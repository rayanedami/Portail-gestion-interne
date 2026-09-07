const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "portail-dev-secret";

function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Authentification requise" });
    }

    try {
        req.auth = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
}

function requireRoles(...roles) {
    return (req, res, next) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ message: "Accès interdit" });
        }
        next();
    };
}

function createToken(utilisateur) {
    return jwt.sign(
        { id: utilisateur.id, role: utilisateur.role },
        JWT_SECRET,
        { expiresIn: "8h" }
    );
}

module.exports = { requireAuth, requireRoles, createToken };
