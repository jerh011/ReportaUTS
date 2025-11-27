import { useState } from "react";
import PWABadge from "../../PWABadge";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { LoginService } from "../../services/LoginService";
import type { LoginDto } from "../../Dtos/LoginDtos";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!user.trim() || !password.trim()) {
      // alert("Por favor ingresa usuario y contraseña.");
      return;
    }

    const payload: LoginDto = {
      user: user,
      contraseña: password,
    };

    try {
       await LoginService.login(payload);
       navigate("/home");
    } catch (error) {
      console.error("Error en login:", error);
      // alert("Usuario o contraseña incorrectos");
    }
  };

  

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.png" alt="Logo ReportaUTS" className="login-logo" />

        <h1 className="login-title">ReportaUTS</h1>

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="login-input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <p className="login-link">
          ¿No tienes cuenta?{" "}
          <a
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            Regístrate
          </a>
        </p>

        <p className="login-link small">
          ¿Olvidaste tu contraseña?{" "}
          <a
            onClick={() => alert("Próximamente")}
            style={{ cursor: "pointer" }}
          >
            Recupérala aquí
          </a>
        </p>
      </div>

      <PWABadge />
    </div>
  );
}
