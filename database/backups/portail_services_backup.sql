set foreign_key_checks = 0;

drop table if exists `badge`;
drop table if exists `notification`;
drop table if exists `piece_jointe`;
drop table if exists `validation`;
drop table if exists `visite`;
drop table if exists `rendez_vous`;
drop table if exists `demande`;
drop table if exists `visiteur`;
drop table if exists `utilisateur`;
drop table if exists `type_demande`;
drop table if exists `departement`;
drop table if exists `role`;

set foreign_key_checks = 1;

create table `role` (
  `id` int(11) not null auto_increment,
  `nom` varchar(50) not null,
  `description` varchar(255) default null,
  primary key (`id`)
) engine=InnoDB auto_increment=7 default charset=latin1 collate=latin1_swedish_ci;

insert into `role` values
(1,'COLLABORATEUR','Utilisateur qui soumet et suit les demandes'),
(2,'RESPONSABLE','Utilisateur qui traite et valide les demandes'),
(3,'ADMINISTRATEUR','Utilisateur qui administre le système'),
(4,'AGENT_ACCUEIL','Utilisateur qui gère l accueil et les visites'),
(5,'VISITEUR','Visiteur externe qui crée un compte et prend des rendez-vous');


create table `departement` (
  `id` int(11) not null auto_increment,
  `nom` varchar(100) not null,
  `description` varchar(255) default null,
  primary key (`id`)
) engine=InnoDB auto_increment=5 default charset=latin1 collate=latin1_swedish_ci;

insert into `departement` values
(1,'Ressources Humaines','Département des ressources humaines'),
(2,'Informatique','Département informatique'),
(3,'Administration','Département administratif'),
(4,'Finance','Département financier');


create table `type_demande` (
  `id` int(11) not null auto_increment,
  `nom` varchar(100) not null,
  `description` varchar(255) default null,
  primary key (`id`)
) engine=InnoDB auto_increment=7 default charset=latin1 collate=latin1_swedish_ci;

insert into `type_demande` values
(1,'Attestation','Demande d\'une attestation administrative'),
(2,'Congé','Demande de congé'),
(3,'Autorisation','Demande d\'autorisation'),
(4,'Document administratif','Demande de document administratif'),
(5,'Matériel informatique','Demande de matériel informatique'),
(6,'Accès','Demande d\'accès aux locaux ou aux systèmes');


create table `utilisateur` (
  `id` int(11) not null auto_increment,
  `nom` varchar(100) not null,
  `prenom` varchar(100) not null,
  `email` varchar(150) not null,
  `mot_de_passe` varchar(255) not null,
  `telephone` varchar(20) default null,
  `actif` tinyint(1) not null default 1,
  `date_creation` datetime not null default current_timestamp(),
  `role_id` int(11) not null,
  `departement_id` int(11) default null,
  primary key (`id`),
  unique key `email` (`email`),
  key `role_id` (`role_id`),
  key `departement_id` (`departement_id`),
  constraint `utilisateur_ibfk_1` foreign key (`role_id`) references `role` (`id`),
  constraint `utilisateur_ibfk_2` foreign key (`departement_id`) references `departement` (`id`)
) engine=InnoDB auto_increment=14 default charset=latin1 collate=latin1_swedish_ci;

