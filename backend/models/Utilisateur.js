const db = require("../config/db");

const Utilisateur = {

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                u.id, u.nom, u.prenom, u.email, u.telephone, u.actif,
                u.date_creation, u.role_id, u.departement_id,
                r.nom AS role_nom,
                d.nom AS departement_nom
            FROM utilisateur u
            JOIN role r ON r.id = u.role_id
            LEFT JOIN departement d ON d.id = u.departement_id
            ORDER BY u.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(
            `SELECT
                     u.id, u.nom, u.prenom, u.email, u.telephone, u.actif,
                     u.date_creation, u.role_id, u.departement_id,
                     r.nom AS role_nom,
                     d.nom AS departement_nom
                 FROM utilisateur u
                 JOIN role r ON r.id = u.role_id
                 LEFT JOIN departement d ON d.id = u.departement_id
                 WHERE u.id = ?`,
            [id]
        );

        return rows[0];
    },

    async updateAdmin(id, data) {
        const { nom, prenom, email, telephone, actif, role_id, departement_id } = data;
        const [result] = await db.query(
            `UPDATE utilisateur
             SET nom = ?, prenom = ?, email = ?, telephone = ?, actif = ?, role_id = ?, departement_id = ?
             WHERE id = ?`,
            [nom, prenom, email, telephone || null, actif ? 1 : 0, role_id, departement_id || null, id]
        );
        return result.affectedRows > 0 ? this.getById(id) : null;
    }
};

module.exports = Utilisateur;