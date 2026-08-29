const db = require("../config/db");

const Visite = {

    async create(data) {
        const {
            date_entree,
            date_sortie,
            statut,
            rendez_vous_id,
            agent_accueil_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO visite
            (date_entree, date_sortie, statut, rendez_vous_id, agent_accueil_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
                date_entree,
                date_sortie,
                statut,
                rendez_vous_id,
                agent_accueil_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            date_entree,
            date_sortie,
            statut,
            rendez_vous_id,
            agent_accueil_id
        } = data;

        await db.query(
            `UPDATE visite
             SET date_entree = ?,
                 date_sortie = ?,
                 statut = ?,
                 rendez_vous_id = ?,
                 agent_accueil_id = ?
             WHERE id = ?`,
            [
                date_entree,
                date_sortie,
                statut,
                rendez_vous_id,
                agent_accueil_id,
                id
            ]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM visite WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

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