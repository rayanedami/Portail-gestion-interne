drop database if exists portail_services;

create database portail_services character set utf8mb4 collate utf8mb4_unicode_ci;

use portail_services;

set foreign_key_checks = 0;

drop table if exists notification;

drop table if exists log;

drop table if exists badge;

drop table if exists visite;

drop table if exists rendez_vous;

drop table if exists validation;

drop table if exists piece_jointe;

drop table if exists demande;

drop table if exists visiteur;

drop table if exists utilisateur;

drop table if exists type_demande;

drop table if exists departement;

drop table if exists role;

set foreign_key_checks = 1;

-- table des rôles de l'application
create table role (
    id int primary key auto_increment,
    nom varchar(50) not null,
    description varchar(255),
    constraint uq_role_nom unique (nom)
) engine = innodb;

-- table des départements
create table departement (
    id int primary key auto_increment,
    nom varchar(100) not null,
    description varchar(255),
    constraint uq_departement_nom unique (nom)
) engine = innodb;

-- table des utilisateurs internes et externes
create table utilisateur (
    id int primary key auto_increment,
    nom varchar(100) not null,
    prenom varchar(100) not null,
    email varchar(150) not null unique,
    mot_de_passe varchar(255) not null,
    telephone varchar(20),
    photo_profil longtext,
    actif boolean not null default true,
    date_creation datetime not null default current_timestamp,
    role_id int not null,
    departement_id int,
    constraint fk_utilisateur_role foreign key (role_id) references role (id),
    constraint fk_utilisateur_departement foreign key (departement_id) references departement (id)
) engine = innodb;

-- types de demandes administratives
create table type_demande (
    id int primary key auto_increment,
    nom varchar(100) not null,
    description varchar(255),
    constraint uq_type_demande_nom unique (nom)
) engine = innodb;

-- demandes soumises par les collaborateurs
create table demande (
    id int primary key auto_increment,
    date_soumission datetime not null default current_timestamp,
    motif text not null,
    statut enum(
        'EN_ATTENTE',
        'EN_COURS',
        'ACCEPTEE',
        'REFUSEE'
    ) not null default 'EN_ATTENTE',
    collaborateur_id int not null,
    type_demande_id int not null,
    constraint fk_demande_collaborateur foreign key (collaborateur_id) references utilisateur (id),
    constraint fk_demande_type foreign key (type_demande_id) references type_demande (id)
) engine = innodb;

-- pièces jointes associées aux demandes
create table piece_jointe (
    id int primary key auto_increment,
    nom_fichier varchar(255) not null,
    url_fichier varchar(500),
    type_fichier varchar(100),
    taille bigint,
    date_ajout datetime not null default current_timestamp,
    demande_id int not null,
    constraint fk_piece_jointe_demande foreign key (demande_id) references demande (id) on delete cascade
) engine = innodb;

-- validations à plusieurs niveaux
create table validation (
    id int primary key auto_increment,
    niveau int not null,
    decision enum(
        'EN_ATTENTE',
        'APPROUVEE',
        'REFUSEE'
    ) not null default 'EN_ATTENTE',
    commentaire text,
    date_validation datetime,
    demande_id int not null,
    responsable_id int not null,
    constraint uq_validation_demande_niveau unique (demande_id, niveau),
    constraint fk_validation_demande foreign key (demande_id) references demande (id) on delete cascade,
    constraint fk_validation_responsable foreign key (responsable_id) references utilisateur (id)
) engine = innodb;

-- visiteurs préenregistrés
create table visiteur (
    id int primary key auto_increment,
    utilisateur_id int unique,
    nom varchar(100) not null,
    prenom varchar(100) not null,
    email varchar(150),
    telephone varchar(20),
    societe varchar(150),
    constraint fk_visiteur_utilisateur foreign key (utilisateur_id) references utilisateur (id) on delete cascade on update cascade
) engine = innodb;

-- rendez-vous entre un visiteur et un collaborateur
create table rendez_vous (
    id int primary key auto_increment,
    date_rendez_vous date not null,
    heure_rendez_vous time not null,
    lieu varchar(150) not null default 'Accueil principal',
    motif varchar(255),
    statut enum(
        'PLANIFIE',
        'CONFIRME',
        'ANNULE',
        'TERMINE'
    ) not null default 'PLANIFIE',
    date_creation datetime not null default current_timestamp,
    collaborateur_id int not null,
    visiteur_id int not null,
    constraint fk_rendez_vous_collaborateur foreign key (collaborateur_id) references utilisateur (id),
    constraint fk_rendez_vous_visiteur foreign key (visiteur_id) references visiteur (id) on delete cascade
) engine = innodb;

