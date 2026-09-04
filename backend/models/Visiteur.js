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

    async getAll(auth, filters = {}) {
        const clauses = [];
        const params = [];
        if (auth?.role === "VISITEUR") { clauses.push("v.utilisateur_id = ?"); params.push(auth.id); }
        if (filters.nom) { clauses.push("v.nom LIKE ?"); params.push(`%${filters.nom}%`); }
        if (filters.prenom) { clauses.push("v.prenom LIKE ?"); params.push(`%${filters.prenom}%`); }
        if (filters.societe) { clauses.push("v.societe LIKE ?"); params.push(`%${filters.societe}%`); }
        if (filters.statut) { clauses.push("EXISTS (SELECT 1 FROM rendez_vous r WHERE r.visiteur_id = v.id AND r.statut = ?)"); params.push(filters.statut); }
        if (filters.date) { clauses.push("EXISTS (SELECT 1 FROM rendez_vous r WHERE r.visiteur_id = v.id AND DATE(r.date_rendez_vous) = ?)"); params.push(filters.date); }
        if (filters.search) { clauses.push("(v.nom LIKE ? OR v.prenom LIKE ? OR v.societe LIKE ?)"); params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
        const [rows] = await db.query(`
            SELECT
                v.id, v.utilisateur_id, v.nom, v.prenom, v.email, v.telephone, v.societe
            FROM visiteur v
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
    },

    async getHistory(id) {
        const [rows] = await db.query(`
            SELECT 'rendez-vous' AS type, r.id, r.date_rendez_vous,
                   r.heure_rendez_vous, r.statut, r.motif
            FROM rendez_vous r
            WHERE r.visiteur_id = ?
            UNION ALL
            SELECT 'visite' AS type, v.id, NULL AS date_rendez_vous,
                   NULL AS heure_rendez_vous, v.statut, NULL AS motif
            FROM visite v
            JOIN rendez_vous r ON r.id = v.rendez_vous_id
            WHERE r.visiteur_id = ?
            ORDER BY id DESC
        `, [id, id]);

        return rows;
    }

};

module.exports = Visiteur;