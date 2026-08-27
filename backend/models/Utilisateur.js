const db = require("../config/db");

const Utilisateur = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                id,
                nom,
                prenom,
                email,
                telephone,
                actif,
                date_creation,
                role_id,
                departement_id
            FROM utilisateur
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(
            `SELECT
                id,
                nom,
                prenom,
                email,
                telephone,
                actif,
                date_creation,
                role_id,
                departement_id
             FROM utilisateur
             WHERE id = ?`,
            [id]
        );

        return rows[0];
    }
};

module.exports = Utilisateur;