-- badges numériques avec qr code
create table badge (
    id int primary key auto_increment,
    qr_code varchar(255) not null unique,
    date_generation datetime not null default current_timestamp,
    date_expiration datetime not null,
    statut enum('VALIDE', 'EXPIRE', 'UTILISE') not null default 'VALIDE',
    rendez_vous_id int not null,
    constraint fk_badge_rendez_vous foreign key (rendez_vous_id) references rendez_vous (id) on delete cascade
) engine = innodb;

-- entrées et sorties des visiteurs
create table visite (
    id int primary key auto_increment,
    date_entree datetime,
    date_sortie datetime,
    statut enum(
        'EN_ATTENTE',
        'EN_COURS',
        'TERMINEE',
        'ANNULEE'
    ) not null default 'EN_ATTENTE',
    rendez_vous_id int not null,
    agent_accueil_id int not null,
    constraint fk_visite_rendez_vous foreign key (rendez_vous_id) references rendez_vous (id) on delete cascade,
    constraint fk_visite_agent foreign key (agent_accueil_id) references utilisateur (id)
) engine = innodb;

-- notifications de l'application
create table notification (
    id int primary key auto_increment,
    message text not null,
    type varchar(50),
    date_envoi datetime not null default current_timestamp,
    est_lue boolean not null default false,
    utilisateur_id int not null,
    expediteur_id int,
    demande_id int,
    rendez_vous_id int,
    constraint fk_notification_utilisateur foreign key (utilisateur_id) references utilisateur (id),
    constraint fk_notification_expediteur foreign key (expediteur_id) references utilisateur (id),
    constraint fk_notification_demande foreign key (demande_id) references demande (id) on delete set null,
    constraint fk_notification_rendez_vous foreign key (rendez_vous_id) references rendez_vous (id) on delete set null
) engine = innodb;

-- journal des actions importantes
create table log(
    id int primary key auto_increment,
    action varchar(100) not null,
    date_action datetime not null default current_timestamp,
    adresse_ip varchar(45),
    utilisateur_id int not null,
    constraint fk_log_utilisateur foreign key (utilisateur_id) references utilisateur (id)
) engine = innodb;

-- données de référence nécessaires au fonctionnement de l'application
insert into
    role (nom, description)
values (
        'COLLABORATEUR',
        'utilisateur qui soumet et suit les demandes'
    ),
    (
        'RESPONSABLE',
        'utilisateur qui traite et valide les demandes'
    ),
    (
        'ADMINISTRATEUR',
        'utilisateur qui administre le système'
    ),
    (
        'AGENT_ACCUEIL',
        'utilisateur qui gère l accueil et les visites'
    ),
    (
        'VISITEUR',
        'visiteur externe qui crée un compte et prend des rendez-vous'
    );

insert into
    departement (nom, description)
values (
        'Ressources Humaines',
        'département des ressources humaines'
    ),
    (
        'Informatique',
        'département informatique'
    ),
    (
        'Administration',
        'département administratif'
    ),
    (
        'Finance',
        'département financier'
    );

insert into
    type_demande (nom, description)
values (
        'Attestation',
        'demande d''une attestation administrative'
    ),
    ('Congé', 'demande de congé'),
    (
        'Autorisation',
        'demande d''autorisation'
    ),
    (
        'Document administratif',
        'demande de document administratif'
    ),
    (
        'Matériel informatique',
        'demande de matériel informatique'
    ),
    (
        'Accès',
        'demande d''accès aux locaux ou aux systèmes'
    );

-- comptes de démonstration : mot de passe pour tous les comptes : 123456
insert into
    utilisateur (
        nom,
        prenom,
        email,
        mot_de_passe,
        telephone,
        role_id,
        departement_id
    )
values (
        'Dami',
        'Rayane',
        'rayane@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000000',
        1,
        1
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
    ),
    (
        'Test',
        'Visiteur',
        'visiteur@portail.ma',
        '$2b$10$X4D9dR/qulrdMHUvLmHJt./h/deR0xdU5X/rd5kOExZwgVUOcDrxu',
        '0600000004',
        5,
        null
    );

insert into
    visiteur (
        utilisateur_id,
        nom,
        prenom,
        email,
        telephone,
        societe
    )
values (
        5,
        'Test',
        'Visiteur',
        'visiteur@portail.ma',
        '0600000004',
        'Entreprise de démonstration'
    );