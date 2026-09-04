const crypto = require("crypto");
const db = require("../config/db");

const Badge = {

    async create(data) {
        const {
            qr_code,
            date_generation,
            date_expiration,
            statut,
            rendez_vous_id
        } = data;

        const rendezVous = await this.getRendezVous(rendez_vous_id);
        const expiration = date_expiration || this.getExpiration(rendezVous);

        const [result] = await db.query(
            `INSERT INTO badge
            (qr_code, date_generation, date_expiration, statut, rendez_vous_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
                qr_code || this.createQrValue(),
                date_generation || new Date(),
                expiration,
                ["VALIDE", "EXPIRE", "UTILISE"].includes(statut) ? statut : "VALIDE",
                rendez_vous_id
            ]
        );

        return this.getById(result.insertId);
    },

    async createForRendezVous(rendezVousId) {
        const existing = await this.getByRendezVousId(rendezVousId);
        if (existing) return existing;

        return this.create({
            qr_code: this.createQrValue(),
            rendez_vous_id: rendezVousId,
            statut: "VALIDE"
        });
    },

    createQrValue() {
        return `PORTAIL-BADGE-${crypto.randomUUID()}`;
    },

    getExpiration(rendezVous) {
        const expiration = new Date(rendezVous.date_rendez_vous);
        const [hours, minutes, seconds = "0"] = String(rendezVous.heure_rendez_vous)
            .split(":");
        expiration.setHours(Number(hours), Number(minutes), Number(seconds), 0);
        expiration.setHours(expiration.getHours() + 2);
        return expiration;
    },

    async getRendezVous(id) {
        const [rows] = await db.query(
            `SELECT id, date_rendez_vous, heure_rendez_vous
             FROM rendez_vous
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            throw new Error("Le rendez-vous associé au badge n'existe pas.");
        }
        return rows[0];
    },

    async getByRendezVousId(id) {
        await this.expireBadges();
        const [rows] = await db.query(
            `SELECT id, qr_code, date_generation, date_expiration, statut, rendez_vous_id
             FROM badge
             WHERE rendez_vous_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [id]
        );
        return rows[0];
    },

    async expireBadges() {
        await db.query(
            `UPDATE badge
             SET statut = 'EXPIRE'
             WHERE statut = 'VALIDE' AND date_expiration <= NOW()`
        );
    },

    async update(id, data) {
        const {
            qr_code,
            date_generation,
            date_expiration,
            statut,
            rendez_vous_id
        } = data;

        const rendezVous = await this.getRendezVous(rendez_vous_id);

        await db.query(
            `UPDATE badge
             SET qr_code = ?,
                 date_generation = ?,
                 date_expiration = ?,
                 statut = ?,
                 rendez_vous_id = ?
             WHERE id = ?`,
            [
                qr_code || this.createQrValue(),
                date_generation || new Date(),
                date_expiration || this.getExpiration(rendezVous),
                ["VALIDE", "EXPIRE", "UTILISE"].includes(statut) ? statut : "VALIDE",
                rendez_vous_id,
                id
            ]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM badge WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll(auth) {
        await this.expireBadges();
        const visitorFilter = auth?.role === "VISITEUR"
            ? "WHERE u.id = ?"
            : "";
        const params = auth?.role === "VISITEUR" ? [auth.id] : [];
        const [rows] = await db.query(`
            SELECT
                b.id,
                b.qr_code,
                b.date_generation,
                b.date_expiration,
                b.statut,
                b.rendez_vous_id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                CONCAT(v.prenom, ' ', v.nom) AS visiteur_nom
            FROM badge b
            JOIN rendez_vous r ON r.id = b.rendez_vous_id
            LEFT JOIN visiteur v ON v.id = r.visiteur_id
            LEFT JOIN utilisateur u ON u.id = v.utilisateur_id
            ${visitorFilter}
            ORDER BY b.id DESC
        `, params);

        return rows;
    },

    async getById(id, auth) {
        await this.expireBadges();
        const visitorFilter = auth?.role === "VISITEUR"
            ? "AND u.id = ?"
            : "";
        const params = auth?.role === "VISITEUR" ? [id, auth.id] : [id];
        const [rows] = await db.query(`
            SELECT
                b.id,
                b.qr_code,
                b.date_generation,
                b.date_expiration,
                b.statut,
                b.rendez_vous_id,
                r.date_rendez_vous,
                r.heure_rendez_vous,
                CONCAT(v.prenom, ' ', v.nom) AS visiteur_nom
            FROM badge b
            JOIN rendez_vous r ON r.id = b.rendez_vous_id
            LEFT JOIN visiteur v ON v.id = r.visiteur_id
            LEFT JOIN utilisateur u ON u.id = v.utilisateur_id
            WHERE b.id = ? ${visitorFilter}
        `, params);

        return rows[0];
    }
};

module.exports = Badge;