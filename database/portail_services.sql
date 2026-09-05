-- DROP DATABASE IF EXISTS portail_services;

-- CREATE DATABASE portail_services;

USE portail_services;

-- =====================================================
-- 1. ROLE
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT uq_role_nom UNIQUE (nom)
);

-- =====================================================
-- 2. DEPARTEMENT
CREATE TABLE departement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT uq_departement_nom UNIQUE (nom)
);

-- =====================================================
-- 3. UTILISATEUR
CREATE TABLE utilisateur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role_id INT NOT NULL,
    departement_id INT,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (departement_id) REFERENCES departement (id)
);

-- =====================================================
-- 4. TYPE DE DEMANDE
CREATE TABLE type_demande (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT uq_type_demande_nom UNIQUE (nom)
);

-- =====================================================
-- 5. DEMANDE
CREATE TABLE demande (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_soumission DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motif TEXT NOT NULL,
    statut ENUM(
        'EN_ATTENTE',
        'EN_COURS',
        'ACCEPTEE',
        'REFUSEE'
    ) NOT NULL DEFAULT 'EN_ATTENTE',
    collaborateur_id INT NOT NULL,
    type_demande_id INT NOT NULL,
    FOREIGN KEY (collaborateur_id) REFERENCES utilisateur (id),
    FOREIGN KEY (type_demande_id) REFERENCES type_demande (id)
);

-- =====================================================
-- 6. PIECE JOINTE
CREATE TABLE piece_jointe (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_fichier VARCHAR(255) NOT NULL,
    url_fichier VARCHAR(500),
    type_fichier VARCHAR(100),
    taille BIGINT,
    date_ajout DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    demande_id INT NOT NULL,
    FOREIGN KEY (demande_id) REFERENCES demande (id)
);

-- =====================================================
-- 7. VALIDATION
CREATE TABLE validation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    niveau INT NOT NULL,
    decision ENUM(
        'EN_ATTENTE',
        'APPROUVEE',
        'REFUSEE'
    ) NOT NULL DEFAULT 'EN_ATTENTE',
    commentaire TEXT,
    date_validation DATETIME,
    demande_id INT NOT NULL,
    responsable_id INT NOT NULL,
    CONSTRAINT uq_validation_demande_niveau UNIQUE (demande_id, niveau),
    FOREIGN KEY (demande_id) REFERENCES demande (id),
    FOREIGN KEY (responsable_id) REFERENCES utilisateur (id)
);

-- =====================================================
-- 8. VISITEUR
CREATE TABLE visiteur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    telephone VARCHAR(20),
    societe VARCHAR(150),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================
-- 9. RENDEZ-VOUS
CREATE TABLE rendez_vous (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_rendez_vous DATE NOT NULL,
    heure_rendez_vous TIME NOT NULL,
    motif VARCHAR(255),
    statut ENUM(
        'PLANIFIE',
        'CONFIRME',
        'ANNULE',
        'TERMINE'
    ) NOT NULL DEFAULT 'PLANIFIE',
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    collaborateur_id INT NOT NULL,
    visiteur_id INT NOT NULL,
    FOREIGN KEY (collaborateur_id) REFERENCES utilisateur (id),
    FOREIGN KEY (visiteur_id) REFERENCES visiteur (id)
);

-- =====================================================
-- 10. BADGE
CREATE TABLE badge (
    id INT PRIMARY KEY AUTO_INCREMENT,
    qr_code VARCHAR(255) NOT NULL UNIQUE,
    date_generation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_expiration DATETIME NOT NULL,
    statut ENUM('VALIDE', 'EXPIRE', 'UTILISE') NOT NULL DEFAULT 'VALIDE',
    rendez_vous_id INT NOT NULL,
    FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous (id)
);

-- =====================================================
-- 11. VISITE
CREATE TABLE visite (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_entree DATETIME,
    date_sortie DATETIME,
    statut ENUM(
        'EN_ATTENTE',
        'EN_COURS',
        'TERMINEE',
        'ANNULEE'
    ) NOT NULL DEFAULT 'EN_ATTENTE',
    rendez_vous_id INT NOT NULL,
    agent_accueil_id INT NOT NULL,
    FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous (id),
    FOREIGN KEY (agent_accueil_id) REFERENCES utilisateur (id)
);

-- =====================================================
-- 12. NOTIFICATION
CREATE TABLE notification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    type VARCHAR(50),
    date_envoi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    est_lue BOOLEAN NOT NULL DEFAULT FALSE,
    utilisateur_id INT NOT NULL,
    demande_id INT,
    rendez_vous_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id),
    FOREIGN KEY (demande_id) REFERENCES demande (id),
    FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous (id)
);

