import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, MapPin, Printer, Ticket } from "lucide-react";
import api from "../services/api";
import "./MonBadge.css";

function MonBadge() {
    const { utilisateur } = useAuth();

    const [badge, setBadge] = useState(null);
    const [rendezVous, setRendezVous] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (utilisateur?.id) {
            chargerBadge();
        }
    }, [utilisateur?.id]);

    const chargerBadge = async () => {
        try {
            setLoading(true);
            setError("");

            const [rendezVousResponse, visiteursResponse] = await Promise.all([
                api.get("/rendez-vous"),
                api.get("/visiteurs")
            ]);

            const rendezVous = rendezVousResponse.data;
            const visiteurs = visiteursResponse.data;
            const monProfilVisiteur = visiteurs.find(
                (visiteur) =>
                    Number(visiteur.utilisateur_id) === Number(utilisateur?.id)
            );

            if (!monProfilVisiteur) {
                setBadge(null);
                return;
            }

            const mesRendezVous = rendezVous.filter(
                (rdv) =>
                    Number(rdv.visiteur_id) === Number(monProfilVisiteur.id)
            );

            if (mesRendezVous.length === 0) {
                setBadge(null);
                return;
            }

            const badgesResponse = await api.get("/badges");
            const badges = badgesResponse.data;

            const mesRendezVousIds = mesRendezVous.map(
                (rdv) => Number(rdv.id)
            );

            const badgeValide = badges.find(
                (item) =>
                    mesRendezVousIds.includes(
                        Number(item.rendez_vous_id)
                    ) &&
                    ["VALIDE"].includes(
                        String(item.statut || "").toUpperCase()
                    )
            );

            setBadge(badgeValide || null);
            setRendezVous(
                mesRendezVous.find(
                    (rdv) => Number(rdv.id) === Number(badgeValide?.rendez_vous_id)
                ) || null
            );

        } catch (err) {
            console.error(err);
            setError(
                "Impossible de récupérer votre badge pour le moment."
            );
        } finally {
            setLoading(false);
        }
    };

    const formaterDate = (date) => {
        if (!date) return "Non renseignée";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    const imprimerBadge = () => {
        window.print();
    };


    if (loading) {
        return (
            <div className="badge-page">
                <div className="badge-container">
                    <div className="badge-loading">
                        Chargement de votre badge...
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="badge-page">
            <div className="badge-container">

                <div className="badge-header">

                    <div>
                        <span>
                            ESPACE VISITEUR
                        </span>

                        <h1>
                            Mon badge QR
                        </h1>

                        <p>
                            Présentez ce badge à l'accueil lors de votre arrivée.
                        </p>
                    </div>

                    <div className="badge-icon-large">
                        <Ticket size={30} />
                    </div>

                </div>


                {error && (
                    <div className="badge-error">
                        {error}
                    </div>
                )}


                {!error && !badge && (
                    <div className="no-badge">

                        <div className="no-badge-icon">
                            <Ticket size={34} />
                        </div>

                        <h2>
                            Aucun badge disponible
                        </h2>

                        <p>
                            Votre badge QR sera disponible après la
                            confirmation de votre rendez-vous.
                        </p>

                    </div>
                )}


                {!error && badge && (
                    <div className="badge-card">
                        <div className="badge-qr-panel">
                            <QRCodeSVG value={badge.qr_code} size={220} level="H" includeMargin />
                            <span className="badge-code-label">Code de validation</span>
                            <strong className="badge-code">{badge.qr_code}</strong>
                            <span className="badge-status"><span className="status-dot"></span>Valide</span>
                        </div>

                        <div className="badge-details-panel">
                            <div className="badge-detail-row"><span>Nom</span><strong>{utilisateur?.prenom} {utilisateur?.nom}</strong></div>
                            <div className="badge-detail-row"><span>Société</span><strong>{utilisateur?.societe || "Non renseignée"}</strong></div>
                            <div className="badge-detail-row"><span>Personne à rencontrer</span><strong>{rendezVous?.personne_a_rencontrer || rendezVous?.collaborateur_nom || "Non renseignée"}</strong></div>
                            <div className="badge-detail-row"><span><CalendarDays size={15} /> Date de visite</span><strong>{formaterDate(rendezVous?.date_rendez_vous)}</strong></div>
                            <div className="badge-detail-row"><span><CalendarDays size={15} /> Heure</span><strong>{rendezVous?.heure_rendez_vous || "Non renseignée"}</strong></div>
                            <div className="badge-detail-row"><span><MapPin size={15} /> Lieu</span><strong>{rendezVous?.lieu || "Accueil principal"}</strong></div>
                            <div className="badge-actions"><button type="button" className="badge-print-button" onClick={imprimerBadge}><Printer size={18} /> Imprimer</button><button type="button" className="badge-finish-button" disabled>Terminer la visite</button></div>
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default MonBadge;