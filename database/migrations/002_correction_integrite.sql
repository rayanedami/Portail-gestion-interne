-- Migration 002 - correction controlee de l'integrite portail_services
-- Sauvegarde prealable : database/backups/portail_services_20260905_022020.sql
-- Ne pas executer le script schema complet portail_services.sql en production.
USE portail_services;

-- 1. DEMANDE : normalisation des statuts vides.
UPDATE demande
SET
    statut = 'EN_ATTENTE'
WHERE
    statut IS NULL
    OR statut = '';

-- 2. VALIDATION : normalisation des decisions vides.
UPDATE validation
SET
    decision = 'EN_ATTENTE'
WHERE
    decision IS NULL
    OR decision = '';

-- Les doublons suivants sont des repetitions vides du meme niveau.
-- Les lignes decisionnelles APPROUVEE/REFUSEE sont conservees.
DELETE FROM validation
WHERE
    id IN (
        1,
        12,
        13,
        14,
        15,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
    );

-- 3. BADGE : conservation de l'historique, ancien badge manuel expire.
UPDATE badge
SET
    statut = 'EXPIRE'
WHERE
    id = 5
    AND rendez_vous_id = 19
    AND statut = 'VALIDE';

-- 4. VISITE : convention unique EN_ATTENTE.
UPDATE visite SET statut = 'EN_ATTENTE' WHERE statut = 'PREVUE';

ALTER TABLE visite
MODIFY statut ENUM(
    'EN_ATTENTE',
    'EN_COURS',
    'TERMINEE',
    'ANNULEE'
) NOT NULL DEFAULT 'EN_ATTENTE';

-- 5. Un seul niveau de validation par demande.
ALTER TABLE validation
ADD CONSTRAINT uq_validation_demande_niveau UNIQUE (demande_id, niveau);

-- 6. Unicite des referentiels, aucun doublon detecte lors de l'audit.
ALTER TABLE role ADD CONSTRAINT uq_role_nom UNIQUE (nom);

ALTER TABLE departement
ADD CONSTRAINT uq_departement_nom UNIQUE (nom);

ALTER TABLE type_demande
ADD CONSTRAINT uq_type_demande_nom UNIQUE (nom);