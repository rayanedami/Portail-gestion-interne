const test = require("node:test");
const assert = require("node:assert/strict");
const db = require("../config/db");
const Demande = require("../models/Demande");
const Validation = require("../models/Validation");
const RendezVous = require("../models/RendezVous");
const Visiteur = require("../models/Visiteur");

function withFakeQuery(handler, callback) {
    const originalQuery = db.query;
    db.query = handler;
    return Promise.resolve()
        .then(callback)
        .finally(() => {
            db.query = originalQuery;
        });
}

test("les demandes d'un collaborateur sont filtrées par propriétaire et critères", async () => {
    let captured;

    await withFakeQuery(async (sql, params) => {
        captured = { sql, params };
        return [[]];
    }, async () => {
        const result = await Demande.getAll(
            { id: 7, role: "COLLABORATEUR" },
            { statut: "EN_ATTENTE", from: "2026-09-01", to: "2026-09-30" }
        );

        assert.deepEqual(result, []);
    });

    assert.match(captured.sql, /d\.collaborateur_id = \?/);
    assert.match(captured.sql, /d\.statut = \?/);
    assert.match(captured.sql, /DATE\(d\.date_soumission\) >= \?/);
    assert.match(captured.sql, /DATE\(d\.date_soumission\) <= \?/);
    assert.deepEqual(captured.params, [7, "EN_ATTENTE", "2026-09-01", "2026-09-30"]);
});

test("les rendez-vous d'un visiteur sont limités à son identité", () => {
    assert.deepEqual(RendezVous.ownerFilter({ id: 12, role: "VISITEUR" }), {
        clause: "(v.utilisateur_id = ? OR v.email = (SELECT email FROM utilisateur WHERE id = ?))",
        params: [12, 12]
    });
});

test("les rendez-vous d'un collaborateur sont limités à ses rendez-vous", () => {
    assert.deepEqual(RendezVous.ownerFilter({ id: 4, role: "COLLABORATEUR" }), {
        clause: "r.collaborateur_id = ?",
        params: [4]
    });
    assert.equal(RendezVous.ownerFilter({ id: 1, role: "ADMINISTRATEUR" }), null);
});

test("les visiteurs connectés sont filtrés par utilisateur", async () => {
    const queries = [];

    await withFakeQuery(async (sql, params) => {
        queries.push({ sql, params });
        return [[]];
    }, async () => {
        const result = await Visiteur.getAll({ id: 21, role: "VISITEUR" });
        assert.deepEqual(result, []);
    });

    assert.equal(queries.length, 2);
    assert.match(queries[0].sql, /UPDATE visiteur/);
    assert.deepEqual(queries[0].params, [21]);
    assert.match(queries[1].sql, /v\.utilisateur_id = \?/);
    assert.deepEqual(queries[1].params, [21]);
});

test("une validation refuse un niveau hors workflow", async () => {
    await assert.rejects(
        Validation.create({
            demande_id: 1,
            responsable_id: 2,
            niveau: 3,
            decision: "EN_ATTENTE"
        }),
        { message: "Niveau de validation invalide" }
    );
});

test("une validation refuse une décision inconnue", async () => {
    await assert.rejects(
        Validation.create({
            demande_id: 1,
            responsable_id: 2,
            niveau: 1,
            decision: "ANNULEE"
        }),
        { message: "Décision de validation invalide" }
    );
});

test("une validation accepte les décisions métier valides", async () => {
    const queries = [];

    await withFakeQuery(async (sql, params) => {
        queries.push({ sql, params });
        return queries.length === 1
            ? [{ insertId: 9 }]
            : [[{ id: 9, demande_id: 1, niveau: 1, decision: "APPROUVEE" }]];
    }, async () => {
        const validation = await Validation.create({
            demande_id: 1,
            responsable_id: 2,
            niveau: 1,
            decision: "APPROUVEE",
            commentaire: "D'accord"
        });

        assert.equal(validation.id, 9);
        assert.equal(validation.decision, "APPROUVEE");
    });

    assert.match(queries[0].sql, /INSERT INTO validation/);
    assert.deepEqual(queries[0].params.slice(0, 4), [1, 2, 1, "APPROUVEE"]);
});
