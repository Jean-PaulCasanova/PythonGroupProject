import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = useSelector((state) => state.session.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}