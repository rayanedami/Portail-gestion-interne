const Notification = require("../models/Notification");

const NotificationController = {

    async create(req, res) {
        try {
            const notification = await Notification.create(req.body);

            res.status(201).json({
                message: "Notification créée avec succès",
                notification
            });

        } catch (error) {
            console.error("Erreur création notification :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getAll(req, res) {
        try {
            const notifications = await Notification.getAll();
            res.json(notifications);
        } catch (error) {
            console.error("Erreur notifications :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const notification = await Notification.getById(req.params.id);

            if (!notification) {
                return res.status(404).json({
                    message: "Notification introuvable"
                });
            }

            res.json(notification);
        } catch (error) {
            console.error("Erreur notification :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = NotificationController;