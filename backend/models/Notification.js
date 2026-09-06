const db = require("../config/db");
const nodemailer = require("nodemailer");

function createMailTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
}

const Notification = {

    async notifyUser(utilisateur_id, message, type, demande_id = null, rendez_vous_id = null) {
        const notification = await this.create({
            utilisateur_id,
            message,
            type,
            demande_id,
            rendez_vous_id
        });
        await this.sendImportantEmail(utilisateur_id, message, type);
        return notification;
    },

    async sendImportantEmail(utilisateurId, message, type) {
        const importantTypes = ["DEMANDE", "VALIDATION", "RENDEZ_VOUS", "BADGE", "VISITE", "QR_INVALIDE"];
        if (!importantTypes.includes(String(type).toUpperCase())) return;
        const transporter = createMailTransporter();
        if (!transporter) return;

        try {
            const [rows] = await db.query("SELECT email, prenom, nom FROM utilisateur WHERE id = ? AND actif = 1", [utilisateurId]);
            if (!rows[0]?.email) return;
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: rows[0].email,
                subject: `Portail Services - ${type}`,
                text: `Bonjour ${rows[0].prenom || ""} ${rows[0].nom || ""},\n\n${message}`
            });
        } catch (error) {
            console.error("Erreur envoi notification email :", error.message);
        }
    },

    async notifyVisitor(rendez_vous_id, message, type) {
        const [rows] = await db.query(
            `SELECT v.utilisateur_id
             FROM rendez_vous r
             JOIN visiteur v ON v.id = r.visiteur_id
             WHERE r.id = ?`,
            [rendez_vous_id]
        );
        if (rows.length === 0 || !rows[0].utilisateur_id) return null;
        return this.notifyUser(
            rows[0].utilisateur_id,
            message,
            type,
            null,
            rendez_vous_id
        );
    },

    async notifyReception(message, type, rendez_vous_id = null) {
        const [agents] = await db.query(
            `SELECT u.id
             FROM utilisateur u
             JOIN role r ON r.id = u.role_id
             WHERE r.nom = 'AGENT_ACCUEIL' AND u.actif = 1`
        );

        await Promise.all(
            agents.map((agent) => this.notifyUser(
                agent.id,
                message,
                type,
                null,
                rendez_vous_id
            ))
        );
    },

    async notifyRole(roleName, message, type, demande_id = null, rendez_vous_id = null, excludeUserId = null) {
        const [users] = await db.query(
            `SELECT u.id
             FROM utilisateur u
             JOIN role r ON r.id = u.role_id
             WHERE r.nom = ? AND u.actif = 1
               AND (? IS NULL OR u.id <> ?)`,
            [roleName, excludeUserId, excludeUserId]
        );

        await Promise.all(
            users.map((user) => this.notifyUser(
                user.id,
                message,
                type,
                demande_id,
                rendez_vous_id
            ))
        );
    },

    async create(data) {
        const {
            message,
            type,
            date_envoi = new Date(),
            est_lue = 0,
            utilisateur_id,
            demande_id,
            rendez_vous_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO notification
            (message, type, date_envoi, est_lue, utilisateur_id, demande_id, rendez_vous_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                message,
                type,
                date_envoi,
                est_lue,
                utilisateur_id,
                demande_id,
                rendez_vous_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            message,
            type,
            est_lue = 0
        } = data;

        await db.query(
            `UPDATE notification
             SET message = ?,
                 type = ?,
                 est_lue = ?
             WHERE id = ?`,
            [message, type, est_lue, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM notification
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll(auth) {
        const where = auth?.role === "ADMINISTRATEUR"
            ? ""
            : "WHERE utilisateur_id = ?";
        const params = auth?.role === "ADMINISTRATEUR" ? [] : [auth.id];
        const [rows] = await db.query(`
            SELECT
                id,
                message,
                type,
                date_envoi,
                est_lue,
                utilisateur_id,
                demande_id,
                rendez_vous_id
            FROM notification
            ${where}
            ORDER BY id DESC
        `, params);

        return rows;
    },

    async getById(id, auth) {
        const where = (!auth || auth.role === "ADMINISTRATEUR")
            ? "WHERE id = ?"
            : "WHERE id = ? AND utilisateur_id = ?";
        const params = (!auth || auth.role === "ADMINISTRATEUR") ? [id] : [id, auth.id];
        const [rows] = await db.query(`
            SELECT
                id,
                message,
                type,
                date_envoi,
                est_lue,
                utilisateur_id,
                demande_id,
                rendez_vous_id
            FROM notification
            ${where}
        `, params);

        return rows[0];
    }
};

module.exports = Notification;