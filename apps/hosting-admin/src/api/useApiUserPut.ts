import { useCallback } from "react";
import { useApi } from "./useApi";

interface Phone {
  prefix: string;
  number: string;
}

interface ProfilePhoto {
  uid: string;
  name: string;
  url: string;
  thumbUrl?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  dni: string;
  cip: string;
  phone: Phone;
  profilePhoto?: ProfilePhoto | null;
  secondaryEmail?: string;
  bloodGroup?: string;
  workPlace?: string;
  cgi?: boolean;
  roleCode?: string;
  searchData?: string[];
  createAt?: any;
  updateAt?: any;
  isDeleted?: boolean;
}

interface ApiResponse<T = string> {
  ok: boolean;
  data?: T;
  error?: string;
}

interface UseApiUserPutReturn {
  putUser: (user: User) => Promise<unknown>;
  putUserLoading: boolean;
  putUserResponse: ApiResponse;
}

export const useApiUserPut = (): UseApiUserPutReturn => {
  const { put, loading, response } = useApi("/users");

  const putUser = useCallback(
    async (user: User): Promise<unknown> => {
      const url = `/${user.id}`;
      return put(url, user);
    },
    [put]
  );

  return {
    putUser,
    putUserLoading: loading,
    putUserResponse: response,
  };
};
