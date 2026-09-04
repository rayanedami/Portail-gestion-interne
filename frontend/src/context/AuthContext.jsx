import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [utilisateur, setUtilisateur] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("utilisateur");
        const storedToken = localStorage.getItem("token");
        if (stored && storedToken) {
            try {
                setUtilisateur(JSON.parse(stored));
                setToken(storedToken);
            } catch (error) {
                console.error("Erreur parsing utilisateur :", error);
                localStorage.removeItem("utilisateur");
                localStorage.removeItem("token");
            }
        } else {
            localStorage.removeItem("utilisateur");
            localStorage.removeItem("token");
        }
        setLoading(false);
    }, []);

    const login = (user, token) => {
        setUtilisateur(user);
        setToken(token || null);
        localStorage.setItem("utilisateur", JSON.stringify(user));
        if (token) {
            localStorage.setItem("token", token);
        }
    };

    const logout = () => {
        setUtilisateur(null);
        setToken(null);
        localStorage.removeItem("utilisateur");
        localStorage.removeItem("token");
    };

    const updateUtilisateur = (user) => {
        setUtilisateur(user);
        localStorage.setItem("utilisateur", JSON.stringify(user));
    };

    const value = {
        utilisateur,
        token,
        loading,
        login,
        updateUtilisateur,
        logout,
        isLoggedIn: !!utilisateur && !!token,
        role: utilisateur?.role || null,
        userId: utilisateur?.id || null
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
    }
    return context;
}
