import { useAuth } from '../context/AuthContext';

export default function Utilisateurs() {
    const { utilisateur } = useAuth();

    return (
        <div className="utilisateurs-page">
            <h1>Gestion des Utilisateurs</h1>
            <p>Connecté en tant que: {utilisateur?.prenom} ({utilisateur?.role})</p>
            {/* TODO: Implémenter liste des utilisateurs et CRUD */}
        </div>
    );
}
