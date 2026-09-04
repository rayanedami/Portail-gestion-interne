const db = require("../config/db");

const Notification = {

    async notifyUser(utilisateur_id, message, type, demande_id = null, rendez_vous_id = null) {
        return this.create({
            utilisateur_id,
            message,
            type,
            demande_id,
            rendez_vous_id
        });
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