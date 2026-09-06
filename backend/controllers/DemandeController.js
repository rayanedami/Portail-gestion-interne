const Demande = require("../models/Demande");
const PieceJointe = require("../models/PieceJointe");
const Log = require("../models/Log");
const Notification = require("../models/Notification");

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
            if (req.auth.role !== "COLLABORATEUR") {
                return res.status(403).json({
                    message: "Seul un collaborateur peut créer une demande."
                });
            }
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

            if (req.file) {
                await PieceJointe.create({
                    nom_fichier: req.file.originalname,
                    url_fichier: `/uploads/${req.file.filename}`,
                    type_fichier: req.file.mimetype,
                    taille: req.file.size,
                    demande_id: demande.id
                });
            }

            await Notification.notifyUser(
                req.auth.id,
                "Votre demande a été créée avec succès.",
                "DEMANDE",
                demande.id,
                null,
                req.auth.id
            );
            await Notification.notifyRole(
                "RESPONSABLE",
                "Une nouvelle demande nécessite votre validation.",
                "VALIDATION",
                demande.id,
                null,
                req.auth.id,
                req.auth.id
            );

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
            const existing = await Demande.getById(req.params.id, req.auth);
            if (!existing) {
                return res.status(404).json({ message: "Demande introuvable" });
            }
            if (Object.prototype.hasOwnProperty.call(req.body, "statut")) {
                return res.status(403).json({
                    message: "Le statut d'une demande est modifié uniquement par le workflow de validation"
                });
            }
            const demande = await Demande.update(req.params.id, {
                motif: req.body.motif ?? existing.motif,
                type_demande_id: req.body.type_demande_id ?? existing.type_demande_id,
                statut: existing.statut
            });

            if (!demande) {
                return res.status(404).json({
                    message: "Demande introuvable"
                });
            }

            await Notification.notifyUser(
                demande.collaborateur_id,
                "Votre demande a été modifiée.",
                "DEMANDE",
                demande.id,
                null,
                req.auth.id
            );
            await Notification.notifyRole(
                "RESPONSABLE",
                "Une demande que vous devez traiter a été modifiée.",
                "VALIDATION",
                demande.id,
                null,
                req.auth.id,
                req.auth.id
            );
            await Log.record({ action: `MODIFICATION_DEMANDE #${demande.id}`, utilisateurId: req.auth.id, req });

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
            const existing = await Demande.getById(req.params.id, req.auth);
            if (!existing) {
                return res.status(404).json({ message: "Demande introuvable" });
            }
            const deleted = await Demande.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Demande introuvable"
                });
            }

            await Log.record({ action: `SUPPRESSION_DEMANDE #${req.params.id}`, utilisateurId: req.auth.id, req });

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