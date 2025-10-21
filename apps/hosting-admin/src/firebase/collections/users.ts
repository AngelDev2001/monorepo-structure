import { firestore } from '../index';
import {
  fetchCollection,
  fetchDocument,
  setDocument,
  updateDocument,
  type WhereClauses,
} from '../firestore';
import type { User } from '../../globalTypes';

export const usersRef = firestore.collection('users');
export const getUserId = (): string => usersRef.doc().id;

export const fetchUsers = async (whereClauses?: WhereClauses<User>[]): Promise<User[]> =>
  fetchCollection<User>(usersRef, whereClauses);

export const fetchUser = async (userId: string): Promise<User | undefined> =>
  fetchDocument<User>(usersRef.doc(userId));

export const addUser = async (department: User): Promise<void> =>
  setDocument<User>(usersRef.doc(department.id), department);

export const updateUser = async (userId: string, department: Partial<User>): Promise<void> =>
  updateDocument<Partial<User>>(usersRef.doc(userId), department);

export const deleteUser = async (userId: string, department: Partial<User>): Promise<void> =>
  updateDocument<Partial<User>>(usersRef.doc(userId), department);
