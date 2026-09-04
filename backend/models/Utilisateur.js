const db = require("../config/db");

const Utilisateur = {

    async getAll(filters = {}) {
        const clauses = [];
        const params = [];
        if (filters.nom) { clauses.push("(u.nom LIKE ? OR u.prenom LIKE ?)"); params.push(`%${filters.nom}%`, `%${filters.nom}%`); }
        if (filters.email) { clauses.push("u.email LIKE ?"); params.push(`%${filters.email}%`); }
        if (filters.role) { clauses.push("u.role_id = ?"); params.push(filters.role); }
        if (filters.departement) { clauses.push("u.departement_id = ?"); params.push(filters.departement); }
        if (filters.statut) { clauses.push("u.actif = ?"); params.push(filters.statut === "ACTIF" ? 1 : 0); }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
        const [rows] = await db.query(`
            SELECT
                u.id, u.nom, u.prenom, u.email, u.telephone, u.actif,
                u.date_creation, u.role_id, u.departement_id,
                r.nom AS role_nom,
                d.nom AS departement_nom
            FROM utilisateur u
            JOIN role r ON r.id = u.role_id
            LEFT JOIN departement d ON d.id = u.departement_id
            ${where}
            ORDER BY u.id DESC
        `, params);

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