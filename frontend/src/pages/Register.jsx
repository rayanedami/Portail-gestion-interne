import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        confirmation: "",
        telephone: "",
        societe: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Vérification des champs obligatoires
        if (
            !formData.nom.trim() ||
            !formData.prenom.trim() ||
            !formData.email.trim() ||
            !formData.mot_de_passe
        ) {
            setError(
                "Veuillez remplir tous les champs obligatoires."
            );
            return;
        }

        // Vérification du mot de passe
        if (formData.mot_de_passe.length < 6) {
            setError(
                "Le mot de passe doit contenir au moins 6 caractères."
            );
            return;
        }

        // Confirmation du mot de passe
        if (
            formData.mot_de_passe !==
            formData.confirmation
        ) {
            setError(
                "Les mots de passe ne correspondent pas."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nom: formData.nom.trim(),
                        prenom: formData.prenom.trim(),
                        email: formData.email.trim(),
                        mot_de_passe: formData.mot_de_passe,
                        telephone:
                            formData.telephone.trim() || null,
                        societe:
                            formData.societe.trim() || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Erreur lors de la création du compte."
                );
                return;
            }

            setSuccess(
                "Compte créé avec succès ! Redirection vers la connexion..."
            );

            // Réinitialiser le formulaire
            setFormData({
                nom: "",
                prenom: "",
                email: "",
                mot_de_passe: "",
                confirmation: "",
                telephone: "",
                societe: ""
            });

            // Retour vers Login après 2 secondes
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.error(
                "Erreur inscription :",
                error
            );

            setError(
                "Impossible de contacter le serveur."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-header">
                    <h1>
                        Créer un compte
                    </h1>

                    <p>
                        Créez votre compte visiteur
                    </p>
                </div>

                {/* Message erreur */}
                {error && (
                    <div className="register-message register-error">
                        {error}
                    </div>
                )}

                {/* Message succès */}
                {success && (
                    <div className="register-message register-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Nom + Prénom */}
                    <div className="register-row">

                        <div className="register-group">
                            <label htmlFor="nom">
                                Nom *
                            </label>

                            <input
                                id="nom"
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Votre nom"
                                autoComplete="family-name"
                            />
                        </div>

                        <div className="register-group">
                            <label htmlFor="prenom">
                                Prénom *
                            </label>

                            <input
                                id="prenom"
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder="Votre prénom"
                                autoComplete="given-name"
                            />
                        </div>

                    </div>

                    {/* Email */}
                    <div className="register-group">
                        <label htmlFor="email">
                            Adresse email *
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            autoComplete="email"
                        />
                    </div>

                    {/* Téléphone */}
                    <div className="register-group">
                        <label htmlFor="telephone">
                            Téléphone
                        </label>

                        <input
                            id="telephone"
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="06 XX XX XX XX"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Société */}
                    <div className="register-group">
                        <label htmlFor="societe">
                            Société
                        </label>

                        <input
                            id="societe"
                            type="text"
                            name="societe"
                            value={formData.societe}
                            onChange={handleChange}
                            placeholder="Nom de votre société"
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="register-group">
                        <label htmlFor="mot_de_passe">
                            Mot de passe *
                        </label>

                        <input
                            id="mot_de_passe"
                            type="password"
                            name="mot_de_passe"
                            value={formData.mot_de_passe}
                            onChange={handleChange}
                            placeholder="Minimum 6 caractères"
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirmation */}
                    <div className="register-group">
                        <label htmlFor="confirmation">
                            Confirmer le mot de passe *
                        </label>

                        <input
                            id="confirmation"
                            type="password"
                            name="confirmation"
                            value={formData.confirmation}
                            onChange={handleChange}
                            placeholder="Confirmez votre mot de passe"
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Bouton */}
                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Création du compte..."
                            : "Créer mon compte"}
                    </button>

                </form>

                {/* Retour connexion */}
                <div className="register-footer">

                    <span>
                        Vous avez déjà un compte ?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Se connecter
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;