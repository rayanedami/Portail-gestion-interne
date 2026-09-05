import { useEffect, useState } from "react";
import { QrCode, Trash2, Edit, RefreshCw, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Badges.css";

function Badges() {
    const { user, utilisateur } = useAuth();

    const currentUser = user || utilisateur;

    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingBadge, setEditingBadge] = useState(null);

    const [formData, setFormData] = useState({
        qr_code: "",
        date_generation: "",
        date_expiration: "",
        statut: "VALIDE",
        rendez_vous_id: ""
    });

    const role = String(currentUser?.role || "").toUpperCase();

    const canManage =
        role === "AGENT_ACCUEIL" ||
        role === "ADMINISTRATEUR";

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/badges");

            setBadges(response.data || []);
        } catch (err) {
            console.error("Erreur récupération badges :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de récupérer les badges."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            qr_code: "",
            date_generation: "",
            date_expiration: "",
            statut: "VALIDE",
            rendez_vous_id: ""
        });

        setEditingBadge(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const generateQRCode = () => {
        const code =
            "BADGE-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        setFormData((prev) => ({
            ...prev,
            qr_code: code
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            if (!formData.rendez_vous_id) {
                setError("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            const data = {
                qr_code: formData.qr_code,
                date_generation: formData.date_generation,
                date_expiration: formData.date_expiration,
                statut: formData.statut,
                rendez_vous_id: Number(formData.rendez_vous_id)
            };

            if (editingBadge) {
                await api.put(
                    `/badges/${editingBadge.id}`,
                    data
                );

                setMessage("Badge modifié avec succès.");
            } else {
                await api.post("/badges", data);

                setMessage("Badge créé avec succès.");
            }

            resetForm();
            await fetchBadges();

        } catch (err) {
            console.error("Erreur badge :", err);

            setError(
                err.response?.data?.message ||
                "Une erreur est survenue."
            );
        }
    };

    const handleEdit = (badge) => {
        setEditingBadge(badge);

        setFormData({
            qr_code: badge.qr_code || "",
            date_generation: formatDateForInput(
                badge.date_generation
            ),
            date_expiration: formatDateForInput(
                badge.date_expiration
            ),
            statut: badge.statut || "VALIDE",
            rendez_vous_id: badge.rendez_vous_id || ""
        });

        setMessage("");
        setError("");
    };

    const handleDelete = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce badge ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await api.delete(`/badges/${id}`);

            setMessage("Badge supprimé avec succès.");

            await fetchBadges();

        } catch (err) {
            console.error("Erreur suppression badge :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de supprimer le badge."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return date;
        }

        return d.toLocaleString("fr-FR");
    };

    const formatDateForInput = (date) => {
        if (!date) return "";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return "";
        }

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getStatusClass = (statut) => {
        switch (String(statut || "").toUpperCase()) {
            case "VALIDE":
                return "status-active";

            case "EXPIRE":
                return "status-expired";

            case "UTILISE":
                return "status-used";

            default:
                return "status-default";
        }
    };

    if (loading) {
        return (
            <div className="badges-page">
                <div className="badges-loading">
                    <RefreshCw className="loading-icon" />
                    <p>Chargement des badges...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="badges-page">
            {/* HEADER */}

            <div className="badges-header">

                <div>
                    <div className="badges-title-row">
                        <QrCode size={28} />

                        <h1>
                            Gestion des badges
                        </h1>
                    </div>

                    <p>
                        Création et gestion des badges QR Code
                        pour les visiteurs.
                    </p>
                </div>

            </div>


            {/* MESSAGES */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* FORMULAIRE */}

            {editingBadge && canManage && (
                <div className="badge-form-card">

                    <div className="form-header">

                        <h2>
                            {editingBadge
                                ? "Modifier le badge"
                                : "Créer un badge"}
                        </h2>

                        <button
                            className="close-form-button"
                            onClick={resetForm}
                        >
                            <X size={20} />
                        </button>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-field">

                                <label>
                                    QR Code *
                                </label>

                                <div className="qr-input-row">

                                    <input
                                        type="text"
                                        name="qr_code"
                                        value={formData.qr_code}
                                        onChange={handleChange}
                                        placeholder="Code QR"
                                    />

                                    <button
                                        type="button"
                                        className="generate-button"
                                        onClick={generateQRCode}
                                    >
                                        Générer
                                    </button>

                                </div>

                            </div>


                            <div className="form-field">

                                <label>
                                    Rendez-vous ID *
                                </label>

                                <input
                                    type="number"
                                    name="rendez_vous_id"
                                    value={
                                        formData.rendez_vous_id
                                    }
                                    onChange={handleChange}
                                    placeholder="Ex: 1"
                                    min="1"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Date de génération *
                                </label>

                                <input
                                    type="datetime-local"
                                    name="date_generation"
                                    value={
                                        formData.date_generation
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Date d'expiration *
                                </label>

                                <input
                                    type="datetime-local"
                                    name="date_expiration"
                                    value={
                                        formData.date_expiration
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    Statut
                                </label>

                                <select
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleChange}
                                >
                                    <option value="VALIDE">
                                        VALIDE
                                    </option>

                                    <option value="EXPIRE">
                                        EXPIRE
                                    </option>

                                    <option value="UTILISE">
                                        UTILISE
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                            >
                                {editingBadge
                                    ? "Enregistrer les modifications"
                                    : "Créer le badge"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* LISTE */}

            <div className="badges-card">

                <div className="list-header">

                    <div>
                        <h2>
                            Badges
                        </h2>

                        <span>
                            {badges.length} badge
                            {badges.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={fetchBadges}
                        title="Actualiser"
                    >
                        <RefreshCw size={18} />
                    </button>

                </div>


                {badges.length === 0 ? (

                    <div className="empty-state">

                        <QrCode size={45} />

                        <h3>
                            Aucun badge
                        </h3>

                        <p>
                            Aucun badge n'a encore été créé.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>QR Code</th>
                                    <th>Génération</th>
                                    <th>Expiration</th>
                                    <th>Statut</th>
                                    <th>Rendez-vous</th>

                                    {canManage && (
                                        <th>Actions</th>
                                    )}
                                </tr>

                            </thead>

                            <tbody>

                                {badges.map((badge) => (

                                    <tr key={badge.id}>

                                        <td>
                                            #{badge.id}
                                        </td>

                                        <td>
                                            <div className="qr-code-cell">
                                                <QRCodeSVG
                                                    value={badge.qr_code || "badge"}
                                                    size={54}
                                                    level="M"
                                                />

                                                <span>
                                                    {badge.qr_code}
                                                </span>

                                            </div>
                                        </td>

                                        <td>
                                            {formatDate(
                                                badge.date_generation
                                            )}
                                        </td>

                                        <td>
                                            {formatDate(
                                                badge.date_expiration
                                            )}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    badge.statut
                                                )}`}
                                            >
                                                {badge.statut}
                                            </span>

                                        </td>

                                        <td>
                                            #{badge.rendez_vous_id}
                                        </td>

                                        {canManage && (
                                            <td>

                                                <div className="actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                badge
                                                            )
                                                        }
                                                        title="Modifier"
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                badge.id
                                                            )
                                                        }
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>

                                            </td>
                                        )}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Badges;