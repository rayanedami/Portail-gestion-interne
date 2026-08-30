import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CalendarDays,
    ClipboardList,
    CheckCheck,
    Home,
    LogOut,
    Menu,
    UserRound,
    X
} from "lucide-react";

import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./Accueil.css";

const getMenuItems = (role) => {
    const roles = {
        COLLABORATEUR: [
            { label: "Accueil", route: "/accueil", icon: Home },
            { label: "Mes demandes", route: "/demandes", icon: ClipboardList },
            { label: "Mes rendez-vous", route: "/rendez-vous", icon: CalendarDays },
            { label: "Notifications", route: "/notifications", icon: Bell },
            { label: "Mon profil", route: "/profil", icon: UserRound }
        ],
        RESPONSABLE: [
            { label: "Accueil", route: "/accueil", icon: Home },
            { label: "Demandes", route: "/demandes", icon: ClipboardList },
            { label: "Validations", route: "/validations", icon: CheckCheck },
            { label: "Rendez-vous", route: "/rendez-vous", icon: CalendarDays },
            { label: "Notifications", route: "/notifications", icon: Bell },
            { label: "Mon profil", route: "/profil", icon: UserRound }
        ],
        ADMINISTRATEUR: [
            { label: "Accueil", route: "/accueil", icon: Home },
            { label: "Demandes", route: "/demandes", icon: ClipboardList },
            { label: "Validations", route: "/validations", icon: CheckCheck },
            { label: "Rendez-vous", route: "/rendez-vous", icon: CalendarDays },
            { label: "Notifications", route: "/notifications", icon: Bell },
            { label: "Mon profil", route: "/profil", icon: UserRound }
        ],
        AGENT_ACCUEIL: [
            { label: "Accueil", route: "/accueil", icon: Home },
            { label: "Rendez-vous", route: "/rendez-vous", icon: CalendarDays },
            { label: "Notifications", route: "/notifications", icon: Bell },
            { label: "Mon profil", route: "/profil", icon: UserRound }
        ]
    };

    return roles[String(role || "").trim().toUpperCase()] || roles.COLLABORATEUR;
};

