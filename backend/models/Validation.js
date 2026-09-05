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

            await connection.commit();
            return {
                demande_id,
                collaborateur_id: demandes[0].collaborateur_id,
                niveau: niveauActuel,
                decision: decisionFinale,
                statut
            };
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

        if (!Number.isInteger(Number(niveau)) || Number(niveau) < 1 || Number(niveau) > 2) {
            throw new Error("Niveau de validation invalide");
        }
        if (!["EN_ATTENTE", "APPROUVEE", "REFUSEE"].includes(String(decision).toUpperCase())) {
            throw new Error("Décision de validation invalide");
        }

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

        if (!Number.isInteger(Number(niveau)) || Number(niveau) < 1 || Number(niveau) > 2) {
            throw new Error("Niveau de validation invalide");
        }
        if (!["EN_ATTENTE", "APPROUVEE", "REFUSEE"].includes(String(decision).toUpperCase())) {
            throw new Error("Décision de validation invalide");
        }

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
                v.responsable_id,
                CONCAT(collab.prenom, ' ', collab.nom) AS collaborateur_nom,
                t.nom AS type_demande_nom,
                CONCAT(resp.prenom, ' ', resp.nom) AS responsable_nom
            FROM validation v
            JOIN demande d ON d.id = v.demande_id
            JOIN utilisateur collab ON collab.id = d.collaborateur_id
            JOIN type_demande t ON t.id = d.type_demande_id
            JOIN utilisateur resp ON resp.id = v.responsable_id
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
                v.responsable_id,
                CONCAT(collab.prenom, ' ', collab.nom) AS collaborateur_nom,
                t.nom AS type_demande_nom,
                CONCAT(resp.prenom, ' ', resp.nom) AS responsable_nom
            FROM validation v
            JOIN demande d ON d.id = v.demande_id
            JOIN utilisateur collab ON collab.id = d.collaborateur_id
            JOIN type_demande t ON t.id = d.type_demande_id
            JOIN utilisateur resp ON resp.id = v.responsable_id
            WHERE v.id = ?
        `, [id]);

        return rows[0];
    }
};

module.exports = Validation;