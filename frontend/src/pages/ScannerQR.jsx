import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";
import { Camera, Square } from "lucide-react";
import "./ScannerQR.css";
import "../components/ReturnHomeButton.css";

const API_URL = "http://localhost:3000/api";

function ScannerQR() {
    const scannerRef = useRef(null);
    const [scannerActif, setScannerActif] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultat, setResultat] = useState(null);
    const [error, setError] = useState("");

    const obtenirUtilisateur = () => {
        try {
            const utilisateur = JSON.parse(
                localStorage.getItem("utilisateur")
            );

            return utilisateur;
        } catch (error) {
            console.error("Erreur utilisateur :", error);
            return null;
        }
    };

    const obtenirDateLocale = () => {
        const maintenant = new Date();

        const annee = maintenant.getFullYear();
        const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
        const jour = String(maintenant.getDate()).padStart(2, "0");
        const heures = String(maintenant.getHours()).padStart(2, "0");
        const minutes = String(maintenant.getMinutes()).padStart(2, "0");
        const secondes = String(maintenant.getSeconds()).padStart(2, "0");

        return `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
    };

    const arreterScanner = async () => {
        try {
            if (scannerRef.current) {
                const state = scannerRef.current.getState();

                if (state === 2) {
                    await scannerRef.current.stop();
                }

                await scannerRef.current.clear();
                scannerRef.current = null;
            }
        } catch (error) {
            console.error("Erreur arrêt scanner :", error);
        }

        setScannerActif(false);
    };

    const creerVisite = async (badge) => {
        try {
            setLoading(true);
            setError("");

            const dateEntree = obtenirDateLocale();

            const response = await api.post("/visites", {
                date_entree: dateEntree,
                qr_code: badge.qr_code
            });

            const data = response.data;

            setResultat({
                type: "success",
                message: "Badge valide. Visiteur enregistré comme présent.",
                badge,
                visite: data.visite
            });

        } catch (error) {
            console.error("Erreur création visite :", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Erreur lors de l'enregistrement de la visite."
            );
        } finally {
            setLoading(false);
        }
    };

    const verifierQRCode = async (qrCode) => {
        try {
            setLoading(true);
            setError("");
            setResultat(null);

            await arreterScanner();

            const verification = await api.get(`/badges/verify?qr_code=${encodeURIComponent(qrCode)}`);
            await creerVisite(verification.data.badge);

        } catch (error) {
            console.error("Erreur vérification QR :", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Erreur lors de la vérification du QR Code."
            );
        } finally {
            setLoading(false);
        }
    };

    const demarrerScanner = async () => {
        try {
            setError("");
            setResultat(null);

            const scanner = new Html5Qrcode("qr-reader");

            scannerRef.current = scanner;

            await scanner.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },
                async (decodedText) => {
                    await verifierQRCode(decodedText);
                },
                () => {
                    // Les erreurs de lecture normales sont ignorées.
                }
            );

            setScannerActif(true);

        } catch (error) {
            console.error("Erreur caméra :", error);

            setError(
                "Impossible d'accéder à la caméra. Vérifiez l'autorisation du navigateur."
            );

            setScannerActif(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current
                    .stop()
                    .catch(() => { });
            }
        };
    }, []);

    return (
        <div className="scanner-page">
            <button className="return-home-button" type="button" onClick={() => window.location.assign("/accueil")}>Retour a l'accueil</button>

            <div className="scanner-header">

                <div>
                    <h1>Scanner QR Code</h1>

                    <p>
                        Vérification du badge numérique du visiteur
                        à l'accueil.
                    </p>
                </div>

            </div>

            <div className="scanner-layout">

                <div className="scanner-camera-card">

                    <div className="scanner-title">

                        <div className="scanner-icon">
                            <Camera size={24} />
                        </div>

                        <div>
                            <h2>Scanner le badge</h2>

                            <p>
                                Présentez le QR Code du visiteur
                                devant la caméra.
                            </p>
                        </div>

                    </div>

                    <div
                        id="qr-reader"
                        className="qr-reader"
                    ></div>

                    <div className="scanner-actions">

                        {!scannerActif ? (

                            <button
                                className="btn-start-scanner"
                                onClick={demarrerScanner}
                                disabled={loading}
                            >
                                <Camera size={17} /> Démarrer la caméra
                            </button>

                        ) : (

                            <button
                                className="btn-stop-scanner"
                                onClick={arreterScanner}
                            >
                                <Square size={17} /> Arrêter le scanner
                            </button>

                        )}

                    </div>

                </div>

                <div className="scanner-info-card">

                    <h2>Comment ça fonctionne ?</h2>

                    <div className="scanner-step">
                        <span>1</span>
                        <p>
                            Le visiteur présente son badge QR
                            à l'accueil.
                        </p>
                    </div>

                    <div className="scanner-step">
                        <span>2</span>
                        <p>
                            L'agent d'accueil scanne le QR Code.
                        </p>
                    </div>

                    <div className="scanner-step">
                        <span>3</span>
                        <p>
                            Le système vérifie le badge et
                            le rendez-vous.
                        </p>
                    </div>

                    <div className="scanner-step">
                        <span>4</span>
                        <p>
                            Si le badge est valide, l'entrée
                            est enregistrée.
                        </p>
                    </div>

                </div>

            </div>

            {loading && (
                <div className="scanner-loading">
                    Vérification du badge...
                </div>
            )}

            {error && (
                <div className="scanner-error">
                    <strong>Erreur :</strong> {error}
                </div>
            )}

            {resultat && (
                <div
                    className={
                        resultat.type === "success"
                            ? "scanner-result success"
                            : "scanner-result error"
                    }
                >

                    <div className="result-icon">
                        {resultat.type === "success"
                            ? "✓"
                            : "✕"}
                    </div>

                    <div>

                        <h3>
                            {resultat.type === "success"
                                ? "Badge valide"
                                : "Badge invalide"}
                        </h3>

                        <p>
                            {resultat.message}
                        </p>

                        {resultat.badge && (
                            <div className="badge-result-details">

                                <p>
                                    <strong>Badge :</strong>{" "}
                                    #{resultat.badge.id}
                                </p>

                                <p>
                                    <strong>Rendez-vous :</strong>{" "}
                                    #{resultat.badge.rendez_vous_id}
                                </p>

                                <p>
                                    <strong>Statut :</strong>{" "}
                                    {resultat.badge.statut}
                                </p>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default ScannerQR;