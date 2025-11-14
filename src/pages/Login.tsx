import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulación de autenticación
    navigate("/home");
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <img
          src="/logo.png"
          alt="Logo ReportaUTS"
          className="login-logo"
        />

        <h1 className="login-title">ReportaUTS</h1>

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="login-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>Iniciar Sesión</button>

        <p className="login-link">
          ¿No tienes cuenta?{" "}
          <a onClick={() => navigate("/register")}>Regístrate</a>
        </p>

        <p className="login-link small">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
        </p>

      </div>
    </div>
  );
}
