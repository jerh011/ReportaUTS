import React, { useState, useEffect } from "react";
import "./PerfilUsuario.css";
import BottomNav from "../../components/BottomNav";
import { ProfileService } from "../../services/ProfileService"; // Ajusta la ruta
import type { UserModel } from "../../Model/UserModel";
import { useNavigate } from "react-router-dom";

type UserData = {
  username: string;
  nombres: string;
  apellidos: string;
  // correo: string;
  no_cel: string | null;
  created_at: string;
};

type UpdateUserPayload = {
  username: string;
  nombres: string;
  apellidos: string;
  // correo: string;
  no_cel: string | null;
  password?: string;
};

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData>({
    username: "",
    nombres: "",
    apellidos: "",
    // correo: "",
    no_cel: null,
    created_at: "",
  });

  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const CerrarSecion = async () => {
    try {
      await ProfileService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const profile: UserModel | null = await ProfileService.getProfile();
      // console.log("Perfil obtenido:", profile);
      if (profile) {
        setUser({
          username: profile.username ?? "",
          nombres: profile.nombres ?? "",
          apellidos: profile.apellidos ?? "",
          // correo: profile.correo ?? "", // Comentado para usar después
          no_cel: profile.noCel ?? null,
          created_at: profile.createdAt ?? "",
        });
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    const namesRegex = /^[A-Za-zÁ-Úá-úÑñ]+( [A-Za-zÁ-Úá-úÑñ]+)*$/;
    const usernameRegex = /^[A-Za-z0-9_.-]+$/;

    if (!namesRegex.test(user.nombres.trim())) {
      errs.nombres = "Solo letras y un espacio entre palabras.";
    }
    if (!namesRegex.test(user.apellidos.trim())) {
      errs.apellidos = "Solo letras y un espacio entre palabras.";
    }
    if (!usernameRegex.test(user.username.trim())) {
      errs.username = "Solo letras, números y _, ., -";
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
      // correo: user.correo?.trim(),
      no_cel: user.no_cel ? user.no_cel.trim() : null,
    };

    if (newPassword.trim()) payload.password = newPassword.trim();

    // console.log("Payload final:", payload);
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
          {[
            { label: "Usuario", name: "username", value: user.username },
            { label: "Nombres", name: "nombres", value: user.nombres },
            { label: "Apellidos", name: "apellidos", value: user.apellidos },
            // { label: "Correo", name: "correo", value: user.correo }, // Comentado
            {
              label: "Número de teléfono",
              name: "no_cel",
              value: user.no_cel ?? "",
            },
          ].map((field) => (
            <div key={field.name} className="perfil-row">
              <label>{field.label}</label>
              <input
                name={field.name}
                value={field.value}
                onChange={handleInput}
                readOnly={!editing}
                className={errors[field.name] ? "invalid" : ""}
              />
              {errors[field.name] && (
                <span className="error">{errors[field.name]}</span>
              )}
            </div>
          ))}

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

          <div className="perfil-actions-bottom">
            {!editing ? (
              <button className="btn-editar" onClick={() => setEditing(true)}>
                Editar
              </button>
            ) : (
              <>
                <button
                  className="btn-cancel"
                  onClick={() => setEditing(false)}
                >
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
          <button
            className="btn-logout small-logout-btn"
            onClick={CerrarSecion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
