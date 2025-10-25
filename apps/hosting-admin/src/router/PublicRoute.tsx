import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PublicRoute = () => {
  const { authUser } = useAuthentication();

  if (authUser) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
