import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        if (password.length < 6 || password !== confirmation) {
            setError("Les mots de passe doivent correspondre et contenir au moins 6 caractères.");
            return;
        }
        try {
            const response = await api.post("/auth/reset-password", {
                token: params.get("token"),
                mot_de_passe: password
            });
            setMessage(response.data.message);
            setTimeout(() => navigate("/"), 1200);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Lien invalide ou expiré.");
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f8fa" }}>
            <form onSubmit={submit} style={{ width: "min(430px, 100%)", padding: 30, border: "1px solid #eaecf0", borderRadius: 12, background: "#fff", boxShadow: "0 8px 24px rgba(16,24,40,.08)" }}>
                <h1 style={{ marginTop: 0 }}>Nouveau mot de passe</h1>
                <p>Choisissez un nouveau mot de passe pour votre compte.</p>
                <label style={{ display: "block", marginTop: 18 }}>Mot de passe<input required minLength="6" type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ display: "block", width: "100%", marginTop: 7, padding: 11 }} /></label>
                <label style={{ display: "block", marginTop: 14 }}>Confirmer<input required minLength="6" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} style={{ display: "block", width: "100%", marginTop: 7, padding: 11 }} /></label>
                {error && <p style={{ color: "#b42318" }}>{error}</p>}
                {message && <p style={{ color: "#16803c" }}>{message}</p>}
                <button type="submit" style={{ width: "100%", marginTop: 20, padding: 12, border: 0, borderRadius: 7, background: "#ff591b", color: "#fff", fontWeight: 700 }}>Réinitialiser</button>
            </form>
        </main>
    );
}

export default ResetPassword;
