const bcrypt = require("bcrypt");
const db = require("./config/db");

async function resetAndHashPasswords() {
    try {
        console.log("🔄 Resetting passwords and hashing them correctly...\n");

        // Define users with their plain passwords
        const userData = [
            { id: 1, mot_de_passe: "123456" },
            { id: 2, mot_de_passe: "123456" },
            { id: 3, mot_de_passe: "123456" },
            { id: 4, mot_de_passe: "123456" }
        ];

        for (const user of userData) {
            const hash = await bcrypt.hash(user.mot_de_passe, 10);
            console.log(`User ID ${user.id}: Hashing "123456" → ${hash.substring(0, 50)}...`);

            await db.query(
                "UPDATE utilisateur SET mot_de_passe = ? WHERE id = ?",
                [hash, user.id]
            );
        }

        console.log("\n✅ All passwords have been reset and properly hashed with bcrypt!");
        console.log("Test: email=rayane@portail.ma, password=123456");

        await db.end();

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

resetAndHashPasswords();
