import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Accueil from "./pages/Accueil";
import Demandes from "./pages/Demandes";
import RendezVous from "./pages/RendezVous";
import Notifications from "./pages/Notifications";
import Profil from "./pages/Profil";
import PiecesJointes from "./pages/PiecesJointes";
import Validations from "./pages/Validations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/accueil"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR",
                            "AGENT_ACCUEIL"
                        ]}>
                            <Accueil />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/demandes"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR"
                        ]}>
                            <Demandes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rendez-vous"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR",
                            "AGENT_ACCUEIL"
                        ]}>
                            <RendezVous />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR",
                            "AGENT_ACCUEIL"
                        ]}>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profil"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR",
                            "AGENT_ACCUEIL"
                        ]}>
                            <Profil />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/validations"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "RESPONSABLE",
                            "ADMINISTRATEUR"
                        ]}>
                            <Validations />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pieces-jointes"
                    element={
                        <ProtectedRoute allowedRoles={[
                            "COLLABORATEUR",
                            "RESPONSABLE",
                            "ADMINISTRATEUR"
                        ]}>
                            <PiecesJointes />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;