import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roleConfig";
import api from "../services/api";
import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    ArrowLeft,
    LogOut
} from "lucide-react";
import "./Profil.css";

function Profil() {
    const navigate = useNavigate();
    const { utilisateur, logout, isLoggedIn, updateUtilisateur, role } = useAuth();
    const [formulaire, setFormulaire] = useState(null);
    const [departements, setDepartements] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (utilisateur) {
            setFormulaire({
                nomComplet: `${utilisateur.prenom || ""} ${utilisateur.nom || ""}`.trim(),
                email: utilisateur.email || "",
                telephone: utilisateur.telephone || "",
                role: utilisateur.role || "COLLABORATEUR",
                departement: utilisateur.departement || "Non renseigné",
                departement_id: utilisateur.departement_id || ""
            });
        }
    }, [utilisateur]);

    useEffect(() => {
        if (role === ROLES.ADMINISTRATEUR) {
            api.get("/departements")
                .then((response) => setDepartements(response.data || []))
                .catch(() => setMessage("Impossible de récupérer les départements."));
        }
    }, [role]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const enregistrerProfil = async (event) => {
        event.preventDefault();
        setMessage("");

        const noms = (formulaire?.nomComplet || "").trim().split(/\s+/);
        const prenom = noms.shift();
        const nom = noms.join(" ");

        try {
            const response = await api.put("/auth/profile", {
                prenom,
                nom,
                email: formulaire.email.trim(),
                telephone: formulaire.telephone.trim(),
                departement_id: role === ROLES.ADMINISTRATEUR
                    ? Number(formulaire.departement_id) || null
                    : undefined
            });
            updateUtilisateur(response.data.utilisateur);
            setMessage("Profil mis à jour avec succès.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Impossible de mettre à jour le profil.");
        }
    };

    if (!utilisateur) {
        return (
            <div className="profil-loading">
                Chargement...
            </div>
        );
    }

    return (
        <div className="profil-page">

            <header className="profil-header">
                <button
                    className="profil-back"
                    onClick={() => navigate("/accueil")}
                >
                    <ArrowLeft size={18} />
                    Retour à l'accueil
                </button>

                <button
                    className="profil-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={17} />
                    Déconnexion
                </button>
            </header>

            <main className="profil-container">

                <section className="profil-card">
                    <div className="profil-title"><div className="profil-title-icon"><UserRound size={28} /></div><div><h1>Profil utilisateur</h1><p>Consultez et gérez vos informations personnelles.</p></div></div>

                    <div className="profil-layout">
                        <div className="profil-summary">
                            <div className="profil-avatar"><UserRound size={48} /></div>
                            <button type="button" className="change-photo-button" disabled title="La photo est gérée par l'administrateur">Changer la photo</button>
                            <h2>{utilisateur.prenom} {utilisateur.nom}</h2>
                            <span className="profil-role"><ShieldCheck size={15} />{utilisateur.role || "COLLABORATEUR"}</span>
                            <strong>{utilisateur.email}</strong>
                            <strong>{utilisateur.telephone || "Non renseigné"}</strong>
                        </div>

                        <form className="profil-form" onSubmit={enregistrerProfil}>
                            <label>Nom complet<input value={formulaire?.nomComplet || ""} onChange={(event) => setFormulaire({ ...formulaire, nomComplet: event.target.value })} /></label>
                            <label>Email<input type="email" value={formulaire?.email || ""} onChange={(event) => setFormulaire({ ...formulaire, email: event.target.value })} /></label>
                            <label>Téléphone<input value={formulaire?.telephone || ""} onChange={(event) => setFormulaire({ ...formulaire, telephone: event.target.value })} /></label>
                            <label>Rôle<input value={formulaire?.role || ""} readOnly /></label>
                            <label>Département{role === ROLES.ADMINISTRATEUR ? (
                                <select value={formulaire?.departement_id || ""} onChange={(event) => setFormulaire({ ...formulaire, departement_id: event.target.value })}>
                                    <option value="">Non renseigné</option>
                                    {departements.map((departement) => <option key={departement.id} value={departement.id}>{departement.nom}</option>)}
                                </select>
                            ) : <input value={formulaire?.departement || "Non renseigné"} readOnly />}</label>
                            <div className="profil-actions"><button type="button" className="profil-cancel" onClick={() => navigate("/accueil")}>Annuler</button><button type="submit" className="profil-save">Enregistrer</button></div>
                            {message && <p className="profil-message">{message}</p>}
                        </form>
                    </div>

                </section>

            </main>
        </div>
    );
}

export default Profil;