insert into `utilisateur` values
(1,'yassin','Mr','rayane@portail.ma','$2b$10$Eg.cQOGlpqct47enWrdGROt6brekWiJaDkQ2Qy1O/W1DPVetJQVwW','0607777999',1,'2026-09-03 02:38:24',1,2),
(2,'saad','Mr','responsable@portail.ma','$2b$10$Kd4yeO16I3VBaaJFPjYlfODhAzdByoZDRm.0sSUQswyWGfSxWoRVi','0612345678',1,'2026-09-03 02:38:24',2,1),
(3,'Test','Administrateur','admin@portail.ma','$2b$10$JqsyKWryw1RZQlVDcfNeFevsFeOgeFx4S40T9d8.bpK1NW16FU9V.','0600000002',1,'2026-09-03 02:38:24',3,2),
(4,'Test','Accueil','accueil@portail.ma','$2b$10$WkvchNIB.N7aVldO./KfsOtbGG8ow1GuKzqM9y3M5o0ZI3pRpHLbm','0600000003',1,'2026-09-03 02:38:24',4,3),
(5,'Dupont','Jean','jean@test.com','$2b$10$QJnjV/DClAczxpOMWvBwQOI7ILICWVB.URmQKbA02rRsEv7Mttrl2','0612345678',1,'2026-09-03 03:07:36',5,null),
(6,'Test','Nouveau','nouveau-20260903031033@test.com','$2b$10$YhGYwNA74ALZx6JdEsoeTeGZyW8xM1SC1lO2XRdZd8kv8SqWwFx6S','0612345678',1,'2026-09-03 03:10:33',5,null),
(7,'Test','Nouveau','test-20260903031336237@test.com','$2b$10$H6NjQnAKaq1q0VrN1YyZpOvzOkwb7.VjFYaI/E3ZDaADvM28d0hf6','0612345678',1,'2026-09-03 03:13:36',5,null),
(8,'Dupont','Jean','jean@exemple.com','$2b$10$RchBUXWuo0O67TGmGeUZ3uBgCozubdyczHRrkZRLnb8zrZoJv2CXy','0612345678',1,'2026-09-03 03:22:47',5,null),
(9,'Dupont','Jean','karim@test.com','$2b$10$7pa.w2Sbe/4JwAvg6p114O8hZBjxAVUb3XO6r70BoXzMm0D39jvZe','0612345678',1,'2026-09-03 13:16:54',5,null),
(10,'Dami','Rayane','boughatatedami@gmail.com','$2b$10$0YdB.ZCJBJ6JqygqTER8lOXlsgqRk8yWfhw9a4YF71eIZLvYlqH6C','+212637271696',1,'2026-09-03 13:25:45',5,null),
(11,'Dami','Rayane','rayane@gmail.com','$2b$10$/Wj1rYtnZkQHyHgk.qYO6uUufpdqSJ9D2hvnADnC9oB2IsX3XWqem','+212637271696',1,'2026-09-04 01:50:59',5,null),
(12,'karim','Rayane','karim@gmail.com','$2b$10$F8amqaHTIdIp616GynAG2uuFcXyFuAYMdWgDyIZ5iRXljWFQnFIBy','+212637271696',1,'2026-09-04 02:19:48',5,null),
(13,'saaid','abcd','saaid@gmail.ma','$2b$10$MGAbNjJ6ostmjyTiKUfJn.42.x3mlPjOLiEBcychW2G/rbD8tJVBu','0631312312',1,'2026-09-04 16:46:20',5,null);


create table `visiteur` (
  `id` int(11) not null auto_increment,
  `utilisateur_id` int(11) default null,
  `nom` varchar(100) not null,
  `prenom` varchar(100) not null,
  `email` varchar(150) default null,
  `telephone` varchar(20) default null,
  `societe` varchar(150) default null,
  primary key (`id`),
  unique key `utilisateur_id` (`utilisateur_id`),
  constraint `fk_visiteur_utilisateur`
    foreign key (`utilisateur_id`) references `utilisateur` (`id`)
    on delete cascade on update cascade
) engine=InnoDB auto_increment=13 default charset=latin1 collate=latin1_swedish_ci;

insert into `visiteur` values
(1,null,'Alami','Youssef','youssef.alami@email.com','0612345678','ABC Consulting'),
(12,null,'Dami','Rayane','rayanedami22@gmail.com','0637271696','iga');


create table `demande` (
  `id` int(11) not null auto_increment,
  `date_soumission` datetime not null default current_timestamp(),
  `motif` text not null,
  `statut` enum('EN_ATTENTE','EN_COURS','ACCEPTEE','REFUSEE') not null default 'EN_ATTENTE',
  `collaborateur_id` int(11) not null,
  `type_demande_id` int(11) not null,
  primary key (`id`),
  key `collaborateur_id` (`collaborateur_id`),
  key `type_demande_id` (`type_demande_id`),
  constraint `demande_ibfk_1`
    foreign key (`collaborateur_id`) references `utilisateur` (`id`),
  constraint `demande_ibfk_2`
    foreign key (`type_demande_id`) references `type_demande` (`id`)
) engine=InnoDB auto_increment=9 default charset=latin1 collate=latin1_swedish_ci;

