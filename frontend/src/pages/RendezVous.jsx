import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    CalendarDays,
    Clock,
    MapPin,
    Search,
    Plus,
    Pencil,
    Ban,
    Eye,
    QrCode,
    X,
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
    const [badges, setBadges] = useState([]);
    const [detailRendezVous, setDetailRendezVous] = useState(null);
    const [historiqueVisites, setHistoriqueVisites] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingRendezVous, setEditingRendezVous] = useState(null);
    const [formData, setFormData] = useState({
        date_rendez_vous: "",
        heure_rendez_vous: "",
        motif: "",
        visiteur_id: "",
        collaborateur_id: ""
    });

    const utilisateurId = utilisateur?.id;

    useEffect(() => {
        fetchRendezVous();
    }, [utilisateur?.role]);

    const fetchRendezVous = async () => {
        try {
            setLoading(true);

            const requests = [api.get("/rendez-vous")];
            if (utilisateur?.role === "AGENT_ACCUEIL") {
                requests.push(api.get("/badges"));
            }
            const [response, badgesResponse] = await Promise.all(requests);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.rendezVous ||
                response.data.rendez_vous ||
                [];

            setRendezVous(data);
            setBadges(badgesResponse?.data || []);
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

    const ouvrirFormulaire = (rdv = null) => {
        setEditingRendezVous(rdv);
        setFormData(rdv ? {
            date_rendez_vous: String(rdv.date_rendez_vous || "").slice(0, 10),
            heure_rendez_vous: String(rdv.heure_rendez_vous || "").slice(0, 5),
            motif: rdv.motif || "",
            visiteur_id: rdv.visiteur_id || "",
            collaborateur_id: rdv.collaborateur_id || utilisateurId || "",
            statut: rdv.statut || "PLANIFIE"
        } : {
            date_rendez_vous: "",
            heure_rendez_vous: "",
            motif: "",
            visiteur_id: "",
            collaborateur_id: utilisateur?.role === "COLLABORATEUR" || utilisateur?.role === "RESPONSABLE" ? utilisateurId : "",
            statut: "PLANIFIE"
        });
        setShowForm(true);
    };

    const enregistrerRendezVous = async (event) => {
        event.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.visiteur_id) delete payload.visiteur_id;
            const response = editingRendezVous
                ? await api.put(`/rendez-vous/${editingRendezVous.id}`, payload)
                : await api.post("/rendez-vous", payload);
            setMessage(response.data.message || "Rendez-vous enregistré.");
            setShowForm(false);
            setEditingRendezVous(null);
            await fetchRendezVous();
        } catch (error) {
            setMessage(error.response?.data?.message || "Impossible d'enregistrer le rendez-vous.");
        }
    };

    const annulerRendezVous = async (id) => {
        if (!window.confirm("Annuler ce rendez-vous ?")) return;
        try {
            const response = await api.delete(`/rendez-vous/${id}`);
            setMessage(response.data.message || "Rendez-vous annulé.");
            await fetchRendezVous();
        } catch (error) {
            setMessage(error.response?.data?.message || "Impossible d'annuler le rendez-vous.");
        }
    };

    const ouvrirDetails = async (rdv) => {
        try {
            setDetailLoading(true);
            const detailResponse = await api.get(`/rendez-vous/${rdv.id}`);
            let visites = [];
            if (isAgentAccueil || utilisateur?.role === "ADMINISTRATEUR") {
                const visitesResponse = await api.get("/visites");
                visites = Array.isArray(visitesResponse.data)
                    ? visitesResponse.data
                    : visitesResponse.data.visites || [];
            }
            setDetailRendezVous(detailResponse.data);
            setHistoriqueVisites(
                visites.filter((visite) => Number(visite.rendez_vous_id) === Number(rdv.id))
            );
        } catch (error) {
            setMessage(error.response?.data?.message || "Impossible de charger le détail du rendez-vous.");
        } finally {
            setDetailLoading(false);
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

    const canManage = ["COLLABORATEUR", "RESPONSABLE", "ADMINISTRATEUR", "AGENT_ACCUEIL"].includes(utilisateur?.role);
    const isAgentAccueil = utilisateur?.role === "AGENT_ACCUEIL";
    const badgeFor = (rdvId) => badges.find(
        (badge) => Number(badge.rendez_vous_id) === Number(rdvId)
    );
    const formatTime = (time) => String(time || "").slice(0, 5);

    return (
        <div className="rendez-vous-page">
            <div className="rdv-header">

                <div>
                    <div className="rdv-title-icon">
                        <CalendarDays />
                    </div>

                    <h1>{utilisateur?.role === "AGENT_ACCUEIL" ? "Liste des rendez-vous" : "Mes rendez-vous"}</h1>

                    <p>Consultez vos rendez-vous et vos visites prévues.</p>
                </div>

                {canManage && (
                    <button className="rdv-add-button" type="button" onClick={() => ouvrirFormulaire()}>
                        <Plus /> Nouveau rendez-vous
                    </button>
                )}

            </div>

            {message && (
                <div className="rdv-message">
                    {message}
                </div>
            )}

            {showForm && (
                <form className="rdv-form" onSubmit={enregistrerRendezVous}>
                    <h2>{editingRendezVous ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</h2>
                    <div className="rdv-form-grid">
                        <label>Date<input required type="date" value={formData.date_rendez_vous} onChange={(e) => setFormData({ ...formData, date_rendez_vous: e.target.value })} /></label>
                        <label>Heure<input required type="time" value={formData.heure_rendez_vous} onChange={(e) => setFormData({ ...formData, heure_rendez_vous: e.target.value })} /></label>
                        <label>Visiteur ID<input required type="number" min="1" value={formData.visiteur_id} onChange={(e) => setFormData({ ...formData, visiteur_id: e.target.value })} /></label>
                        <label>Collaborateur ID<input required type="number" min="1" value={formData.collaborateur_id} onChange={(e) => setFormData({ ...formData, collaborateur_id: e.target.value })} /></label>
                        <label>Statut<select value={formData.statut || "PLANIFIE"} onChange={(e) => setFormData({ ...formData, statut: e.target.value })}>
                            <option value="PLANIFIE">EN ATTENTE</option>
                            <option value="CONFIRME">CONFIRME</option>
                            <option value="ANNULE">ANNULE</option>
                            <option value="TERMINE">TERMINE</option>
                        </select></label>
                        <label className="rdv-form-wide">Motif<textarea value={formData.motif} onChange={(e) => setFormData({ ...formData, motif: e.target.value })} /></label>
                    </div>
                    <div className="rdv-form-actions">
                        <button type="button" onClick={() => setShowForm(false)}>Fermer</button>
                        <button className="rdv-add-button" type="submit">Enregistrer</button>
                    </div>
                </form>
            )}

            {detailRendezVous && (
                <div className="rdv-modal-backdrop" role="presentation" onClick={() => setDetailRendezVous(null)}>
                    <section className="rdv-detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                        <div className="rdv-detail-header">
                            <div>
                                <span className="rdv-detail-kicker">FICHE RENDEZ-VOUS</span>
                                <h2>Rendez-vous #{detailRendezVous.id}</h2>
                            </div>
                            <button type="button" title="Fermer" onClick={() => setDetailRendezVous(null)}><X /></button>
                        </div>
                        {detailLoading ? <p>Chargement...</p> : (
                            <>
                                <div className="rdv-detail-grid">
                                    <div><span>Visiteur</span><strong>{detailRendezVous.visiteur_nom || "-"}</strong></div>
                                    <div><span>Société</span><strong>{detailRendezVous.visiteur_societe || "-"}</strong></div>
                                    <div><span>Email</span><strong>{detailRendezVous.visiteur_email || "-"}</strong></div>
                                    <div><span>Téléphone</span><strong>{detailRendezVous.visiteur_telephone || "-"}</strong></div>
                                    <div><span>Date et heure</span><strong>{formatDate(detailRendezVous.date_rendez_vous, false)} à {formatTime(detailRendezVous.heure_rendez_vous)}</strong></div>
                                    <div><span>Personne à rencontrer</span><strong>{detailRendezVous.collaborateur_nom || "-"}</strong></div>
                                    <div><span>Objet</span><strong>{detailRendezVous.motif || "-"}</strong></div>
                                    <div><span>Statut</span><strong>{detailRendezVous.statut || "-"}</strong></div>
                                </div>
                                <div className="rdv-detail-section">
                                    <h3>Badge / QR associé</h3>
                                    {badgeFor(detailRendezVous.id) ? <p className="rdv-detail-code"><QrCode /> {badgeFor(detailRendezVous.id).qr_code}</p> : <p>Aucun badge généré.</p>}
                                </div>
                                <div className="rdv-detail-section">
                                    <h3>Historique de la visite</h3>
                                    {historiqueVisites.length === 0 ? <p>Aucune visite enregistrée.</p> : historiqueVisites.map((visite) => <div className="rdv-history-row" key={visite.id}><span>{visite.statut}</span><span>Entrée : {visite.date_entree ? new Date(visite.date_entree).toLocaleString("fr-FR") : "-"}</span><span>Sortie : {visite.date_sortie ? new Date(visite.date_sortie).toLocaleString("fr-FR") : "-"}</span></div>)}
                                </div>
                            </>
                        )}
                    </section>
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

            <div className={isAgentAccueil ? "rdv-table-wrapper" : "rdv-list"}>

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
                ) : isAgentAccueil ? (
                    <table className="rdv-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Visiteur</th>
                                <th>Société</th>
                                <th>Personne à rencontrer</th>
                                <th>Date &amp; Heure</th>
                                <th>Objet</th>
                                <th>Statut</th>
                                <th>Badge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRendezVous.map((rdv) => {
                                const status = getStatus(rdv.statut);
                                const badge = badgeFor(rdv.id);
                                return (
                                    <tr key={rdv.id}>
                                        <td className="rdv-id-cell">#RDV-{String(rdv.id).padStart(5, "0")}</td>
                                        <td><strong>{rdv.visiteur_nom || "Visiteur non renseigné"}</strong></td>
                                        <td>{rdv.visiteur_societe || "-"}</td>
                                        <td><strong>{rdv.collaborateur_nom || "-"}</strong></td>
                                        <td><strong>{formatDate(rdv.date_rendez_vous, false)}</strong><small>{formatTime(rdv.heure_rendez_vous)}</small></td>
                                        <td><strong>{rdv.motif || "-"}</strong></td>
                                        <td><span className={`rdv-table-status ${status.className}`}>{rdv.statut || "EN ATTENTE"}</span></td>
                                        <td>{badge ? <span className="rdv-badge-qr" title={`Badge ${badge.statut}`}><QrCode /></span> : <span className="rdv-no-badge">-</span>}</td>
                                        <td>
                                            <div className="rdv-table-actions">
                                                <button type="button" title="Voir" onClick={() => ouvrirDetails(rdv)}><Eye /></button>
                                                {isAgentAccueil && rdv.statut !== "ANNULE" && <button type="button" title="Modifier" onClick={() => ouvrirFormulaire(rdv)}><Pencil /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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
                                            {rdv.visiteur_nom || "Visiteur non renseigné"}
                                        </span>

                                        {rdv.collaborateur_nom && <span>{rdv.collaborateur_nom}</span>}

                                    </div>

                                </div>

                                {canManage && rdv.statut !== "ANNULE" && (
                                    <div className="rdv-item-actions">
                                        <button title="Modifier" type="button" onClick={() => ouvrirFormulaire(rdv)}><Pencil /></button>
                                        <button title="Annuler" type="button" onClick={() => annulerRendezVous(rdv.id)}><Ban /></button>
                                    </div>
                                )}

                            </div>
                        );
                    })
                )}

            </div>

        </div>
    );
}

export default RendezVous;