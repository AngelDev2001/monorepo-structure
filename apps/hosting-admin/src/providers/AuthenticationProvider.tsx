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

  const { firebaseUser, firebaseUserLoading } = useFirebaseUser();

  const userDocRef = firebaseUser
    ? firestore.collection("users").doc(firebaseUser.uid)
    : undefined;

  const [user, userLoading, userError] = useDocumentData<User>(
    userDocRef as any
  );

  const authLoading = firebaseUserLoading || userLoading;
  const authError = userError;

  const authUser: User | null = firebaseUser ? (user as User) : null;

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
        // ========== VERIFICACIÓN POR CELULAR (Firebase Phone Auth) ==========
        console.log("📱 Enviando código por SMS a:", user.phone.number);

        const phoneNumber = `+${user.phone.prefix}${user.phone.number}`;

        // Configurar reCAPTCHA (necesario para Firebase Phone Auth)
        const appVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("✅ reCAPTCHA resuelto");
            },
          }
        );

        const confirmationResult = await auth.signInWithPhoneNumber(
          phoneNumber,
          appVerifier
        );

        setVerificationId(confirmationResult.verificationId);

        notification({
          type: "success",
          title: "Código enviado",
          description: `Se envió un código a tu celular ${maskPhone(user.phone.number)}`,
        });
      } else {
        // ========== VERIFICACIÓN POR EMAIL (Backend API) ==========
        console.log("📧 Enviando código por email a:", user.email);

        // Aquí llamas a tu backend/Cloud Function para enviar el código por email
        const response = await fetch("/api/send-verification-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            method: "email",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al enviar código");
        }

        setVerificationId(data.verificationId); // ID del código generado en backend

        notification({
          type: "success",
          title: "Código enviado",
          description: `Se envió un código a tu email ${maskEmail(user.email)}`,
        });
      }

      setLoginLoading(false);
    } catch (e) {
      const error = isError(e) ? e : undefined;

      console.error("❌ Error enviando código:", e);

      notification({
        type: "error",
        title: "Error al enviar código",
        description:
          error?.message || "No se pudo enviar el código de verificación",
      });

      setLoginLoading(false);
      throw e;
    }
  };

  // ========== STEP 3: Verificar código ingresado ==========
  const verifyCode = async (code: string) => {
    try {
      setLoginLoading(true);

      if (!verificationId) {
        throw new Error("No hay código de verificación pendiente");
      }

      if (!tempUser) {
        throw new Error("No hay usuario temporal");
      }

      console.log("🔐 Verificando código:", code);

      // Si fue verificación por teléfono (Firebase Phone Auth)
      if (verificationId.startsWith("firebase-")) {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          code
        );
        await auth.signInWithCredential(credential);
      } else {
        // Si fue verificación por email (Backend API)
        const response = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: tempUser.id,
            verificationId,
            code,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Código incorrecto");
        }

        // Crear custom token y autenticar con Firebase
        const customToken = data.customToken;
        await auth.signInWithCustomToken(customToken);
      }

      await auth.setPersistence(authPersistence.LOCAL);

      notification({
        type: "success",
        title: "Bienvenido",
        description: `Hola ${tempUser.firstName}!`,
      });

      // Limpiar estado temporal
      setVerificationId(null);
      setTempUser(null);
      setLoginLoading(false);
    } catch (e) {
      const error = isError(e) ? e : undefined;

      console.error("❌ Error verificando código:", e);

      notification({
        type: "error",
        title: "Código incorrecto",
        description: error?.message || "El código ingresado no es válido",
      });

      setLoginLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    setVerificationId(null);
    setTempUser(null);
    return auth.signOut();
  };

  if (authLoading && location.pathname !== "/") return <Spinner fullscreen />;

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

// Helpers para enmascarar datos sensibles
const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  return `${user.substring(0, 3)}***@${domain}`;
};

const maskPhone = (phone: string) => {
  return `*** *** ${phone.slice(-3)}`;
};
