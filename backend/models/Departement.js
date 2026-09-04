const db = require("../config/db");

const Departement = {
    async getAll() {
        const [rows] = await db.query(
            "SELECT id, nom, description FROM departement ORDER BY nom"
        );
        return rows;
    }
};

module.exports = Departement;
