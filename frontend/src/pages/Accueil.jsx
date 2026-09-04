import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MENU_ITEMS_BY_ROLE, ROLES } from "../config/roleConfig";
import {
    Bell,
    CalendarDays,
    ClipboardList,
    Home,
    LogOut,
    Menu,
    UserRound,
    X,
    CheckCircle2,
    Users,
    BarChart3,
    BadgeCheck,
    Settings,
    UserPlus,
    DoorOpen,
    ScanLine
} from "lucide-react";

import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./Accueil.css";

const ICON_MAP = {
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

function Accueil() {
    const navigate = useNavigate();
    const { utilisateur, logout, role, isLoggedIn } = useAuth();

    const [menuOuvert, setMenuOuvert] = useState(false);

    const [demandes, setDemandes] = useState([]);
    const [rendezVous, setRendezVous] = useState([]);
    const [visites, setVisites] = useState([]);
    const [visiteurs, setVisiteurs] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        chargerDonnees();
    }, [isLoggedIn, navigate]);

    const chargerDonnees = async () => {
        try {
            setChargement(true);

            const responses = await Promise.all([
                role === ROLES.COLLABORATEUR || role === ROLES.RESPONSABLE || role === ROLES.ADMINISTRATEUR
                    ? api.get("/demandes")
                    : Promise.resolve({ data: [] }),
                api.get("/rendez-vous"),
                api.get("/notifications"),
                role === ROLES.AGENT_ACCUEIL || role === ROLES.ADMINISTRATEUR
                    ? api.get("/visites")
                    : Promise.resolve({ data: [] }),
                role === ROLES.AGENT_ACCUEIL || role === ROLES.ADMINISTRATEUR
                    ? api.get("/visiteurs")
                    : Promise.resolve({ data: [] })
            ]);

            const [demandesResponse, rendezVousResponse, notificationsResponse, visitesResponse, visiteursResponse] = responses;

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

            setVisites(
                Array.isArray(visitesResponse.data)
                    ? visitesResponse.data
                    : visitesResponse.data?.visites || []
            );

            setVisiteurs(
                Array.isArray(visiteursResponse.data)
                    ? visiteursResponse.data
                    : visiteursResponse.data?.visiteurs || []
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
        logout();
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

    const menuItems = MENU_ITEMS_BY_ROLE[role] || [];

    const demandesApprouvees = demandes.filter((demande) =>
        ["ACCEPTEE", "ACCEPTÉE", "APPROUVEE", "APPROUVÉE", "VALIDEE", "VALIDÉE"].includes(
            String(demande.statut || "").toUpperCase()
        )
    ).length;

    const demandesRefusees = demandes.filter((demande) =>
        ["REFUSEE", "REFUSÉE", "REJETEE", "REJETÉE"].includes(
            String(demande.statut || "").toUpperCase()
        )
    ).length;

    const visitesEnCours = visites.filter((visite) =>
        ["PRESENT", "PRÉSENT", "EN_COURS", "EN COURS"].includes(
            String(visite.statut || "").toUpperCase()
        )
    ).length;

    const dateAujourdHui = new Date().toISOString().slice(0, 10);
    const rendezVousAujourdHui = rendezVous.filter((rdv) =>
        String(rdv.date_rendez_vous || "").slice(0, 10) === dateAujourdHui
    ).length;

    const visitesTerminees = visites.filter((visite) =>
        ["TERMINEE", "TERMINE", "SORTI"].includes(String(visite.statut || "").toUpperCase())
    ).length;

    const visiteursAttendusAujourdHui = rendezVous.filter((rdv) =>
        String(rdv.date_rendez_vous || "").slice(0, 10) === dateAujourdHui &&
        !["ANNULE", "TERMINE"].includes(String(rdv.statut || "").toUpperCase())
    );

    const dashboardCards = role === ROLES.RESPONSABLE
        ? [
            ["Demandes à traiter", demandesEnAttente],
            ["En attente de validation", demandesEnAttente],
            ["Demandes approuvées", demandesApprouvees],
            ["Demandes refusées", demandesRefusees]
        ]
        : role === ROLES.AGENT_ACCUEIL
            ? [
                ["Visiteurs attendus", rendezVousAujourdHui],
                ["Visiteurs présents", visitesEnCours],
                ["Visites en cours", visitesEnCours],
                ["Rendez-vous aujourd'hui", rendezVousAujourdHui]
            ]
            : [
                ["Utilisateurs", visiteurs.length + demandes.length],
                ["Demandes totales", demandes.length],
                ["Visiteurs", visiteurs.length],
                ["Visites aujourd'hui", rendezVousAujourdHui]
            ];


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
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className="sidebar-item"
                            onClick={() => allerVers(item.path)}
                        >
                            {ICON_MAP[item.icon] || <span>{item.icon}</span>}
                            <span>{item.label}</span>

                            {item.path === "/notifications" && notificationsNonLues > 0 && (
                                <span className="menu-badge">
                                    {notificationsNonLues}
                                </span>
                            )}

                            {item.path === "/demandes" && demandesEnAttente > 0 && role === ROLES.COLLABORATEUR && (
                                <span className="menu-badge">
                                    {demandesEnAttente}
                                </span>
                            )}
                        </button>
                    ))}
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


                    {role === ROLES.COLLABORATEUR ? (
                        <>
                            <div className="stats-grid">
                                {[
                                    ["Mes demandes", demandes.length, "orange"],
                                    ["Demandes en attente", demandesEnAttente, "yellow"],
                                    ["Demandes approuvées", demandesApprouvees, "green"],
                                    ["Demandes refusées", demandesRefusees, "red"],
                                    ["Mes rendez-vous", rendezVous.length, "blue"]
                                ].map(([label, value, couleur]) => (
                                    <div className="stat-card" key={label}>
                                        <div className={`stat-icon ${couleur}`}>
                                            <ClipboardList size={22} />
                                        </div>
                                        <div>
                                            <span className="stat-label">{label}</span>
                                            <strong className="stat-number">
                                                {chargement ? "..." : value}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="section-title">
                                <h2>Actions rapides</h2>
                                <p>Accédez rapidement à vos fonctionnalités principales.</p>
                            </div>

                            <div className="quick-actions">
                                {[
                                    ["Nouvelle demande", "/nouvelle-demande", ClipboardList],
                                    ["Mes demandes", "/demandes", ClipboardList],
                                    ["Nouveau rendez-vous", "/rendez-vous", CalendarDays],
                                    ["Mes rendez-vous", "/rendez-vous", CalendarDays]
                                ].map(([label, route, Icon]) => (
                                    <button className="quick-card" key={`${label}-${route}`} onClick={() => allerVers(route)}>
                                        <div className="quick-icon blue"><Icon size={24} /></div>
                                        <div><h3>{label}</h3><p>Ouvrir cette fonctionnalité.</p></div>
                                    </button>
                                ))}
                            </div>

                            <div className="recent-section">
                                <div className="section-title recent-title">
                                    <div><h2>Dernières demandes</h2><p>Suivez vos demandes récentes.</p></div>
                                    <button className="view-all-button" onClick={() => allerVers("/demandes")}>Voir tout</button>
                                </div>
                                <div className="recent-card">
                                    {demandes.length === 0 ? (
                                        <div className="empty-state"><ClipboardList size={30} /><strong>Aucune demande</strong><span>Vous n'avez pas encore soumis de demande.</span></div>
                                    ) : (
                                        <div className="demandes-list">
                                            {demandes.slice(0, 5).map((demande) => (
                                                <div className="demande-row" key={demande.id}>
                                                    <div className="demande-info">
                                                        <div className="demande-icon"><ClipboardList size={18} /></div>
                                                        <div>
                                                            <strong>{demande.nom_type || demande.type_demande || `Demande #${demande.id}`}</strong>
                                                            <span>{formatDate(demande.date_soumission)}</span>
                                                        </div>
                                                    </div>
                                                    <span className="status">{demande.statut || "Non défini"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : role === ROLES.AGENT_ACCUEIL ? (
                        <>
                            <div className="stats-grid agent-accueil-stats">
                                {[
                                    ["Visiteurs attendus aujourd'hui", visiteursAttendusAujourdHui.length, "blue", CalendarDays],
                                    ["Visiteurs présents", visitesEnCours, "green", Users],
                                    ["Visites en cours", visitesEnCours, "orange", DoorOpen],
                                    ["Visites terminées", visitesTerminees, "yellow", CheckCircle2],
                                    ["Rendez-vous aujourd'hui", rendezVousAujourdHui, "blue", CalendarDays]
                                ].map(([label, value, couleur, Icon]) => (
                                    <div className="stat-card" key={label}>
                                        <div className={`stat-icon ${couleur}`}><Icon size={22} /></div>
                                        <div>
                                            <span className="stat-label">{label}</span>
                                            <strong className="stat-number">{chargement ? "..." : value}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="section-title">
                                <h2>Actions rapides</h2>
                                <p>Accédez rapidement aux opérations d'accueil.</p>
                            </div>

                            <div className="quick-actions agent-accueil-actions">
                                {[
                                    ["Scanner QR", "/scanner-qr", ScanLine, "Valider l'arrivée d'un visiteur."],
                                    ["Préenregistrer un visiteur", "/visiteurs", UserPlus, "Créer une fiche visiteur."],
                                    ["Voir les visiteurs", "/visiteurs", Users, "Consulter les visiteurs enregistrés."],
                                    ["Voir les visites", "/visites", DoorOpen, "Suivre les entrées et sorties."],
                                    ["Voir les rendez-vous", "/rendez-vous", CalendarDays, "Consulter les visiteurs attendus."]
                                ].map(([label, route, Icon, description]) => (
                                    <button className="quick-card" key={route + label} onClick={() => allerVers(route)}>
                                        <div className="quick-icon blue"><Icon size={24} /></div>
                                        <div><h3>{label}</h3><p>{description}</p></div>
                                    </button>
                                ))}
                            </div>

                            <div className="recent-section">
                                <div className="section-title recent-title">
                                    <div>
                                        <h2>Visiteurs attendus aujourd'hui</h2>
                                        <p>Rendez-vous planifiés pour la journée.</p>
                                    </div>
                                    <button className="view-all-button" onClick={() => allerVers("/rendez-vous")}>Voir tout</button>
                                </div>
                                <div className="recent-card expected-visitors-card">
                                    {visiteursAttendusAujourdHui.length === 0 ? (
                                        <div className="empty-state"><CalendarDays size={30} /><strong>Aucun visiteur attendu</strong><span>Aucun rendez-vous n'est prévu aujourd'hui.</span></div>
                                    ) : (
                                        <div className="expected-visitors-list">
                                            {visiteursAttendusAujourdHui.map((rdv) => (
                                                <div className="expected-visitor-row" key={rdv.id}>
                                                    <div><strong>{rdv.visiteur_nom || "Visiteur non renseigné"}</strong><span>{rdv.visiteur_societe || "Société non renseignée"}</span></div>
                                                    <span>{String(rdv.heure_rendez_vous || "").slice(0, 5) || "-"}</span>
                                                    <span>{rdv.collaborateur_nom || "-"}</span>
                                                    <span className={`status ${String(rdv.statut || "").toLowerCase()}`}>{rdv.statut || "PLANIFIE"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
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

                        </>
                    )}

                </section>


                {/* FOOTER */}

                <footer className="accueil-footer">
                    © 2026 Attijariwafa bank. Tous droits réservés.
                </footer>

            </main >

        </div >
    );
}

export default Accueil;