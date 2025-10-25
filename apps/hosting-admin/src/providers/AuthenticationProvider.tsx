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
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

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

  const findUserByDNI = async (dni: string): Promise<User | null> => {
    try {
      setLoginLoading(true);

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
        const phoneNumber = `${user?.phone.prefix}${user?.phone.number}`;

        if ((window as any).recaptchaVerifier) {
          try {
            await (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
          } catch (e) {}
        }

        const oldContainer = document.getElementById("recaptcha-container");
        if (oldContainer) {
          oldContainer.remove();
        }

        const newContainer = document.createElement("div");
        newContainer.id = "recaptcha-container";
        document.body.appendChild(newContainer);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const appVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response: any) => {},
            "expired-callback": () => {},
          },
          firebase.app()
        );

        await appVerifier.render();

        (window as any).recaptchaVerifier = appVerifier;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const result = await auth.signInWithPhoneNumber(
          phoneNumber,
          appVerifier
        );

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
      console.error(e);

      if ((window as any).recaptchaVerifier) {
        try {
          await (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (cleanupError) {}
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

  const verifyCode = async (code: string) => {
    try {
      setLoginLoading(true);

      if (!confirmationResult) {
        throw new Error("No hay confirmación de SMS pendiente");
      }

      if (!tempUser) {
        throw new Error("No hay usuario temporal guardado");
      }

      const result = await confirmationResult.confirm(code);

      await firestore.collection("users").doc(tempUser.id).update({
        firebaseAuthUid: result.user.uid,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        phoneVerified: true,
      });

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

    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      } catch (e) {}
    }

    return auth.signOut();
  };

  if (authLoading && location.pathname !== "/") return <Spinner fullscreen />;

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
        try {
          const userSnapshot = await firestore
            .collection("users")
            .where("firebaseAuthUid", "==", user.uid)
            .limit(1)
            .get();

          if (!userSnapshot.empty) {
            setFirestoreDocId(userSnapshot.docs[0].id);
          } else {
            console.error("Not found document for uid:", user.uid);
          }
        } catch (error) {
          console.error("Error searching for user:", error);
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
