const db = require("../config/db");

module.exports = {
    async getAll() {
        const [rows] = await db.query("SELECT id, nom, description FROM role ORDER BY nom");
        return rows;
    }
};