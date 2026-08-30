import { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    Search
} from "lucide-react";
import api from "../services/api";
import { formatDate } from "../utils/formatDate";
import "./Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur") || "null"
    );

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

            <div className="notifications-list">

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
                    filteredNotifications.map(
                        (notification) => {

                            const isUnread =
                                !notification.est_lue ||
                                Number(notification.est_lue) === 0;

                            return (
                                <div
                                    className={`notification-card ${
                                        isUnread
                                            ? "notification-unread"
                                            : ""
                                    }`}
                                    key={notification.id}
                                >

                                    <div className="notification-icon">

                                        <Bell />

                                    </div>

                                    <div className="notification-content">

                                        <div className="notification-top">

                                            <span className="notification-type">
                                                {notification.type ||
                                                    "Information"}
                                            </span>

                                            {isUnread && (
                                                <span className="new-badge">
                                                    Nouvelle
                                                </span>
                                            )}

                                        </div>

                                        <p className="notification-text">
                                            {notification.message}
                                        </p>

                                        <div className="notification-date">
                                            <Clock />
                                            {formatDate(notification.date_envoi)}
                                        </div>

                                    </div>

                                    {isUnread && (
                                        <button
                                            className="read-button"
                                            title="Marquer comme lu"
                                            onClick={() =>
                                                markAsRead(
                                                    notification
                                                )
                                            }
                                        >
                                            <Check />
                                        </button>
                                    )}

                                </div>
                            );
                        }
                    )
                )}

            </div>

        </div>
    );
}

export default Notifications;