const bcrypt = require("bcrypt");
const db = require("../config/db");

const AuthController = {

    // =========================
    // CONNEXION
    // =========================
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
    },


    // =========================
    // INSCRIPTION VISITEUR
    // =========================
    async register(req, res) {
        const connection = await db.getConnection();

        try {
            const {
                nom,
                prenom,
                email,
                mot_de_passe,
                telephone,
                societe
            } = req.body;

            // Vérification des champs obligatoires
            if (
                !nom ||
                !prenom ||
                !email ||
                !mot_de_passe
            ) {
                return res.status(400).json({
                    message: "Nom, prénom, email et mot de passe sont obligatoires"
                });
            }

            // Vérification longueur mot de passe
            if (mot_de_passe.length < 6) {
                return res.status(400).json({
                    message: "Le mot de passe doit contenir au moins 6 caractères"
                });
            }

            // Vérifier si l'email existe déjà
            const [existingUser] = await connection.query(
                `SELECT id
                 FROM utilisateur
                 WHERE email = ?`,
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(409).json({
                    message: "Cette adresse email est déjà utilisée"
                });
            }

            // Récupérer le rôle VISITEUR
            const [roles] = await connection.query(
                `SELECT id
                 FROM role
                 WHERE nom = 'VISITEUR'
                 LIMIT 1`
            );

            if (roles.length === 0) {
                return res.status(500).json({
                    message: "Le rôle VISITEUR n'existe pas dans la base de données"
                });
            }

            const roleVisiteurId = roles[0].id;

            // Hash du mot de passe
            const motDePasseHash = await bcrypt.hash(
                mot_de_passe,
                10
            );

            // Transaction
            await connection.beginTransaction();

            // Créer le compte utilisateur
            const [userResult] = await connection.query(
                `INSERT INTO utilisateur
                (
                    nom,
                    prenom,
                    email,
                    mot_de_passe,
                    telephone,
                    actif,
                    role_id
                )
                VALUES (?, ?, ?, ?, ?, 1, ?)`,
                [
                    nom,
                    prenom,
                    email,
                    motDePasseHash,
                    telephone || null,
                    roleVisiteurId
                ]
            );

            const utilisateurId = userResult.insertId;

            // Créer le profil visiteur
            await connection.query(
                `INSERT INTO visiteur
                (
                    utilisateur_id,
                    nom,
                    prenom,
                    email,
                    telephone,
                    societe
                )
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    utilisateurId,
                    nom,
                    prenom,
                    email,
                    telephone || null,
                    societe || null
                ]
            );

            await connection.commit();

            res.status(201).json({
                message: "Compte visiteur créé avec succès",
                utilisateur: {
                    id: utilisateurId,
                    nom,
                    prenom,
                    email,
                    telephone: telephone || null,
                    role_id: roleVisiteurId,
                    role: "VISITEUR"
                }
            });

        } catch (error) {

            await connection.rollback();

            console.error(
                "Erreur inscription visiteur :",
                error.message
            );

            res.status(500).json({
                message: "Erreur lors de la création du compte"
            });

        } finally {
            connection.release();
        }
    }

};

module.exports = AuthController;