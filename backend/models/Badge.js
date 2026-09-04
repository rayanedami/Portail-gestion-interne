const db = require("../config/db");

const Badge = {

    async create(data) {
        const {
            qr_code,
            date_generation,
            date_expiration,
            statut,
            rendez_vous_id
        } = data;

        const [rendezVous] = await db.query(
            "SELECT id FROM rendez_vous WHERE id = ?",
            [rendez_vous_id]
        );

        if (rendezVous.length === 0) {
            throw new Error("Le rendez-vous associé au badge n'existe pas.");
        }

        const [result] = await db.query(
            `INSERT INTO badge
            (qr_code, date_generation, date_expiration, statut, rendez_vous_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
                qr_code,
                date_generation,
                date_expiration,
                statut,
                rendez_vous_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            qr_code,
            date_generation,
            date_expiration,
            statut,
            rendez_vous_id
        } = data;

        await db.query(
            `UPDATE badge
             SET qr_code = ?,
                 date_generation = ?,
                 date_expiration = ?,
                 statut = ?,
                 rendez_vous_id = ?
             WHERE id = ?`,
            [
                qr_code,
                date_generation,
                date_expiration,
                statut,
                rendez_vous_id,
                id
            ]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM badge WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

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