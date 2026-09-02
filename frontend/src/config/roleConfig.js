export const ROLES = {
    COLLABORATEUR: "COLLABORATEUR",
    RESPONSABLE: "RESPONSABLE",
    ADMINISTRATEUR: "ADMINISTRATEUR",
    AGENT_ACCUEIL: "AGENT_ACCUEIL"
};

export const ROUTE_PERMISSIONS = {
    "/accueil": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL
    ],
    "/demandes": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR
    ],
    "/validations": [
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR
    ],
    "/rendez-vous": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL
    ],
    "/visiteurs": [
        ROLES.AGENT_ACCUEIL,
        ROLES.ADMINISTRATEUR
    ],
    "/notifications": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL
    ],
    "/profil": [
        ROLES.COLLABORATEUR,
        ROLES.RESPONSABLE,
        ROLES.ADMINISTRATEUR,
        ROLES.AGENT_ACCUEIL
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
        { label: "Accueil", path: "/accueil", icon: "🏠" },
        { label: "Mes demandes", path: "/demandes", icon: "📄" },
        { label: "Mes rendez-vous", path: "/rendez-vous", icon: "📅" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
        { label: "Profil", path: "/profil", icon: "👤" }
    ],
    [ROLES.RESPONSABLE]: [
        { label: "Accueil", path: "/accueil", icon: "🏠" },
        { label: "Demandes", path: "/demandes", icon: "📄" },
        { label: "Validations", path: "/validations", icon: "✅" },
        { label: "Visiteurs", path: "/visiteurs", icon: "👥" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "📅" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
        { label: "Profil", path: "/profil", icon: "👤" }
    ],
    [ROLES.ADMINISTRATEUR]: [
        { label: "Accueil", path: "/accueil", icon: "🏠" },
        { label: "Demandes", path: "/demandes", icon: "📄" },
        { label: "Validations", path: "/validations", icon: "✅" },
        { label: "Utilisateurs", path: "/utilisateurs", icon: "👥" },
        { label: "Visiteurs", path: "/visiteurs", icon: "🏢" },
        { label: "Visites", path: "/visites", icon: "📋" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "📅" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
        { label: "Logs", path: "/logs", icon: "📋" },
        { label: "Profil", path: "/profil", icon: "👤" }
    ],
    [ROLES.AGENT_ACCUEIL]: [
        { label: "Accueil", path: "/accueil", icon: "🏠" },
        { label: "Visiteurs", path: "/visiteurs", icon: "👥" },
        { label: "Visites", path: "/visites", icon: "📋" },
        { label: "Rendez-vous", path: "/rendez-vous", icon: "📅" },
        { label: "Badges/QR", path: "/badges", icon: "🎫" },
        { label: "Scanner QR", path: "/scanner-qr", icon: "📱" },
        { label: "Notifications", path: "/notifications", icon: "🔔" },
        { label: "Profil", path: "/profil", icon: "👤" }
    ]
};
