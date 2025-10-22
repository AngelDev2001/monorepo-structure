import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PrivateRoute = () => {
  const { authUser } = useAuthentication();
  const location = useLocation();

  // Si no está autenticado, redirige al login
  if (!authUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderiza las rutas hijas
  return <Outlet />;
};