-- =====================================================
-- 13. LOG
CREATE TABLE log(
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(100) NOT NULL,
    date_action DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    adresse_ip VARCHAR(45),
    utilisateur_id INT NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)
);

-- définit les différents rôles des utilisateurs du système.
INSERT INTO
    role (nom, description)
VALUES (
        'COLLABORATEUR',
        'Utilisateur qui soumet et suit les demandes'
    ),
    (
        'RESPONSABLE',
        'Utilisateur qui traite et valide les demandes'
    ),
    (
        'ADMINISTRATEUR',
        'Utilisateur qui administre le système'
    ),
    (
        'AGENT_ACCUEIL',
        'Utilisateur qui gère l accueil et les visites'
    ),
    (
        'VISITEUR',
        'Visiteur externe qui crée un compte et prend des rendez-vous'
    );

SELECT * FROM role;

-- contient les départements auxquels les utilisateurs sont rattachés.
INSERT INTO
    departement (nom, description)
VALUES (
        'Ressources Humaines',
        'Département des ressources humaines'
    ),
    (
        'Informatique',
        'Département informatique'
    ),
    (
        'Administration',
        'Département administratif'
    ),
    (
        'Finance',
        'Département financier'
    );

SELECT * FROM departement;

-- contient les informations des utilisateurs et leurs rôles.
INSERT INTO
    utilisateur (
        nom,
        prenom,
        email,
        mot_de_passe,
        telephone,
        role_id,
        departement_id
    )
VALUES (
        'Dami',
        'Rayane',
        'rayane@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000000',
        1,
        2
    ),
    (
        'Test',
        'Responsable',
        'responsable@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000001',
        2,
        2
    ),
    (
        'Test',
        'Administrateur',
        'admin@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000002',
        3,
        3
    ),
    (
        'Test',
        'Accueil',
        'accueil@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000003',
        4,
        3
    );

SELECT * FROM utilisateur;

SELECT u.id, u.nom, u.prenom, u.email, r.nom AS role, d.nom AS departement
FROM
    utilisateur u
    JOIN role r ON u.role_id = r.id
    LEFT JOIN departement d ON u.departement_id = d.id;

--  définit les différents types de demandes administratives
INSERT INTO
    type_demande (nom, description)
VALUES (
        'Attestation',
        'Demande d''une attestation administrative'
    ),
    ('Congé', 'Demande de congé'),
    (
        'Autorisation',
        'Demande d''autorisation'
    ),
    (
        'Document administratif',
        'Demande de document administratif'
    ),
    (
        'Matériel informatique',
        'Demande de matériel informatique'
    ),
    (
        'Accès',
        'Demande d''accès aux locaux ou aux systèmes'
    );

SELECT * FROM type_demande;

-- représente une demande soumise par un collaborateur.
INSERT INTO
    demande (
        date_soumission,
        motif,
        statut,
        collaborateur_id,
        type_demande_id
    )
VALUES (
        NOW(),
        'Demande d''attestation administrative',
        'EN_ATTENTE',
        1,
        1
    );

SELECT d.id, d.date_soumission, d.motif, d.statut, u.nom, u.prenom, td.nom AS type_demande
FROM
    demande d
    JOIN utilisateur u ON d.collaborateur_id = u.id
    JOIN type_demande td ON d.type_demande_id = td.id;

--  contient les fichiers associés à une demande
INSERT INTO
    piece_jointe (
        nom_fichier,
        url_fichier,
        type_fichier,
        taille,
        demande_id
    )
VALUES (
        'attestation.pdf',
        '/uploads/attestation.pdf',
        'application/pdf',
        250000,
        1
    );

SELECT p.id, p.nom_fichier, p.type_fichier, p.taille, p.demande_id, d.motif
FROM piece_jointe p
    JOIN demande d ON p.demande_id = d.id;

-- gère les différentes étapes de validation d'une demande.
INSERT INTO
    validation (
        niveau,
        decision,
        commentaire,
        demande_id,
        responsable_id
    )
VALUES (1, 'EN_ATTENTE', NULL, 1, 2);

SELECT v.id, v.niveau, v.decision, v.commentaire, v.date_validation, v.demande_id, u.nom, u.prenom
FROM validation v
    JOIN utilisateur u ON v.responsable_id = u.id;

-- update validation
UPDATE validation
SET
    decision = 'APPROUVEE',
    commentaire = 'Demande acceptée',
    date_validation = NOW()
WHERE
    id = 1;

