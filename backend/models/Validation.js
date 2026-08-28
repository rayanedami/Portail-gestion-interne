const db = require("../config/db");

const Validation = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.niveau,
                v.decision,
                v.commentaire,
                v.date_validation,
                v.demande_id,
                v.responsable_id
            FROM validation v
            ORDER BY v.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.niveau,
                v.decision,
                v.commentaire,
                v.date_validation,
                v.demande_id,
                v.responsable_id
            FROM validation v
            WHERE v.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Validation;