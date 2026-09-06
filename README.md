# Portail de gestion des services internes et des visiteurs

## Présentation

Ce projet consiste à développer une application web permettant de gérer les services internes d'une organisation ainsi que les visiteurs.

L'application permet aux collaborateurs de créer et de suivre leurs demandes, aux responsables de les traiter et de les valider, aux administrateurs de gérer les utilisateurs et les différentes données du système, et aux agents d'accueil de gérer les visiteurs, les rendez-vous et les visites.

Le système permet également de gérer les badges avec QR Code afin de faciliter le contrôle des entrées et des sorties des visiteurs.

## Fonctionnalités principales

### Gestion des utilisateurs

- Authentification des utilisateurs
- Gestion des rôles
- Gestion du profil
- Activation et gestion des comptes
- Gestion des permissions selon le rôle

Les rôles internes utilisés dans l'application sont :

- Collaborateur
- Responsable
- Administrateur
- Agent d'accueil

Un rôle Visiteur est également présent pour permettre aux visiteurs de consulter leurs rendez-vous et leur badge QR.

### Collaborateur

Le collaborateur peut :

- Consulter son tableau de bord
- Créer une nouvelle demande
- Consulter ses demandes
- Suivre l'état de ses demandes
- Consulter ses rendez-vous
- Recevoir des notifications
- Gérer son profil

Les types de demandes disponibles sont :

- Attestation
- Congé
- Autorisation
- Document administratif
- Matériel informatique
- Accès

### Responsable

Le responsable peut :

- Consulter les demandes
- Consulter les demandes en attente de validation
- Valider une demande
- Refuser une demande avec un commentaire
- Suivre le processus de validation
- Consulter les rendez-vous
- Recevoir des notifications

### Administrateur

L'administrateur dispose d'une vue globale du système.

Il peut notamment :

- Gérer les utilisateurs
- Gérer les rôles
- Consulter les demandes
- Consulter les validations
- Gérer les visiteurs
- Consulter les visites
- Consulter les rendez-vous
- Consulter les logs
- Consulter les statistiques
- Exporter certaines données

### Agent d'accueil

L'agent d'accueil est principalement chargé de la gestion des visiteurs.

Il peut :

- Enregistrer les visiteurs
- Consulter les visiteurs
- Gérer les rendez-vous
- Générer les badges QR
- Consulter les badges
- Scanner les QR Codes
- Enregistrer les entrées
- Enregistrer les sorties
- Consulter les visiteurs présents

### Gestion des visiteurs

Le système permet de :

- Enregistrer un visiteur
- Modifier les informations d'un visiteur
- Rechercher un visiteur
- Associer un visiteur à un rendez-vous
- Consulter l'historique des visites

### Gestion des rendez-vous

Les rendez-vous permettent d'associer un visiteur à une date et une personne à rencontrer.

Les principales fonctionnalités sont :

- Création d'un rendez-vous
- Modification d'un rendez-vous
- Annulation d'un rendez-vous
- Consultation des rendez-vous
- Recherche de rendez-vous
- Association avec un visiteur

### Gestion des badges et QR Code

Un badge QR Code peut être généré à partir d'un rendez-vous.

Le badge contient les informations nécessaires pour identifier le visiteur et vérifier la validité du rendez-vous.

L'agent d'accueil peut scanner le QR Code afin de :

- Vérifier le badge
- Vérifier sa validité
- Identifier le visiteur
- Vérifier le rendez-vous
- Enregistrer l'entrée
- Enregistrer la sortie

### Notifications

Le système permet d'envoyer des notifications aux utilisateurs lors de différentes actions :

- Création d'une demande
- Validation d'une demande
- Refus d'une demande
- Modification d'un rendez-vous
- Confirmation d'un rendez-vous
- Création ou utilisation d'un badge
- Entrée ou sortie d'un visiteur

### Logs

Les actions importantes effectuées dans l'application sont enregistrées dans les logs.

Les logs permettent notamment de garder une trace des :

- Connexions
- Actions des administrateurs
- Créations et modifications
- Validations
- Gestion des visiteurs
- Gestion des rendez-vous
- Création des badges
- Entrées et sorties des visiteurs

## Technologies utilisées

### Frontend

- React
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express.js
- JWT pour l'authentification

### Base de données

- MySQL

### Outils

- Visual Studio Code
- Git

## Structure du projet

```text
portail-gestion-interne/
│
├── backend/
│   ├── config/              # Configuration de la base de données
│   ├── controllers/         # Logique métier
│   ├── middleware/          # Authentification et autorisations
│   ├── models/              # Accès aux données
│   ├── routes/              # Routes de l'API REST
│   ├── debugLogin.js        # Outil local de diagnostic de connexion
│   ├── hashPasswords.js     # Utilitaire de hachage des mots de passe
│   ├── resetPasswords.js    # Utilitaire de réinitialisation des mots de passe
│   ├── package.json
│   └── server.js            # Point d'entrée du serveur Express
│
├── frontend/
│   ├── public/              # Ressources publiques
│   ├── src/                 # Pages, composants et services React
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── backups/             # Sauvegardes de la base de données
│   ├── migrations/          # Scripts de migration
│   └── portail_services.sql # Schéma et données initiales
│
├── D use case .png          # Diagramme de cas d'utilisation
├── D classe.png             # Diagramme de classes
├── D sequence 1.png         # Diagrammes de séquence
├── D sequence 2.png
├── D sequence 3.png
├── D sequence Cmpt.jpeg     # Diagramme de composants
├── separer.png
├── Sujet-Stage-Mr-DAMI.docx # Sujet de stage
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```