# Portail-gestion-interne

Plateforme web de gestion des demandes administratives (congés, attestations, matériel, accès) et du pré-enregistrement des visiteurs avec génération de badges QR Code. Projet de stage.

## Technologies utilisées
- Backend : Node.js, Express.js
- Frontend : React, Vite, React Router
- Base de données : MySQL
- Sécurité : bcrypt et JWT

##  Fonctionnalités
-  Gestion des demandes administratives
-  Workflow de validation multi-niveaux
-  Pré-enregistrement des visiteurs
-  Génération de badges QR Code
-  Tableaux de bord personnalisés
-  Export PDF/Excel
-  Scanner QR et enregistrement des entrées/sorties
-  Gestion des rôles et permissions
-  Historique des visites, notifications et logs

##  Structure du projet

## Configuration de l'envoi d'emails

Le mot de passe oublié utilise SMTP. Renseigner ces variables dans `backend/.env` pour activer l'envoi réel des liens de réinitialisation :

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=compte@example.com
SMTP_PASS=mot-de-passe-smtp
SMTP_FROM=compte@example.com
FRONTEND_URL=http://localhost:5173
```

Ne jamais versionner le fichier `.env` ni ses secrets.