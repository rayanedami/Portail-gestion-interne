const bcrypt = require("bcrypt");
const db = require("./config/db");

async function debugLogin() {
    try {
        console.log("🔍 Fetching users from database...");

        const [users] = await db.query(
            "SELECT id, nom, prenom, email, mot_de_passe FROM utilisateur LIMIT 5"
        );

        console.log("\n📋 Users in database:");
        for (const user of users) {
            console.log(`  ID: ${user.id}, Name: ${user.prenom} ${user.nom}, Email: ${user.email}`);
            console.log(`  Password hash (first 50 chars): ${String(user.mot_de_passe).substring(0, 50)}...`);
            console.log(`  Password hash length: ${String(user.mot_de_passe).length}`);

            // Try comparing with "123456"
            const isMatch = await bcrypt.compare("123456", user.mot_de_passe);
            console.log(`  ✓ bcrypt.compare("123456", hash) = ${isMatch}`);
            console.log("---");
        }

        console.log("\n✅ Debug complete. Check if password hashes are valid and comparisons work.");

        await db.end();

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

debugLogin();
