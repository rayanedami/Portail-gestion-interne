import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROLES, ROUTE_PERMISSIONS } from "./config/roleConfig";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Accueil from "./pages/Accueil";
import AccueilVisiteur from "./pages/AccueilVisiteur";

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
import MonBadge from "./pages/MonBadge";
import Visites from "./pages/Visites";
import ScannerQR from "./pages/ScannerQR";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>

                <Routes>

                    {/* PUBLIC */}

                    <Route
                        path="/"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route path="/reset-password" element={<ResetPassword />} />


                    {/* VISITEUR */}

                    <Route
                        path="/accueil-visiteur"
                        element={
                            <ProtectedRoute
                                element={<AccueilVisiteur />}
                                allowedRoles={[
                                    ROLES.VISITEUR
                                ]}
                            />
                        }
                    />

                    <Route
                        path="/mon-badge"
                        element={
                            <ProtectedRoute
                                element={<MonBadge />}
                                allowedRoles={[
                                    ROLES.VISITEUR
                                ]}
                            />
                        }
                    />


                    {/* ACCUEIL */}

                    <Route
                        path="/accueil"
                        element={
                            <ProtectedRoute
                                element={<Accueil />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/accueil"]
                                }
                            />
                        }
                    />


                    {/* DEMANDES */}

                    <Route
                        path="/demandes"
                        element={
                            <ProtectedRoute
                                element={<Demandes />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/demandes"]
                                }
                            />
                        }
                    />

                    <Route
                        path="/nouvelle-demande"
                        element={
                            <ProtectedRoute
                                element={<Demandes />}
                                allowedRoles={ROUTE_PERMISSIONS["/nouvelle-demande"]}
                            />
                        }
                    />


                    {/* RENDEZ-VOUS */}

                    <Route
                        path="/rendez-vous"
                        element={
                            <ProtectedRoute
                                element={<RendezVous />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/rendez-vous"]
                                }
                            />
                        }
                    />


                    {/* NOTIFICATIONS */}

                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute
                                element={<Notifications />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/notifications"]
                                }
                            />
                        }
                    />


                    {/* PROFIL */}

                    <Route
                        path="/profil"
                        element={
                            <ProtectedRoute
                                element={<Profil />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/profil"]
                                }
                            />
                        }
                    />


                    {/* VALIDATIONS */}

                    <Route
                        path="/validations"
                        element={
                            <ProtectedRoute
                                element={<Validations />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/validations"]
                                }
                            />
                        }
                    />


                    {/* PIECES JOINTES */}

                    <Route
                        path="/pieces-jointes"
                        element={
                            <ProtectedRoute
                                element={<PiecesJointes />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/pieces-jointes"]
                                }
                            />
                        }
                    />


                    {/* VISITEURS */}

                    <Route
                        path="/visiteurs"
                        element={
                            <ProtectedRoute
                                element={<Visiteurs />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/visiteurs"]
                                }
                            />
                        }
                    />


                    {/* UTILISATEURS */}

                    <Route
                        path="/utilisateurs"
                        element={
                            <ProtectedRoute
                                element={<Utilisateurs />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/utilisateurs"]
                                }
                            />
                        }
                    />


                    {/* LOGS */}

                    <Route
                        path="/logs"
                        element={
                            <ProtectedRoute
                                element={<Logs />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/logs"]
                                }
                            />
                        }
                    />


                    {/* BADGES AGENT / ADMIN */}

                    <Route
                        path="/badges"
                        element={
                            <ProtectedRoute
                                element={<Badges />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/badges"]
                                }
                            />
                        }
                    />


                    {/* VISITES */}

                    <Route
                        path="/visites"
                        element={
                            <ProtectedRoute
                                element={<Visites />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/visites"]
                                }
                            />
                        }
                    />


                    {/* SCANNER QR */}

                    <Route
                        path="/scanner-qr"
                        element={
                            <ProtectedRoute
                                element={<ScannerQR />}
                                allowedRoles={
                                    ROUTE_PERMISSIONS["/scanner-qr"]
                                }
                            />
                        }
                    />


                    {/* ROUTE INCONNUE */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;