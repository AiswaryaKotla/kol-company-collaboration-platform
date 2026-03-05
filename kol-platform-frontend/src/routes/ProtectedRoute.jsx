import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  //  not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  wrong role
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  //  allowed
  return children;
}

export default ProtectedRoute;