import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthUser();

  if (loading) return <div className="admin-loading">Checking admin access...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
