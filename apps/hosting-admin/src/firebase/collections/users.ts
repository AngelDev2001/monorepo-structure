import { firestore } from "../index";
import {
  fetchCollection,
  fetchDocument,
  setDocument,
  updateDocument,
  type WhereClauses,
} from "../firestore";

interface User {
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
  profilePhoto?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
}

export const usersRef = firestore.collection("users");
export const getUserId = (): string => usersRef.doc().id;

export const fetchUsers = async (
  whereClauses?: WhereClauses<User>[]
): Promise<User[]> => fetchCollection<User>(usersRef, whereClauses);

export const fetchUser = async (userId: string): Promise<User | undefined> =>
  fetchDocument<User>(usersRef.doc(userId));

export const fetchUserByDni = async (
  whereClauses?: WhereClauses<Partial<User>>[]
): Promise<User[]> => fetchCollection<User>(usersRef, whereClauses);

export const addUser = async (user: User): Promise<void> =>
  setDocument<User>(usersRef.doc(user.id), user);

export const updateUser = async (
  userId: string,
  user: Partial<User>
): Promise<void> => updateDocument<Partial<User>>(usersRef.doc(userId), user);

export const deleteUser = async (
  userId: string,
  user: Partial<User>
): Promise<void> => updateDocument<Partial<User>>(usersRef.doc(userId), user);
