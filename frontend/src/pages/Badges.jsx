import { useEffect, useState } from "react";
import {
    BadgeCheck,
    QrCode,
    UserRound,
    CalendarDays,
    Search,
    RefreshCw
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Badges.css";

function Badges() {
    const { user, utilisateur } = useAuth();

    const currentUser = user || utilisateur;

    const [visiteurs, setVisiteurs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchVisiteurs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/visiteurs");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.visiteurs || [];

            setVisiteurs(data);

        } catch (err) {
            console.error("Erreur récupération visiteurs :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de récupérer les visiteurs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisiteurs();
    }, []);

    const filteredVisiteurs = visiteurs.filter((visiteur) => {
        const texte = search.toLowerCase();

        return (
            String(visiteur.nom || "")
                .toLowerCase()
                .includes(texte) ||
            String(visiteur.prenom || "")
                .toLowerCase()
                .includes(texte) ||
            String(visiteur.email || "")
                .toLowerCase()
                .includes(texte) ||
            String(visiteur.id || "")
                .toLowerCase()
                .includes(texte)
        );
    });

    const getNomVisiteur = (visiteur) => {
        const nom = visiteur.nom || "";
        const prenom = visiteur.prenom || "";

        const fullName = `${prenom} ${nom}`.trim();

        return fullName || `Visiteur #${visiteur.id}`;
    };

    const getStatut = (visiteur) => {
        return (
            visiteur.statut ||
            visiteur.status ||
            "EN_ATTENTE"
        );
    };

    const getBadgeClass = (statut) => {
        const value = String(statut).toUpperCase();

        if (
            value === "ACTIF" ||
            value === "VALIDE" ||
            value === "VALIDEE"
        ) {
            return "badge-status active";
        }

        if (
            value === "TERMINE" ||
            value === "EXPIRE"
        ) {
            return "badge-status expired";
        }

        return "badge-status pending";
    };

    return (
        <div className="badges-page">

            {/* HEADER */}

            <div className="badges-header">

                <div>
                    <div className="badges-title-row">
                        <BadgeCheck size={30} />

                        <h1>Gestion des badges</h1>
                    </div>

                    <p>
                        Gestion et contrôle des badges visiteurs.
                    </p>
                </div>

                <button
                    type="button"
                    className="badges-refresh"
                    onClick={fetchVisiteurs}
                >
                    <RefreshCw size={16} />
                    Actualiser
                </button>

            </div>


            {/* INFORMATIONS UTILISATEUR */}

            <div className="badges-user-card">

                <div className="user-avatar">
                    <UserRound size={22} />
                </div>

                <div>
                    <strong>
                        {currentUser?.prenom} {currentUser?.nom}
                    </strong>

                    <span>
                        Rôle : {currentUser?.role}
                    </span>
                </div>

            </div>


            {/* RECHERCHE */}

            <div className="badges-toolbar">

                <div className="badges-search">

                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Rechercher un visiteur..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </div>


            {/* ERREUR */}

            {error && (
                <div className="badges-error">
                    {error}
                </div>
            )}


            {/* CHARGEMENT */}

            {loading ? (
                <div className="badges-empty">
                    Chargement des visiteurs...
                </div>
            ) : filteredVisiteurs.length === 0 ? (

                <div className="badges-empty">

                    <QrCode size={45} />

                    <h3>
                        Aucun visiteur trouvé
                    </h3>

                    <p>
                        Aucun visiteur ne correspond à votre recherche.
                    </p>

                </div>

            ) : (

                <div className="badges-grid">

                    {filteredVisiteurs.map((visiteur) => {

                        const statut = getStatut(visiteur);

                        return (

                            <div
                                className="badge-card"
                                key={visiteur.id}
                            >

                                <div className="badge-card-top">

                                    <div className="badge-icon">
                                        <QrCode size={28} />
                                    </div>

                                    <span
                                        className={getBadgeClass(
                                            statut
                                        )}
                                    >
                                        {statut}
                                    </span>

                                </div>


                                <div className="badge-person">

                                    <h2>
                                        {getNomVisiteur(visiteur)}
                                    </h2>

                                    {visiteur.email && (
                                        <p>
                                            {visiteur.email}
                                        </p>
                                    )}

                                </div>


                                <div className="badge-info">

                                    <div>

                                        <UserRound size={15} />

                                        <span>
                                            ID visiteur :{" "}
                                            {visiteur.id}
                                        </span>

                                    </div>

                                    <div>

                                        <CalendarDays size={15} />

                                        <span>
                                            {visiteur.date_visite ||
                                                visiteur.date_arrivee ||
                                                "Date non renseignée"}
                                        </span>

                                    </div>

                                </div>


                                <div className="badge-code">

                                    <QrCode size={20} />

                                    <div>

                                        <strong>
                                            QR Badge
                                        </strong>

                                        <span>
                                            Badge associé au visiteur
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default Badges;