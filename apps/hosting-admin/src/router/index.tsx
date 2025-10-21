import { Navigate, Route, Routes } from "react-router-dom";
import * as A from "../pages";
import { AdminLayout, PublicLayout } from "../components/layout";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export function Router() {
  return (
    <Routes>
      {/* Redirección raíz */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ========== RUTAS PÚBLICAS ========== */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={
            <PublicLayout>
              <A.Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <A.Register />
            </PublicLayout>
          }
        />
      </Route>

      {/* ========== RUTAS PRIVADAS ========== */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/home"
          element={
            <AdminLayout>
              <A.Home />
            </AdminLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AdminLayout>
              <A.Profile />
            </AdminLayout>
          }
        />
        <Route
          path="/quotations"
          element={
            <AdminLayout>
              <A.Quotations />
            </AdminLayout>
          }
        />
        <Route
          path="/assistances"
          element={
            <AdminLayout>
              <A.Assistances />
            </AdminLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AdminLayout>
              <A.Users />
            </AdminLayout>
          }
        />
      </Route>

      {/* ========== RUTA 404 ========== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
