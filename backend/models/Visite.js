const db = require("../config/db");

const Visite = {
    async create(data) {
        const { date_entree, date_sortie, statut = "EN_COURS", rendez_vous_id, agent_accueil_id } = data;

        if (!["EN_ATTENTE", "EN_COURS", "TERMINEE", "ANNULEE"].includes(statut)) {
            throw new Error("Statut de visite invalide");
        }
        if (statut === "EN_COURS" && !date_entree) {
            throw new Error("Une date d'entrée est obligatoire pour une visite en cours");
        }
        if (statut === "TERMINEE" && !date_sortie) {
            throw new Error("Une date de sortie est obligatoire pour une visite terminée");
        }

        const [result] = await db.query(
            `INSERT INTO visite (date_entree, date_sortie, statut, rendez_vous_id, agent_accueil_id)
             VALUES (?, ?, ?, ?, ?)`,
            [date_entree, date_sortie, statut, rendez_vous_id, agent_accueil_id]
        );
        return this.getById(result.insertId);
    },

    async update(id, data) {
        const { date_entree, date_sortie, statut, rendez_vous_id, agent_accueil_id } = data;
        if (!["EN_ATTENTE", "EN_COURS", "TERMINEE", "ANNULEE"].includes(statut)) {
            throw new Error("Statut de visite invalide");
        }
        if (statut === "EN_COURS" && !date_entree) {
            throw new Error("Une date d'entrée est obligatoire pour une visite en cours");
        }
        if (statut === "TERMINEE" && !date_sortie) {
            throw new Error("Une date de sortie est obligatoire pour une visite terminée");
        }

        await db.query(
            `UPDATE visite
             SET date_entree = ?, date_sortie = ?, statut = ?, rendez_vous_id = ?, agent_accueil_id = ?
             WHERE id = ?`,
            [date_entree, date_sortie, statut, rendez_vous_id, agent_accueil_id, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query("DELETE FROM visite WHERE id = ?", [id]);
        return result.affectedRows > 0;
    },

    async findOpenByRendezVousId(rendezVousId) {
        const [rows] = await db.query(
            "SELECT id FROM visite WHERE rendez_vous_id = ? AND statut = 'EN_COURS' LIMIT 1",
            [rendezVousId]
        );
        return rows[0];
    },

    async getAll(filters = {}) {
        const clauses = [];
        const params = [];
        if (filters.visiteur) {
            clauses.push("(vis.nom LIKE ? OR vis.prenom LIKE ?)");
            params.push(`%${filters.visiteur}%`, `%${filters.visiteur}%`);
        }
        if (filters.date) { clauses.push("DATE(v.date_entree) = ?"); params.push(filters.date); }
        if (filters.from) { clauses.push("DATE(v.date_entree) >= ?"); params.push(filters.from); }
        if (filters.to) { clauses.push("DATE(v.date_entree) <= ?"); params.push(filters.to); }
        if (filters.statut) { clauses.push("v.statut = ?"); params.push(filters.statut); }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

        const [rows] = await db.query(`
            SELECT v.id, v.date_entree, v.date_sortie, v.statut,
                   v.rendez_vous_id, v.agent_accueil_id,
                   r.date_rendez_vous, r.heure_rendez_vous, r.motif,
                   r.statut AS rendez_vous_statut,
                   vis.id AS visiteur_id, vis.nom AS visiteur_nom,
                   vis.prenom AS visiteur_prenom, vis.email AS visiteur_email,
                   vis.telephone AS visiteur_telephone, vis.societe AS visiteur_societe,
                   u.nom AS agent_nom, u.prenom AS agent_prenom
            FROM visite v
            INNER JOIN rendez_vous r ON v.rendez_vous_id = r.id
            INNER JOIN visiteur vis ON r.visiteur_id = vis.id
            LEFT JOIN utilisateur u ON v.agent_accueil_id = u.id
            ${where}
            ORDER BY v.id DESC
        `, params);
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT v.id, v.date_entree, v.date_sortie, v.statut,
                   v.rendez_vous_id, v.agent_accueil_id,
                   r.date_rendez_vous, r.heure_rendez_vous, r.motif,
                   r.statut AS rendez_vous_statut,
                   vis.id AS visiteur_id, vis.nom AS visiteur_nom,
                   vis.prenom AS visiteur_prenom, vis.email AS visiteur_email,
                   vis.telephone AS visiteur_telephone, vis.societe AS visiteur_societe,
                   u.nom AS agent_nom, u.prenom AS agent_prenom
            FROM visite v
            INNER JOIN rendez_vous r ON v.rendez_vous_id = r.id
            INNER JOIN visiteur vis ON r.visiteur_id = vis.id
            LEFT JOIN utilisateur u ON v.agent_accueil_id = u.id
            WHERE v.id = ?
        `, [id]);
        return rows[0];
    }
};

module.exports = Visite;
