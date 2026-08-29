const db = require("../config/db");

const Validation = {

    async create(data) {
        const {
            demande_id,
            responsable_id,
            niveau,
            decision,
            commentaire
        } = data;

        const [result] = await db.query(
            `INSERT INTO validation
            (demande_id, responsable_id, niveau, decision, commentaire, date_validation)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                demande_id,
                responsable_id,
                niveau,
                decision,
                commentaire
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            niveau,
            decision,
            commentaire
        } = data;

        await db.query(
            `UPDATE validation
             SET niveau = ?, decision = ?, commentaire = ?
             WHERE id = ?`,
            [niveau, decision, commentaire, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM validation WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

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