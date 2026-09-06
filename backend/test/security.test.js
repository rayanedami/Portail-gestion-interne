const test = require("node:test");
const assert = require("node:assert/strict");
const { createToken, requireAuth, requireRoles } = require("../middleware/auth");
const Badge = require("../models/Badge");

function responseDouble() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

test("createToken et requireAuth acceptent un utilisateur authentifié", () => {
    const token = createToken({ id: 42, role: "COLLABORATEUR" });
    const request = { headers: { authorization: `Bearer ${token}` } };
    const response = responseDouble();
    let called = false;

    requireAuth(request, response, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(request.auth.id, 42);
    assert.equal(request.auth.role, "COLLABORATEUR");
});

test("requireAuth refuse un token absent", () => {
    const response = responseDouble();
    let called = false;

    requireAuth({ headers: {} }, response, () => {
        called = true;
    });

    assert.equal(called, false);
    assert.equal(response.statusCode, 401);
});

test("requireRoles refuse un rôle non autorisé", () => {
    const response = responseDouble();
    let called = false;

    requireRoles("ADMINISTRATEUR")({ auth: { id: 42, role: "VISITEUR" } }, response, () => {
        called = true;
    });

    assert.equal(called, false);
    assert.equal(response.statusCode, 403);
});

test("requireRoles accepte le rôle attendu", () => {
    const response = responseDouble();
    let called = false;

    requireRoles("RESPONSABLE")({ auth: { id: 42, role: "RESPONSABLE" } }, response, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(response.statusCode, 200);
});

test("un badge QR possède un identifiant unique préfixé", () => {
    const qrCode = Badge.createQrValue();

    assert.match(qrCode, /^PORTAIL-BADGE-[0-9a-f-]{36}$/);
});

test("l'expiration d'un badge est fixée deux heures après le rendez-vous", () => {
    const expiration = Badge.getExpiration({
        date_rendez_vous: "2026-09-07",
        heure_rendez_vous: "14:30:00"
    });

    assert.equal(expiration.getHours(), 16);
    assert.equal(expiration.getMinutes(), 30);
});
