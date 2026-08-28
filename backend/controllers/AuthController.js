const bcrypt = require("bcrypt");
const db = require("../config/db");

const AuthController = {

    async login(req, res) {
        try {
            const { email, mot_de_passe } = req.body;

            if (!email || !mot_de_passe) {
                return res.status(400).json({
                    message: "Email et mot de passe obligatoires"
                });
            }

            const [rows] = await db.query(
                `SELECT
                    u.id,
                    u.nom,
                    u.prenom,
                    u.email,
                    u.mot_de_passe,
                    u.telephone,
                    u.actif,
                    u.role_id,
                    r.nom AS role
                 FROM utilisateur u
                 LEFT JOIN role r ON u.role_id = r.id
                 WHERE u.email = ?`,
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    message: "Email ou mot de passe incorrect"
                });
            }

            const utilisateur = rows[0];

            if (!utilisateur.actif) {
                return res.status(403).json({
                    message: "Compte désactivé"
                });
            }

            const motDePasseCorrect = await bcrypt.compare(
                mot_de_passe,
                utilisateur.mot_de_passe
            );

            if (!motDePasseCorrect) {
                return res.status(401).json({
                    message: "Email ou mot de passe incorrect"
                });
            }

            delete utilisateur.mot_de_passe;

            res.json({
                message: "Connexion réussie",
                utilisateur
            });

        } catch (error) {
            console.error("Erreur login :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    }
};

module.exports = AuthController;