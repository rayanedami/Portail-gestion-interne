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