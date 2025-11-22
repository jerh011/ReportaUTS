import "./CreateReport.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function CreateReport() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    privacidad: "",
    edificio: "",
    titulo: "",
    categoria: "",
    area: "",
    descripcion: "",
  });

  const [imagenes, setImagenes] = useState<{ file: File; url: string }[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const nuevas: { file: File; url: string }[] = [];

    files.forEach((file) => {
      if (imagenes.length + nuevas.length < 2) {
        const reader = new FileReader();
        reader.onload = (event) => {
          nuevas.push({ file, url: event.target?.result as string });
          if (
            nuevas.length === files.length ||
            imagenes.length + nuevas.length === 2
          ) {
            setImagenes((prev) => [...prev, ...nuevas]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const eliminarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Reporte enviado con éxito ✅");
    nav("/home");
  };

  return (
    <div className="create-container">
      {/* Encabezado */}
      <header className="create-header">
        <h2>
          Crear Reporte <span>(Formulario)</span>
        </h2>
      </header>

      {/* Formulario */}
      <form className="create-form" onSubmit={handleSubmit}>
        <label>Privacidad del Reporte</label>
        <select
          name="privacidad"
          value={formData.privacidad}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="publico">Público</option>
          <option value="privado">Privado</option>
        </select>

        <label>Edificio</label>
        <select
          name="edificio"
          value={formData.edificio}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar edificio</option>
          <option value="Idiomas">Edificio de Idiomas</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={`Edificio ${num}`}>
              Edificio {num}
            </option>
          ))}
          <option value="Servicios Escolares">Servicios Escolares</option>
          <option value="Rectoría">Rectoría</option>
          <option value="Cafetería">Cafetería</option>
        </select>

        <label>Título del Reporte</label>
        <input
          type="text"
          name="titulo"
          placeholder="Pequeño título sobre el suceso"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <label>Categoría</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>

        <label>Área solicitante</label>
        <select
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="academico">Académico</option>
          <option value="rectoria">Rectoría</option>
          <option value="finanzas">Administración de Finanzas</option>
          <option value="vinculacion">Vinculación y Extensión Universitaria</option>
          <option value="estudiantes">Estudiantes</option>
        </select>

        <label>Descripción</label>
        <textarea
          name="descripcion"
          placeholder="Describir la fuente del problema"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          required
        />

        {/* Subir imágenes */}
        <label>Subir imágenes (máx. 2)</label>
        <div className="upload-box">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImage}
            disabled={imagenes.length >= 2}
          />

          {imagenes.length > 0 && (
            <div className="preview-container">
              {imagenes.map((img, index) => (
                <div className="preview" key={index}>
                  <img src={img.url} alt={`imagen-${index}`} />
                  <button
                    type="button"
                    className="eliminar"
                    onClick={() => eliminarImagen(index)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => nav("/home")}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Enviar Reporte
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}
