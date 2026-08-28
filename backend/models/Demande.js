const db = require("../config/db");

const Demande = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                d.id,
                d.date_soumission,
                d.motif,
                d.statut,
                d.collaborateur_id,
                d.type_demande_id
            FROM demande d
            ORDER BY d.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                d.id,
                d.date_soumission,
                d.motif,
                d.statut,
                d.collaborateur_id,
                d.type_demande_id
            FROM demande d
            WHERE d.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Demande;