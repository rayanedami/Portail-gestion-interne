const db = require("../config/db");

const Log = {

    async record({ action, utilisateurId, req }) {
        if (!utilisateurId) return null;
        try {
            return await this.create({
                action,
                utilisateur_id: utilisateurId,
                adresse_ip: req?.ip || req?.socket?.remoteAddress || null
            });
        } catch (error) {
            console.error("Erreur journalisation :", error.message);
            return null;
        }
    },

    async create(data) {
        const {
            action,
            date_action = new Date(),
            adresse_ip,
            utilisateur_id
        } = data;

        const [result] = await db.query(
            `INSERT INTO log
            (action, date_action, adresse_ip, utilisateur_id)
            VALUES (?, ?, ?, ?)`,
            [
                action,
                date_action,
                adresse_ip,
                utilisateur_id
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        throw new Error("Les logs sont immuables et ne peuvent pas être modifiés");
    },

    async delete(id) {
        throw new Error("Les logs sont immuables et ne peuvent pas être supprimés");
    },

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                l.id,
                l.action,
                l.date_action,
                l.adresse_ip,
                l.utilisateur_id,
                CONCAT(u.prenom, ' ', u.nom) AS utilisateur_nom,
                u.email AS utilisateur_email
            FROM log l
            LEFT JOIN utilisateur u ON u.id = l.utilisateur_id
            ORDER BY l.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                l.id,
                l.action,
                l.date_action,
                l.adresse_ip,
                l.utilisateur_id,
                CONCAT(u.prenom, ' ', u.nom) AS utilisateur_nom,
                u.email AS utilisateur_email
            FROM log l
            LEFT JOIN utilisateur u ON u.id = l.utilisateur_id
            WHERE l.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Log;