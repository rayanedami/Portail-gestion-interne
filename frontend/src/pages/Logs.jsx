import { useAuth } from '../context/AuthContext';

export default function Logs() {
    const { utilisateur } = useAuth();

    return (
        <div className="logs-page">
            <h1>Journaux d'Activité</h1>
            <p>Connecté en tant que: {utilisateur?.prenom} ({utilisateur?.role})</p>
            {/* TODO: Implémenter affichage des logs */}
        </div>
    );
}
