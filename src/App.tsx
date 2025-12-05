import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotificationContainer from "./NotificationContainer";
import { OfflineSyncService } from "./services/OfflineSyncService ";
import { NotificacionService } from "./services/NotificacionService";

export default function App() {
  useEffect(() => {
    // Inicializar sincronización automática cuando la app se carga
    OfflineSyncService.initializeAutoSync((result) => {
      NotificacionService.sincronizacionCompletada(
        result.success,
        result.failed
      );
    });

    // Verificar el estado de conexión inicial
    if (!navigator.onLine && OfflineSyncService.hasPendingReports()) {
      const count = OfflineSyncService.getPendingCount();
      NotificacionService.info(
        "Modo offline",
        `Tienes ${count} reporte${count > 1 ? "s" : ""} pendiente${
          count > 1 ? "s" : ""
        } de sincronizar.`
      );
    }

    // Listener para detectar cuando se pierde la conexión
    const handleOffline = () => {
      NotificacionService.conexionPerdida();
    };

    // Listener para detectar cuando se recupera la conexión
    const handleOnline = () => {
      NotificacionService.conexionRestaurada();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Cleanup
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div>
      <NotificationContainer />
      <BrowserRouter>
        <Routes>
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

          {/* Rutas protegidas (solo usuario logueado) */}
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
