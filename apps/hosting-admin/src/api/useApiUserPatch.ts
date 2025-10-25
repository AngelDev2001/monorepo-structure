import { useCallback } from "react";
import { useApi } from "./useApi";

import { Timestamp } from "firebase/firestore";

export interface Phone {
  prefix: string;
  number: string;
}

export interface ProfilePhoto {
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
  cip?: string;
  phone?: Phone;
  profilePhoto?: ProfilePhoto | null;
  secondaryEmail?: string;
  bloodGroup?: string;
  workPlace?: string;
  cgi?: boolean;
  roleCode?: string;
  searchData?: string[];
  createAt: Timestamp;
  updateAt?: Timestamp;
  isDeleted: boolean;
  updateBy?: string;
}

interface PatchUserPayload extends Partial<User> {
  id: string;
  updateBy: string;
  isDeleted?: boolean;
}

interface ApiResponse<T = string> {
  ok: boolean;
  data?: T;
  error?: string;
}

interface UseApiUserPatchReturn {
  patchUser: (user: PatchUserPayload) => Promise<unknown>;
  patchUserLoading: boolean;
  patchUserResponse: ApiResponse;
}

export const useApiUserPatch = (): UseApiUserPatchReturn => {
  const { loading, patch, response } = useApi("/users");

  const patchUser = useCallback(
    async (user: PatchUserPayload): Promise<unknown> => {
      const url = `/${user.id}`;
      return patch(url, user);
    },
    [patch]
  );

  return {
    patchUser,
    patchUserLoading: loading,
    patchUserResponse: response,
  };
};
