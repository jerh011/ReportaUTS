import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
//import Home from "./pages/Home"; // luego la crearemos

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página que se muestra al abrir */}
        <Route path="/" element={<Login />} />

        {/* Página principal después de iniciar sesión */}
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
