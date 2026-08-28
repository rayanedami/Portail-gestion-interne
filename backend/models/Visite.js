const db = require("../config/db");

const Visite = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                id,
                date_entree,
                date_sortie,
                statut,
                rendez_vous_id,
                agent_accueil_id
            FROM visite
            ORDER BY id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                id,
                date_entree,
                date_sortie,
                statut,
                rendez_vous_id,
                agent_accueil_id
            FROM visite
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Visite;