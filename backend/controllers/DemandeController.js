const Demande = require("../models/Demande");
const Log = require("../models/Log");

const DemandeController = {

    async getOptions(req, res) {
        try {
            const db = require("../config/db");
            const [types] = await db.query("SELECT id, nom FROM type_demande ORDER BY nom");
            const [collaborateurs] = await db.query(
                `SELECT u.id, CONCAT(u.prenom, ' ', u.nom) AS nom
                 FROM utilisateur u JOIN role r ON r.id = u.role_id
                 WHERE r.nom IN ('COLLABORATEUR', 'RESPONSABLE')
                 ORDER BY u.prenom, u.nom`
            );
            const [departements] = await db.query("SELECT id, nom FROM departement ORDER BY nom");
            res.json({ types, collaborateurs, departements });
        } catch (error) {
            console.error("Erreur options demandes :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async create(req, res) {
        try {
            const { motif, type_demande_id } = req.body;
            const collaborateur_id = req.auth.id;

            if (!motif || !collaborateur_id || !type_demande_id) {
                return res.status(400).json({
                    message: "motif, collaborateur_id et type_demande_id sont obligatoires"
                });
            }

            const demande = await Demande.createWorkflow({
                motif,
                type_demande_id,
                collaborateur_id
            });

            await Log.record({ action: `CREATION_DEMANDE #${demande.id}`, utilisateurId: req.auth.id, req });

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
            if (req.body.statut && !["EN_ATTENTE", "EN_COURS", "ACCEPTEE", "REFUSEE"].includes(String(req.body.statut).toUpperCase())) {
                return res.status(400).json({ message: "Statut de demande invalide" });
            }
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
            const demandes = await Demande.getAll(req.auth, req.query);

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

            const demande = await Demande.getById(id, req.auth);

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