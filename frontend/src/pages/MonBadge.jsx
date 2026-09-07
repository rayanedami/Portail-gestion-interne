import React, { useCallback, useEffect, useState } from "react";
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

    const chargerBadge = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [rendezVousResponse, badgesResponse] = await Promise.all([
                api.get("/rendez-vous"),
                api.get("/badges")
            ]);
            const rendezVous = Array.isArray(rendezVousResponse.data)
                ? rendezVousResponse.data
                : rendezVousResponse.data?.rendezVous || [];
            const badges = Array.isArray(badgesResponse.data)
                ? badgesResponse.data
                : badgesResponse.data?.badges || [];
            const mesRendezVous = rendezVous.filter((rdv) => Number(rdv.visiteur_id) > 0);
            const mesRendezVousIds = new Set(mesRendezVous.map((rdv) => Number(rdv.id)));
            const badgeValide = badges.find((item) => (
                ["VALIDE", "UTILISE"].includes(String(item.statut || "").toUpperCase()) &&
                (mesRendezVousIds.size === 0 || mesRendezVousIds.has(Number(item.rendez_vous_id)))
            ));

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
    }, []);

    useEffect(() => {
        if (utilisateur?.id) {
            chargerBadge();
        }
    }, [utilisateur?.id, chargerBadge]);

    const formaterDate = (date) => {
        if (!date) return "Non renseignée";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    const imprimerBadge = () => {
        const qrCode = document.querySelector(".badge-qr-panel svg")?.outerHTML;
        if (!qrCode || !badge) return;

        const nom = `${utilisateur?.prenom || ""} ${utilisateur?.nom || ""}`.trim() || "Non renseigné";
        const dateVisite = formaterDate(rendezVous?.date_rendez_vous);
        const heureVisite = rendezVous?.heure_rendez_vous || "Non renseignée";
        const personne = rendezVous?.personne_a_rencontrer || rendezVous?.collaborateur_nom || "Non renseignée";
        const societe = utilisateur?.societe || "Non renseignée";
        const printWindow = window.open("", "_blank", "width=900,height=700");

        if (!printWindow) {
            setError("Autorisez les fenêtres pop-up pour imprimer le badge.");
            return;
        }

        printWindow.document.write(`
            <!doctype html>
            <html lang="fr">
                <head>
                    <meta charset="UTF-8" />
                    <title>Badge QR - ${nom}</title>
                    <style>
                        * { box-sizing: border-box; }
                        body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #101828; background: #fff; }
                        .badge { width: 100%; max-width: 760px; margin: 0 auto; border: 1px solid #d0d5dd; border-radius: 12px; padding: 28px; }
                        h1 { margin: 0 0 6px; font-size: 24px; }
                        .subtitle { margin: 0 0 24px; color: #667085; font-size: 13px; }
                        .content { display: grid; grid-template-columns: 250px 1fr; gap: 30px; align-items: center; }
                        .qr { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px; border: 1px solid #eaecf0; border-radius: 8px; }
                        .qr svg { width: 205px; height: 205px; }
                        .code { max-width: 220px; text-align: center; font-size: 11px; font-weight: 700; overflow-wrap: anywhere; }
                        .valid { color: #067647; font-size: 12px; font-weight: 700; }
                        .details { display: grid; gap: 0; }
                        .row { display: grid; grid-template-columns: 150px 1fr; gap: 12px; padding: 13px 0; border-bottom: 1px solid #eaecf0; font-size: 13px; }
                        .label { color: #667085; font-weight: 700; }
                        .value { font-weight: 600; }
                        @page { size: A4; margin: 16mm; }
                        @media print { body { padding: 0; } .badge { border: 0; padding: 0; } }
                    </style>
                </head>
                <body>
                    <main class="badge">
                        <h1>Badge visiteur QR</h1>
                        <p class="subtitle">Présentez ce badge à l'accueil lors de votre arrivée.</p>
                        <section class="content">
                            <div class="qr">
                                ${qrCode}
                                <span class="code">${badge.qr_code}</span>
                                <span class="valid">Valide</span>
                            </div>
                            <div class="details">
                                <div class="row"><span class="label">Nom</span><span class="value">${nom}</span></div>
                                <div class="row"><span class="label">Société</span><span class="value">${societe}</span></div>
                                <div class="row"><span class="label">Personne à rencontrer</span><span class="value">${personne}</span></div>
                                <div class="row"><span class="label">Date de visite</span><span class="value">${dateVisite}</span></div>
                                <div class="row"><span class="label">Heure</span><span class="value">${heureVisite}</span></div>
                            </div>
                        </section>
                    </main>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
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
                            <span className="badge-status"><span className="status-dot"></span>{badge.statut === "UTILISE" ? "Déjà utilisé" : "Valide"}</span>
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