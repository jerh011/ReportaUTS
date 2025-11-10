import "./Login.css";

export default function Login() {
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

        <button className="login-btn">Iniciar Sesión</button>

        <p className="login-link">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>

        <p className="login-link small">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala aquí</a>
        </p>

      </div>
    </div>
  );
}
