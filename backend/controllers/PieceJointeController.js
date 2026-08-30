const PieceJointe = require("../models/PieceJointe");

const PieceJointeController = {

    async create(req, res) {
        try {
            const { nom_fichier, demande_id } = req.body;

            if (!nom_fichier || !demande_id) {
                return res.status(400).json({
                    message: "nom_fichier et demande_id sont obligatoires"
                });
            }

            const pieceJointe = await PieceJointe.create(req.body);

            res.status(201).json({
                message: "Pièce jointe créée avec succès",
                pieceJointe
            });
        } catch (error) {
            console.error("Erreur création pièce jointe :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async update(req, res) {
        try {
            const pieceJointe = await PieceJointe.update(
                req.params.id,
                req.body
            );

            if (!pieceJointe) {
                return res.status(404).json({
                    message: "Pièce jointe introuvable"
                });
            }

            res.json({
                message: "Pièce jointe modifiée avec succès",
                pieceJointe
            });
        } catch (error) {
            console.error("Erreur modification pièce jointe :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await PieceJointe.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Pièce jointe introuvable"
                });
            }

            res.json({ message: "Pièce jointe supprimée avec succès" });
        } catch (error) {
            console.error("Erreur suppression pièce jointe :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getAll(req, res) {
        try {
            res.json(await PieceJointe.getAll());
        } catch (error) {
            console.error("Erreur pièces jointes :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const pieceJointe = await PieceJointe.getById(req.params.id);

            if (!pieceJointe) {
                return res.status(404).json({
                    message: "Pièce jointe introuvable"
                });
            }

            res.json(pieceJointe);
        } catch (error) {
            console.error("Erreur pièce jointe :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = PieceJointeController;
