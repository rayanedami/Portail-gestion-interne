const Utilisateur = require("../models/Utilisateur");

const UtilisateurController = {

    async getAll(req, res) {
        try {
            const utilisateurs = await Utilisateur.getAll(req.query);

            res.json(utilisateurs);

        } catch (error) {
            console.error("Erreur récupération utilisateurs :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            const utilisateur = await Utilisateur.getById(id);

            if (!utilisateur) {
                return res.status(404).json({
                    message: "Utilisateur introuvable"
                });
            }

            res.json(utilisateur);

        } catch (error) {
            console.error("Erreur récupération utilisateur :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const { nom, prenom, email, telephone, actif, role_id, departement_id } = req.body;
            if (!nom || !prenom || !email || !role_id) {
                return res.status(400).json({ message: "Nom, prénom, email et rôle sont obligatoires" });
            }
            const updated = await Utilisateur.updateAdmin(req.params.id, {
                nom, prenom, email, telephone, actif: Boolean(actif), role_id: Number(role_id),
                departement_id: departement_id ? Number(departement_id) : null
            });
            if (!updated) return res.status(404).json({ message: "Utilisateur introuvable" });
            res.json({ message: "Utilisateur modifié avec succès", utilisateur: updated });
        } catch (error) {
            console.error("Erreur modification utilisateur :", error.message);
            if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Cet email est déjà utilisé" });
            if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ message: "Rôle ou département invalide" });
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = UtilisateurController;