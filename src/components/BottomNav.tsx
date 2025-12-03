import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // Mapa con la ruta y los nombres exactos de tus íconos
  const icons: Record<
    string,
    { active: string; inactive: string }
  > = {
    "/create": {
      active: "/icons/Crear Reporte V2.png",
      inactive: "/icons/Crear Reporte V1.png",
    },
    "/my-reports": {
      active: "/icons/Mis Reportes V2.png",
      inactive: "/icons/Mis Reportes V1.png",
    },
    "/home": {
      active: "/icons/casa V2.png",
      inactive: "/icons/casa V1.png",
    },
    "/community": {
      active: "/icons/Reportes de Comunidad V2.png",
      inactive: "/icons/Reportes de Comunidad V1.png",
    },
    "/profile": {
      active: "/icons/Detalles Usuario V2.png",
      inactive: "/icons/Detalles Usuario V1.png",
    },
  };

  // Función para obtener el icono correcto
  const getIcon = (route: string) =>
    pathname === route ? icons[route].active : icons[route].inactive;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Barra inferior">

      <button className="nav-item" onClick={() => nav("/create")}>
        <img src={getIcon("/create")} alt="Crear" />
      </button>

      <button className="nav-item" onClick={() => nav("/my-reports")}>
        <img src={getIcon("/my-reports")} alt="Mis Reportes" />
      </button>

      <button className="nav-item center-btn" onClick={() => nav("/home")}>
        <img src={getIcon("/home")} alt="Inicio" />
      </button>

      <button className="nav-item" onClick={() => nav("/community")}>
        <img src={getIcon("/community")} alt="Comunidad" />
      </button>

      <button className="nav-item" onClick={() => nav("/profile")}>
        <img src={getIcon("/profile")} alt="Perfil" />
      </button>

    </nav>
  );
}
