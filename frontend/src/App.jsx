import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Accueil from "./pages/Accueil";
import Demandes from "./pages/Demandes";
import Notifications from "./pages/Notifications";
import RendezVous from "./pages/RendezVous";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ================= LOGIN ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />


                {/* ================= ACCUEIL ================= */}

                <Route
                    path="/accueil"
                    element={<Accueil />}
                />

                <Route
                    path="/demandes"
                    element={<Demandes />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/rendez-vous"
                    element={<RendezVous />}
                />


                {/* ================= REDIRECTION ================= */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;