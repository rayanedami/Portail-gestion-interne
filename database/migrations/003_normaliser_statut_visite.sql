-- Migration 003 - normalisation des anciens statuts de visite
-- Aucun enregistrement n'est supprime.
USE portail_services;

UPDATE visite
SET
    statut = 'EN_ATTENTE'
WHERE
    statut IS NULL
    OR statut = ''
    OR statut = 'PREVUE';