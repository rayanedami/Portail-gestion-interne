import { useEffect, useState } from "react";
import { Paperclip, Download, Trash2, Upload, FileText } from "lucide-react";
import api from "../services/api";
import "./PiecesJointes.css";

function PiecesJointes() {
    const [pieces, setPieces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

    const chargerPieces = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await api.get("/pieces-jointes");

            setPieces(response.data);
        } catch (error) {
            console.error("Erreur récupération pièces jointes :", error);

            setMessage(
                error.response?.data?.message ||
                "Impossible de récupérer les pièces jointes."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerPieces();
    }, []);

    const supprimerPiece = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer cette pièce jointe ?"
        );

        if (!confirmation) return;

        try {
            await api.delete(`/pieces-jointes/${id}`);

            setPieces((ancienneListe) =>
                ancienneListe.filter((piece) => piece.id !== id)
            );

            setMessage("Pièce jointe supprimée avec succès.");
        } catch (error) {
            console.error("Erreur suppression :", error);

            setMessage(
                error.response?.data?.message ||
                "Erreur lors de la suppression."
            );
        }
    };

    const telechargerPiece = (piece) => {
        if (!piece.fichier && !piece.url) {
            setMessage("Fichier indisponible.");
            return;
        }

        const url = piece.url || piece.fichier;

        window.open(url, "_blank");
    };

    return (
        <div className="pieces-page">

            <div className="pieces-header">
                <div>
                    <div className="pieces-title-row">
                        <Paperclip size={24} />
                        <h1>Pièces jointes</h1>
                    </div>

                    <p>
                        Consultez les documents associés à vos demandes
                        administratives.
                    </p>
                </div>

                <button className="upload-button">
                    <Upload size={17} />
                    Ajouter un document
                </button>
            </div>

            {message && (
                <div className="pieces-message">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="pieces-loading">
                    Chargement des pièces jointes...
                </div>
            ) : pieces.length === 0 ? (
                <div className="empty-pieces">
                    <FileText size={42} />

                    <h2>Aucune pièce jointe</h2>

                    <p>
                        Vous n'avez actuellement aucun document associé
                        à vos demandes.
                    </p>
                </div>
            ) : (
                <div className="pieces-card">

                    <div className="pieces-table-header">
                        <span>Document</span>
                        <span>Demande</span>
                        <span>Date</span>
                        <span>Actions</span>
                    </div>

                    {pieces.map((piece) => (
                        <div
                            className="piece-row"
                            key={piece.id}
                        >
                            <div className="piece-name">
                                <div className="file-icon">
                                    <FileText size={19} />
                                </div>

                                <div>
                                    <strong>
                                        {piece.nom ||
                                            piece.nom_fichier ||
                                            `Document #${piece.id}`}
                                    </strong>

                                    {piece.type && (
                                        <small>
                                            {piece.type}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div>
                                {piece.demande_id
                                    ? `Demande #${piece.demande_id}`
                                    : "-"}
                            </div>

                            <div>
                                {piece.date_ajout ||
                                    piece.date_creation ||
                                    "-"}
                            </div>

                            <div className="piece-actions">

                                <button
                                    className="action-download"
                                    onClick={() =>
                                        telechargerPiece(piece)
                                    }
                                    title="Télécharger"
                                >
                                    <Download size={17} />
                                </button>

                                <button
                                    className="action-delete"
                                    onClick={() =>
                                        supprimerPiece(piece.id)
                                    }
                                    title="Supprimer"
                                >
                                    <Trash2 size={17} />
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}

            <div className="pieces-info">
                <Paperclip size={17} />

                <span>
                    Les pièces jointes sont associées aux demandes
                    administratives soumises par l'utilisateur connecté.
                </span>
            </div>

        </div>
    );
}

export default PiecesJointes;