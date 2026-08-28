const bcrypt = require("bcrypt");
const db = require("./config/db");

async function hashPasswords() {
    try {
        const [users] = await db.query(
            "SELECT id, mot_de_passe FROM utilisateur"
        );

        for (const user of users) {
            const hash = await bcrypt.hash(user.mot_de_passe, 10);

            await db.query(
                "UPDATE utilisateur SET mot_de_passe = ? WHERE id = ?",
                [hash, user.id]
            );
        }

        console.log("Tous les mots de passe ont été sécurisés avec bcrypt.");

        await db.end();

    } catch (error) {
        console.error("Erreur :", error.message);
    }
}

hashPasswords();