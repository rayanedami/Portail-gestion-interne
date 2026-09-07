# Guide d'installation et de test

## 1. Prerequis

- Node.js 20 ou plus recent
- npm
- MySQL 8 ou compatible
- Un navigateur web moderne

## 2. Installation de la base de donnees

1. Creer ou ouvrir MySQL.
2. Executer le fichier `database/portail_services.sql`.
3. Verifier que la base `portail_services` et ses tables ont ete creees.

Le script contient les tables, les relations et les donnees de reference necessaires : roles, departements et types de demandes.

## Comptes de test

Le script SQL cree les comptes de demonstration suivants. Le mot de passe est `123456` pour tous les comptes :

| Role | Email | Mot de passe |
| --- | --- | --- |
| Collaborateur | `rayane@portail.ma` | `123456` |
| Responsable | `responsable@portail.ma` | `123456` |
| Administrateur | `admin@portail.ma` | `123456` |
| Agent d'accueil | `accueil@portail.ma` | `123456` |
| Visiteur | `visiteur@portail.ma` | `123456` |

Ces comptes sont uniquement destines aux tests et doivent etre modifies ou supprimes dans un environnement reel.

## 3. Configuration du backend

1. Ouvrir le dossier `backend`.
2. Copier `.env.example` vers `.env`.
3. Adapter les valeurs de connexion MySQL.
4. Installer les dependances :

```powershell
cd backend
npm install
```

5. Demarrer l'API :

```powershell
node server.js
```

L'API est disponible sur `http://localhost:3000`.

Verification rapide : ouvrir `http://localhost:3000/` dans le navigateur. La reponse doit confirmer que l'API fonctionne.

## 4. Installation et demarrage du frontend

Dans un autre terminal :

```powershell
cd frontend
npm install
npm run dev
```

Ouvrir l'adresse affichee par Vite, generalement `http://localhost:5173`.

## 5. Tests

### Tests backend

```powershell
cd backend
npm test
```

Les tests verifient l'authentification, les permissions, les demandes, les validations, les visiteurs, les rendez-vous et les badges QR.

### Verification de compilation frontend

```powershell
cd frontend
npm run build
```

### Verification fonctionnelle

Tester avec les profils suivants :

- Visiteur : inscription, rendez-vous et badge QR.
- Collaborateur : creation et suivi d'une demande.
- Responsable : validation ou refus d'une demande.
- Agent d'accueil : visiteurs, badges, scanner QR et entrees/sorties.
- Administrateur : utilisateurs, roles, departements, statistiques, logs et exports.

## 6. Arret des serveurs

Dans le terminal de chaque serveur, utiliser `Ctrl+C`.

## 7. Fichiers exclus de la livraison

Les dependances, fichiers generes, variables secretes, sauvegardes et outils de diagnostic ne sont pas inclus. Ils sont recrees avec `npm install` et la configuration `.env` locale.
