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
  tempUser: User | null;
  sendVerificationCode: (
    user: {
      email?: string;
      phone?: {
        prefix?: string;
        number?: string;
      };
    },
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
  tempUser: null,
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

  const { firebaseUser, firebaseUserLoading, firestoreDocId } =
    useFirebaseUser();

  const userDocRef = firestoreDocId
    ? firestore.collection("users").doc(firestoreDocId)
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

      // ✅ Guardar en estado (NO en localStorage)
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
    user: {
      email?: string;
      phone?: {
        prefix?: string;
        number?: string;
      };
    },
    method: VerificationMethod
  ) => {
    try {
      setLoginLoading(true);

      if (method === "phone") {
        console.log("📱 Enviando código por SMS a:", user?.phone.number);

        const phoneNumber = `${user?.phone.prefix}${user?.phone.number}`;

        // Limpiar verifier anterior
        console.log("🧹 Limpiando verifier anterior...");
        if ((window as any).recaptchaVerifier) {
          try {
            await (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
          } catch (e) {
            console.log("No se pudo limpiar verifier anterior");
          }
        }

        // Eliminar y recrear el elemento
        console.log("🗑️ Eliminando contenedor antiguo...");
        const oldContainer = document.getElementById("recaptcha-container");
        if (oldContainer) {
          oldContainer.remove();
        }

        console.log("🆕 Creando nuevo contenedor...");
        const newContainer = document.createElement("div");
        newContainer.id = "recaptcha-container";
        document.body.appendChild(newContainer);

        // Esperar
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("🔧 Creando nuevo RecaptchaVerifier...");

        // Crear verifier
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
          },
          firebase.app()
        );

        console.log("⏳ Renderizando verifier...");
        await appVerifier.render();
        console.log("✅ Verifier renderizado");

        // ❌ NO verificar widgetId, simplemente continuar
        // Guardar referencia
        (window as any).recaptchaVerifier = appVerifier;

        // Esperar más tiempo antes de enviar
        console.log("⏰ Esperando para estabilizar...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("📤 Enviando código de verificación...");

        // ✅ Intentar enviar directamente
        const result = await auth.signInWithPhoneNumber(
          phoneNumber,
          appVerifier
        );

        console.log("✅ Código enviado! Confirmation result:", result);

        setConfirmationResult(result);
        setVerificationId(result.verificationId);

        notification({
          type: "success",
          title: "Código enviado",
          description: `Se envió un código SMS a ${user.phone.number}`,
        });
      } else {
        throw new Error("Método de email no disponible");
      }

      setLoginLoading(false);
    } catch (e: any) {
      console.error("❌ Error enviando código:", e);
      console.error("❌ Error code:", e.code);
      console.error("❌ Error message:", e.message);

      // Limpiar
      if ((window as any).recaptchaVerifier) {
        try {
          await (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (cleanupError) {
          console.log("Error limpiando:", cleanupError);
        }
      }

      let errorMessage = "No se pudo enviar el código";

      if (e.code === "auth/invalid-app-credential") {
        errorMessage =
          "Error de verificación. Recarga la página e intenta de nuevo.";
      } else if (e.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Espera 15 minutos.";
      } else if (e.code === "auth/invalid-phone-number") {
        errorMessage = "Número inválido. Formato: +51987654321";
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
        throw new Error("No hay usuario temporal guardado");
      }

      console.log("🔐 Verificando código:", code);
      console.log("👤 Usuario a vincular:", tempUser);

      // ✅ Confirmar código SMS
      const result = await confirmationResult.confirm(code);

      console.log("✅ Código verificado");
      console.log("🔑 Firebase Auth UID:", result.user.uid);
      console.log("📝 Documento Firestore ID:", tempUser.id);

      // ✅✅ VINCULAR: Actualizar el documento EXISTENTE con el UID de Firebase
      await firestore.collection("users").doc(tempUser.id).update({
        firebaseAuthUid: result.user.uid, // ✅ Guardar el UID como campo
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        phoneVerified: true,
      });

      console.log("✅ Usuario vinculado correctamente");

      await auth.setPersistence(authPersistence.LOCAL);

      notification({
        type: "success",
        title: "Bienvenido",
        description: `Hola ${tempUser.firstName}!`,
      });

      setVerificationId(null);
      setConfirmationResult(null);
      setTempUser(null);
      setLoginLoading(false);
    } catch (e: any) {
      console.error("❌ Error verificando código:", e);

      let errorMessage = "El código ingresado no es válido";

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
    <Spinner fullscreen height="80vh" />;

  return (
    <AuthenticationContext.Provider
      value={{
        authUser: isAuthUser(authUser) ? authUser : null,
        findUserByDNI,
        tempUser,
        sendVerificationCode,
        verifyCode,
        logout,
        loginLoading,
        verificationId,
      }}
    >
      <div id="recaptcha-container" />
      {children}
    </AuthenticationContext.Provider>
  );
};

const useFirebaseUser = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseUserLoading, setFirebaseUserLoading] = useState(true);
  const [firestoreDocId, setFirestoreDocId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);

      if (user) {
        // ✅ Buscar el documento por firebaseAuthUid
        try {
          const userSnapshot = await firestore
            .collection("users")
            .where("firebaseAuthUid", "==", user.uid)
            .limit(1)
            .get();

          if (!userSnapshot.empty) {
            setFirestoreDocId(userSnapshot.docs[0].id);
          } else {
            console.error("❌ No se encontró documento para UID:", user.uid);
          }
        } catch (error) {
          console.error("❌ Error buscando usuario:", error);
        }
      } else {
        setFirestoreDocId(null);
      }

      setFirebaseUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, firebaseUserLoading, firestoreDocId };
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
