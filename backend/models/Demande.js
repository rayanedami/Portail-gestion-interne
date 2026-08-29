const db = require("../config/db");

const Demande = {

    async create(data) {
        const {
            motif,
            collaborateur_id,
            type_demande_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO demande
            (motif, collaborateur_id, type_demande_id)
            VALUES (?, ?, ?)`,
            [motif, collaborateur_id, type_demande_id]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            motif,
            statut,
            type_demande_id
        } = data;

        await db.query(
            `UPDATE demande
             SET motif = ?, statut = ?, type_demande_id = ?
             WHERE id = ?`,
            [motif, statut, type_demande_id, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM demande WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

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