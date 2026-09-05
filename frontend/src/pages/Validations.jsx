import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Validations.css";

function Validations() {
    const { utilisateur } = useAuth();

    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const formaterDate = (date) => date
        ? new Date(date).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short"
        })
        : "Non renseignée";

    const [selectedDemande, setSelectedDemande] = useState(null);
    const [historique, setHistorique] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [showRefusModal, setShowRefusModal] = useState(false);
    const [commentaire, setCommentaire] = useState("");

    const fetchDemandes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/demandes");

            const toutesDemandes = response.data;

            const demandesEnAttente = toutesDemandes.filter(
                (demande) =>
                    String(demande.statut || "").toUpperCase() ===
                    "EN_ATTENTE"
            );

            setDemandes(demandesEnAttente);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Impossible de récupérer les demandes."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemandes();
    }, []);

    const validerDemande = async (demande) => {
        try {
            setMessage("");
            setError("");

            const response = await api.post("/validations/decision", {
                demande_id: demande.id,
                decision: "APPROUVEE",
                commentaire: "Demande validée par le responsable."
            });

            setMessage(
                response.data?.message || `La demande #${demande.id} a été validée avec succès.`
            );

            await fetchDemandes();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors de la validation de la demande."
            );
        }
    };

    const examinerDemande = async (demande) => {
        try {
            const response = await api.get("/validations");
            setHistorique(
                (response.data || []).filter(
                    (validation) => Number(validation.demande_id) === Number(demande.id)
                )
            );
            setSelectedDemande(demande);
            setShowDetail(true);
            setError("");
        } catch (err) {
            setError("Impossible de récupérer l'historique de validation.");
        }
    };

    const ouvrirRefus = (demande) => {
        setSelectedDemande(demande);
        setCommentaire("");
        setShowRefusModal(true);
        setMessage("");
        setError("");
    };

    const refuserDemande = async () => {
        if (!selectedDemande) return;

        if (!commentaire.trim()) {
            setError("Veuillez indiquer le motif du refus.");
            return;
        }

        try {
            setMessage("");
            setError("");

            const response = await api.post("/validations/decision", {
                demande_id: selectedDemande.id,
                decision: "REFUSEE",
                commentaire: commentaire.trim()
            });

            setShowRefusModal(false);
            setSelectedDemande(null);
            setCommentaire("");

            setMessage(
                response.data?.message || `La demande #${selectedDemande.id} a été refusée.`
            );

            await fetchDemandes();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors du refus de la demande."
            );
        }
    };

    return (
        <div className="validations-page">
            <div className="validations-header">
                <div>
                    <h1>Validations</h1>
                    <p>
                        Gérez les demandes en attente de validation.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchDemandes}
                    type="button"
                >
                    <RefreshCw size={16} />
                    Actualiser
                </button>
            </div>

            {message && (
                <div className="validation-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="validation-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="validation-empty">
                    Chargement des demandes...
                </div>
            ) : demandes.length === 0 ? (
                <div className="validation-empty">
                    <CheckCircle size={40} />

                    <h3>Aucune demande en attente</h3>

                    <p>
                        Toutes les demandes ont été traitées.
                    </p>
                </div>
            ) : (
                <div className="validation-list">

                    {demandes.map((demande) => (
                        <div
                            className="validation-card"
                            key={demande.id}
                        >

                            <div className="validation-card-header">

                                <div>
                                    <span className="demande-number">
                                        Demande #{demande.id}
                                    </span>

                                    <h2>
                                        {demande.motif ||
                                            "Demande administrative"}
                                    </h2>
                                </div>

                                <span className="status-badge">
                                    EN ATTENTE
                                </span>

                            </div>

                            <div className="validation-info">

                                <div>
                                    <strong>Date :</strong>

                                    <span>
                                        {demande.date_soumission
                                            ? new Date(
                                                demande.date_soumission
                                            ).toLocaleDateString("fr-FR")
                                            : "Non renseignée"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Collaborateur :</strong>

                                    <span>
                                        {demande.collaborateur_id ||
                                            "Non renseigné"}
                                    </span>
                                </div>

                                <div>
                                    <strong>Type :</strong>

                                    <span>
                                        {demande.type_demande_id ||
                                            "Non renseigné"}
                                    </span>
                                </div>

                            </div>

                            <div className="validation-actions">

                                <button
                                    className="details-button"
                                    type="button"
                                    onClick={() => examinerDemande(demande)}
                                >
                                    Examiner
                                </button>

                                <button
                                    className="approve-button"
                                    type="button"
                                    onClick={() =>
                                        validerDemande(demande)
                                    }
                                >
                                    <CheckCircle size={17} />
                                    Valider
                                </button>

                                <button
                                    className="reject-button"
                                    type="button"
                                    onClick={() =>
                                        ouvrirRefus(demande)
                                    }
                                >
                                    <XCircle size={17} />
                                    Refuser
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

            {showDetail && selectedDemande && (
                <div className="modal-overlay">
                    <div className="refus-modal validation-detail-modal">
                        <h2>Détail de la demande #{selectedDemande.id}</h2>
                        <p><strong>Collaborateur :</strong> {selectedDemande.collaborateur_id}</p>
                        <p><strong>Type :</strong> {selectedDemande.nom_type || selectedDemande.type_demande_id}</p>
                        <p><strong>Motif :</strong> {selectedDemande.motif}</p>
                        <p><strong>Date :</strong> {formaterDate(selectedDemande.date_soumission)}</p>
                        <p><strong>Statut :</strong> {selectedDemande.statut}</p>
                        <p><strong>Niveau actuel :</strong> {historique.length ? Math.max(...historique.map((item) => Number(item.niveau))) : 1}</p>
                        <h3>Historique des validations</h3>
                        {historique.length === 0 ? <p>Aucune validation enregistrée.</p> : historique.map((item) => (
                            <p key={item.id}>Niveau {item.niveau} - {item.decision} - Responsable #{item.responsable_id}{item.commentaire ? ` - ${item.commentaire}` : ""}</p>
                        ))}
                        <div className="modal-actions">
                            <button type="button" className="cancel-button" onClick={() => { setShowDetail(false); setSelectedDemande(null); }}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {showRefusModal && (
                <div className="modal-overlay">

                    <div className="refus-modal">

                        <h2>
                            Refuser la demande
                        </h2>

                        <p>
                            Demande #{selectedDemande?.id}
                        </p>

                        <label>
                            Motif du refus
                        </label>

                        <textarea
                            value={commentaire}
                            onChange={(e) =>
                                setCommentaire(e.target.value)
                            }
                            placeholder="Indiquez le motif du refus..."
                            rows="5"
                        />

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setShowRefusModal(false);
                                    setSelectedDemande(null);
                                }}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="confirm-reject-button"
                                onClick={refuserDemande}
                            >
                                Confirmer le refus
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Validations;