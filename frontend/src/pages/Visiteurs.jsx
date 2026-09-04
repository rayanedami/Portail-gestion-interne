import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    UserRound,
    Phone,
    Mail,
    Building2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Visiteurs.css";

function Visiteurs() {
    const { utilisateur } = useAuth();
    const [visiteurs, setVisiteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingVisiteur, setEditingVisiteur] = useState(null);
    const [historique, setHistorique] = useState([]);
    const [visiteurHistorique, setVisiteurHistorique] = useState(null);

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        societe: ""
    });

    const role = String(utilisateur?.role || "").trim().toUpperCase();

    const canManage =
        role === "AGENT_ACCUEIL" ||
        role === "ADMINISTRATEUR";

    /* =========================
       CHARGER LES VISITEURS
    ========================= */

    const fetchVisiteurs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/visiteurs");

            const data = response.data;

            if (Array.isArray(data)) {
                setVisiteurs(data);
            } else if (Array.isArray(data.visiteurs)) {
                setVisiteurs(data.visiteurs);
            } else if (Array.isArray(data.data)) {
                setVisiteurs(data.data);
            } else {
                setVisiteurs([]);
            }
        } catch (err) {
            console.error("Erreur chargement visiteurs :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de charger les visiteurs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisiteurs();
    }, []);

    /* =========================
       FORMULAIRE
    ========================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            societe: ""
        });

        setEditingVisiteur(null);
    };

    const openAddModal = () => {
        resetForm();
        setMessage("");
        setError("");
        setShowModal(true);
    };

    const openEditModal = (visiteur) => {
        setEditingVisiteur(visiteur);

        setForm({
            nom: visiteur.nom || "",
            prenom: visiteur.prenom || "",
            email: visiteur.email || "",
            telephone: visiteur.telephone || "",
            societe: visiteur.societe || ""
        });

        setMessage("");
        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    /* =========================
       AJOUT / MODIFICATION
    ========================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            if (editingVisiteur) {
                await api.put(
                    `/visiteurs/${editingVisiteur.id}`,
                    form
                );

                setMessage("Visiteur modifié avec succès.");
            } else {
                await api.post("/visiteurs", form);

                setMessage("Visiteur ajouté avec succès.");
            }

            closeModal();
            await fetchVisiteurs();
        } catch (err) {
            console.error("Erreur visiteur :", err);

            setError(
                err.response?.data?.message ||
                "Une erreur est survenue."
            );
        }
    };

    /* =========================
       SUPPRESSION
    ========================= */

    const handleDelete = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce visiteur ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            setMessage("");
            setError("");

            await api.delete(`/visiteurs/${id}`);

            setMessage("Visiteur supprimé avec succès.");

            await fetchVisiteurs();
        } catch (err) {
            console.error("Erreur suppression visiteur :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de supprimer le visiteur."
            );
        }
    };

    const consulterHistorique = async (visiteur) => {
        try {
            const response = await api.get(`/visiteurs/${visiteur.id}/historique`);
            setHistorique(response.data || []);
            setVisiteurHistorique(visiteur);
        } catch (err) {
            setError("Impossible de récupérer l'historique du visiteur.");
        }
    };

    /* =========================
       RECHERCHE
    ========================= */

    const filteredVisiteurs = visiteurs.filter((visiteur) => {
        const text = search.toLowerCase();

        return (
            String(visiteur.nom || "")
                .toLowerCase()
                .includes(text) ||
            String(visiteur.prenom || "")
                .toLowerCase()
                .includes(text) ||
            String(visiteur.email || "")
                .toLowerCase()
                .includes(text) ||
            String(visiteur.telephone || "")
                .toLowerCase()
                .includes(text) ||
            String(visiteur.societe || "")
                .toLowerCase()
                .includes(text)
        );
    });

    return (
        <div className="visiteurs-page">

            {/* ================= HEADER ================= */}

            <div className="visiteurs-header">

                <div>
                    <div className="visiteurs-breadcrumb">
                        Accueil / Visiteurs
                    </div>

                    <h1>Gestion des visiteurs</h1>

                    <p>
                        Gérez les visiteurs enregistrés dans le portail interne.
                    </p>
                </div>

                {canManage && (
                    <button
                        className="btn-add-visiteur"
                        onClick={openAddModal}
                    >
                        <Plus size={18} />
                        Nouveau visiteur
                    </button>
                )}

            </div>

            {/* ================= MESSAGES ================= */}

            {message && (
                <div className="visiteurs-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="visiteurs-error">
                    {error}
                </div>
            )}

            {/* ================= STATISTIQUES ================= */}

            <div className="visiteurs-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <span>Total visiteurs</span>
                        <strong>{visiteurs.length}</strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        <Building2 size={22} />
                    </div>

                    <div>
                        <span>Entreprises</span>
                        <strong>
                            {
                                new Set(
                                    visiteurs
                                        .map((v) => v.societe)
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>
                    </div>

                </div>

            </div>

            {/* ================= OUTILS ================= */}

            <div className="visiteurs-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Rechercher un visiteur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="results-count">
                    {filteredVisiteurs.length} visiteur
                    {filteredVisiteurs.length !== 1 ? "s" : ""}
                </div>

            </div>

            {/* ================= TABLE ================= */}

            <div className="visiteurs-card">

                {loading ? (
                    <div className="visiteurs-loading">
                        Chargement des visiteurs...
                    </div>
                ) : filteredVisiteurs.length === 0 ? (
                    <div className="visiteurs-empty">

                        <UserRound size={42} />

                        <h3>
                            Aucun visiteur trouvé
                        </h3>

                        <p>
                            Aucun visiteur ne correspond à votre recherche.
                        </p>

                        {canManage && (
                            <button
                                className="btn-add-empty"
                                onClick={openAddModal}
                            >
                                <Plus size={17} />
                                Ajouter un visiteur
                            </button>
                        )}

                    </div>
                ) : (
                    <div className="table-wrapper">

                        <table className="visiteurs-table">

                            <thead>
                                <tr>
                                    <th>Visiteur</th>
                                    <th>Entreprise</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>

                                    {canManage && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>

                                {filteredVisiteurs.map((visiteur) => (

                                    <tr key={visiteur.id}>

                                        <td>
                                            <div className="visitor-name">

                                                <div className="visitor-avatar">
                                                    <UserRound size={17} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {visiteur.prenom}{" "}
                                                        {visiteur.nom}
                                                    </strong>

                                                    <span>
                                                        ID #{visiteur.id}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {visiteur.societe || "—"}
                                        </td>

                                        <td>
                                            {visiteur.email ? (
                                                <div className="contact-info">
                                                    <Mail size={15} />
                                                    {visiteur.email}
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        <td>
                                            {visiteur.telephone ? (
                                                <div className="contact-info">
                                                    <Phone size={15} />
                                                    {visiteur.telephone}
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        {canManage && (
                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="btn-edit"
                                                        title="Modifier"
                                                        onClick={() =>
                                                            openEditModal(
                                                                visiteur
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="btn-delete"
                                                        title="Supprimer"
                                                        onClick={() =>
                                                            handleDelete(
                                                                visiteur.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    <button
                                                        className="btn-edit"
                                                        title="Historique"
                                                        onClick={() => consulterHistorique(visiteur)}
                                                    >
                                                        Historique
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

            {/* ================= MODAL ================= */}

            {showModal && (

                <div className="modal-overlay">

                    <div className="visiteur-modal">

                        <div className="modal-header">

                            <div>
                                <h2>
                                    {editingVisiteur
                                        ? "Modifier le visiteur"
                                        : "Nouveau visiteur"}
                                </h2>

                                <p>
                                    {editingVisiteur
                                        ? "Modifiez les informations du visiteur."
                                        : "Ajoutez un nouveau visiteur au portail."}
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-field">

                                    <label>
                                        Prénom *
                                    </label>

                                    <input
                                        type="text"
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        placeholder="Prénom"
                                        required
                                    />

                                </div>

                                <div className="form-field">

                                    <label>
                                        Nom *
                                    </label>

                                    <input
                                        type="text"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        placeholder="Nom"
                                        required
                                    />

                                </div>

                                <div className="form-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="exemple@email.com"
                                    />

                                </div>

                                <div className="form-field">

                                    <label>
                                        Téléphone
                                    </label>

                                    <input
                                        type="text"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
                                        placeholder="06 XX XX XX XX"
                                    />

                                </div>

                                <div className="form-field full-width">

                                    <label>
                                        Entreprise
                                    </label>

                                    <input
                                        type="text"
                                        name="societe"
                                        value={form.societe}
                                        onChange={handleChange}
                                        placeholder="Nom de l'entreprise"
                                    />

                                </div>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeModal}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="btn-save"
                                >
                                    {editingVisiteur
                                        ? "Enregistrer les modifications"
                                        : "Ajouter le visiteur"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {visiteurHistorique && (
                <div className="modal-overlay">
                    <div className="visiteur-modal">
                        <div className="modal-header">
                            <div>
                                <h2>Historique de {visiteurHistorique.prenom} {visiteurHistorique.nom}</h2>
                                <p>Rendez-vous et visites enregistrés.</p>
                            </div>
                            <button className="modal-close" onClick={() => setVisiteurHistorique(null)}><X size={20} /></button>
                        </div>
                        <div className="historique-visiteur">
                            {historique.length === 0 ? <p>Aucun historique disponible.</p> : historique.map((item) => (
                                <div className="historique-item" key={`${item.type}-${item.id}`}>
                                    <strong>{item.type === "visite" ? "Visite" : "Rendez-vous"} #{item.id}</strong>
                                    <span>{item.statut || "-"}</span>
                                    <small>{item.date_rendez_vous || item.date_entree || "Date non renseignée"}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Visiteurs;