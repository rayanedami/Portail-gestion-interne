import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    CalendarDays,
    Clock,
    MapPin,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./RendezVous.css";

function RendezVous() {
    const { utilisateur } = useAuth();
    const [rendezVous, setRendezVous] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const utilisateurId = utilisateur?.id;

    useEffect(() => {
        fetchRendezVous();
    }, []);

    const fetchRendezVous = async () => {
        try {
            setLoading(true);

            const response = await api.get("/rendez-vous");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.rendezVous ||
                response.data.rendez_vous ||
                [];

            let identifiantRendezVous = utilisateurId;

            if (utilisateur?.role === "VISITEUR") {
                const visiteursResponse = await api.get("/visiteurs");
                const visiteurs = Array.isArray(visiteursResponse.data)
                    ? visiteursResponse.data
                    : [];
                const profilVisiteur = visiteurs.find(
                    (visiteur) =>
                        Number(visiteur.utilisateur_id) === Number(utilisateurId)
                );
                identifiantRendezVous = profilVisiteur?.id;
            }

            const mesRendezVous = data.filter((rdv) => {
                const identifiant = utilisateur?.role === "VISITEUR"
                    ? rdv.visiteur_id
                    : rdv.utilisateur_id ?? rdv.collaborateur_id;
                return Number(identifiant) === Number(identifiantRendezVous);
            });

            setRendezVous(mesRendezVous);
        } catch (error) {
            console.error(
                "Erreur récupération rendez-vous :",
                error
            );

            setMessage(
                "Impossible de récupérer les rendez-vous."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (statut) => {
        const value = String(statut || "").toLowerCase();

        if (
            value.includes("confirm") ||
            value.includes("valid")
        ) {
            return {
                className: "rdv-success",
                icon: <CheckCircle2 />
            };
        }

        if (
            value.includes("annul") ||
            value.includes("refus")
        ) {
            return {
                className: "rdv-danger",
                icon: <XCircle />
            };
        }

        return {
            className: "rdv-warning",
            icon: <AlertCircle />
        };
    };

    const filteredRendezVous = rendezVous.filter((rdv) => {
        const text = `
            ${rdv.motif || ""}
            ${rdv.statut || ""}
            ${rdv.lieu || ""}
            ${rdv.visiteur_nom || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    return (
        <div className="rendez-vous-page">

            <div className="rdv-header">

                <div>
                    <div className="rdv-title-icon">
                        <CalendarDays />
                    </div>

                    <h1>Mes rendez-vous</h1>

                    <p>
                        Consultez vos rendez-vous et vos visites prévues.
                    </p>
                </div>

            </div>

            {message && (
                <div className="rdv-message">
                    {message}
                </div>
            )}

            <div className="rdv-toolbar">

                <div className="rdv-search">
                    <Search />

                    <input
                        type="text"
                        placeholder="Rechercher un rendez-vous..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <span className="rdv-count">
                    {filteredRendezVous.length} rendez-vous
                </span>

            </div>

            <div className="rdv-list">

                {loading ? (
                    <div className="rdv-empty">
                        Chargement des rendez-vous...
                    </div>
                ) : filteredRendezVous.length === 0 ? (
                    <div className="rdv-empty">

                        <CalendarDays />

                        <h3>
                            Aucun rendez-vous
                        </h3>

                        <p>
                            Aucun rendez-vous n'est disponible.
                        </p>

                    </div>
                ) : (
                    filteredRendezVous.map((rdv) => {

                        const status = getStatus(rdv.statut);

                        return (
                            <div
                                className="rdv-card"
                                key={rdv.id}
                            >

                                <div className="rdv-date">

                                    <span>
                                        {formatDate(
                                            rdv.date_rendez_vous || rdv.date,
                                            false
                                        )}
                                    </span>

                                </div>

                                <div className="rdv-content">

                                    <div className="rdv-content-header">

                                        <h3>
                                            {rdv.motif ||
                                                "Rendez-vous"}
                                        </h3>

                                        <span
                                            className={`rdv-status ${status.className}`}
                                        >
                                            {status.icon}
                                            {rdv.statut ||
                                                "En attente"}
                                        </span>

                                    </div>

                                    <div className="rdv-details">

                                        <span>
                                            <Clock />
                                            {rdv.heure_rendez_vous ||
                                                rdv.heure ||
                                                "Heure non définie"}
                                        </span>

                                        <span>
                                            <MapPin />
                                            {rdv.lieu ||
                                                "Lieu non défini"}
                                        </span>

                                    </div>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>

        </div>
    );
}

export default RendezVous;