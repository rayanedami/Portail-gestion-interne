import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const rawUser = localStorage.getItem("utilisateur");

        if (!rawUser) {
            return null;
        }

        try {
            return JSON.parse(rawUser);
        } catch (error) {
            console.error("Erreur parsing utilisateur localStorage :", error);
            localStorage.removeItem("utilisateur");
            return null;
        }
    });

    useEffect(() => {
        if (!user) {
            localStorage.removeItem("utilisateur");
            return;
        }

        localStorage.setItem("utilisateur", JSON.stringify(user));
    }, [user]);

    const login = (userData) => setUser(userData);

    const logout = () => setUser(null);

    const hasRole = (roleName) => {
        if (!user || !user.role) return false;
        return String(user.role).trim().toUpperCase() === String(roleName).trim().toUpperCase();
    };

    const isAuthenticated = Boolean(user);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        hasRole,
        isAuthenticated
    }), [user, isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth doit être utilisé à l’intérieur de AuthProvider");
    }

    return context;
}
