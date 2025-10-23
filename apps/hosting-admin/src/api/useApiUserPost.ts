import { useCallback } from "react";
import { useApi } from "./useApi";

interface User {
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

export const useApiUserPost = () => {
  const { post, loading, response } = useApi("/users");

  const postUser = useCallback(
    async (user: User) => {
      return post(user);
    },
    [post]
  );

  return {
    postUser,
    postUserLoading: loading,
    postUserResponse: response,
  };
};
