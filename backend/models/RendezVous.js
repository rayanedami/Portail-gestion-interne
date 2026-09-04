const db = require("../config/db");

const RendezVous = {

    async create(data) {
        const {
            date_rendez_vous,
            heure_rendez_vous,
            motif,
            statut,
            visiteur_id,
            collaborateur_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO rendez_vous
            (date_rendez_vous, heure_rendez_vous, motif, statut, visiteur_id, collaborateur_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                date_rendez_vous,
                heure_rendez_vous,
                motif || null,
                statut || "PLANIFIE",
                visiteur_id,
                collaborateur_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            date_rendez_vous,
            heure_rendez_vous,
            motif,
            statut,
            visiteur_id,
            collaborateur_id
        } = data;

        await db.query(
            `UPDATE rendez_vous
             SET date_rendez_vous = ?,
                 heure_rendez_vous = ?,
                 motif = ?,
                 statut = ?,
                 visiteur_id = ?,
                 collaborateur_id = ?
             WHERE id = ?`,
            [
                date_rendez_vous,
                heure_rendez_vous,
                motif || null,
                statut || "PLANIFIE",
                visiteur_id,
                collaborateur_id,
                id
            ]
        );

        return this.getById(id);
    },

    // Annulation logique : conserve l'historique et évite de casser les badges/visites liés.
    async cancel(id) {
        await db.query(
            `UPDATE rendez_vous SET statut = 'ANNULE' WHERE id = ?`,
            [id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM rendez_vous WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    ownerFilter(auth, alias = "r") {
        if (auth?.role === "VISITEUR") {
            return { clause: "v.utilisateur_id = ?", params: [auth.id] };
        }
        if (auth?.role === "COLLABORATEUR" || auth?.role === "RESPONSABLE") {
            return { clause: `${alias}.collaborateur_id = ?`, params: [auth.id] };
        }
        return null;
    },

    async getAll(auth) {
        const owner = this.ownerFilter(auth);
        const where = owner ? `WHERE ${owner.clause}` : "";
        const params = owner ? owner.params : [];

        const [rows] = await db.query(`
            SELECT
                r.id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut,
                r.visiteur_id,
                r.collaborateur_id,
                CONCAT(v.prenom, ' ', v.nom) AS visiteur_nom,
                v.telephone AS visiteur_telephone,
                v.societe AS visiteur_societe,
                CONCAT(u.prenom, ' ', u.nom) AS collaborateur_nom
            FROM rendez_vous r
            LEFT JOIN visiteur v ON v.id = r.visiteur_id
            LEFT JOIN utilisateur u ON u.id = r.collaborateur_id
            ${where}
            ORDER BY r.id DESC
        `, params);

        return rows;
    },

    async getById(id, auth) {
        const owner = this.ownerFilter(auth);
        const where = owner ? `WHERE r.id = ? AND ${owner.clause}` : "WHERE r.id = ?";
        const params = owner ? [id, ...owner.params] : [id];

        const [rows] = await db.query(`
            SELECT
                r.id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                r.motif,
                r.statut,
                r.visiteur_id,
                r.collaborateur_id,
                CONCAT(v.prenom, ' ', v.nom) AS visiteur_nom,
                v.telephone AS visiteur_telephone,
                v.societe AS visiteur_societe,
                CONCAT(u.prenom, ' ', u.nom) AS collaborateur_nom
            FROM rendez_vous r
            LEFT JOIN visiteur v ON v.id = r.visiteur_id
            LEFT JOIN utilisateur u ON u.id = r.collaborateur_id
            ${where}
        `, params);

        return rows[0];
    }
};

module.exports = RendezVous;