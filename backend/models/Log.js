const db = require("../config/db");

const Log = {

    async create(data) {
        const {
            action,
            date_action,
            adresse_ip,
            utilisateur_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO log
            (action, date_action, adresse_ip, utilisateur_id)
            VALUES (?, ?, ?, ?)`,
            [
                action,
                date_action,
                adresse_ip,
                utilisateur_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            action,
            adresse_ip
        } = data;

        await db.query(
            `UPDATE log
             SET action = ?,
                 adresse_ip = ?
             WHERE id = ?`,
            [action, adresse_ip, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM log
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                id,
                action,
                date_action,
                adresse_ip,
                utilisateur_id
            FROM log
            ORDER BY id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                id,
                action,
                date_action,
                adresse_ip,
                utilisateur_id
            FROM log
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Log;