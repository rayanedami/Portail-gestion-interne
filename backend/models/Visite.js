const db = require("../config/db");

const Visite = {

    async create(data) {
        const {
            date_entree,
            date_sortie,
            statut = "EN_COURS",
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
                ["EN_ATTENTE", "PREVUE", "EN_COURS", "TERMINEE", "ANNULEE"].includes(statut)
                    ? (statut === "EN_ATTENTE" ? "PREVUE" : statut)
                    : "EN_COURS",
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
                statut === "EN_ATTENTE" ? "PREVUE" : statut,
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

    async findOpenByRendezVousId(rendezVousId) {
        const [rows] = await db.query(
            `SELECT id FROM visite
             WHERE rendez_vous_id = ? AND statut = 'EN_COURS'
             LIMIT 1`,
            [rendezVousId]
        );
        return rows[0];
    },

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.date_entree,
                v.date_sortie,
                CASE WHEN v.statut = 'PREVUE' THEN 'EN_ATTENTE' ELSE v.statut END AS statut,

                v.rendez_vous_id,
                v.agent_accueil_id,

                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut AS rendez_vous_statut,

                vis.id AS visiteur_id,
                vis.nom AS visiteur_nom,
                vis.prenom AS visiteur_prenom,
                vis.email AS visiteur_email,
                vis.telephone AS visiteur_telephone,
                vis.societe AS visiteur_societe,

                u.nom AS agent_nom,
                u.prenom AS agent_prenom

            FROM visite v

            INNER JOIN rendez_vous r
                ON v.rendez_vous_id = r.id

            INNER JOIN visiteur vis
                ON r.visiteur_id = vis.id

            LEFT JOIN utilisateur u
                ON v.agent_accueil_id = u.id

            ORDER BY v.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.date_entree,
                v.date_sortie,
                CASE WHEN v.statut = 'PREVUE' THEN 'EN_ATTENTE' ELSE v.statut END AS statut,

                v.rendez_vous_id,
                v.agent_accueil_id,

                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut AS rendez_vous_statut,

                vis.id AS visiteur_id,
                vis.nom AS visiteur_nom,
                vis.prenom AS visiteur_prenom,
                vis.email AS visiteur_email,
                vis.telephone AS visiteur_telephone,
                vis.societe AS visiteur_societe,

                u.nom AS agent_nom,
                u.prenom AS agent_prenom

            FROM visite v

            INNER JOIN rendez_vous r
                ON v.rendez_vous_id = r.id

            INNER JOIN visiteur vis
                ON r.visiteur_id = vis.id

            LEFT JOIN utilisateur u
                ON v.agent_accueil_id = u.id

            WHERE v.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Visite;