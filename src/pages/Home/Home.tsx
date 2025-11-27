import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import { HomeService } from "../../services/HomeServise"; // tu servicio
import { ReportsDto } from "../../Dtos/ReportsDto";

export default function Home() {
  const nav = useNavigate();
  const [showAllNotifs, setShowAllNotifs] = useState(false);
  const [reportes, setReportes] = useState<ReportsDto[]>([]);

  // Datos estáticos de notificaciones
  const notificaciones = [
    "Tu reporte ‘Fallas en el pasillo 1102’ ha sido actualizado por el equipo técnico.",
    "Tu reporte ‘Aula 202 sin luz’ ha sido atendido por mantenimiento.",
    "Nuevo comentario en tu reporte ‘Pérdida de conexión Wi-Fi’ por parte del área TI.",
  ];

  // Cargar reportes al montar
  useEffect(() => {
    async function cargarReportes() {
      try {
        const data = await HomeService.Reports(); // reemplaza 5 por id dinámico del usuario
        setReportes(data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      }
    }
    cargarReportes();
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo-title">
          <img src="/logo.png" className="home-logo" alt="ReportaUTS logo" />
          <h2 className="home-appname">ReportaUTS</h2>
        </div>
        <div className="home-actions">
          <button className="opt-btn" aria-label="Opciones">
            <img src="/icons/Opciones V2.png" alt="Opciones" />
          </button>
        </div>
      </header>

      {/* Welcome */}
      <section className="home-welcome">
        <h1>¡Hola, Eloy! 👋</h1>
        <p className="home-sub">Reporta fácil y mejora tu universidad</p>
      </section>

      {/* Zona con fondo cactus */}
      <div className="home-main-bg">
        <main className="home-content">
          <div className="card-row">
            <div className="home-card">
              <h3>Creación de Reportes</h3>
              <p>Crea un nuevo reporte con foto y ubicación.</p>
              <button className="card-btn" onClick={() => nav("/create")}>
                Hacer Reporte
              </button>
            </div>

            <div className="home-card">
              <h3>Reportes de la Comunidad</h3>
              <p>Ver reportes públicos hechos por otros usuarios.</p>
              <button className="card-btn" onClick={() => nav("/community")}>
                Ver más
              </button>
            </div>
          </div>

          {/* Sección Mis Reportes */}
          <div className="home-section reports-table">
            <h3>Mis reportes</h3>
            <div className="report-table">
              <div className="table-header">
                <span>Título</span>
                <span>Estado</span>
                <span>Fecha</span>
              </div>

              {reportes.length === 0 ? (
                <div className="table-row">
                  <span>No hay reportes aún</span>
                </div>
              ) : (
                reportes.map((rep, i) => (
                  <div key={i} className="table-row">
                    <span>{rep.titulo}</span>
                    <span className={`status ${rep.estado?.toLowerCase() ?? "pendiente"}`}>
                    {rep.estado ?? "Pendiente"}
                  </span>
                    <span>{rep.fechaFormateada}</span>
                  </div>
                ))
              )}
            </div>
            <button className="link-btn" onClick={() => nav("/my-reports")}>
              Ver más
            </button>
          </div>
        </main>
      </div>

      {/* Sección Notificaciones (fuera del fondo) */}
      <section className="notif-section">
        <h3>Notificaciones</h3>
        <div className="notif-list">
          {notificaciones
            .slice(0, showAllNotifs ? notificaciones.length : 1)
            .map((msg, i) => (
              <div key={i} className="notif-card">
                <img
                  src="/icons/notificacion.png"
                  alt="Notificación"
                  className="notif-icon"
                />
                <p className="notif-text">{msg}</p>
              </div>
            ))}
        </div>

        <button
          className="notif-more"
          onClick={() => setShowAllNotifs(!showAllNotifs)}
        >
          {showAllNotifs ? "▲ Ver menos" : "▼ Ver más"}
        </button>
      </section>

      <BottomNav />
    </div>
  );
}
