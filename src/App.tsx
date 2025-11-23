import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateReport from "./pages/CreateReport";
import ReportesComunidad from "./pages/ReportesComunidad";
import PerfilUsuario from "./pages/PerfilUsuario";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Página de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Página de registro */}
        <Route path="/register" element={<Register />} />

        {/* Página principal */}
        <Route path="/home" element={<Home />} />

        {/* Página de crear un reporte */}
        <Route path="/create" element={<CreateReport />} />

        {/* Página de reportes de la comunidad */}
        <Route path="/community" element={<ReportesComunidad />} /> 

        {/* Página de perfil del usuario */}
        <Route path="/profile" element={<PerfilUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}
