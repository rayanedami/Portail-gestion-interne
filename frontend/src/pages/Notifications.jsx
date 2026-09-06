import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    Search,
    Trash2,
    Eye,
    CalendarDays,
    ClipboardList,
    UserRound,
    Megaphone,
    Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./Notifications.css";

function Notifications() {
    const { utilisateur } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selection, setSelection] = useState([]);

    const utilisateurId = utilisateur?.id;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await api.get("/notifications");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.notifications || [];

            const mesNotifications = data.filter(
                (notification) =>
                    Number(notification.utilisateur_id) ===
                    Number(utilisateurId)
            );

            setNotifications(mesNotifications);
        } catch (error) {
            console.error(
                "Erreur récupération notifications :",
                error
            );

            setMessage(
                "Impossible de récupérer les notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notification) => {
        try {
            await api.put(
                `/notifications/${notification.id}`,
                {
                    est_lue: 1
                }
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, est_lue: 1 }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Erreur modification notification :",
                error
            );

            // Mise à jour visuelle même si le backend
            // n'a pas encore cette route PUT.
            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, est_lue: 1 }
                        : item
                )
            );
        }
    };

    const markAllAsRead = async () => {
        const nonLues = notifications.filter(
            (notification) =>
                !notification.est_lue ||
                Number(notification.est_lue) === 0
        );

        for (const notification of nonLues) {
            try {
                await api.put(
                    `/notifications/${notification.id}`,
                    {
                        est_lue: 1
                    }
                );
            } catch (error) {
                console.error(error);
            }
        }

        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                est_lue: 1
            }))
        );
    };

    const supprimerNotification = async (notification) => {
        try {
            await api.delete(`/notifications/${notification.id}`);
            setNotifications((previous) => previous.filter((item) => item.id !== notification.id));
            setSelection((previous) => previous.filter((id) => id !== notification.id));
        } catch (error) {
            setMessage(error.response?.data?.message || "Impossible de supprimer la notification.");
        }
    };

    const getNotificationMeta = (type) => {
        const value = String(type || "").toUpperCase();
        if (value.includes("RENDEZ")) return { label: "Rendez-vous", className: "notification-type-blue", icon: <CalendarDays /> };
        if (value.includes("VISITE")) return { label: "Visite", className: "notification-type-green", icon: <UserRound /> };
        if (value.includes("VALIDATION")) return { label: "Validation", className: "notification-type-orange", icon: <ClipboardList /> };
        if (value.includes("DEMANDE")) return { label: "Demande", className: "notification-type-red", icon: <Bell /> };
        if (value.includes("UTILISATEUR")) return { label: "Utilisateur", className: "notification-type-purple", icon: <Users /> };
        return { label: "Notification système", className: "notification-type-teal", icon: <Megaphone /> };
    };

    const toggleSelection = (id) => {
        setSelection((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
    };

    const filteredNotifications = notifications.filter(
        (notification) => {
            const text = `
                ${notification.message || ""}
                ${notification.type || ""}
                ${notification.date_envoi || ""}
            `.toLowerCase();

            return text.includes(search.toLowerCase());
        }
    );

    const unreadCount = notifications.filter(
        (notification) =>
            !notification.est_lue ||
            Number(notification.est_lue) === 0
    ).length;

    return (
        <div className="notifications-page">
            <div className="notifications-header">

                <div>
                    <div className="notification-title-icon">
                        <Bell />
                    </div>

                    <h1>Notifications</h1>

                    <p>
                        Restez informé des dernières activités du portail.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        className="mark-all-button"
                        onClick={markAllAsRead}
                    >
                        <CheckCheck />
                        Tout marquer comme lu
                    </button>
                )}

            </div>

            {message && (
                <div className="notifications-message">
                    {message}
                </div>
            )}

            <div className="notifications-toolbar">

                <div className="notification-search">
                    <Search />

                    <input
                        type="text"
                        placeholder="Rechercher une notification..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <div className="unread-counter">
                    {unreadCount} non lue
                    {unreadCount > 1 ? "s" : ""}
                </div>

            </div>

            <div className="notifications-table-wrapper">

                {loading ? (
                    <div className="notification-empty">
                        Chargement des notifications...
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="notification-empty">

                        <Bell />

                        <h3>
                            Aucune notification
                        </h3>

                        <p>
                            Vous n'avez aucune notification.
                        </p>

                    </div>
                ) : (
                    <table className="notifications-table">
                        <thead>
                            <tr>
                                <th className="notification-check-cell"><input type="checkbox" aria-label="Sélectionner toutes les notifications" checked={selection.length === filteredNotifications.length && filteredNotifications.length > 0} onChange={(event) => setSelection(event.target.checked ? filteredNotifications.map((item) => item.id) : [])} /></th>
                                <th>Type</th>
                                <th>Message</th>
                                <th>Expéditeur</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotifications.map((notification) => {

                            const isUnread =
                                !notification.est_lue ||
                                Number(notification.est_lue) === 0;
                            const meta = getNotificationMeta(notification.type);

                            return (
                                <tr className={isUnread ? "notification-unread" : ""}
                                    key={notification.id}
                                >
                                    <td className="notification-check-cell"><input type="checkbox" aria-label="Sélectionner la notification" checked={selection.includes(notification.id)} onChange={() => toggleSelection(notification.id)} /></td>
                                    <td><div className={`notification-type-cell ${meta.className}`}><span className="notification-icon">{meta.icon}</span><strong>{meta.label}</strong>{isUnread && <em>Important</em>}</div></td>
                                    <td><div className="notification-message-cell"><strong>{notification.message}</strong><small>{notification.demande_id ? `Référence : #DM-${String(notification.demande_id).padStart(4, "0")}` : notification.rendez_vous_id ? `Rendez-vous #${notification.rendez_vous_id}` : "Portail de gestion interne"}</small></div></td>
                                    <td><div className="notification-sender"><span className="sender-avatar">{notification.expediteur_photo ? <img src={notification.expediteur_photo} alt="" /> : <UserRound />}</span><div><strong>{notification.expediteur_nom || "Système"}</strong><small>{notification.expediteur_nom ? "Utilisateur" : "Portail"}</small></div></div></td>
                                    <td className="notification-date-cell"><strong>{notification.date_envoi ? new Date(notification.date_envoi).toLocaleDateString("fr-FR") : "-"}</strong><small>{notification.date_envoi ? new Date(notification.date_envoi).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}</small></td>
                                    <td><span className={`notification-read-status ${isUnread ? "unread" : "read"}`}>{isUnread ? "Non lu" : "Lu"}</span></td>
                                    <td><div className="notification-actions"><button type="button" title={isUnread ? "Marquer comme lu" : "Déjà lu"} onClick={() => markAsRead(notification)}><Eye /></button><button type="button" title="Supprimer" onClick={() => supprimerNotification(notification)}><Trash2 /></button></div></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

            </div>

        </div>
    );
}

export default Notifications;