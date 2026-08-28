const db = require("../config/db");

const Visiteur = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                id,
                nom,
                prenom,
                email,
                telephone,
                societe
            FROM visiteur
            ORDER BY id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                id,
                nom,
                prenom,
                email,
                telephone,
                societe
            FROM visiteur
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Visiteur;