-- contient les informations des visiteurs externes.
INSERT INTO
    visiteur (
        nom,
        prenom,
        email,
        telephone,
        societe
    )
VALUES (
        'Alami',
        'Youssef',
        'youssef.alami@email.com',
        '0612345678',
        'ABC Consulting'
    );

SELECT * FROM visiteur;

-- représente un rendez-vous entre un collaborateur et un visiteur.
INSERT INTO
    rendez_vous (
        date_rendez_vous,
        heure_rendez_vous,
        motif,
        statut,
        collaborateur_id,
        visiteur_id
    )
VALUES (
        '2026-08-25',
        '10:00:00',
        'Réunion professionnelle',
        'PLANIFIE',
        1,
        1
    );

SELECT
    r.id,
    r.date_rendez_vous,
    r.heure_rendez_vous,
    r.motif,
    r.statut,
    u.nom AS collaborateur_nom,
    u.prenom AS collaborateur_prenom,
    v.nom AS visiteur_nom,
    v.prenom AS visiteur_prenom
FROM
    rendez_vous r
    JOIN utilisateur u ON r.collaborateur_id = u.id
    JOIN visiteur v ON r.visiteur_id = v.id;

-- représente le badge avec le QR Code associé à un rendez-vous.
INSERT INTO
    badge (
        qr_code,
        date_expiration,
        statut,
        rendez_vous_id
    )
VALUES (
        'QR-RDV-000001',
        '2026-08-25 23:59:59',
        'VALIDE',
        1
    );

SELECT
    b.id,
    b.qr_code,
    b.date_generation,
    b.date_expiration,
    b.statut,
    b.rendez_vous_id,
    v.nom AS visiteur_nom,
    v.prenom AS visiteur_prenom
FROM
    badge b
    JOIN rendez_vous r ON b.rendez_vous_id = r.id
    JOIN visiteur v ON r.visiteur_id = v.id;

-- enregistre l'arrivée et le départ d'un visiteur.
INSERT INTO
    visite (
        date_entree,
        date_sortie,
        statut,
        rendez_vous_id,
        agent_accueil_id
    )
VALUES (
        NULL,
        NULL,
        'EN_ATTENTE',
        1,
        4
    );

SELECT vi.id, vi.date_entree, vi.date_sortie, vi.statut, vi.rendez_vous_id, u.nom, u.prenom
FROM visite vi
    JOIN utilisateur u ON vi.agent_accueil_id = u.id;

-- informe les utilisateurs des événements importants du système.
INSERT INTO
    notification (
        message,
        type,
        est_lue,
        utilisateur_id,
        demande_id
    )
VALUES (
        'Une nouvelle demande a été soumise.',
        'DEMANDE',
        FALSE,
        2,
        1
    );

SELECT n.id, n.message, n.type, n.date_envoi, n.est_lue, u.nom, u.prenom
FROM notification n
    JOIN utilisateur u ON n.utilisateur_id = u.id;

-- conserve l'historique des actions effectuées dans le système.
INSERT INTO
    log(
        action,
        adresse_ip,
        utilisateur_id
    )
VALUES (
        'Soumission d''une demande',
        '127.0.0.1',
        1
    );

SELECT l.id, l.action, l.date_action, l.adresse_ip, u.nom, u.prenom
FROM log l
    JOIN utilisateur u ON l.utilisateur_id = u.id;

SHOW TABLES;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'portail_services'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
------------------------------------------------------------
SELECT
    d.id AS demande_id,
    CONCAT(u.prenom, ' ', u.nom) AS collaborateur,
    td.nom AS type_demande,
    d.statut,
    v.decision AS validation,
    CONCAT(vis.prenom, ' ', vis.nom) AS visiteur,
    r.statut AS rendez_vous,
    b.statut AS badge,
    vi.statut AS visite
FROM
    demande d
    LEFT JOIN utilisateur u ON d.collaborateur_id = u.id
    LEFT JOIN type_demande td ON d.type_demande_id = td.id
    LEFT JOIN validation v ON d.id = v.demande_id
    LEFT JOIN rendez_vous r ON r.id = 1
    LEFT JOIN visiteur vis ON r.visiteur_id = vis.id
    LEFT JOIN badge b ON b.rendez_vous_id = r.id
    LEFT JOIN visite vi ON vi.rendez_vous_id = r.id;

SELECT u.id, u.nom, u.prenom, u.email, r.nom AS role, v.utilisateur_id, v.societe
FROM
    utilisateur u
    JOIN role r ON r.id = u.role_id
    LEFT JOIN visiteur v ON v.utilisateur_id = u.id
WHERE
    u.email = 'jean@exemple.com';