import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleRoutes = {
    COLLABORATEUR: [
        "/accueil",
        "/demandes",
        "/rendez-vous",
        "/notifications",
        "/profil"
    ],
    RESPONSABLE: [
        "/accueil",
        "/demandes",
        "/validations",
        "/rendez-vous",
        "/notifications",
        "/profil"
    ],
    ADMINISTRATEUR: [
        "/accueil",
        "/demandes",
        "/validations",
        "/rendez-vous",
        "/notifications",
        "/profil"
    ],
    AGENT_ACCUEIL: [
        "/accueil",
        "/rendez-vous",
        "/notifications",
        "/profil"
    ]
};

function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    const userRole = String(user?.role || "").trim().toUpperCase();

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        const fallbackRoute = roleRoutes[userRole] || ["/accueil"];
        return <Navigate to={fallbackRoute[0]} replace />;
    }

    const authorizedRoutes = roleRoutes[userRole] || [];
    if (authorizedRoutes.length > 0 && !authorizedRoutes.includes(location.pathname)) {
        return <Navigate to={authorizedRoutes[0]} replace />;
    }

    return children;
}

export default ProtectedRoute;
