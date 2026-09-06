# Modèle de données

## Entités principales

```mermaid
erDiagram
    UTILISATEUR ||--o| VISITEUR : "profil visiteur"
    ROLE ||--o{ UTILISATEUR : attribue
    DEPARTEMENT ||--o{ UTILISATEUR : affecte
    UTILISATEUR ||--o{ DEMANDE : soumet
    TYPE_DEMANDE ||--o{ DEMANDE : categorise
    DEMANDE ||--o{ PIECE_JOINTE : contient
    DEMANDE ||--o{ VALIDATION : suit
    UTILISATEUR ||--o{ VALIDATION : decide
    VISITEUR ||--o{ RENDEZ_VOUS : possede
    UTILISATEUR ||--o{ RENDEZ_VOUS : rencontre
    RENDEZ_VOUS ||--o{ BADGE : genere
    RENDEZ_VOUS ||--o{ VISITE : produit
    UTILISATEUR ||--o{ VISITE : enregistre
    UTILISATEUR ||--o{ NOTIFICATION : recoit
    UTILISATEUR ||--o{ LOG : produit
```

## Règles d'intégrité

- Un visiteur peut être lié à un compte utilisateur par `visiteur.utilisateur_id`.
- Une demande appartient à un collaborateur.
- Une demande possède une validation de niveau 1, puis éventuellement une validation de niveau 2.
- Le niveau 2 n'est possible qu'après approbation du niveau 1.
- Un badge est lié à un rendez-vous confirmé.
- Une visite est liée à un rendez-vous et à l'agent d'accueil qui l'enregistre.
- Les notifications sont liées à un utilisateur et peuvent référencer une demande ou un rendez-vous.
- Les logs conservent les actions importantes et sont immuables par l'API.

Le schéma complet et les contraintes SQL sont dans `database/portail_services.sql`.
