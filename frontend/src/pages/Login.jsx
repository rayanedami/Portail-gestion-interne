import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    BarChart3,
    Bell,
    ChevronDown,
    ClipboardList,
    Globe2,
    LockKeyhole,
    UserRound,
    UsersRound
} from "lucide-react";
import api from "../services/api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await api.post("/auth/login", {
                email: email,
                mot_de_passe: motDePasse
            });

            const utilisateur = response.data.utilisateur;

            login(utilisateur, response.data.token);
            navigate(
                utilisateur.role === "VISITEUR"
                    ? "/accueil-visiteur"
                    : "/accueil"
            );

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Erreur de connexion"
            );
        }
    };

    return (
        <div className="login-page">

            {/* ================= HEADER ================= */}
            <header className="login-header">

                <img
                    src="/attijari-logo.jpg"
                    alt="Attijariwafa bank"
                    className="attijari-logo"
                />

            </header>


            {/* ================= MAIN ================= */}
            <main className="login-main">

                {/* ========== LEFT SIDE ========== */}
                <section className="login-left">

                    <div className="login-card">

                        <div className="welcome-text">
                            Bienvenue sur le
                        </div>

                        <h1>
                            Portail Interne
                        </h1>

                        <p className="description">
                            Gérez vos demandes administratives et facilitez
                            l’accueil des visiteurs au sein de l’entreprise.
                        </p>


                        <form onSubmit={handleLogin}>

                            {/* IDENTIFIANT */}
                            <div className="form-group">

                                <label>
                                    Identifiant
                                </label>

                                <div className="input-wrapper">

                                    <input
                                        type="email"
                                        placeholder="Entrez votre identifiant"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                    <span className="input-icon">
                                        <UserRound aria-hidden="true" />
                                    </span>

                                </div>

                            </div>


                            {/* MOT DE PASSE */}
                            <div className="form-group">

                                <label>
                                    Mot de passe
                                </label>

                                <div className="input-wrapper">

                                    <input
                                        type="password"
                                        placeholder="Entrez votre mot de passe"
                                        value={motDePasse}
                                        onChange={(e) =>
                                            setMotDePasse(e.target.value)
                                        }
                                        required
                                    />

                                    <span className="input-icon">
                                        <LockKeyhole aria-hidden="true" />
                                    </span>

                                </div>

                            </div>


                            {/* MOT DE PASSE OUBLIE */}
                            <div className="forgot-password">
                                Mot de passe oublié ?
                            </div>


                            {/* LOGIN */}
                            <button
                                type="submit"
                                className="login-button"
                            >
                                Se connecter
                            </button>

                        </form>


                        {/* OU */}
                        <div className="separator">
                            <span></span>
                            <p>ou</p>
                            <span></span>
                        </div>

                        <Link
                            to="/register"
                            className="create-account-button"
                        >
                            <UserRound aria-hidden="true" />
                            <span>Créer un compte visiteur</span>
                        </Link>

                        {message && (
                            <div className="login-message">
                                {message}
                            </div>
                        )}

                    </div>

                </section>


                {/* ========== RIGHT SIDE ========== */}
                <section className="login-right">

                    {/* LANGUE */}
                    <div className="language-selector">
                        <span className="globe">
                            <Globe2 aria-hidden="true" />
                        </span>

                        <span>
                            Français
                        </span>

                        <span className="arrow">
                            <ChevronDown aria-hidden="true" />
                        </span>
                    </div>


                    {/* CONTENU BAS */}
                    <div className="right-overlay">

                        <h2>
                            Un portail unique pour simplifier{" "}
                            <span>votre quotidien</span>
                        </h2>


                        <div className="features">

                            {/* FEATURE 1 */}
                            <div className="feature">

                                <div className="feature-icon">
                                    <ClipboardList aria-hidden="true" />
                                </div>

                                <h3>
                                    Demandes
                                    <br />
                                    administratives
                                </h3>

                                <p>
                                    Soumettez et suivez
                                    vos demandes
                                </p>

                            </div>


                            {/* FEATURE 2 */}
                            <div className="feature">

                                <div className="feature-icon">
                                    <UsersRound aria-hidden="true" />
                                </div>

                                <h3>
                                    Gestion des
                                    <br />
                                    visiteurs
                                </h3>

                                <p>
                                    Préenregistrez et
                                    accueillez vos visiteurs
                                </p>

                            </div>


                            {/* FEATURE 3 */}
                            <div className="feature">

                                <div className="feature-icon">
                                    <BarChart3 aria-hidden="true" />
                                </div>

                                <h3>
                                    Tableaux de
                                    <br />
                                    bord
                                </h3>

                                <p>
                                    Consultez vos indicateurs
                                    et statistiques
                                </p>

                            </div>


                            {/* FEATURE 4 */}
                            <div className="feature">

                                <div className="feature-icon">
                                    <Bell aria-hidden="true" />
                                </div>

                                <h3>
                                    Notifications
                                </h3>

                                <p>
                                    Restez informé
                                    en temps réel
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}
            <footer className="login-footer">

                <div>
                    © 2026 Attijariwafa bank. Tous droits réservés.
                </div>

                <div className="footer-links">
                    Confidentialité
                    <span>|</span>
                    Conditions d’utilisation
                    <span>|</span>
                    Support
                </div>

            </footer>

        </div>
    );
}

export default Login;