insert into `demande` values
(1,'2026-09-03 02:38:24','Demande d\'attestation administrative','REFUSEE',1,1),
(2,'2026-09-04 01:48:47','111','',2,3),
(3,'2026-09-04 03:02:30','attes','REFUSEE',1,1),
(4,'2026-09-04 16:23:49','Demande de mat?riel informatique pour le poste de travail','ACCEPTEE',1,5),
(5,'2026-09-04 18:48:53','attestation de trvail','ACCEPTEE',3,1),
(6,'2026-09-04 19:22:59','iiiiiiiiiiiiiiiiiiiiiiiiiii','ACCEPTEE',3,4),
(7,'2026-09-04 19:23:16','pppppppppppppppppppp','ACCEPTEE',2,3),
(8,'2026-09-04 19:24:34','qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq','ACCEPTEE',1,5);


create table `rendez_vous` (
  `id` int(11) not null auto_increment,
  `date_rendez_vous` date not null,
  `heure_rendez_vous` time not null,
  `motif` varchar(255) default null,
  `statut` enum('PLANIFIE','CONFIRME','ANNULE','TERMINE') not null default 'PLANIFIE',
  `date_creation` datetime not null default current_timestamp(),
  `collaborateur_id` int(11) not null,
  `visiteur_id` int(11) not null,
  primary key (`id`),
  key `collaborateur_id` (`collaborateur_id`),
  key `visiteur_id` (`visiteur_id`),
  constraint `rendez_vous_ibfk_1`
    foreign key (`collaborateur_id`) references `utilisateur` (`id`),
  constraint `rendez_vous_ibfk_2`
    foreign key (`visiteur_id`) references `visiteur` (`id`)
) engine=InnoDB auto_increment=22 default charset=latin1 collate=latin1_swedish_ci;

insert into `rendez_vous` values
(1,'2026-08-25','10:00:00','Réunion professionnelle','PLANIFIE','2026-09-03 02:38:24',1,1),
(2,'2026-10-10','14:30:00','Rendez-vous de test','PLANIFIE','2026-09-04 16:50:46',1,1),
(3,'2026-11-10','14:30:00','Rendez-vous test ?tape 9','PLANIFIE','2026-09-04 16:52:08',1,1),
(4,'2026-12-10','14:30:00','Test rendez-vous','PLANIFIE','2026-09-04 16:53:32',1,1),
(5,'2026-12-11','15:00:00','Test rendez-vous final','PLANIFIE','2026-09-04 16:54:44',1,1),
(6,'2026-12-20','12:00:00','debug','PLANIFIE','2026-09-04 16:55:07',1,1),
(7,'2026-09-10','04:54:00','service intere','PLANIFIE','2026-09-04 16:55:24',4,1),
(8,'2026-12-21','16:00:00','Test rendez-vous ?tape 9','PLANIFIE','2026-09-04 16:56:04',1,1),
(9,'2026-09-10','04:54:00','service intere','PLANIFIE','2026-09-04 16:56:05',4,1),
(10,'2026-09-10','04:54:00','service intere','PLANIFIE','2026-09-04 16:56:06',4,1),
(11,'2026-12-22','16:30:00','Test rendez-vous final','PLANIFIE','2026-09-04 16:57:54',1,1),
(12,'2026-12-23','17:00:00','Test rendez-vous final','PLANIFIE','2026-09-04 17:06:27',1,1),
(13,'2026-12-24','18:00:00','Test final etape9','PLANIFIE','2026-09-04 17:18:56',1,1),
(14,'2026-12-25','19:00:00','MARKERTEST','PLANIFIE','2026-09-04 17:19:42',1,1),
(15,'2026-12-26','10:00:00','debug2','PLANIFIE','2026-09-04 17:20:08',1,1),
(16,'2026-12-27','11:00:00','debug4','PLANIFIE','2026-09-04 17:20:38',1,1),
(17,'2026-12-28','12:00:00','debug5','PLANIFIE','2026-09-04 17:20:49',1,1),
(18,'2026-12-29','13:00:00','Motif modifie','ANNULE','2026-09-04 17:21:57',1,1),
(19,'2026-09-20','14:00:00','Validation badge QR','CONFIRME','2026-09-04 17:27:19',1,1),
(20,'2026-09-21','15:00:00','Confirmation automatique QR','ANNULE','2026-09-04 17:31:06',1,1),
(21,'2026-10-14','10:30:00','Test Etape 11','ANNULE','2026-09-04 17:59:11',1,1);


