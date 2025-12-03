// src/pages/Register.tsx
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginService } from "../../services/LoginService";
import { RegisterUserDto } from "../../Dtos/RegisterUserDto ";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    contrasena: "",
    confirmar: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // solo números en teléfono
    if (name === "telefono" && !/^\d*$/.test(value)) return;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.usuario ||
      !formData.contrasena ||
      formData.contrasena !== formData.confirmar
    ) {
      alert(
        "Completa usuario/contraseña y asegúrate que las contraseñas coincidan."
      );
      return;
    }

    const dto: RegisterUserDto = {
      nombre: formData.nombre || undefined,
      apellidos: formData.apellidos || undefined,
      username: formData.usuario,
      contrasena: formData.contrasena,
      num_cel: formData.telefono || null,
    };

    try {
      const ok: boolean = await LoginService.RegistrarUsuario(dto);
      if (ok) {
        alert("Cuenta creada ✅");
        navigate("/login");
      } else {
        alert("Error al crear cuenta ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/logo.png" alt="Logo" className="register-logo" />
        <h1 className="register-title">ReportaUTS</h1>

        <form onSubmit={handleRegister} className="register-form">
          <input
            name="nombre"
            placeholder="Nombre(s)"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
          />
          <input
            name="usuario"
            placeholder="Nombre de usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
          />
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <input
            name="confirmar"
            type="password"
            placeholder="Confirmar contraseña"
            value={formData.confirmar}
            onChange={handleChange}
            required
          />
          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono (opcional)"
            value={formData.telefono}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Crear Nueva Cuenta
          </button>
        </form>

        <p className="register-link">
          ¿Ya tienes cuenta?{" "}
          <a onClick={() => navigate("/login")}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
