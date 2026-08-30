import { useEffect, useState } from "react";
import {
    Check,
    X,
    ClipboardCheck,
    User,
    CalendarDays,
    FileText,
    Clock3
} from "lucide-react";
import api from "../services/api";
import "./Validations.css";

const isPendingStatus = (statut) => {
    if (!statut) return true;

    const value = String(statut).trim().toUpperCase();
    return [
        "EN_ATTENTE",
        "EN ATTENTE",
        "PENDING",
        "ATTENTE",
        "WAITING"
    ].includes(value);
};

const formatDate = (value) => {
    if (!value) return "Date non disponible";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium"
    }).format(date);
};

function Validations() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [refusalText, setRefusalText] = useState({});

    const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "null");
    const responsableId = utilisateur?.id;

    const fetchDemandes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/demandes");
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.demandes || [];

            const demandesEnAttente = data.filter((demande) => {
                const isPending = isPendingStatus(demande.statut);
                return isPending || !demande.statut;
            });

            setDemandes(demandesEnAttente);
        } catch (err) {
            console.error("Erreur récupération demandes :", err);
            setError("Impossible de récupérer les demandes à valider.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandes();
    }, []);

    const createNotification = async ({ utilisateurId, demandeId, messageText }) => {
        await api.post("/notifications", {
            message: messageText,
            type: "validation",
            date_envoi: new Date().toISOString(),
            est_lue: false,
            utilisateur_id: utilisateurId,
            demande_id: demandeId,
            rendez_vous_id: null
        });
    };

    const handleDecision = async (demande, decision) => {
        if (!responsableId) {
            setError("Aucun responsable connecté.");
            return;
        }

        const statut = decision === "VALIDEE" ? "VALIDEE" : "REFUSEE";
        const commentaire = decision === "VALIDEE"
            ? "Demande validée par le responsable."
            : (refusalText[demande.id] || "").trim();

        if (decision !== "VALIDEE" && !commentaire) {
            setError("Veuillez saisir le motif du refus avant de confirmer.");
            return;
        }

        try {
            setProcessingId(demande.id);
            setError("");
            setMessage("");

            await api.post("/validations", {
                demande_id: demande.id,
                responsable_id: responsableId,
                niveau: 1,
                decision: statut,
                commentaire
            });

            await api.put(`/demandes/${demande.id}`, {
                motif: demande.motif || "",
                statut,
                type_demande_id: demande.type_demande_id ?? 1,
                collaborateur_id: demande.collaborateur_id,
            });

            const messageText = decision === "VALIDEE"
                ? "Votre demande a été validée."
                : "Votre demande a été refusée. Motif : " + commentaire;

            await createNotification({
                utilisateurId: demande.collaborateur_id,
                demandeId: demande.id,
                messageText
            });

            setMessage(`La demande #${demande.id} a été ${statut.toLowerCase()}.`);
            setRefusalText((prev) => ({ ...prev, [demande.id]: "" }));
            await fetchDemandes();
        } catch (err) {
            console.error("Erreur validation demande :", err);
            setError(err.response?.data?.message || "Erreur lors du traitement de la demande.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="validations-page">
            <div className="validations-header">
                <div>
                    <div className="validations-title-icon">
                        <ClipboardCheck />
                    </div>
                    <h1>Demandes à valider</h1>
                    <p>Validez ou refusez les demandes soumises par les collaborateurs.</p>
                </div>
            </div>

            {message && <div className="validations-message success">{message}</div>}
            {error && <div className="validations-message error">{error}</div>}

            {loading ? (
                <div className="validations-loading">Chargement des demandes...</div>
            ) : demandes.length === 0 ? (
                <div className="validations-empty">
                    <Clock3 />
                    <h3>Aucune demande en attente</h3>
                    <p>Les demandes à valider apparaîtront ici.</p>
                </div>
            ) : (
                <div className="validations-list">
                    {demandes.map((demande) => (
                        <div className="validation-card" key={demande.id}>
                            <div className="validation-card-header">
                                <div>
                                    <span className="validation-badge">Demande #{demande.id}</span>
                                    <h2>{demande.motif || "Demande sans motif"}</h2>
                                </div>
                                <span className="validation-status">
                                    {String(demande.statut || "EN_ATTENTE").toUpperCase()}
                                </span>
                            </div>

                            <div className="validation-meta">
                                <div className="meta-item">
                                    <User />
                                    <span>Collaborateur : #{demande.collaborateur_id || "Inconnu"}</span>
                                </div>
                                <div className="meta-item">
                                    <CalendarDays />
                                    <span>Date : {formatDate(demande.date_soumission)}</span>
                                </div>
                                <div className="meta-item">
                                    <FileText />
                                    <span>Statut : {String(demande.statut || "EN ATTENTE").toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="validation-actions">
                                <button
                                    className="btn btn-success"
                                    type="button"
                                    onClick={() => handleDecision(demande, "VALIDEE")}
                                    disabled={processingId === demande.id}
                                >
                                    <Check />
                                    {processingId === demande.id ? "Traitement..." : "Valider"}
                                </button>

                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => {
                                        const field = document.getElementById(`refus-${demande.id}`);
                                        if (field) field.focus();
                                    }}
                                >
                                    <X />
                                    Refuser
                                </button>
                            </div>

                            <div className="refusal-box">
                                <label htmlFor={`refus-${demande.id}`}>Motif du refus :</label>
                                <textarea
                                    id={`refus-${demande.id}`}
                                    value={refusalText[demande.id] || ""}
                                    onChange={(event) => {
                                        setRefusalText((prev) => ({
                                            ...prev,
                                            [demande.id]: event.target.value
                                        }));
                                    }}
                                    placeholder="Précisez la raison du refus..."
                                />

                                <div className="refusal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setRefusalText((prev) => ({ ...prev, [demande.id]: "" }))}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDecision(demande, "REFUSEE")}
                                        disabled={processingId === demande.id}
                                    >
                                        Confirmer le refus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Validations;
