import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateReport from "./pages/CreateReport";
// import CommunityReports from "./pages/CommunityReports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página de inicio de sesión */}
        <Route path="/" element={<Login />} />

        {/* Página principal */}
        <Route path="/home" element={<Home />} />

        <Route path="/create" element={<CreateReport />} />
        {/* <Route path="/community" element={<CommunityReports />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
