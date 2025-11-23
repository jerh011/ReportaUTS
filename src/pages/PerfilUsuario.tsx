import React, { useState } from "react";
import "./PerfilUsuario.css";
import BottomNav from "../components/BottomNav";

type UserData = {
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  no_cel: string | null;
  created_at: string;
};

type UpdateUserPayload = {
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  no_cel: string | null;
  password?: string;
};

export default function PerfilUsuario() {
  const [user, setUser] = useState<UserData>({
    username: "johan01",
    nombres: "Johan Alberto",
    apellidos: "Lopez Ruiz",
    correo: "johan@example.com",
    no_cel: "5550123456",
    created_at: "2025-01-04",
  });

  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};

    const namesRegex = /^[A-Za-zÁ-Úá-úÑñ]+( [A-Za-zÁ-Úá-úÑñ]+)*$/;
    const usernameRegex = /^[A-Za-z0-9_.-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namesRegex.test(user.nombres.trim())) {
      errs.nombres = "Solo letras y un espacio entre palabras.";
    }
    if (!namesRegex.test(user.apellidos.trim())) {
      errs.apellidos = "Solo letras y un espacio entre palabras.";
    }
    if (!usernameRegex.test(user.username.trim())) {
      errs.username = "Solo letras, números y _, ., -";
    }
    if (!emailRegex.test(user.correo.trim())) {
      errs.correo = "Correo inválido.";
    }
    if (user.no_cel && !/^\d{10}$/.test(user.no_cel.trim())) {
      errs.no_cel = "Debe tener 10 dígitos.";
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        errs.newPassword = "Mínimo 6 caracteres.";
      }
      if (newPassword !== confirmPassword) {
        errs.confirmPassword = "Las contraseñas no coinciden.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    if (!validate()) return;

    const payload: UpdateUserPayload = {
      username: user.username.trim(),
      nombres: user.nombres.trim(),
      apellidos: user.apellidos.trim(),
      correo: user.correo.trim(),
      no_cel: user.no_cel ? user.no_cel.trim() : null,
    };

    if (newPassword.trim()) {
      payload.password = newPassword.trim();
    }

    console.log("Payload final:", payload);

    setEditing(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="perfil-container">

      {/* HEADER */}
      <header className="perfil-header">
        <h1 className="perfil-title-centered">Mi Perfil</h1>
      </header>

      {/* MAIN */}
      <div className="perfil-main">

        {/* FECHA DE CREACIÓN */}
        <div className="perfil-card small-info-card">
          <p className="fecha-creacion">
            Cuenta creada el: <strong>{user.created_at}</strong>
          </p>
        </div>

        {/* CAMPOS */}
        <div className="perfil-card">

          <div className="perfil-row">
            <label>Usuario</label>
            <input
              name="username"
              value={user.username}
              onChange={handleInput}
              readOnly={!editing}
              className={errors.username ? "invalid" : ""}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="perfil-row">
            <label>Nombres</label>
            <input
              name="nombres"
              value={user.nombres}
              onChange={handleInput}
              readOnly={!editing}
              className={errors.nombres ? "invalid" : ""}
            />
            {errors.nombres && <span className="error">{errors.nombres}</span>}
          </div>

          <div className="perfil-row">
            <label>Apellidos</label>
            <input
              name="apellidos"
              value={user.apellidos}
              onChange={handleInput}
              readOnly={!editing}
              className={errors.apellidos ? "invalid" : ""}
            />
            {errors.apellidos && <span className="error">{errors.apellidos}</span>}
          </div>

          <div className="perfil-row">
            <label>Correo</label>
            <input
              name="correo"
              value={user.correo}
              onChange={handleInput}
              readOnly={!editing}
              className={errors.correo ? "invalid" : ""}
            />
            {errors.correo && <span className="error">{errors.correo}</span>}
          </div>

          <div className="perfil-row">
            <label>Número de teléfono</label>
            <input
              name="no_cel"
              value={user.no_cel ?? ""}
              onChange={handleInput}
              readOnly={!editing}
              className={errors.no_cel ? "invalid" : ""}
            />
            {errors.no_cel && <span className="error">{errors.no_cel}</span>}
          </div>

          {editing && (
            <>
              <div className="perfil-row">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.newPassword ? "invalid" : ""}
                />
                {errors.newPassword && (
                  <span className="error">{errors.newPassword}</span>
                )}
              </div>

              <div className="perfil-row">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "invalid" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          {/* BOTONES DENTRO DEL CARD ABAJO DERECHA */}
          <div className="perfil-actions-bottom">
            {!editing ? (
              <button className="btn-editar" onClick={() => setEditing(true)}>
                Editar
              </button>
            ) : (
              <>
                <button className="btn-cancel" onClick={() => setEditing(false)}>
                  Cancelar
                </button>
                <button className="btn-guardar" onClick={saveChanges}>
                  Guardar
                </button>
              </>
            )}
          </div>

        </div>

        {/* LOGOUT */}
        <div className="perfil-logout-wrap">
          <button className="btn-logout small-logout-btn">Cerrar sesión</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