create table `badge` (
  `id` int(11) not null auto_increment,
  `qr_code` varchar(255) not null,
  `date_generation` datetime not null default current_timestamp(),
  `date_expiration` datetime not null,
  `statut` enum('VALIDE','EXPIRE','UTILISE') not null default 'VALIDE',
  `rendez_vous_id` int(11) not null,
  primary key (`id`),
  unique key `qr_code` (`qr_code`),
  key `rendez_vous_id` (`rendez_vous_id`),
  constraint `badge_ibfk_1`
    foreign key (`rendez_vous_id`) references `rendez_vous` (`id`)
) engine=InnoDB auto_increment=8 default charset=latin1 collate=latin1_swedish_ci;

insert into `badge` values
(4,'PORTAIL-BADGE-215ceeef-0ab4-4201-82b4-7e7b9ad83618','2026-09-04 17:31:06','2026-09-21 17:00:00','VALIDE',20),
(5,'PORTAIL-MANUAL-95f62d3c-9da3-47bb-a9fc-9ad3ced2bff9','2026-09-04 18:00:00','2026-09-20 16:00:00','VALIDE',19),
(6,'PORTAIL-BADGE-fe356663-cb4a-46bb-9a6c-5b86ad9995ed','2026-09-04 17:41:39','2026-09-20 16:00:00','VALIDE',19),
(7,'PORTAIL-BADGE-dc882846-3aea-439c-b912-efb274524d73','2026-09-04 17:59:11','2026-10-15 11:30:00','UTILISE',21);


create table `validation` (
  `id` int(11) not null auto_increment,
  `niveau` int(11) not null,
  `decision` enum('EN_ATTENTE','APPROUVEE','REFUSEE') not null default 'EN_ATTENTE',
  `commentaire` text default null,
  `date_validation` datetime default null,
  `demande_id` int(11) not null,
  `responsable_id` int(11) not null,
  primary key (`id`),
  key `demande_id` (`demande_id`),
  key `responsable_id` (`responsable_id`),
  constraint `validation_ibfk_1`
    foreign key (`demande_id`) references `demande` (`id`),
  constraint `validation_ibfk_2`
    foreign key (`responsable_id`) references `utilisateur` (`id`)
) engine=InnoDB auto_increment=27 default charset=latin1 collate=latin1_swedish_ci;

insert into `validation` values
(1,1,'APPROUVEE','Demande acceptée','2026-09-03 02:38:24',1,2),
(2,1,'','Demande validée par le responsable.','2026-09-04 02:47:25',2,3),
(3,1,'','Demande validée par le responsable.','2026-09-04 02:47:27',2,3),
(4,1,'','Demande validée par le responsable.','2026-09-04 15:42:27',3,3),
(5,1,'','Demande validée par le responsable.','2026-09-04 15:42:30',3,3),
(6,1,'','Demande validée par le responsable.','2026-09-04 15:42:30',3,3),
(7,1,'','Demande validée par le responsable.','2026-09-04 15:42:31',3,3),
(8,1,'','Demande validée par le responsable.','2026-09-04 15:42:31',3,3),
(9,1,'','Demande validée par le responsable.','2026-09-04 15:42:32',3,3),
(10,1,'','Demande validée par le responsable.','2026-09-04 15:42:35',3,3),
(11,1,'REFUSEE','qqqq','2026-09-04 15:42:35',3,3),
(12,1,'','Demande validée par le responsable.','2026-09-04 15:42:36',1,3),
(13,1,'','Demande validée par le responsable.','2026-09-04 15:42:37',1,3),
(14,1,'','Demande validée par le responsable.','2026-09-04 15:42:37',1,3),
(15,1,'','Demande validée par le responsable.','2026-09-04 15:42:38',1,3),
(16,1,'REFUSEE','eeee','2026-09-04 15:42:41',1,3),
(17,1,'EN_ATTENTE',null,null,4,2),
(18,2,'APPROUVEE','Validation finale de test','2026-09-04 16:27:58',4,2),
(19,1,'EN_ATTENTE',null,null,5,2),
(20,2,'APPROUVEE','Demande validée par le responsable.','2026-09-04 18:49:08',5,3),
(21,1,'EN_ATTENTE',null,null,6,2),
(22,1,'EN_ATTENTE',null,null,7,2),
(23,2,'APPROUVEE','Demande validée par le responsable.','2026-09-04 19:23:19',7,2),
(24,1,'EN_ATTENTE',null,null,6,2),
(25,1,'EN_ATTENTE',null,null,8,2),
(26,2,'APPROUVEE','Demande validée par le responsable.','2026-09-04 19:25:11',8,2);


