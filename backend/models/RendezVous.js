const db = require("../config/db");

const RendezVous = {

    async create(data) {
        const {
            date_rendez_vous,
            heure_rendez_vous,
            motif,
            statut,
            visiteur_id,
            collaborateur_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO rendez_vous
            (date_rendez_vous, heure_rendez_vous, motif, statut, visiteur_id, collaborateur_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                date_rendez_vous,
                heure_rendez_vous,
                motif,
                statut,
                visiteur_id,
                collaborateur_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            date_rendez_vous,
            heure_rendez_vous,
            motif,
            statut,
            visiteur_id,
            collaborateur_id
        } = data;

        await db.query(
            `UPDATE rendez_vous
             SET date_rendez_vous = ?,
                 heure_rendez_vous = ?,
                 motif = ?,
                 statut = ?,
                 visiteur_id = ?,
                 collaborateur_id = ?
             WHERE id = ?`,
            [
                date_rendez_vous,
                heure_rendez_vous,
                motif,
                statut,
                visiteur_id,
                collaborateur_id,
                id
            ]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM rendez_vous WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

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