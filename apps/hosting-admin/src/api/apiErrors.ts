import { notification } from "../components";
import { isObject } from "lodash";
import apiErrors from "../config/apiErros.json";

interface ApiError {
  title: string;
  description: string;
}

interface ApiErrorsConfig {
  [key: string]: ApiError;
  default: ApiError;
}

interface ErrorResponse {
  message: string;
  [key: string]: any;
}

export const isResponse = (data: unknown): data is ErrorResponse => {
  return isObject(data) && "message" in data;
};

export const getApiErrorResponse = (response: unknown): string | unknown => {
  try {
    if (isResponse(response)) {
      try {
        console.error(response);
        return response.message;
      } catch (e) {
        console.error(e);
        return response;
      }
    }
    return response;
  } catch (e) {
    console.error(e);
    return response;
  }
};

export const apiErrorNotification = (response?: string | unknown): void => {
  if (response) {
    notificationApiError(response);
  } else {
    notification({ type: "error" });
  }
};

const notificationApiError = (key: string | unknown): void => {
  const errors = apiErrors as ApiErrorsConfig;
  const errorKey = typeof key === "string" ? key : "default";
  const errorData = errors[errorKey] || errors.default;

  notification({
    type: "warning",
    title: errorData.title,
    description: errorData.description,
  });
};
