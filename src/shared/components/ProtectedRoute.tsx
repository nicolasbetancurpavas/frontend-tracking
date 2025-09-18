import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/auth.store";

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/auth" replace />;
}
