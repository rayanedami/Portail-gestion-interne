const db = require("../config/db");

const Validation = {

    async decide(data) {
        const connection = await db.getConnection();

        try {
            const { demande_id, responsable_id, niveau, decision, commentaire } = data;
            const niveauActuel = Number(niveau);
            const decisionFinale = String(decision).toUpperCase();
            const [demandes] = await connection.query(
                "SELECT id, statut FROM demande WHERE id = ? FOR UPDATE",
                [demande_id]
            );

            if (demandes.length === 0) {
                throw new Error("Demande introuvable");
            }

            await connection.beginTransaction();
            await connection.query(
                `INSERT INTO validation
                (demande_id, responsable_id, niveau, decision, commentaire, date_validation)
                VALUES (?, ?, ?, ?, ?, NOW())`,
                [demande_id, responsable_id, niveauActuel, decisionFinale, commentaire || null]
            );

            const statut = decisionFinale === "REFUSEE"
                ? "REFUSEE"
                : niveauActuel >= 2 ? "VALIDEE" : "EN_ATTENTE";
            await connection.query(
                "UPDATE demande SET statut = ? WHERE id = ?",
                [statut, demande_id]
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