const db = require("../config/db");

const Badge = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                id,
                qr_code,
                date_generation,
                date_expiration,
                statut,
                rendez_vous_id
            FROM badge
            ORDER BY id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                id,
                qr_code,
                date_generation,
                date_expiration,
                statut,
                rendez_vous_id
            FROM badge
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Badge;