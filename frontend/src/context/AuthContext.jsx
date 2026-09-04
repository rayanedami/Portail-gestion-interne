import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("utilisateur");
        if (stored) {
            try {
                setUtilisateur(JSON.parse(stored));
            } catch (error) {
                console.error("Erreur parsing utilisateur :", error);
                localStorage.removeItem("utilisateur");
            }
        }
        setLoading(false);
    }, []);

    const login = (user, token) => {
        setUtilisateur(user);
        localStorage.setItem("utilisateur", JSON.stringify(user));
        if (token) {
            localStorage.setItem("token", token);
        }
    };

    const logout = () => {
        setUtilisateur(null);
        localStorage.removeItem("utilisateur");
        localStorage.removeItem("token");
    };

    const updateUtilisateur = (user) => {
        setUtilisateur(user);
        localStorage.setItem("utilisateur", JSON.stringify(user));
    };

    const value = {
        utilisateur,
        loading,
        login,
        updateUtilisateur,
        logout,
        isLoggedIn: !!utilisateur,
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
