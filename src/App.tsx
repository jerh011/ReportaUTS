import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateReport from "./pages/CreateReport";
// import CommunityReports from "./pages/CommunityReports";

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

        {/* <Route path="/community" element={<CommunityReports />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
