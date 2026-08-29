const db = require("../config/db");

const Notification = {

    async create(data) {
        const {
            message,
            type,
            date_envoi,
            est_lue,
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