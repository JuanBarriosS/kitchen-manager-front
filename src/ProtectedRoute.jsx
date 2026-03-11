import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(role)) {
    if (role === "ADMIN")    return <Navigate to="/admin" replace />;
    if (role === "EMPLEADO") return <Navigate to="/empleado" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}