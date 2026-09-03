import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROUTE_PERMISSIONS } from "./config/roleConfig";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Accueil from "./pages/Accueil";
import Demandes from "./pages/Demandes";
import RendezVous from "./pages/RendezVous";
import Notifications from "./pages/Notifications";
import Profil from "./pages/Profil";
import PiecesJointes from "./pages/PiecesJointes";
import Validations from "./pages/Validations";
import Visiteurs from "./pages/Visiteurs";
import Utilisateurs from "./pages/Utilisateurs";
import Logs from "./pages/Logs";
import Badges from "./pages/Badges";
import Visites from "./pages/Visites";
import ScannerQR from "./pages/ScannerQR";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* =========================
                        ROUTES PUBLIQUES
                    ========================= */}

                    <Route
                        path="/"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =========================
                        ROUTES PROTÉGÉES
                    ========================= */}

                    <Route
                        path="/accueil"
                        element={
                            <ProtectedRoute
                                element={<Accueil />}
                                allowedRoles={ROUTE_PERMISSIONS["/accueil"]}
                            />
                        }
                    />

                    <Route
                        path="/demandes"
                        element={
                            <ProtectedRoute
                                element={<Demandes />}
                                allowedRoles={ROUTE_PERMISSIONS["/demandes"]}
                            />
                        }
                    />

                    <Route
                        path="/rendez-vous"
                        element={
                            <ProtectedRoute
                                element={<RendezVous />}
                                allowedRoles={ROUTE_PERMISSIONS["/rendez-vous"]}
                            />
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute
                                element={<Notifications />}
                                allowedRoles={ROUTE_PERMISSIONS["/notifications"]}
                            />
                        }
                    />

                    <Route
                        path="/profil"
                        element={
                            <ProtectedRoute
                                element={<Profil />}
                                allowedRoles={ROUTE_PERMISSIONS["/profil"]}
                            />
                        }
                    />

                    <Route
                        path="/validations"
                        element={
                            <ProtectedRoute
                                element={<Validations />}
                                allowedRoles={ROUTE_PERMISSIONS["/validations"]}
                            />
                        }
                    />

                    <Route
                        path="/pieces-jointes"
                        element={
                            <ProtectedRoute
                                element={<PiecesJointes />}
                                allowedRoles={ROUTE_PERMISSIONS["/pieces-jointes"]}
                            />
                        }
                    />

                    <Route
                        path="/visiteurs"
                        element={
                            <ProtectedRoute
                                element={<Visiteurs />}
                                allowedRoles={ROUTE_PERMISSIONS["/visiteurs"]}
                            />
                        }
                    />

                    <Route
                        path="/utilisateurs"
                        element={
                            <ProtectedRoute
                                element={<Utilisateurs />}
                                allowedRoles={ROUTE_PERMISSIONS["/utilisateurs"]}
                            />
                        }
                    />

                    <Route
                        path="/logs"
                        element={
                            <ProtectedRoute
                                element={<Logs />}
                                allowedRoles={ROUTE_PERMISSIONS["/logs"]}
                            />
                        }
                    />

                    <Route
                        path="/badges"
                        element={
                            <ProtectedRoute
                                element={<Badges />}
                                allowedRoles={ROUTE_PERMISSIONS["/badges"]}
                            />
                        }
                    />

                    <Route
                        path="/visites"
                        element={
                            <ProtectedRoute
                                element={<Visites />}
                                allowedRoles={ROUTE_PERMISSIONS["/visites"]}
                            />
                        }
                    />

                    <Route
                        path="/scanner-qr"
                        element={
                            <ProtectedRoute
                                element={<ScannerQR />}
                                allowedRoles={ROUTE_PERMISSIONS["/scanner-qr"]}
                            />
                        }
                    />


                    {/* =========================
                        ROUTE PAR DÉFAUT
                    ========================= */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;