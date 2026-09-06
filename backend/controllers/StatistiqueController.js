const db = require("../config/db");

const StatistiqueController = {
    async getDashboard(req, res) {
        try {
            const role = req.auth.role;
            const userId = req.auth.id;
            const demandeFilter = role === "COLLABORATEUR" ? "WHERE d.collaborateur_id = ?" : "";
            const demandeParams = role === "COLLABORATEUR" ? [userId] : [];
            const rendezVousFilter = ["COLLABORATEUR", "RESPONSABLE"].includes(role)
                ? "WHERE r.collaborateur_id = ?"
                : role === "VISITEUR"
                    ? "WHERE (v.utilisateur_id = ? OR (v.utilisateur_id IS NULL AND v.email = (SELECT email FROM utilisateur WHERE id = ?)))"
                    : "";
            const rendezVousParams = role === "COLLABORATEUR" || role === "RESPONSABLE"
                ? [userId]
                : role === "VISITEUR" ? [userId, userId] : [];

            const [[demandes], [visites], [rendezVous]] = await Promise.all([
                db.query(`
                    SELECT
                        COUNT(*) AS total,
                        SUM(d.statut = 'EN_ATTENTE') AS en_attente,
                        SUM(d.statut = 'ACCEPTEE') AS acceptees,
                        SUM(d.statut = 'REFUSEE') AS refusees
                    FROM demande d ${demandeFilter}
                `, demandeParams),
                db.query(`
                    SELECT
                        COUNT(*) AS total,
                        SUM(v.statut = 'EN_COURS') AS visiteurs_presents,
                        SUM(v.statut IN ('TERMINEE', 'SORTI')) AS terminees
                    FROM visite v
                    JOIN rendez_vous r ON r.id = v.rendez_vous_id
                    ${role === "VISITEUR" ? "JOIN visiteur vi ON vi.id = r.visiteur_id WHERE vi.utilisateur_id = ?" : ""}
                `, role === "VISITEUR" ? [userId] : []),
                db.query(`
                    SELECT
                        COUNT(*) AS total,
                        SUM(r.statut = 'CONFIRME') AS confirmees,
                        SUM(r.statut = 'ANNULE') AS annulees,
                        SUM(DATE(r.date_rendez_vous) = CURDATE()) AS aujourd_hui
                    FROM rendez_vous r
                    LEFT JOIN visiteur v ON v.id = r.visiteur_id
                    ${rendezVousFilter}
                `, rendezVousParams)
            ]);

            let roles = [];
            if (role === "ADMINISTRATEUR") {
                const [roleRows] = await db.query(`
                    SELECT r.nom AS role, COUNT(u.id) AS total
                    FROM role r
                    LEFT JOIN utilisateur u ON u.role_id = r.id AND u.actif = 1
                    GROUP BY r.id, r.nom
                    ORDER BY r.nom
                `);
                roles = roleRows;
            }

            return res.json({
                role,
                demandes: demandes[0],
                visites: visites[0],
                rendezVous: rendezVous[0],
                roles
            });
        } catch (error) {
            console.error("Erreur statistiques dashboard :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = StatistiqueController;
