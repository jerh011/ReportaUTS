import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import CreateReport from "./pages/CreateReport/CreateReport";
import ReportesComunidad from "./pages/ReportesComunidad/ReportesComunidad";
import PerfilUsuario from "./pages/Perfil/PerfilUsuario";
import MisReportes from "./pages/MisReportes/MisReportes";

import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import PWABadge from "./PWABadge";

import { OfflineReportService } from "./services/OfflineReportService";

export default function App() {

  // ✅ Sincronización automática de reportes offline
  useEffect(() => {
    const handleOnline = async () => {
      console.log("📡 Conexión recuperada, sincronizando reportes offline...");
      await OfflineReportService.sync();
    };

    window.addEventListener("online", handleOnline);

    // ✅ Si inicia y ya está online
    if (navigator.onLine) {
      OfflineReportService.sync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoutes>
                <CreateReport />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/community"
            element={
              <ProtectedRoutes>
                <ReportesComunidad />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <PerfilUsuario />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/my-reports"
            element={
              <ProtectedRoutes>
                <MisReportes />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>

      <PWABadge />
    </div>
  );
}
