const Demande = require("../models/Demande");

const DemandeController = {

    async create(req, res) {
        try {
            const { motif, collaborateur_id, type_demande_id } = req.body;

            if (!motif || !collaborateur_id || !type_demande_id) {
                return res.status(400).json({
                    message: "motif, collaborateur_id et type_demande_id sont obligatoires"
                });
            }

            const demande = await Demande.create(req.body);

            res.status(201).json({
                message: "Demande créée avec succès",
                demande
            });

        } catch (error) {
            console.error("Erreur création demande :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const demande = await Demande.update(req.params.id, req.body);

            if (!demande) {
                return res.status(404).json({
                    message: "Demande introuvable"
                });
            }

            res.json({
                message: "Demande modifiée avec succès",
                demande
            });

        } catch (error) {
            console.error("Erreur modification demande :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Demande.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Demande introuvable"
                });
            }

            res.json({
                message: "Demande supprimée avec succès"
            });

        } catch (error) {
            console.error("Erreur suppression demande :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getAll(req, res) {
        try {
            const demandes = await Demande.getAll(req.auth);

            res.json(demandes);

        } catch (error) {
            console.error("Erreur récupération demandes :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            const demande = await Demande.getById(id);

            if (!demande) {
                return res.status(404).json({
                    message: "Demande introuvable"
                });
            }

            res.json(demande);

        } catch (error) {
            console.error("Erreur récupération demande :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    }
};

module.exports = DemandeController;