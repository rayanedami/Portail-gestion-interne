const db = require("../config/db");

const RendezVous = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                r.id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut,
                r.visiteur_id,
                r.collaborateur_id
            FROM rendez_vous r
            ORDER BY r.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                r.id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut,
                r.visiteur_id,
                r.collaborateur_id
            FROM rendez_vous r
            WHERE r.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = RendezVous;