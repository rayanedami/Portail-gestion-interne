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

    async createWorkflow(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const { motif, collaborateur_id, type_demande_id } = data;
            const [result] = await connection.query(
                `INSERT INTO demande (motif, collaborateur_id, type_demande_id)
                 VALUES (?, ?, ?)`,
                [motif, collaborateur_id, type_demande_id]
            );
            const demandeId = result.insertId;
            const [responsables] = await connection.query(
                `SELECT u.id FROM utilisateur u
                 JOIN role r ON r.id = u.role_id
                 WHERE r.nom = 'RESPONSABLE' AND u.actif = 1
                 ORDER BY u.id LIMIT 1`
            );
            if (responsables.length > 0) {
                await connection.query(
                    `INSERT INTO validation
                     (demande_id, responsable_id, niveau, decision)
                     VALUES (?, ?, 1, 'EN_ATTENTE')`,
                    [demandeId, responsables[0].id]
                );
            }
            await connection.commit();
            return this.getById(demandeId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
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

    async getAll(auth, filters = {}) {
        const clauses = [];
        const params = [];
        if (auth?.role === "COLLABORATEUR") { clauses.push("d.collaborateur_id = ?"); params.push(auth.id); }
        if (filters.type) { clauses.push("d.type_demande_id = ?"); params.push(filters.type); }
        if (filters.statut) { clauses.push("d.statut = ?"); params.push(filters.statut); }
        if (filters.collaborateur) { clauses.push("d.collaborateur_id = ?"); params.push(filters.collaborateur); }
        if (filters.departement) { clauses.push("u.departement_id = ?"); params.push(filters.departement); }
        if (filters.date) { clauses.push("DATE(d.date_soumission) = ?"); params.push(filters.date); }
        if (filters.from) { clauses.push("DATE(d.date_soumission) >= ?"); params.push(filters.from); }
        if (filters.to) { clauses.push("DATE(d.date_soumission) <= ?"); params.push(filters.to); }
        if (filters.search) {
            clauses.push("(d.motif LIKE ? OR t.nom LIKE ? OR u.nom LIKE ? OR u.prenom LIKE ?)");
            params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
        const [rows] = await db.query(`
            SELECT
                d.id,
                d.date_soumission,
                d.motif,
                d.statut,
                d.collaborateur_id,
                d.type_demande_id,
                t.nom AS nom_type,
                CONCAT(u.prenom, ' ', u.nom) AS collaborateur_nom
            FROM demande d
            JOIN type_demande t ON t.id = d.type_demande_id
            JOIN utilisateur u ON u.id = d.collaborateur_id
            ${where}
            ORDER BY d.id DESC
        `, params);

        return rows;
    },

    async getById(id, auth) {
        const ownerClause = auth?.role === "COLLABORATEUR"
            ? "AND d.collaborateur_id = ?"
            : "";
        const params = auth?.role === "COLLABORATEUR" ? [id, auth.id] : [id];
        const [rows] = await db.query(`
            SELECT
                d.id,
                d.date_soumission,
                d.motif,
                d.statut,
                d.collaborateur_id,
                d.type_demande_id,
                t.nom AS nom_type
            FROM demande d
            JOIN type_demande t ON t.id = d.type_demande_id
            WHERE d.id = ? ${ownerClause}
        `, params);

        return rows[0];
    }
};

module.exports = Demande;