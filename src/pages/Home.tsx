import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const nav = useNavigate();
  const [showAllNotifs, setShowAllNotifs] = useState(false);

  const notificaciones = [
    "Tu reporte ‘Fallas en el pasillo 1102’ ha sido actualizado por el equipo técnico.",
    "Tu reporte ‘Aula 202 sin luz’ ha sido atendido por mantenimiento.",
    "Nuevo comentario en tu reporte ‘Pérdida de conexión Wi-Fi’ por parte del área TI.",
  ];

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
                {/* <span>Categoria</span> */}
                <span>Estado</span>
                <span>Fecha</span>
              </div>
              <div className="table-row">
                <span>🚧 Fuga en laboratorio</span>
                {/* <span>Mantenimiento</span> */}
                <span className="status pending">En proceso</span>
                <span>10/11/25</span>
              </div>
              <div className="table-row">
                <span>💡 Foco fundido biblioteca</span>
                {/* <span>Mantenimiento</span> */}
                <span className="status solved">Resuelto</span>
                <span>08/11/25</span>
              </div>
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
