const db = require("../config/db");

const Notification = {

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
            est_lue
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

    async getAll() {
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
            ORDER BY id DESC
        `);

        return rows;
    },

    async getById(id) {
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
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Notification;