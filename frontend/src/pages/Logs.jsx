import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import api from "../services/api";
import "../components/ReturnHomeButton.css";

function Logs() {
    const [logs, setLogs] = useState([]);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        api.get("/logs")
            .then((response) => setLogs(response.data || []))
            .catch(() => setErreur("Impossible de récupérer les journaux."));
    }, []);

    const exporter = () => {
        const csv = [
            ["Action", "Utilisateur", "Date", "Adresse IP"],
            ...logs.map((log) => [log.action, log.utilisateur_id || "", log.date_action || "", log.adresse_ip || ""])
        ].map((ligne) => ligne.map((valeur) => `"${String(valeur).replaceAll('"', '""')}"`).join(",")).join("\n");
        const lien = document.createElement("a");
        lien.href = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
        lien.download = "logs.csv";
        lien.click();
        URL.revokeObjectURL(lien.href);
    };

    return (
        <main className="admin-page">
            <button className="return-home-button" type="button" onClick={() => window.location.assign("/accueil")}>Retour a l'accueil</button>
            <h1><ClipboardList size={24} /> Journaux d'activité <button onClick={exporter}>Exporter Excel</button></h1>
            {erreur && <p>{erreur}</p>}
            <table><thead><tr><th>Action</th><th>Utilisateur</th><th>Date</th><th>Adresse IP</th></tr></thead><tbody>
                {logs.map((log) => <tr key={log.id}><td>{log.action}</td><td>{log.utilisateur_id || "-"}</td><td>{log.date_action || "-"}</td><td>{log.adresse_ip || "-"}</td></tr>)}
            </tbody></table>
        </main>
    );
}

export default Logs;
