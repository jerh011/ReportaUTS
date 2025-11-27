import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [touched, setTouched] = useState({
    nombre: false,
    apellidos: false,
    usuario: false,
    contrasena: false,
    confirmar: false,
    correo: false,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    contrasena: "",
    confirmar: "",
    correo: "",
    telefono: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // SOLO números en teléfono
    if (name === "telefono") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });

    // Validación en tiempo real de contraseñas
    if (name === "contrasena" || name === "confirmar") {
      if (
        (name === "contrasena" && value !== formData.confirmar) ||
        (name === "confirmar" && value !== formData.contrasena)
      ) {
        setPasswordError("Las contraseñas no coinciden");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      alert("Corrige los errores antes de continuar.");
      return;
    }

    alert("Cuenta creada exitosamente ✅");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/logo.png" alt="Logo ReportaUTS" className="register-logo" />
        <h1 className="register-title">ReportaUTS</h1>

        <form onSubmit={handleRegister} className="register-form">
          {/* CAMPOS OBLIGATORIOS */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre(s)"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.nombre && !formData.nombre ? "input-error" : ""}
            required
          />

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.apellidos && !formData.apellidos ? "input-error" : ""}
            required
          />

          <input
            type="text"
            name="usuario"
            placeholder="Nombre de usuario"
            value={formData.usuario}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.usuario && !formData.usuario ? "input-error" : ""}
            required
          />

          {/* CONTRASEÑA */}
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              touched.contrasena && (!formData.contrasena || passwordError)
                ? "input-error"
                : ""
            }
            required
          />

          <input
            type="password"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={formData.confirmar}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              touched.confirmar && (!formData.confirmar || passwordError)
                ? "input-error"
                : ""
            }
            required
          />

          {/* MENSAJE DE ERROR */}
          {passwordError && (
            <p className="error-message">{passwordError}</p>
          )}

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.correo && !formData.correo ? "input-error" : ""}
            required
          />

          <input
            type="tel"
            name="telefono"
            placeholder="Número de teléfono (opcional)"
            value={formData.telefono}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Crear Nueva Cuenta
          </button>
        </form>

        <p className="register-link">
          ¿Ya cuentas con una cuenta?{" "}
          <a onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </a>
        </p>
      </div>
      
    </div>
  );
}
