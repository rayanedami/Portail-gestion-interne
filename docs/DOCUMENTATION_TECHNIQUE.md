# Documentation technique

## 1. Architecture

Le portail est une application web en deux couches :

- `frontend/` : React, Vite, React Router et Axios.
- `backend/` : Node.js, Express, JWT, bcrypt, Multer, Nodemailer et MySQL.
- `database/` : schéma SQL, migrations et sauvegardes.

Le frontend appelle l'API sur `http://localhost:3000/api`. Les routes API protégées utilisent un token JWT transmis dans l'en-tête `Authorization`.

## 2. Modules métier

- Utilisateurs, rôles et profils.
- Demandes administratives et pièces jointes.
- Validation multi-niveau.
- Visiteurs et rendez-vous.
- Badges QR, scanner et visites.
- Notifications internes et email optionnel.
- Logs et statistiques personnalisées.

## 3. Sécurité

- Mots de passe hachés avec bcrypt.
- Authentification JWT.
- Autorisations par rôle côté backend.
- Un collaborateur ne peut modifier que ses demandes.
- Le niveau 2 de validation nécessite l'approbation du niveau 1.
- Les logs sont append-only : ils ne sont pas modifiables ni supprimables par l'API.
- Les notifications métier sont créées par les services internes, pas par un utilisateur arbitraire.

## 4. Configuration

Variables backend principales :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=portail_services
JWT_SECRET=...
PORT=3000
```

Email métier optionnel :

```env
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
SMTP_SECURE=false
```

Sans configuration SMTP, les notifications internes restent actives.

## 5. Démarrage

```powershell
cd backend
npm install
node server.js
```

Dans un autre terminal :

```powershell
cd frontend
npm install
npm run dev
```

## 6. Validation

```powershell
cd backend
npm test

cd ..\frontend
npm run build
```

## 7. Exports

Les écrans Demandes, Visiteurs, Visites, Utilisateurs et Logs exportent de vrais fichiers `.xlsx`. Les exports PDF utilisent l'impression structurée existante.
