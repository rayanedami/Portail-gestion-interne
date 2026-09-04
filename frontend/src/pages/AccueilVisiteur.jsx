import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Bell, CalendarDays, CircleUserRound, Info, Ticket } from "lucide-react";
import "./AccueilVisiteur.css";

function AccueilVisiteur() {
    const navigate = useNavigate();
    const { utilisateur } = useAuth();

    const prenom = utilisateur?.prenom || "Visiteur";
    const nom = utilisateur?.nom || "";

    return (
        <div className="visiteur-page">

            <header className="visiteur-header">

                <div className="visiteur-brand">
                    <div className="visiteur-logo">
                        <img src="/s-logo.png" alt="Portail de Gestion Interne" />
                    </div>

                    <div>
                        <h1>Portail de Gestion Interne</h1>
                        <p>Espace visiteur</p>
                    </div>
                </div>

                <div className="visiteur-user">

                    <div className="user-avatar">
                        {prenom.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {prenom} {nom}
                        </strong>

                        <span>
                            Visiteur
                        </span>
                    </div>

                </div>

            </header>


            <main className="visiteur-content">

                <section className="welcome-card">

                    <div>

                        <span className="welcome-label">
                            ESPACE VISITEUR
                        </span>

                        <h2>
                            Bienvenue, {prenom}
                        </h2>

                        <p>
                            Depuis cet espace, vous pouvez gérer vos
                            rendez-vous, consulter votre badge numérique
                            et suivre les informations concernant vos visites.
                        </p>

                    </div>

                    <div className="welcome-icon">
                        <CircleUserRound size={38} />
                    </div>

                </section>


                <section className="section-block">

                    <div className="section-title">

                        <h3>
                            Mes services
                        </h3>

                        <p>
                            Accédez rapidement aux fonctionnalités disponibles.
                        </p>

                    </div>


                    <div className="services-grid">

                        <button
                            className="service-card"
                            onClick={() => navigate("/rendez-vous")}
                        >

                            <div className="service-icon appointment-icon">
                                <CalendarDays size={22} />
                            </div>

                            <div className="service-text">

                                <h4>
                                    Mes rendez-vous
                                </h4>

                                <p>
                                    Consultez vos rendez-vous et demandez
                                    une nouvelle visite.
                                </p>

                            </div>

                            <span className="service-arrow">
                                <ArrowRight size={18} />
                            </span>

                        </button>


                        <button
                            className="service-card"
                            onClick={() => navigate("/mon-badge")}
                        >

                            <div className="service-icon badge-icon">
                                <Ticket size={22} />
                            </div>

                            <div className="service-text">

                                <h4>
                                    Mon badge QR
                                </h4>

                                <p>
                                    Consultez votre badge numérique lorsque
                                    votre rendez-vous est confirmé.
                                </p>

                            </div>

                            <span className="service-arrow">
                                <ArrowRight size={18} />
                            </span>

                        </button>


                        <button
                            className="service-card"
                            onClick={() => navigate("/notifications")}
                        >

                            <div className="service-icon notification-icon">
                                <Bell size={22} />
                            </div>

                            <div className="service-text">

                                <h4>
                                    Notifications
                                </h4>

                                <p>
                                    Consultez les informations et mises
                                    à jour concernant vos rendez-vous.
                                </p>

                            </div>

                            <span className="service-arrow">
                                <ArrowRight size={18} />
                            </span>

                        </button>


                        <button
                            className="service-card"
                            onClick={() => navigate("/profil")}
                        >

                            <div className="service-icon profile-icon">
                                <CircleUserRound size={22} />
                            </div>

                            <div className="service-text">

                                <h4>
                                    Mon profil
                                </h4>

                                <p>
                                    Consultez et modifiez vos informations
                                    personnelles.
                                </p>

                            </div>

                            <span className="service-arrow">
                                <ArrowRight size={18} />
                            </span>

                        </button>

                    </div>

                </section>


                <section className="information-card">

                    <div className="information-icon">
                        <Info size={22} />
                    </div>

                    <div>

                        <h3>
                            Comment fonctionne votre visite ?
                        </h3>

                        <p>
                            Après confirmation de votre rendez-vous,
                            un badge numérique avec QR Code est disponible
                            dans votre espace. Présentez ce QR Code à
                            l'accueil lors de votre arrivée.
                        </p>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AccueilVisiteur;