create table `visite` (
  `id` int(11) not null auto_increment,
  `date_entree` datetime default null,
  `date_sortie` datetime default null,
  `statut` enum('PREVUE','EN_COURS','TERMINEE','ANNULEE') not null default 'PREVUE',
  `rendez_vous_id` int(11) not null,
  `agent_accueil_id` int(11) not null,
  primary key (`id`),
  key `rendez_vous_id` (`rendez_vous_id`),
  key `agent_accueil_id` (`agent_accueil_id`),
  constraint `visite_ibfk_1`
    foreign key (`rendez_vous_id`) references `rendez_vous` (`id`),
  constraint `visite_ibfk_2`
    foreign key (`agent_accueil_id`) references `utilisateur` (`id`)
) engine=InnoDB auto_increment=3 default charset=latin1 collate=latin1_swedish_ci;

insert into `visite` values
(1,null,null,'PREVUE',1,4),
(2,'2026-09-04 18:00:00','2026-09-04 20:00:00','TERMINEE',21,4);


create table `piece_jointe` (
  `id` int(11) not null auto_increment,
  `nom_fichier` varchar(255) not null,
  `url_fichier` varchar(500) default null,
  `type_fichier` varchar(100) default null,
  `taille` bigint(20) default null,
  `date_ajout` datetime not null default current_timestamp(),
  `demande_id` int(11) not null,
  primary key (`id`),
  key `demande_id` (`demande_id`),
  constraint `piece_jointe_ibfk_1`
    foreign key (`demande_id`) references `demande` (`id`)
) engine=InnoDB auto_increment=2 default charset=latin1 collate=latin1_swedish_ci;

insert into `piece_jointe` values
(1,'attestation.pdf','/uploads/attestation.pdf','application/pdf',250000,'2026-09-03 02:38:24',1);


create table `log` (
  `id` int(11) not null auto_increment,
  `action` varchar(100) not null,
  `date_action` datetime not null default current_timestamp(),
  `adresse_ip` varchar(45) default null,
  `utilisateur_id` int(11) not null,
  primary key (`id`),
  key `utilisateur_id` (`utilisateur_id`),
  constraint `log_ibfk_1`
    foreign key (`utilisateur_id`) references `utilisateur` (`id`)
) engine=InnoDB auto_increment=11 default charset=latin1 collate=latin1_swedish_ci;

insert into `log` values
(1,'Soumission d\'une demande','2026-09-03 02:38:24','127.0.0.1',1),
(3,'CONNEXION','2026-09-04 19:53:40','::1',3),
(4,'MODIFICATION_PROFIL','2026-09-05 02:05:47','::1',3),
(5,'MODIFICATION_PROFIL','2026-09-05 02:05:50','::1',3),
(6,'MODIFICATION_PROFIL','2026-09-05 02:05:54','::1',3),
(7,'MODIFICATION_PROFIL','2026-09-05 02:10:48','::1',3),
(8,'MODIFICATION_PROFIL','2026-09-05 02:10:54','::1',3),
(9,'MODIFICATION_PROFIL','2026-09-05 02:19:52','::1',3),
(10,'MODIFICATION_PROFIL','2026-09-05 02:19:56','::1',3);


create table `notification` (
  `id` int(11) not null auto_increment,
  `message` text not null,
  `type` varchar(50) default null,
  `date_envoi` datetime not null default current_timestamp(),
  `est_lue` tinyint(1) not null default 0,
  `utilisateur_id` int(11) not null,
  `demande_id` int(11) default null,
  `rendez_vous_id` int(11) default null,
  primary key (`id`),
  key `utilisateur_id` (`utilisateur_id`),
  key `demande_id` (`demande_id`),
  key `rendez_vous_id` (`rendez_vous_id`),
  constraint `notification_ibfk_1`
    foreign key (`utilisateur_id`) references `utilisateur` (`id`),
  constraint `notification_ibfk_2`
    foreign key (`demande_id`) references `demande` (`id`),
  constraint `notification_ibfk_3`
    foreign key (`rendez_vous_id`) references `rendez_vous` (`id`)
) engine=InnoDB auto_increment=43 default charset=latin1 collate=latin1_swedish_ci;

