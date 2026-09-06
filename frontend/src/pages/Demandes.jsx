import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    RefreshCw,
    Download,
    Printer,
    Eye,
    Paperclip,
    UploadCloud,
    FileCheck,
    X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import { printTable } from "../utils/printTable";
import "./Demandes.css";

function Demandes() {
    const { utilisateur } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
    const [fichierJoint, setFichierJoint] = useState(null);
    const [fichierErreur, setFichierErreur] = useState("");
    const fichierInputRef = useRef(null);
    const showForm = location.pathname === "/nouvelle-demande";
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ type: "", statut: "", from: "", to: "", search: "" });
    const [options, setOptions] = useState({ types: [] });

    const [formData, setFormData] = useState({
        motif: "",
        type_demande_id: ""
    });

    const utilisateurId = utilisateur?.id;

    useEffect(() => {
        fetchDemandes();
    }, [filters]);

    useEffect(() => {
        api.get("/demandes/options")
            .then((response) => setOptions(response.data || { types: [] }))
            .catch((error) => console.error("Erreur options demandes :", error));
    }, []);

    const fetchDemandes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/demandes", { params: { ...filters } });

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

    const selectionnerFichier = (file) => {
        if (!file) return;

        const formatsAcceptes = ["application/pdf", "image/jpeg", "image/png"];
        if (!formatsAcceptes.includes(file.type)) {
            setFichierJoint(null);
            setFichierErreur("Formats acceptés : PDF, JPG et PNG.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFichierJoint(null);
            setFichierErreur("La pièce jointe ne doit pas dépasser 5 Mo.");
            return;
        }

        setFichierErreur("");
        setFichierJoint(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const demandeData = new FormData();
            demandeData.append("motif", formData.motif);
            demandeData.append("type_demande_id", String(Number(formData.type_demande_id)));
            demandeData.append("collaborateur_id", String(utilisateurId));
            demandeData.append("statut", "EN_ATTENTE");
            if (fichierJoint) {
                demandeData.append("piece_jointe", fichierJoint);
            }

            await api.post("/demandes", demandeData);

            setMessage("Demande créée avec succès.");

            setFormData({
                motif: "",
                type_demande_id: ""
            });
            setFichierJoint(null);
            setFichierErreur("");

            navigate("/demandes");
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
            ${demande.collaborateur_nom || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
    });

    const reinitialiserFiltres = () => {
        setSearch("");
        setFilters({ type: "", statut: "", from: "", to: "", search: "" });
    };

    const exporterExcel = () => {
        const rows = [
            ["Motif", "Type", "Statut", "Date"],
            ...filteredDemandes.map((demande) => [demande.motif, demande.nom_type, demande.statut, demande.date_soumission])
        ];
        const csv = rows.map((row) => row.map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(",")).join("\n");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
        link.download = "demandes.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exporterPdf = () => {
        printTable({
            title: "Mes demandes",
            headers: ["Motif", "Type", "Statut", "Date"],
            rows: filteredDemandes.map((demande) => [
                demande.motif,
                demande.nom_type,
                demande.statut,
                formatDate(demande.date_soumission)
            ])
        });
    };

    return (
        <div className="demandes-page">
            <div className="demandes-header">
                <div>
                    <div className="page-title-icon">
                        <ClipboardList />
                    </div>

                    <h1>{showForm ? "Nouvelle demande" : "Mes demandes"}</h1>

                    <p>{showForm ? "Remplissez le formulaire ci-dessous pour soumettre une nouvelle demande." : "Consultez et gérez vos demandes administratives."}</p>
                </div>

                {!showForm && <button
                    className="add-demande-button"
                    onClick={() => navigate("/nouvelle-demande")}
                >
                    <Plus />
                    Nouvelle demande
                </button>}
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
                        <div className="demande-form-grid">
                            <div className="form-field">
                                <label>Type de demande</label>

                                <select
                                    name="type_demande_id"
                                    value={formData.type_demande_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Sélectionner un type</option>
                                    {options.types.map((type) => <option key={type.id} value={type.id}>{type.nom}</option>)}
                                </select>
                            </div>

                            <div className="form-field motif-field">
                                <label>Motif</label>

                                <textarea
                                    name="motif"
                                    value={formData.motif}
                                    onChange={handleChange}
                                    placeholder="Décrivez votre demande..."
                                    maxLength={500}
                                    required
                                />
                                <span className="character-count">{formData.motif.length}/500</span>
                            </div>
                        </div>

                        <div className="form-field attachment-field">
                            <label>Pièce jointe <span>(optionnel)</span></label>
                            <input ref={fichierInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" hidden onChange={(event) => selectionnerFichier(event.target.files?.[0])} />
                            <button type="button" className="attachment-dropzone" onClick={() => fichierInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectionnerFichier(event.dataTransfer.files?.[0]); }}>
                                {fichierJoint ? <><FileCheck size={30} /><strong>{fichierJoint.name}</strong><small>{(fichierJoint.size / 1024 / 1024).toFixed(2)} Mo</small></> : <><UploadCloud size={34} /><strong>Glissez un fichier ici ou cliquez pour sélectionner</strong><small>PDF, JPG, PNG (max 5 Mo)</small></>}
                            </button>
                            {fichierJoint && <button type="button" className="remove-file-button" onClick={() => setFichierJoint(null)}><X size={14} /> Retirer le fichier</button>}
                            {fichierErreur && <p className="file-error">{fichierErreur}</p>}
                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setFormData({ motif: "", type_demande_id: "" });
                                    setFichierJoint(null);
                                    setFichierErreur("");
                                    navigate("/demandes", { replace: true });
                                }}
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

            {!showForm && <div className="demandes-toolbar">

                <div className="search-box">
                    <Search />
                    <input
                        type="text"
                        placeholder="Rechercher une demande..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setFilters((current) => ({ ...current, search: e.target.value })); }}
                    />
                </div>

                <select value={filters.statut} onChange={(e) => setFilters({ ...filters, statut: e.target.value })}><option value="">Tous les statuts</option><option value="EN_ATTENTE">En attente</option><option value="ACCEPTEE">Acceptée</option><option value="REFUSEE">Refusée</option></select>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}><option value="">Tous les types</option>{options.types.map((type) => <option key={type.id} value={type.id}>{type.nom}</option>)}</select>
                <label className="date-filter"><span>De</span><input aria-label="Date de début" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></label>
                <label className="date-filter"><span>À</span><input aria-label="Date de fin" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></label>
                <button className="refresh-filter-button" type="button" title="Réinitialiser les filtres" aria-label="Réinitialiser les filtres" onClick={reinitialiserFiltres}><RefreshCw size={17} /></button>
                <div className="export-actions">
                    <button type="button" title="Exporter Excel" onClick={exporterExcel}><Download size={16} /></button>
                    <button type="button" title="Exporter PDF" onClick={exporterPdf}><Printer size={16} /></button>
                </div>

                <div className="demandes-count">
                    {filteredDemandes.length} demande
                    {filteredDemandes.length > 1 ? "s" : ""}
                </div>

            </div>}

            {!showForm && <div className="demandes-table-wrapper">

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
                    <table className="demandes-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date de soumission</th>
                                <th>Type de demande</th>
                                <th>Motif</th>
                                <th>Statut</th>
                                <th>Pièces jointes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemandes.map((demande) => {
                                const status = getStatut(demande.statut);
                                return (
                                    <tr key={demande.id}>
                                        <td>{demande.id}</td>
                                        <td>{formatDate(demande.date_soumission)}</td>
                                        <td>{demande.type_demande || demande.nom_type || "Non précisé"}</td>
                                        <td className="demande-motif-cell">{demande.motif || "Demande administrative"}</td>
                                        <td><span className={`demande-status ${status.className}`}>{status.icon}{status.label}</span></td>
                                        <td>{Number(demande.nombre_pieces_jointes || 0) > 0 ? <span className="pieces-count"><Paperclip size={16} /> {demande.nombre_pieces_jointes} fichier{Number(demande.nombre_pieces_jointes) > 1 ? "s" : ""}</span> : "-"}</td>
                                        <td><button className="details-button" type="button" onClick={() => setDemandeSelectionnee(demande)}><Eye size={17} /> Détails</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

            </div>}

            {demandeSelectionnee && (
                <div className="demande-modal-backdrop" onClick={() => setDemandeSelectionnee(null)}>
                    <section className="demande-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="demande-modal-close" type="button" onClick={() => setDemandeSelectionnee(null)}>×</button>
                        <h2>Détails de la demande #{demandeSelectionnee.id}</h2>
                        <p><strong>Date :</strong> {formatDate(demandeSelectionnee.date_soumission)}</p>
                        <p><strong>Type :</strong> {demandeSelectionnee.nom_type || "Non précisé"}</p>
                        <p><strong>Statut :</strong> {demandeSelectionnee.statut || "Non précisé"}</p>
                        <p><strong>Motif :</strong> {demandeSelectionnee.motif || "Non précisé"}</p>
                    </section>
                </div>
            )}

        </div>
    );
}

export default Demandes;