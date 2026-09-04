const db = require("../config/db");

const Validation = {

    async decide(data) {
        const connection = await db.getConnection();

        try {
            const { demande_id, responsable_id, decision, commentaire } = data;
            const decisionDemandee = String(decision).toUpperCase();
            const decisionFinale = decisionDemandee === "VALIDEE"
                ? "APPROUVEE"
                : decisionDemandee;
            if (!["APPROUVEE", "REFUSEE"].includes(decisionFinale)) {
                throw new Error("Décision de validation invalide");
            }
            await connection.beginTransaction();
            const [demandes] = await connection.query(
                "SELECT id, statut, collaborateur_id FROM demande WHERE id = ? FOR UPDATE",
                [demande_id]
            );

            if (demandes.length === 0) {
                throw new Error("Demande introuvable");
            }

            const [dernieresValidations] = await connection.query(
                `SELECT niveau, decision FROM validation
                 WHERE demande_id = ?
                 ORDER BY niveau DESC
                 LIMIT 1`,
                [demande_id]
            );
            const niveauActuel = dernieresValidations.length > 0
                ? Number(dernieresValidations[0].niveau) + 1
                : 1;
            if (niveauActuel > 2) {
                throw new Error("Cette demande a déjà terminé son workflow de validation");
            }

            await connection.query(
                `INSERT INTO validation
                (demande_id, responsable_id, niveau, decision, commentaire, date_validation)
                VALUES (?, ?, ?, ?, ?, NOW())`,
                [demande_id, responsable_id, niveauActuel, decisionFinale, commentaire || null]
            );

            const statut = decisionFinale === "REFUSEE"
                ? "REFUSEE"
                : niveauActuel >= 2 ? "ACCEPTEE" : "EN_ATTENTE";
            await connection.query(
                "UPDATE demande SET statut = ? WHERE id = ?",
                [statut, demande_id]
            );

            const message = decisionFinale === "REFUSEE"
                ? `Votre demande #${demande_id} a été refusée.`
                : statut === "ACCEPTEE"
                    ? `Votre demande #${demande_id} a été acceptée.`
                    : `Votre demande #${demande_id} a été validée au niveau ${niveauActuel}.`;

            await connection.query(
                `INSERT INTO notification
                (message, type, date_envoi, est_lue, utilisateur_id, demande_id)
                VALUES (?, ?, NOW(), 0, ?, ?)`,
                [message, "VALIDATION", demandes[0].collaborateur_id, demande_id]
            );
            await connection.commit();
            return { demande_id, niveau: niveauActuel, decision: decisionFinale, statut };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async create(data) {
        const {
            demande_id,
            responsable_id,
            niveau,
            decision,
            commentaire
        } = data;

        const [result] = await db.query(
            `INSERT INTO validation
            (demande_id, responsable_id, niveau, decision, commentaire, date_validation)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                demande_id,
                responsable_id,
                niveau,
                decision,
                commentaire
            ]
        );

        return this.getById(result.insertId);
    },

    async update(id, data) {
        const {
            niveau,
            decision,
            commentaire
        } = data;

        await db.query(
            `UPDATE validation
             SET niveau = ?, decision = ?, commentaire = ?
             WHERE id = ?`,
            [niveau, decision, commentaire, id]
        );

        return this.getById(id);
    },

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM validation WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    },

    async getAll() {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.niveau,
                v.decision,
                v.commentaire,
                v.date_validation,
                v.demande_id,
                v.responsable_id
            FROM validation v
            ORDER BY v.id DESC
        `);

        return rows;
    },

    async getById(id) {
        const [rows] = await db.query(`
            SELECT
                v.id,
                v.niveau,
                v.decision,
                v.commentaire,
                v.date_validation,
                v.demande_id,
                v.responsable_id
            FROM validation v
            WHERE v.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Validation;