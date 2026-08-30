import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [utilisateur, setUtilisateur] = useState(null);

    useEffect(() => {
        const utilisateurStocke = localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
            navigate("/");
            return;
        }

        try {
            const user = JSON.parse(utilisateurStocke);
            setUtilisateur(user);
        } catch (error) {
            console.error("Erreur lecture utilisateur :", error);
            localStorage.removeItem("utilisateur");
            navigate("/");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("utilisateur");
        navigate("/");
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

                <div className="profil-title">
                    <div className="profil-title-icon">
                        <UserRound size={28} />
                    </div>

                    <div>
                        <h1>Mon profil</h1>
                        <p>
                            Consultez vos informations personnelles et votre
                            compte utilisateur.
                        </p>
                    </div>
                </div>

                <section className="profil-card">

                    <div className="profil-avatar">
                        <UserRound size={48} />
                    </div>

                    <div className="profil-name">
                        <h2>
                            {utilisateur.prenom} {utilisateur.nom}
                        </h2>

                        <span className="profil-role">
                            <ShieldCheck size={15} />
                            {utilisateur.role || "COLLABORATEUR"}
                        </span>
                    </div>

                    <div className="profil-separator"></div>

                    <div className="profil-information">

                        <div className="information-item">
                            <div className="information-icon">
                                <UserRound size={20} />
                            </div>

                            <div>
                                <span>Nom complet</span>
                                <strong>
                                    {utilisateur.prenom} {utilisateur.nom}
                                </strong>
                            </div>
                        </div>

                        <div className="information-item">
                            <div className="information-icon">
                                <Mail size={20} />
                            </div>

                            <div>
                                <span>Email</span>
                                <strong>
                                    {utilisateur.email}
                                </strong>
                            </div>
                        </div>

                        <div className="information-item">
                            <div className="information-icon">
                                <Phone size={20} />
                            </div>

                            <div>
                                <span>Téléphone</span>
                                <strong>
                                    {utilisateur.telephone || "Non renseigné"}
                                </strong>
                            </div>
                        </div>

                        <div className="information-item">
                            <div className="information-icon">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <span>Rôle</span>
                                <strong>
                                    {utilisateur.role || "COLLABORATEUR"}
                                </strong>
                            </div>
                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}

export default Profil;