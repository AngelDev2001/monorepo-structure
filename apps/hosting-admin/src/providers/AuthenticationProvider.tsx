import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, firebase, firestore } from "../firebase";
import { isError, isObject } from "lodash";
import { notification, Spinner } from "../components";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { authPersistence } from "../firebase/auth";

type FirebaseUser = firebase.UserInfo;
type VerificationMethod = "email" | "phone";

export interface User {
  id: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  document: {
    type: "DNI" | "RUC" | "CE";
    number: string;
  };
  phone: {
    prefix: string;
    number: string;
  };
  gender: "male" | "female" | "other";
}

interface ContextType {
  authUser: User | null;
  findUserByDNI: (dni: string) => Promise<User | null>;
  sendVerificationCode: (
    user: User,
    method: VerificationMethod
  ) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  loginLoading: boolean;
  verificationId: string | null;
}

const AuthenticationContext = createContext<ContextType>({
  authUser: null,
  findUserByDNI: () => Promise.reject("Unable to find AuthenticationProvider."),
  sendVerificationCode: () =>
    Promise.reject("Unable to find AuthenticationProvider."),
  verifyCode: () => Promise.reject("Unable to find AuthenticationProvider."),
  logout: () => Promise.reject("Unable to find AuthenticationProvider."),
  loginLoading: false,
  verificationId: null,
});

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null); // ✅ NUEVO

  const { firebaseUser, firebaseUserLoading } = useFirebaseUser();

  const userDocRef = firebaseUser
    ? firestore.collection("users").doc(firebaseUser.uid)
    : undefined;

  const [user, userLoading, userError] = useDocumentData<User>(
    userDocRef as any
  );

  const authLoading = firebaseUserLoading || userLoading;
  const authError = userError;

  console.log("firebaseUser: ", firebaseUser);

  const authUser: User | null = firebaseUser ? (user as User) : null;

  console.log("authUser: ", authUser);

  useEffect(() => {
    authError && logout();
  }, [authError]);

  useEffect(() => {
    if (isAuthUserError(authUser)) {
      notification({ type: "warning", title: "Error de autenticación" });
      logout();
    }
  }, [authUser && (authUser as any).type]);

  // ========== STEP 1: Buscar usuario por DNI ==========
  const findUserByDNI = async (dni: string): Promise<User | null> => {
    try {
      setLoginLoading(true);

      console.log("🔍 Buscando usuario con DNI:", dni);

      const usersSnapshot = await firestore
        .collection("users")
        .where("document.number", "==", dni)
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        notification({
          type: "error",
          title: "Usuario no encontrado",
          description: "El DNI ingresado no está registrado",
        });
        setLoginLoading(false);
        return null;
      }

      const userData = usersSnapshot.docs[0].data() as User;
      const userId = usersSnapshot.docs[0].id;

      const foundUser: User = {
        ...userData,
        id: userId,
      };

      console.log("✅ Usuario encontrado:", foundUser);

      setTempUser(foundUser);
      setLoginLoading(false);

      return foundUser;
    } catch (e) {
      const error = isError(e) ? e : undefined;

      console.error("❌ Error buscando usuario:", e);

      notification({
        type: "error",
        title: "Error",
        description: error?.message || "Error al buscar usuario",
      });

      setLoginLoading(false);
      return null;
    }
  };

  // ========== STEP 2: Enviar código de verificación ==========
  const sendVerificationCode = async (
    user: User,
    method: VerificationMethod
  ) => {
    try {
      setLoginLoading(true);

      if (method === "phone") {
        console.log("📱 Enviando código por SMS a:", user.phone.number);

        const phoneNumber = `+${user.phone.prefix}${user.phone.number}`;

        console.log("📞 Número completo:", phoneNumber);

        // ✅ Limpiar verifier anterior si existe
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {
            console.log("No se pudo limpiar verifier anterior");
          }
        }

        // ✅ Configurar reCAPTCHA según documentación
        const appVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response: any) => {
              console.log("✅ reCAPTCHA resuelto", response);
            },
            "expired-callback": () => {
              console.log("⏱️ reCAPTCHA expiró");
            },
          }
        );

        // Guardar referencia global
        (window as any).recaptchaVerifier = appVerifier;

        // ✅ Según documentación: signInWithPhoneNumber retorna confirmationResult
        const result = await auth.signInWithPhoneNumber(
          phoneNumber,
          appVerifier
        );

        console.log("✅ Confirmation result recibido:", result);

        // ✅ IMPORTANTE: Guardar el confirmationResult completo
        setConfirmationResult(result);
        setVerificationId(result.verificationId);

        notification({
          type: "success",
          title: "Código enviado",
          description: `Se envió un código SMS a ${user.phone.number}`,
        });
      } else {
        // Email implementation...
        console.log("📧 Email no implementado aún");
        throw new Error("Método de email no disponible");
      }

      setLoginLoading(false);
    } catch (e: any) {
      const error = isError(e) ? e : undefined;

      console.error("❌ Error enviando código:", e);
      console.error("❌ Error code:", e.code);
      console.error("❌ Error message:", e.message);

      // ✅ Mensajes de error específicos
      let errorMessage =
        error?.message || "No se pudo enviar el código de verificación";

      if (e.code === "auth/operation-not-allowed") {
        errorMessage =
          "La autenticación por SMS no está habilitada. Verifica que estés en el plan Blaze de Firebase y que Phone Auth esté configurado correctamente.";
      } else if (e.code === "auth/invalid-phone-number") {
        errorMessage =
          "El número de teléfono no es válido. Formato: +51987654321";
      } else if (e.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Por favor espera unos minutos.";
      }

      notification({
        type: "error",
        title: "Error al enviar código",
        description: errorMessage,
      });

      setLoginLoading(false);
      throw e;
    }
  };

  // ========== STEP 3: Verificar código ingresado ==========
  const verifyCode = async (code: string) => {
    try {
      setLoginLoading(true);

      if (!confirmationResult) {
        throw new Error("No hay confirmación de SMS pendiente");
      }

      if (!tempUser) {
        throw new Error("No hay usuario temporal");
      }

      console.log("🔐 Verificando código:", code);
      console.log("📄 tempUser.id:", tempUser.id);

      // ✅ Confirmar código SMS
      const result = await confirmationResult.confirm(code);

      console.log("✅ Código verificado");
      console.log("🔑 result.user.uid:", result.user.uid);
      console.log("📄 tempUser.id:", tempUser.id);

      // ⚠️ VERIFICAR SI LOS IDs COINCIDEN
      if (result.user.uid !== tempUser.id) {
        console.error("❌ ERROR: Los UIDs no coinciden!");
        console.error("   Auth UID:", result.user.uid);
        console.error("   Firestore ID:", tempUser.id);
        throw new Error(
          "Error de sincronización de IDs. Por favor contacta a soporte."
        );
      }

      // ✅ Solo actualizar lastLogin (SIN agregar firebaseUid)
      await firestore.collection("users").doc(tempUser.id).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await auth.setPersistence(authPersistence.LOCAL);

      notification({
        type: "success",
        title: "Bienvenido",
        description: `Hola ${tempUser.firstName}!`,
      });

      // Limpiar estado temporal
      setVerificationId(null);
      setConfirmationResult(null);
      setTempUser(null);
      setLoginLoading(false);
    } catch (e: any) {
      const error = isError(e) ? e : undefined;

      console.error("❌ Error verificando código:", e);
      console.error("❌ Error code:", e.code);

      let errorMessage = error?.message || "El código ingresado no es válido";

      if (e.code === "auth/invalid-verification-code") {
        errorMessage =
          "El código ingresado es incorrecto. Por favor verifica e intenta de nuevo.";
      } else if (e.code === "auth/code-expired") {
        errorMessage = "El código ha expirado. Por favor solicita uno nuevo.";
      }

      notification({
        type: "error",
        title: "Código incorrecto",
        description: errorMessage,
      });

      setLoginLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    setVerificationId(null);
    setConfirmationResult(null);
    setTempUser(null);

    // Limpiar reCAPTCHA
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      } catch (e) {
        console.log("No se pudo limpiar verifier en logout");
      }
    }

    return auth.signOut();
  };

  if (authLoading && location.pathname !== "/")
    return <Spinner height="80vh" />;

  return (
    <AuthenticationContext.Provider
      value={{
        authUser: isAuthUser(authUser) ? authUser : null,
        findUserByDNI,
        sendVerificationCode,
        verifyCode,
        logout,
        loginLoading,
        verificationId,
      }}
    >
      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container" />
      {children}
    </AuthenticationContext.Provider>
  );
};

const useFirebaseUser = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseUserLoading, setFirebaseUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setFirebaseUserLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { firebaseUser, firebaseUserLoading };
};

const isAuthUser = (data: unknown): data is User =>
  isObject(data) && ("id" in data || "uid" in data || "email" in data);

const isAuthUserError = (data: unknown) =>
  isObject(data) && "type" in data && data.type === "error";

// const maskEmail = (email: string) => {
//   const [user, domain] = email.split("@");
//   return `${user.substring(0, 3)}***@${domain}`;
// };

// const maskPhone = (phone: string) => {
//   return `*** *** ${phone?.slice(-3)}`;
// };
