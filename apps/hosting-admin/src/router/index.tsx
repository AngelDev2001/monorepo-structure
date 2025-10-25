import { Navigate, Route, Routes } from "react-router-dom";
import * as A from "../pages";
import { AdminLayout } from "../components";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export function Router() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<A.Login />} />
        <Route path="/register" element={<A.Register />} />
      </Route>

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
          path="/quotations/:quotationId"
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
          path="/assistances/:assistanceId"
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
        <Route
          path="/users/:userId"
          element={
            <AdminLayout>
              <A.Users />
            </AdminLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
