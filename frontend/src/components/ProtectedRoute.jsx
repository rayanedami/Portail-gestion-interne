import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ element, allowedRoles }) {
    const { isLoggedIn, loading, role } = useAuth();
    if (loading) {
        return <div style={{ padding: "32px", textAlign: "center" }}>Chargement...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/accueil" replace />;
    }

    return element;
}
