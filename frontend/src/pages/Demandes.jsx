import { useEffect, useState } from "react";
import {
    ClipboardList,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./Demandes.css";

function Demandes() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        motif: "",
        type_demande_id: ""
    });

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur") || "null"
    );

    const utilisateurId = utilisateur?.id;

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/demandes");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.demandes || [];

            // Afficher uniquement les demandes du collaborateur connecté
            const mesDemandes = data.filter(
                (demande) =>
                    Number(
                        demande.utilisateur_id ??
                        demande.demandeur_id ??
                        demande.collaborateur_id
                    ) === Number(utilisateurId)
            );

            setDemandes(mesDemandes);
        } catch (error) {
            console.error("Erreur récupération demandes :", error);
            setMessage("Impossible de récupérer les demandes.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post("/demandes", {
                motif: formData.motif,
                type_demande_id: formData.type_demande_id
                    ? Number(formData.type_demande_id)
                    : null,
                collaborateur_id: utilisateurId
            });

            setMessage("Demande créée avec succès.");

            setFormData({
                motif: "",
                type_demande_id: ""
            });

            setShowForm(false);

            fetchDemandes();
        } catch (error) {
            console.error("Erreur création demande :", error);

            setMessage(
                error.response?.data?.message ||
                "Erreur lors de la création de la demande."
            );
        }
    };

    const getStatut = (statut) => {
        const value = String(statut || "").toLowerCase();

        if (
            value.includes("valid") ||
            value.includes("accept") ||
            value === "approuve"
        ) {
            return {
                label: statut,
                className: "status-success",
                icon: <CheckCircle2 />
            };
        }

        if (
            value.includes("refus") ||
            value.includes("rejet")
        ) {
            return {
                label: statut,
                className: "status-danger",
                icon: <XCircle />
            };
        }

        if (
            value.includes("cours") ||
            value.includes("attente") ||
            value.includes("pending")
        ) {
            return {
                label: statut,
                className: "status-warning",
                icon: <Clock />
            };
        }

        return {
            label: statut || "Inconnu",
            className: "status-neutral",
            icon: <AlertCircle />
        };
    };

    const filteredDemandes = demandes.filter((demande) => {
        const text = `
            ${demande.motif || ""}
            ${demande.statut || ""}
            ${demande.type_demande || ""}
            ${demande.nom_type || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    return (
        <div className="demandes-page">

            <div className="demandes-header">
                <div>
                    <div className="page-title-icon">
                        <ClipboardList />
                    </div>

                    <h1>Mes demandes</h1>

                    <p>
                        Consultez et gérez vos demandes administratives.
                    </p>
                </div>

                <button
                    className="add-demande-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus />
                    Nouvelle demande
                </button>
            </div>

            {message && (
                <div className="demandes-message">
                    {message}
                </div>
            )}

            {showForm && (
                <div className="demande-form-card">

                    <h2>Nouvelle demande</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-field">
                            <label>Type de demande</label>

                            <select
                                name="type_demande_id"
                                value={formData.type_demande_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Sélectionner un type
                                </option>
                                <option value="1">
                                    Attestation
                                </option>
                                <option value="2">
                                    Congé
                                </option>
                                <option value="3">
                                    Document administratif
                                </option>
                                <option value="4">
                                    Autre
                                </option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Motif</label>

                            <textarea
                                name="motif"
                                value={formData.motif}
                                onChange={handleChange}
                                placeholder="Décrivez votre demande..."
                                required
                            />
                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setShowForm(false)}
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                className="submit-button"
                            >
                                Envoyer la demande
                            </button>

                        </div>

                    </form>
                </div>
            )}

            <div className="demandes-toolbar">

                <div className="search-box">
                    <Search />
                    <input
                        type="text"
                        placeholder="Rechercher une demande..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="demandes-count">
                    {filteredDemandes.length} demande
                    {filteredDemandes.length > 1 ? "s" : ""}
                </div>

            </div>

            <div className="demandes-list">

                {loading ? (
                    <div className="empty-state">
                        Chargement des demandes...
                    </div>
                ) : filteredDemandes.length === 0 ? (
                    <div className="empty-state">
                        <ClipboardList />
                        <h3>Aucune demande</h3>
                        <p>
                            Vous n'avez pas encore soumis de demande.
                        </p>
                    </div>
                ) : (
                    filteredDemandes.map((demande) => {

                        const status = getStatut(demande.statut);

                        return (
                            <div
                                className="demande-card"
                                key={demande.id}
                            >

                                <div className="demande-card-icon">
                                    <ClipboardList />
                                </div>

                                <div className="demande-card-content">

                                    <div className="demande-card-top">

                                        <h3>
                                            {demande.motif ||
                                                "Demande administrative"}
                                        </h3>

                                        <span
                                            className={`demande-status ${status.className}`}
                                        >
                                            {status.icon}
                                            {status.label}
                                        </span>

                                    </div>

                                    <div className="demande-info">

                                        <span>
                                            Type :{" "}
                                            {demande.type_demande ||
                                                demande.nom_type ||
                                                "Non précisé"}
                                        </span>

                                        <span>
                                            Date :{" "}
                                            {formatDate(
                                                demande.date_soumission ||
                                                demande.date_demande ||
                                                demande.created_at
                                            )}
                                        </span>

                                    </div>

                                    {demande.commentaire && (
                                        <p className="demande-commentaire">
                                            {demande.commentaire}
                                        </p>
                                    )}

                                </div>

                            </div>
                        );
                    })
                )}

            </div>

        </div>
    );
}

export default Demandes;