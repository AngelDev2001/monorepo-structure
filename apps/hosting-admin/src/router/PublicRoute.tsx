import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../providers";

export const PublicRoute = () => {
  const { authUser } = useAuthentication();

  // Si ya está autenticado, redirige al home
  if (authUser) {
    return <Navigate to="/home" replace />;
  }

  // Si no está autenticado, renderiza las rutas públicas
  return <Outlet />;
};
