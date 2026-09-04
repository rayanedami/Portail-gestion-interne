import { useEffect, useState } from "react";
import "./Visites.css";
import api from "../services/api";
import { DoorOpen, RefreshCw, UsersRound } from "lucide-react";

const API_URL = "http://localhost:3000/api";

function Visites() {
    const [visites, setVisites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const chargerVisites = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/visites");
            const data = response.data;

            // Le backend peut retourner directement un tableau
            // ou un objet contenant les visites.
            const liste = Array.isArray(data)
                ? data
                : data.visites || data.data || [];

            setVisites(liste);
        } catch (err) {
            console.error("Erreur visites :", err);
            setError(err.message || "Erreur lors du chargement des visites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerVisites();
    }, []);

    const formaterDate = (date) => {
        if (!date) return "-";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return date;
        }

        return d.toLocaleDateString("fr-FR");
    };

    const formaterHeure = (heure) => {
        if (!heure) return "-";

        // Si le backend retourne déjà HH:mm:ss
        if (typeof heure === "string" && /^\d{2}:\d{2}/.test(heure)) {
            return heure.substring(0, 5);
        }

        const d = new Date(heure);

        if (Number.isNaN(d.getTime())) {
            return heure;
        }

        return d.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getNomVisiteur = (visite) => {
        if (visite.visiteur_nom || visite.visiteur_prenom) {
            return `${visite.visiteur_prenom || ""} ${visite.visiteur_nom || ""}`.trim();
        }

        if (visite.nom || visite.prenom) {
            return `${visite.prenom || ""} ${visite.nom || ""}`.trim();
        }

        if (visite.visiteur?.nom || visite.visiteur?.prenom) {
            return `${visite.visiteur?.prenom || ""} ${visite.visiteur?.nom || ""}`.trim();
        }

        return `Visiteur #${visite.visiteur_id || visite.id || "-"}`;
    };

    const getStatut = (visite) => {
        if (visite.statut) {
            return String(visite.statut).toUpperCase();
        }

        if (visite.date_sortie || visite.heure_sortie) {
            return "SORTI";
        }

        return "EN_ATTENTE";
    };

    const visiteursPresents = visites.filter((visite) => {
        const statut = getStatut(visite);
        return statut === "EN_COURS" || statut === "PRESENT" || statut === "PRÉSENT";
    }).length;

    const visitesTerminees = visites.filter((visite) => {
        const statut = getStatut(visite);
        return statut === "SORTI" || statut === "TERMINEE" || statut === "TERMINÉE";
    }).length;

    const enregistrerSortie = async (visite) => {
        try {
            await api.put(`/visites/${visite.id}`, {
                date_entree: visite.date_entree,
                date_sortie: new Date().toISOString().slice(0, 19).replace("T", " "),
                statut: "TERMINEE",
                rendez_vous_id: visite.rendez_vous_id,
                agent_accueil_id: visite.agent_accueil_id
            });
            await chargerVisites();
        } catch (err) {
            setError("Impossible d'enregistrer la sortie.");
        }
    };

    return (
        <div className="visites-page">
            <div className="visites-header">
                <div>
                    <h1>Gestion des visites</h1>
                    <p>
                        Consultez les entrées, sorties et l'historique des visiteurs.
                    </p>
                </div>

                <button
                    className="btn-refresh-visites"
                    onClick={chargerVisites}
                >
                    <RefreshCw size={16} /> Actualiser
                </button>
            </div>

            <div className="visites-stats">

                <div className="visite-stat-card">
                    <div className="stat-icon"><UsersRound size={20} /></div>
                    <div>
                        <span>Total des visites</span>
                        <strong>{visites.length}</strong>
                    </div>
                </div>

                <div className="visite-stat-card">
                    <div className="stat-icon"><span className="status-dot"></span></div>
                    <div>
                        <span>Visiteurs présents</span>
                        <strong>{visiteursPresents}</strong>
                    </div>
                </div>

                <div className="visite-stat-card">
                    <div className="stat-icon"><DoorOpen size={20} /></div>
                    <div>
                        <span>Visites terminées</span>
                        <strong>{visitesTerminees}</strong>
                    </div>
                </div>

            </div>

            <div className="visites-card">

                <div className="visites-card-header">
                    <div>
                        <h2>Historique des visites</h2>
                        <p>Liste des entrées et sorties enregistrées.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="visites-message">
                        Chargement des visites...
                    </div>
                ) : error ? (
                    <div className="visites-error">
                        <strong>Erreur :</strong> {error}
                        <br />
                        <button
                            className="btn-retry-visites"
                            onClick={chargerVisites}
                        >
                            Réessayer
                        </button>
                    </div>
                ) : visites.length === 0 ? (
                    <div className="visites-message">
                        Aucune visite enregistrée.
                    </div>
                ) : (
                    <div className="table-container-visites">

                        <table className="visites-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Visiteur</th>
                                    <th>Rendez-vous</th>
                                    <th>Date</th>
                                    <th>Entrée</th>
                                    <th>Sortie</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>

                            <tbody>

                                {visites.map((visite) => {

                                    const statut = getStatut(visite);

                                    return (
                                        <tr key={visite.id}>

                                            <td>
                                                #{visite.id}
                                            </td>

                                            <td>
                                                <div className="visiteur-cell">
                                                    <div className="visiteur-avatar">
                                                        {getNomVisiteur(visite)
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <span>
                                                        {getNomVisiteur(visite)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {visite.rendez_vous_id
                                                    ? `#${visite.rendez_vous_id}`
                                                    : "-"}
                                            </td>

                                            <td>
                                                {formaterDate(
                                                    visite.date_visite ||
                                                    visite.date ||
                                                    visite.date_entree
                                                )}
                                            </td>

                                            <td>
                                                {formaterHeure(
                                                    visite.heure_entree ||
                                                    visite.date_entree
                                                )}
                                            </td>

                                            <td>
                                                {formaterHeure(
                                                    visite.heure_sortie ||
                                                    visite.date_sortie
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`statut-visite statut-${statut
                                                        .toLowerCase()
                                                        .replace("é", "e")}`}
                                                >
                                                    {statut}
                                                </span>
                                                {(statut === "EN_COURS" || statut === "PRESENT" || statut === "PRÉSENT") && (
                                                    <button
                                                        className="btn-retry-visites"
                                                        onClick={() => enregistrerSortie(visite)}
                                                    >
                                                        Sortie
                                                    </button>
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Visites;