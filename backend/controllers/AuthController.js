const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const { createToken } = require("../middleware/auth");
const Log = require("../models/Log");

const JWT_SECRET = process.env.JWT_SECRET || "portail-dev-secret";

function createMailTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
}

const AuthController = {

    async forgotPassword(req, res) {
        const email = String(req.body.email || "").trim().toLowerCase();
        const genericMessage = "Si cette adresse existe, un email de réinitialisation a été envoyé.";

        try {
            if (!email) return res.status(400).json({ message: "Email obligatoire" });

            const [rows] = await db.query(
                "SELECT id, email FROM utilisateur WHERE email = ? AND actif = 1",
                [email]
            );
            const transporter = createMailTransporter();
            if (rows.length === 0 || !transporter) return res.json({ message: genericMessage });

            const token = jwt.sign(
                { id: rows[0].id, purpose: "RESET_PASSWORD" },
                JWT_SECRET,
                { expiresIn: "30m" }
            );
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: rows[0].email,
                subject: "Réinitialisation de votre mot de passe",
                text: `Réinitialisez votre mot de passe avec ce lien : ${resetUrl}`,
                html: `<p>Réinitialisez votre mot de passe :</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Ce lien expire dans 30 minutes.</p>`
            });
            return res.json({ message: genericMessage });
        } catch (error) {
            console.error("Erreur mot de passe oublié :", error.message);
            return res.json({ message: genericMessage });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, mot_de_passe } = req.body;
            if (!token || !mot_de_passe || mot_de_passe.length < 6) {
                return res.status(400).json({ message: "Token et mot de passe valide obligatoires" });
            }
            const payload = jwt.verify(token, JWT_SECRET);
            if (payload.purpose !== "RESET_PASSWORD") throw new Error("Token invalide");
            const hash = await bcrypt.hash(mot_de_passe, 10);
            await db.query("UPDATE utilisateur SET mot_de_passe = ? WHERE id = ? AND actif = 1", [hash, payload.id]);
            res.json({ message: "Mot de passe réinitialisé avec succès" });
        } catch (error) {
            res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré" });
        }
    },

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
                    u.departement_id,
                          r.nom AS role,
                          d.nom AS departement
                 FROM utilisateur u
                 LEFT JOIN role r ON u.role_id = r.id
                      LEFT JOIN departement d ON d.id = u.departement_id
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

            await Log.record({ action: "CONNEXION", utilisateurId: utilisateur.id, req });

            res.json({
                message: "Connexion réussie",
                utilisateur,
                token: createToken(utilisateur)
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

            await Log.record({ action: `CREATION_UTILISATEUR #${utilisateurId}`, utilisateurId, req });

            res.status(201).json({
                message: "Compte visiteur créé avec succès",
                token: createToken({
                    id: utilisateurId,
                    role: "VISITEUR"
                }),
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

    ,

    async updateProfile(req, res) {
        try {
            const { nom, prenom, email, telephone, departement_id } = req.body;

            if (!nom || !prenom || !email) {
                return res.status(400).json({
                    message: "Nom, prénom et email sont obligatoires"
                });
            }

            const [existing] = await db.query(
                "SELECT id FROM utilisateur WHERE email = ? AND id <> ?",
                [email, req.auth.id]
            );

            if (existing.length > 0) {
                return res.status(409).json({
                    message: "Cette adresse email est déjà utilisée"
                });
            }

            if (req.auth.role === "ADMINISTRATEUR") {
                await db.query(
                    `UPDATE utilisateur
                     SET nom = ?, prenom = ?, email = ?, telephone = ?, departement_id = ?
                     WHERE id = ?`,
                    [nom, prenom, email, telephone || null, departement_id || null, req.auth.id]
                );
            } else {
                await db.query(
                    `UPDATE utilisateur
                     SET nom = ?, prenom = ?, email = ?, telephone = ?
                     WHERE id = ?`,
                    [nom, prenom, email, telephone || null, req.auth.id]
                );
            }

            const [rows] = await db.query(
                `SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
                    u.actif, u.role_id, r.nom AS role, d.nom AS departement
                 FROM utilisateur u
                 LEFT JOIN role r ON r.id = u.role_id
                 LEFT JOIN departement d ON d.id = u.departement_id
                 WHERE u.id = ?`,
                [req.auth.id]
            );

            await Log.record({ action: "MODIFICATION_PROFIL", utilisateurId: req.auth.id, req });

            return res.json({
                message: "Profil mis à jour avec succès",
                utilisateur: rows[0]
            });
        } catch (error) {
            console.error("Erreur mise à jour profil :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }

};

module.exports = AuthController;