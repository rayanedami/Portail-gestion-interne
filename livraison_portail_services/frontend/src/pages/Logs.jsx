import { useEffect, useState } from "react";
import { ClipboardList, Download, RefreshCw, Search, Printer } from "lucide-react";
import api from "../services/api";
import { printTable } from "../utils/printTable";
import { exportExcel } from "../utils/exportExcel";
import "./Logs.css";

function Logs() {
    const [logs, setLogs] = useState([]);
    const [erreur, setErreur] = useState("");
    const [recherche, setRecherche] = useState("");
    const [chargement, setChargement] = useState(true);

    const chargerLogs = async () => {
        try {
            setChargement(true);
            setErreur("");
            const response = await api.get("/logs");
            setLogs(response.data || []);
        } catch (error) {
            setErreur(error.response?.data?.message || "Impossible de récupérer les journaux.");
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerLogs();
    }, []);

    const logsFiltres = logs.filter((log) =>
        `${log.action || ""} ${log.utilisateur_nom || ""} ${log.utilisateur_email || ""}`
            .toLowerCase()
            .includes(recherche.toLowerCase())
    );

    const formaterDate = (date) => date
        ? new Date(date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
        : "-";

    const exporter = () => {
        exportExcel("logs.xlsx", ["Action", "Utilisateur", "Date"], logsFiltres.map((log) => [log.action, log.utilisateur_nom || log.utilisateur_id || "", log.date_action || ""]));
    };

    const exporterPdf = () => {
        printTable({
            title: "Journaux d'activité",
            headers: ["Action", "Utilisateur", "Date"],
            rows: logsFiltres.map((log) => [log.action, log.utilisateur_nom || log.utilisateur_id || "", formaterDate(log.date_action)])
        });
    };

    return (
        <main className="logs-page">
            <div className="logs-header">
                <div><h1><ClipboardList size={26} /> Journaux d'activité</h1><p>Consultez les actions importantes enregistrées dans le portail.</p></div>
                <div className="logs-actions"><button title="Actualiser" onClick={chargerLogs}><RefreshCw size={17} /></button><button title="Exporter Excel" onClick={exporter}><Download size={17} /></button><button title="Exporter PDF" onClick={exporterPdf}><Printer size={17} /></button></div>
            </div>
            <div className="logs-toolbar"><div className="logs-search"><Search size={17} /><input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Rechercher une action, un utilisateur..." /></div><span>{logsFiltres.length} activité{logsFiltres.length !== 1 ? "s" : ""}</span></div>
            {erreur && <div className="logs-error">{erreur}</div>}
            <div className="logs-card"><table><thead><tr><th>Action</th><th>Utilisateur</th><th>Date</th></tr></thead><tbody>
                {chargement ? <tr><td colSpan="3" className="logs-empty">Chargement des journaux...</td></tr> : logsFiltres.length === 0 ? <tr><td colSpan="3" className="logs-empty">Aucune activité trouvée.</td></tr> : logsFiltres.map((log) => <tr key={log.id}><td><span className="log-action">{log.action}</span></td><td><strong>{log.utilisateur_nom || `Utilisateur #${log.utilisateur_id || "-"}`}</strong>{log.utilisateur_email && <small>{log.utilisateur_email}</small>}</td><td>{formaterDate(log.date_action)}</td></tr>)}
            </tbody></table></div>
        </main>
    );
}

export default Logs;
