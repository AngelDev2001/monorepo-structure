import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
} from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FirestoreError } from "firebase/firestore";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components";
import { orderBy } from "lodash";
import { quotationsRef, usersRef } from "../firebase/collections";

import { Timestamp } from "firebase/firestore";

interface BaseEntity {
  id: string;
  createAt: Timestamp;
  updateAt?: Timestamp;
  isDeleted: boolean;
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleCode?: string;
  photoUrl?: string;
  [key: string]: any;
}

export interface Correspondence extends BaseEntity {
  code: string;
  title: string;
  description?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  userId: string;
  amount?: number;
  [key: string]: any;
}

// Global Data Context Value
export interface GlobalDataContextValue {
  users: User[];
  correspondences: Correspondence[];
}

interface GlobalDataProviderProps {
  children: ReactNode;
}

const GlobalDataContext = createContext<GlobalDataContextValue>({
  users: [],
  quotations: [],
});

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({
  children,
}) => {
  const { authUser } = useAuthentication();

  const [users = [], usersLoading, usersError] = useCollectionData<User>(
    authUser ? usersRef.where("isDeleted", "==", false) : null,
    { idField: "id" }
  );

  console.log(users);

  const [quotations = [], quotationsLoading, quotationsError] =
    useCollectionData<Correspondence>(
      authUser ? quotationsRef.where("isDeleted", "==", false) : null,
      { idField: "id" }
    );

  const error: FirestoreError | undefined = usersError || quotationsError;

  const loading: boolean = usersLoading || quotationsLoading;

  useEffect(() => {
    if (error) {
      notification({
        type: "error",
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos. Intente nuevamente.",
      });
    }
  }, [error]);

  if (loading) {
    return <Spinner height="100vh" />;
  }

  return (
    <GlobalDataContext.Provider
      value={{
        users: orderBy(users, ["createAt"], ["desc"]),
        quotations: orderBy(quotations, ["createAt"], ["desc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = (): GlobalDataContextValue => {
  const context = useContext(GlobalDataContext);

  if (!context) {
    throw new Error("useGlobalData must be used within a GlobalDataProvider");
  }

  return context;
};
