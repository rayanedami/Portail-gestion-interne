import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../services/api";
import "../components/ReturnHomeButton.css";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        api.get("/utilisateurs")
            .then((response) => setUtilisateurs(response.data || []))
            .catch(() => setErreur("Impossible de récupérer les utilisateurs."));
    }, []);

    const resultats = utilisateurs.filter((utilisateur) =>
        `${utilisateur.prenom} ${utilisateur.nom} ${utilisateur.email}`.toLowerCase().includes(recherche.toLowerCase())
    );

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
            <button className="return-home-button" type="button" onClick={() => window.location.assign("/accueil")}>Retour a l'accueil</button>
            <h1><Users size={24} /> Gestion des utilisateurs</h1>
            <div className="admin-search"><Search size={18} /><input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Rechercher..." /><button onClick={exporter}>Exporter Excel</button></div>
            {erreur && <p>{erreur}</p>}
            <table><thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Actif</th></tr></thead><tbody>
                {resultats.map((utilisateur) => <tr key={utilisateur.id}><td>{utilisateur.prenom} {utilisateur.nom}</td><td>{utilisateur.email}</td><td>{utilisateur.telephone || "-"}</td><td>{utilisateur.role_id || "-"}</td><td>{utilisateur.actif ? "Oui" : "Non"}</td></tr>)}
            </tbody></table>
        </main>
    );
}

export default Utilisateurs;