insert into `notification` values
(1,'',null,'2026-09-03 02:38:24',1,2,1,null),
(2,'',null,'2026-09-04 15:42:27',1,1,3,null),
(3,'',null,'2026-09-04 15:42:30',1,1,3,null),
(4,'',null,'2026-09-04 15:42:30',1,1,3,null),
(5,'',null,'2026-09-04 15:42:31',1,1,3,null),
(6,'',null,'2026-09-04 15:42:31',1,1,3,null),
(7,'',null,'2026-09-04 15:42:31',1,1,3,null),
(8,'',null,'2026-09-04 15:42:32',1,1,3,null),
(9,'',null,'2026-09-04 15:42:35',1,1,3,null),
(10,'',null,'2026-09-04 15:42:37',1,1,1,null),
(11,'',null,'2026-09-04 15:42:37',1,1,1,null),
(12,'',null,'2026-09-04 15:42:37',1,1,1,null),
(13,'',null,'2026-09-04 15:42:38',1,1,1,null),
(14,'',null,'2026-09-04 15:42:41',1,1,1,null),
(15,'',null,'2026-09-04 16:23:49',1,1,4,null),
(16,'',null,'2026-09-04 16:27:58',1,1,4,null),
(17,'Le rendez-vous #2 a été créé.','RENDEZ_VOUS','2026-09-04 16:50:46',0,1,null,2),
(18,'Le rendez-vous #3 a été créé.','RENDEZ_VOUS','2026-09-04 16:52:08',0,1,null,3),
(19,'Le rendez-vous #4 a été créé.','RENDEZ_VOUS','2026-09-04 16:53:32',0,1,null,4),
(20,'Le rendez-vous #5 a été créé.','RENDEZ_VOUS','2026-09-04 16:54:44',0,1,null,5),
(21,'Le rendez-vous #7 a été créé.','RENDEZ_VOUS','2026-09-04 16:55:24',0,4,null,7),
(22,'Le rendez-vous #8 a été créé.','RENDEZ_VOUS','2026-09-04 16:56:04',0,1,null,8),
(23,'Le rendez-vous #9 a été créé.','RENDEZ_VOUS','2026-09-04 16:56:05',0,4,null,9),
(24,'Le rendez-vous #10 a été créé.','RENDEZ_VOUS','2026-09-04 16:56:06',0,4,null,10),
(25,'Le rendez-vous #11 a été créé.','RENDEZ_VOUS','2026-09-04 16:57:54',0,1,null,11),
(26,'Le rendez-vous #12 a été créé.','RENDEZ_VOUS','2026-09-04 17:06:29',0,1,null,12),
(27,'Un nouveau rendez-vous #13 a été créé.','RENDEZ_VOUS','2026-09-04 17:18:56',0,1,null,13),
(28,'Un nouveau rendez-vous #14 a été créé.','RENDEZ_VOUS','2026-09-04 17:19:42',0,1,null,14),
(29,'Un nouveau rendez-vous #16 a été créé.','RENDEZ_VOUS','2026-09-04 17:20:38',0,1,null,16),
(30,'x','RENDEZ_VOUS','2026-09-04 17:20:49',0,1,null,17),
(31,'Un nouveau rendez-vous #18 a été créé.','RENDEZ_VOUS','2026-09-04 17:21:57',0,1,null,18),
(32,'Un nouveau rendez-vous #19 a été créé.','RENDEZ_VOUS','2026-09-04 17:27:19',0,1,null,19),
(33,'Un nouveau rendez-vous #20 a été créé.','RENDEZ_VOUS','2026-09-04 17:31:06',0,1,null,20),
(34,'Un nouveau rendez-vous #21 a été créé.','RENDEZ_VOUS','2026-09-04 17:59:11',0,1,null,21),
(35,'',null,'2026-09-04 18:48:53',1,3,5,null),
(36,'',null,'2026-09-04 18:49:08',1,3,5,null),
(37,'',null,'2026-09-04 19:22:59',1,3,6,null),
(38,'Votre demande #7 a été soumise.','DEMANDE','2026-09-04 19:23:16',0,2,7,null),
(39,'Votre demande #7 a été acceptée.','VALIDATION','2026-09-04 19:23:19',0,2,7,null),
(40,'',null,'2026-09-04 19:23:20',1,3,6,null),
(41,'Votre demande #8 a été soumise.','DEMANDE','2026-09-04 19:24:34',0,1,8,null),
(42,'Votre demande #8 a été acceptée.','VALIDATION','2026-09-04 19:25:11',0,1,8,null);


set foreign_key_checks = 1;