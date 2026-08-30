const db = require("../config/db");

const PieceJointe = {

    async create(data) {
        const {
            nom_fichier,
            url_fichier,
            type_fichier,
            taille,
            demande_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO piece_jointe
			(nom_fichier, url_fichier, type_fichier, taille, demande_id)
			VALUES (?, ?, ?, ?, ?)`,
            [nom_fichier, url_fichier, type_fichier, taille, demande_id]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            nom_fichier,
            url_fichier,
            type_fichier,
            taille
        } = data;

        await db.query(
            `UPDATE piece_jointe
			 SET nom_fichier = ?,
				 url_fichier = ?,
				 type_fichier = ?,
				 taille = ?
			 WHERE id = ?`,
            [nom_fichier, url_fichier, type_fichier, taille, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            "DELETE FROM piece_jointe WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll() {
        const [rows] = await db.query(`
			SELECT
				id,
				nom_fichier,
				url_fichier,
				type_fichier,
				taille,
				date_ajout,
				demande_id
			FROM piece_jointe
			ORDER BY id DESC
		`);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
			SELECT
				id,
				nom_fichier,
				url_fichier,
				type_fichier,
				taille,
				date_ajout,
				demande_id
			FROM piece_jointe
			WHERE id = ?
		`, [id]);

        return rows[0];
    }
};

module.exports = PieceJointe;
