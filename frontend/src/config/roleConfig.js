export const ROLES = {
    COLLABORATEUR: "COLLABORATEUR",
    RESPONSABLE: "RESPONSABLE",
    ADMINISTRATEUR: "ADMINISTRATEUR",
    AGENT_ACCUEIL: "AGENT_ACCUEIL",
    VISITEUR: "VISITEUR"
};

export const ROUTE_PERMISSIONS = {
    "/accueil": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL
    ],

    "/accueil-visiteur": [
        ROLES.VISITEUR
    ],

    "/demandes": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR
    ],

    "/nouvelle-demande": [
        ROLES.COLLABORATEUR
    ],

    "/validations": [
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR
    ],

    "/rendez-vous": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL,
        ROLES.VISITEUR
    ],

    "/mon-badge": [
        ROLES.VISITEUR
    ],

    "/visiteurs": [
        ROLES.AGENT_ACCUEIL,
        ROLES.ADMINISTRATEUR
    ],

    "/notifications": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL,
        ROLES.VISITEUR
    ],

    "/profil": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL,
        ROLES.VISITEUR
    ],

    "/pieces-jointes": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR
    ],

    "/utilisateurs": [
        ROLES.ADMINISTRATEUR
    ],

    "/logs": [
        ROLES.ADMINISTRATEUR
    ],

    "/badges": [
        ROLES.AGENT_ACCUEIL,
        ROLES.ADMINISTRATEUR
    ],

    "/visites": [
        ROLES.AGENT_ACCUEIL,
        ROLES.ADMINISTRATEUR
    ],

    "/scanner-qr": [
        ROLES.AGENT_ACCUEIL,
        ROLES.ADMINISTRATEUR
    ]
};


export const MENU_ITEMS_BY_ROLE = {

    [ROLES.COLLABORATEUR]: [
        { label: "Accueil", path: "/accueil", icon: "home" },
        { label: "Mes demandes", path: "/demandes", icon: "clipboard" },
        { label: "Nouvelle demande", path: "/nouvelle-demande", icon: "plus" },
        { label: "Mes rendez-vous", path: "/rendez-vous", icon: "calendar" },
        { label: "Notifications", path: "/notifications", icon: "bell" },
        { label: "Profil", path: "/profil", icon: "user" }
    ],

    [ROLES.RESPONSABLE]: [
        { label: "Accueil", path: "/accueil", icon: "home" },
        { label: "Demandes", path: "/demandes", icon: "clipboard" },
        { label: "Validations", path: "/validations", icon: "check" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "calendar" },
        { label: "Notifications", path: "/notifications", icon: "bell" },
        { label: "Profil", path: "/profil", icon: "user" }
    ],

    [ROLES.ADMINISTRATEUR]: [
        { label: "Accueil", path: "/accueil", icon: "home" },
        { label: "Demandes", path: "/demandes", icon: "clipboard" },
        { label: "Validations", path: "/validations", icon: "check" },
        { label: "Utilisateurs", path: "/utilisateurs", icon: "users" },
        { label: "Visiteurs", path: "/visiteurs", icon: "building" },
        { label: "Visites", path: "/visites", icon: "list" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "calendar" },
        { label: "Notifications", path: "/notifications", icon: "bell" },
        { label: "Logs", path: "/logs", icon: "list" },
        { label: "Profil", path: "/profil", icon: "user" }
    ],

    [ROLES.AGENT_ACCUEIL]: [
        { label: "Accueil", path: "/accueil", icon: "home" },
        { label: "Visiteurs", path: "/visiteurs", icon: "users" },
        { label: "Visites", path: "/visites", icon: "list" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "calendar" },
        { label: "Badges/QR", path: "/badges", icon: "badge" },
        { label: "Scanner QR", path: "/scanner-qr", icon: "scan" },
        { label: "Notifications", path: "/notifications", icon: "bell" },
        { label: "Profil", path: "/profil", icon: "user" }
    ],

    [ROLES.VISITEUR]: [
        { label: "Accueil", path: "/accueil-visiteur", icon: "home" },
        { label: "Mes rendez-vous", path: "/rendez-vous", icon: "calendar" },
        { label: "Mon badge QR", path: "/mon-badge", icon: "badge" },
        { label: "Notifications", path: "/notifications", icon: "bell" },
        { label: "Profil", path: "/profil", icon: "user" }
    ]
};