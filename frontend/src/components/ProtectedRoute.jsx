import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MENU_ITEMS_BY_ROLE } from "../config/roleConfig";
import {
    BadgeCheck,
    Bell,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Home,
    LogOut,
    UserRound,
    Users,
    BarChart3,
    Settings
} from "lucide-react";
import "../pages/Accueil.css";

export function ProtectedRoute({ element, allowedRoles }) {
    const { isLoggedIn, loading, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    if (loading) {
        return <div style={{ padding: "32px", textAlign: "center" }}>Chargement...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/accueil" replace />;
    }

    const iconMap = {
        home: <Home size={19} />,
        clipboard: <ClipboardList size={19} />,
        plus: <ClipboardList size={19} />,
        check: <CheckCircle2 size={19} />,
        users: <Users size={19} />,
        calendar: <CalendarDays size={19} />,
        bell: <Bell size={19} />,
        user: <UserRound size={19} />,
        building: <Users size={19} />,
        list: <BarChart3 size={19} />,
        badge: <BadgeCheck size={19} />,
        scan: <Settings size={19} />
    };

    const menuItems = MENU_ITEMS_BY_ROLE[role] || [];
    const isHome = ["/accueil", "/accueil-visiteur"].includes(location.pathname);

    if (isHome) {
        return element;
    }

    return (
        <div className="protected-page-shell">
            <aside className="accueil-sidebar protected-sidebar">
                <div className="sidebar-logo">
                    <img src="/attijari-logo.jpg" alt="Attijariwafa bank" />
                </div>
                <div className="sidebar-menu">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`sidebar-item ${location.pathname === item.path ? "actif" : ""}`}
                            type="button"
                            onClick={() => navigate(item.path)}
                        >
                            {iconMap[item.icon]}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
                <div className="sidebar-bottom">
                    <button className="logout-button" type="button" onClick={() => { logout(); navigate("/"); }}>
                        <LogOut size={18} />
                        <span>Se déconnecter</span>
                    </button>
                </div>
            </aside>
            <main className="protected-page-content">
                {element}
            </main>
        </div>
    );
}