function Accueil() {
    const navigate = useNavigate();

    const [utilisateur, setUtilisateur] = useState(null);
    const [menuOuvert, setMenuOuvert] = useState(false);

    const [demandes, setDemandes] = useState([]);
    const [rendezVous, setRendezVous] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const utilisateurStocke = localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
            navigate("/");
            return;
        }

        try {
            const utilisateurConnecte = JSON.parse(utilisateurStocke);

            setUtilisateur(utilisateurConnecte);

            chargerDonnees();
        } catch (error) {
            console.error("Erreur utilisateur :", error);
            localStorage.removeItem("utilisateur");
            navigate("/");
        }
    }, [navigate]);

    const chargerDonnees = async () => {
        try {
            setChargement(true);

            const [demandesResponse, rendezVousResponse, notificationsResponse] =
                await Promise.all([
                    api.get("/demandes"),
                    api.get("/rendez-vous"),
                    api.get("/notifications")
                ]);

            setDemandes(
                Array.isArray(demandesResponse.data)
                    ? demandesResponse.data
                    : demandesResponse.data?.demandes || []
            );

            setRendezVous(
                Array.isArray(rendezVousResponse.data)
                    ? rendezVousResponse.data
                    : rendezVousResponse.data?.rendezVous ||
                    rendezVousResponse.data?.rendez_vous ||
                    []
            );

            setNotifications(
                Array.isArray(notificationsResponse.data)
                    ? notificationsResponse.data
                    : notificationsResponse.data?.notifications || []
            );

        } catch (error) {
            console.error(
                "Erreur lors du chargement des données :",
                error
            );
        } finally {
            setChargement(false);
        }
    };

    const deconnexion = () => {
        localStorage.removeItem("utilisateur");
        navigate("/");
    };

    const allerVers = (route) => {
        navigate(route);
        setMenuOuvert(false);
    };

    const demandesEnAttente = demandes.filter(
        (demande) =>
            String(demande.statut || "").toUpperCase() === "EN_ATTENTE" ||
            String(demande.statut || "").toUpperCase() === "EN ATTENTE"
    ).length;

    const notificationsNonLues = notifications.filter(
        (notification) =>
            Number(notification.utilisateur_id) === Number(utilisateur?.id) &&
            (!notification.est_lue || Number(notification.est_lue) === 0)
    ).length;

    const nomComplet = utilisateur
        ? `${utilisateur.prenom || ""} ${utilisateur.nom || ""}`.trim()
        : "Utilisateur";

    const menuItems = getMenuItems(utilisateur?.role);

    return (
        <div className="accueil-page">

            {/* ================= SIDEBAR MOBILE ================= */}

            {menuOuvert && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMenuOuvert(false)}
                ></div>
            )}

            <aside className={`accueil-sidebar ${menuOuvert ? "ouverte" : ""}`}>

                <div className="sidebar-logo">
                    <img
                        src="/attijari-logo.jpg"
                        alt="Attijariwafa bank"
                    />
                </div>

                <div className="sidebar-menu">
                    {menuItems.map(({ label, route, icon: Icon }, index) => {
                        const isActive = route === "/accueil";

                        return (
                            <button
                                key={`${route}-${index}`}
                                className={`sidebar-item ${isActive ? "actif" : ""}`}
                                onClick={() => allerVers(route)}
                            >
                                <Icon size={19} />
                                <span>{label}</span>

                                {route === "/notifications" && notificationsNonLues > 0 && (
                                    <span className="menu-badge">
                                        {notificationsNonLues}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={deconnexion}
                    >
                        <LogOut size={18} />
                        <span>Se déconnecter</span>
                    </button>

                </div>

            </aside>


            {/* ================= CONTENU PRINCIPAL ================= */}

            <main className="accueil-content">

                {/* HEADER */}

                <header className="accueil-header">

                    <button
                        className="mobile-menu-button"
                        onClick={() => setMenuOuvert(!menuOuvert)}
                    >
                        {menuOuvert ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                    <div className="header-title">
                        <h1>Accueil</h1>
                        <p>
                            Bienvenue dans votre espace personnel
                        </p>
                    </div>

                    <div className="header-user">

                        <div className="header-user-info">
                            <strong>{nomComplet}</strong>

                            <span>
                                {utilisateur?.role || "COLLABORATEUR"}
                            </span>
                        </div>

                        <div className="header-avatar">
                            <UserRound size={21} />
                        </div>

                    </div>

                </header>


                {/* ================= CONTENU ================= */}

                <section className="accueil-body">

                    {/* BIENVENUE */}

                    <div className="welcome-banner">

                        <div>
                            <span className="welcome-small">
                                Bienvenue,
                            </span>

                            <h2>
                                {nomComplet}
                            </h2>

                            <p>
                                Gérez facilement vos demandes
                                administratives et vos rendez-vous.
                            </p>
                        </div>

                        <div className="welcome-role">
                            <span>Votre rôle</span>
                            <strong>
                                {utilisateur?.role || "COLLABORATEUR"}
                            </strong>
                        </div>

                    </div>


                    {/* STATISTIQUES */}

                    <div className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon orange">
                                <ClipboardList size={22} />
                            </div>

                            <div>
                                <span className="stat-label">
                                    Mes demandes
                                </span>

                                <strong className="stat-number">
                                    {chargement ? "..." : demandes.length}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon blue">
                                <CalendarDays size={22} />
                            </div>

                            <div>
                                <span className="stat-label">
                                    Rendez-vous
                                </span>

                                <strong className="stat-number">
                                    {chargement
                                        ? "..."
                                        : rendezVous.length}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon yellow">
                                <Bell size={22} />
                            </div>

                            <div>
                                <span className="stat-label">
                                    Notifications
                                </span>

                                <strong className="stat-number">
                                    {chargement
                                        ? "..."
                                        : notificationsNonLues}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon green">
                                <ClipboardList size={22} />
                            </div>

                            <div>
                                <span className="stat-label">
                                    En attente
                                </span>

                                <strong className="stat-number">
                                    {chargement
                                        ? "..."
                                        : demandesEnAttente}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* ACTIONS RAPIDES */}

                    <div className="section-title">
                        <h2>Actions rapides</h2>
                        <p>
                            Accédez rapidement aux fonctionnalités principales.
                        </p>
                    </div>


                    <div className="quick-actions">

                        <button
                            className="quick-card"
                            onClick={() => allerVers("/demandes")}
                        >
                            <div className="quick-icon orange">
                                <ClipboardList size={24} />
                            </div>

                            <div>
                                <h3>Mes demandes</h3>
                                <p>
                                    Consulter et suivre vos demandes
                                    administratives.
                                </p>
                            </div>
                        </button>


                        <button
                            className="quick-card"
                            onClick={() => allerVers("/rendez-vous")}
                        >
                            <div className="quick-icon blue">
                                <CalendarDays size={24} />
                            </div>

                            <div>
                                <h3>Mes rendez-vous</h3>
                                <p>
                                    Consulter vos rendez-vous et leurs
                                    informations.
                                </p>
                            </div>
                        </button>


                        <button
                            className="quick-card"
                            onClick={() => allerVers("/notifications")}
                        >
                            <div className="quick-icon yellow">
                                <Bell size={24} />
                            </div>

                            <div>
                                <h3>Notifications</h3>
                                <p>
                                    Consultez vos dernières notifications.
                                </p>
                            </div>
                        </button>

                    </div>


                    {/* DERNIÈRES DEMANDES */}

                    <div className="recent-section">

                        <div className="section-title recent-title">
                            <div>
                                <h2>Dernières demandes</h2>
                                <p>
                                    Aperçu de vos demandes administratives.
                                </p>
                            </div>

                            <button
                                className="view-all-button"
                                onClick={() => allerVers("/demandes")}
                            >
                                Voir tout
                            </button>
                        </div>


                        <div className="recent-card">

                            {chargement ? (

                                <div className="empty-state">
                                    Chargement...
                                </div>

                            ) : demandes.length === 0 ? (

                                <div className="empty-state">
                                    <ClipboardList size={30} />

                                    <strong>
                                        Aucune demande
                                    </strong>

                                    <span>
                                        Vous n'avez pas encore soumis de demande.
                                    </span>
                                </div>

                            ) : (

                                <div className="demandes-list">

                                    {demandes
                                        .slice(0, 5)
                                        .map((demande) => (

                                            <div
                                                className="demande-row"
                                                key={demande.id}
                                            >

                                                <div className="demande-info">

                                                    <div className="demande-icon">
                                                        <ClipboardList
                                                            size={18}
                                                        />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {demande.motif ||
                                                                "Demande administrative"}
                                                        </strong>

                                                        <span>
                                                            {formatDate(
                                                                demande.dateSoumission ||
                                                                demande.date_soumission
                                                            )}
                                                        </span>
                                                    </div>

                                                </div>


                                                <span
                                                    className={`status ${String(
                                                        demande.statut || ""
                                                    )
                                                        .toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )
                                                        }`}
                                                >
                                                    {demande.statut ||
                                                        "Non défini"}
                                                </span>

                                            </div>

                                        ))}

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* FOOTER */}

                <footer className="accueil-footer">
                    © 2026 Attijariwafa bank. Tous droits réservés.
                </footer>

            </main>

        </div>
    );
}

export default Accueil;