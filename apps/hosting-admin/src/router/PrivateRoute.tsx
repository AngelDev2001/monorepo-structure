import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PrivateRoute = () => {
  const { authUser } = useAuthentication();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
