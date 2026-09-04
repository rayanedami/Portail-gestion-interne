import { useEffect, useState } from "react";
import { Search, Users, Eye, Pencil, X, Check } from "lucide-react";
import api from "../services/api";
import "./Utilisateurs.css";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [erreur, setErreur] = useState("");
    const [roles, setRoles] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [roleFilter, setRoleFilter] = useState("");
    const [departementFilter, setDepartementFilter] = useState("");
    const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
    const [edition, setEdition] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        Promise.all([api.get("/utilisateurs"), api.get("/roles"), api.get("/departements")])
            .then(([usersResponse, rolesResponse, departmentsResponse]) => {
                setUtilisateurs(usersResponse.data || []);
                setRoles(rolesResponse.data || []);
                setDepartements(departmentsResponse.data || []);
            })
            .catch((error) => setErreur(error.response?.data?.message || "Impossible de récupérer les utilisateurs."));
    }, []);

    const resultats = utilisateurs.filter((utilisateur) =>
        `${utilisateur.prenom} ${utilisateur.nom} ${utilisateur.email} ${utilisateur.telephone || ""}`.toLowerCase().includes(recherche.toLowerCase()) &&
        (!roleFilter || String(utilisateur.role_id) === roleFilter) &&
        (!departementFilter || String(utilisateur.departement_id || "") === departementFilter)
    );

    const ouvrirEdition = (utilisateur) => setEdition({ ...utilisateur });

    const enregistrer = async (event) => {
        event.preventDefault();
        try {
            const response = await api.put(`/utilisateurs/${edition.id}`, {
                ...edition,
                role_id: Number(edition.role_id),
                departement_id: edition.departement_id ? Number(edition.departement_id) : null
            });
            setUtilisateurs((current) => current.map((item) => item.id === edition.id ? response.data.utilisateur : item));
            setEdition(null);
            setMessage("Utilisateur modifié avec succès.");
        } catch (error) {
            setErreur(error.response?.data?.message || "Impossible de modifier l'utilisateur.");
        }
    };

    const exporter = () => {
        const lignes = [
            ["Nom", "Email", "Téléphone", "Rôle", "Actif"],
            ...resultats.map((utilisateur) => [
                `${utilisateur.prenom} ${utilisateur.nom}`,
                utilisateur.email,
                utilisateur.telephone || "",
                utilisateur.role_id || "",
                utilisateur.actif ? "Oui" : "Non"
            ])
        ];
        const csv = lignes.map((ligne) => ligne.map((valeur) => `"${String(valeur).replaceAll('"', '""')}"`).join(",")).join("\n");
        const lien = document.createElement("a");
        lien.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
        lien.download = "utilisateurs.csv";
        lien.click();
        URL.revokeObjectURL(lien.href);
    };

    return (
        <main className="admin-page">
            <div className="users-header"><h1><Users size={24} /> Gestion des utilisateurs</h1><button onClick={exporter}>Exporter Excel</button></div>
            <div className="users-filters">
                <label className="admin-search"><Search size={18} /><input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Rechercher un utilisateur..." /></label>
                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option value="">Tous les rôles</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.nom}</option>)}</select>
                <select value={departementFilter} onChange={(event) => setDepartementFilter(event.target.value)}><option value="">Tous les départements</option>{departements.map((departement) => <option key={departement.id} value={departement.id}>{departement.nom}</option>)}</select>
            </div>
            {message && <p className="users-success">{message}</p>}
            {erreur && <p>{erreur}</p>}
            <table><thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Département</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
                {resultats.map((utilisateur) => <tr key={utilisateur.id}><td>{utilisateur.prenom} {utilisateur.nom}</td><td>{utilisateur.email}</td><td>{utilisateur.telephone || "-"}</td><td>{utilisateur.role_nom || utilisateur.role_id || "-"}</td><td>{utilisateur.departement_nom || "-"}</td><td><span className={`user-status ${utilisateur.actif ? "active" : "inactive"}`}>{utilisateur.actif ? "Actif" : "Inactif"}</span></td><td className="user-actions"><button title="Consulter" onClick={() => setUtilisateurSelectionne(utilisateur)}><Eye size={16} /></button><button title="Modifier" onClick={() => ouvrirEdition(utilisateur)}><Pencil size={16} /></button></td></tr>)}
            </tbody></table>
            {utilisateurSelectionne && <div className="user-modal-backdrop" onClick={() => setUtilisateurSelectionne(null)}><section className="user-modal" onClick={(event) => event.stopPropagation()}><button className="user-close" onClick={() => setUtilisateurSelectionne(null)}><X /></button><h2>Fiche utilisateur</h2><p><strong>Nom :</strong> {utilisateurSelectionne.prenom} {utilisateurSelectionne.nom}</p><p><strong>Email :</strong> {utilisateurSelectionne.email}</p><p><strong>Téléphone :</strong> {utilisateurSelectionne.telephone || "-"}</p><p><strong>Rôle :</strong> {utilisateurSelectionne.role_nom || "-"}</p><p><strong>Département :</strong> {utilisateurSelectionne.departement_nom || "-"}</p><p><strong>Statut :</strong> {utilisateurSelectionne.actif ? "Actif" : "Inactif"}</p></section></div>}
            {edition && <div className="user-modal-backdrop"><form className="user-modal" onSubmit={enregistrer}><button type="button" className="user-close" onClick={() => setEdition(null)}><X /></button><h2>Modifier l'utilisateur</h2><div className="user-form-grid"><label>Nom<input required value={edition.nom || ""} onChange={(event) => setEdition({ ...edition, nom: event.target.value })} /></label><label>Prénom<input required value={edition.prenom || ""} onChange={(event) => setEdition({ ...edition, prenom: event.target.value })} /></label><label>Email<input required type="email" value={edition.email || ""} onChange={(event) => setEdition({ ...edition, email: event.target.value })} /></label><label>Téléphone<input value={edition.telephone || ""} onChange={(event) => setEdition({ ...edition, telephone: event.target.value })} /></label><label>Rôle<select value={edition.role_id || ""} onChange={(event) => setEdition({ ...edition, role_id: event.target.value })}>{roles.map((role) => <option key={role.id} value={role.id}>{role.nom}</option>)}</select></label><label>Département<select value={edition.departement_id || ""} onChange={(event) => setEdition({ ...edition, departement_id: event.target.value })}><option value="">Aucun</option>{departements.map((departement) => <option key={departement.id} value={departement.id}>{departement.nom}</option>)}</select></label></div><label className="user-active-toggle"><input type="checkbox" checked={Boolean(edition.actif)} onChange={(event) => setEdition({ ...edition, actif: event.target.checked })} /> Compte actif</label><div className="user-form-actions"><button type="button" onClick={() => setEdition(null)}>Annuler</button><button className="user-save" type="submit"><Check size={16} /> Enregistrer</button></div></form></div>}
        </main>
    );
}

export default Utilisateurs;
