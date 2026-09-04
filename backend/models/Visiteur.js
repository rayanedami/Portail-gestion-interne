const db = require("../config/db");

const Visiteur = {

    async create(data) {
        const {
            nom,
            prenom,
            email,
            telephone,
            societe
        } = data;

        const [result] = await db.query(
            `INSERT INTO visiteur
            (nom, prenom, email, telephone, societe)
            VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, telephone, societe]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            nom,
            prenom,
            email,
            telephone,
            societe
        } = data;

        await db.query(
            `UPDATE visiteur
             SET nom = ?, prenom = ?, email = ?, telephone = ?, societe = ?
             WHERE id = ?`,
            [nom, prenom, email, telephone, societe, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM visiteur WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll(auth) {
        const where = auth?.role === "VISITEUR"
            ? "WHERE utilisateur_id = ?"
            : "";
        const params = auth?.role === "VISITEUR" ? [auth.id] : [];
        const [rows] = await db.query(`
            SELECT
                id,
                utilisateur_id,
                nom,
                prenom,
                email,
                telephone,
                societe
            FROM visiteur
            ${where}
            ORDER BY id DESC
        `, params);

        return rows;

    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                id,
                utilisateur_id,
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