// src/pages/CreateReport.tsx
import "./CreateReport.css";
import { useState, useEffect } from "react";
import BottomNav from "../../components/BottomNav";
import { ReportService } from "../../services/ReportService";
import { Edificio } from "../../Model/EdifiioModel";
import { Categoria } from "../../Model/CategoriaMode";
import { ReporteRegistroModel } from "../../Model/ReporteRegistroModel";
import { useNavigate } from "react-router-dom";

// ✅ Servicio para guardar y sincronizar reportes sin internet
import { OfflineReportService } from "../../services/OfflineReportService";

export default function CreateReport() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    privacidad: null as boolean | null,
    edificio: "",
    titulo: "",
    categoria: "",
    descripcion: "",
  });

  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagenes, setImagenes] = useState<{ file: File; url: string }[]>([]);

  // ✅ Cargar edificios y categorías (esto NO depende de conexión en el submit)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const edificiosData = await ReportService.GetEdificios();
        setEdificios(edificiosData);

        const categoriasData = await ReportService.GetCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "privacidad" ? value === "true" : value,
    });
  };

  // ✅ Manejo de imágenes (máx. 2)
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

  /**
   * ✅ EVENTO ONLINE GLOBAL
   * Cuando el dispositivo recupera internet:
   * - Se intentan enviar automáticamente TODOS los reportes guardados offline
   * - No se muestra botón al usuario (UX limpia)
   */
  // useEffect(() => {
  //   const handleOnline = () => {
  //     OfflineReportService.sync();
  //   };

  //   window.addEventListener("online", handleOnline);
  //   return () => window.removeEventListener("online", handleOnline);
  // }, []);

  /**
   * ✅ SUBMIT DEL FORMULARIO
   * Lógica completa:
   * 1. Construimos el modelo del reporte
   * 2. Si NO hay internet → guardar offline y salir
   * 3. Si hay internet → enviar normal
   * 4. Si falla el envío → guardar offline como respaldo
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoriaId = Number(formData.categoria);
    const edificioId = Number(formData.edificio);

    const nuevoReporte: ReporteRegistroModel = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      privacidad: formData.privacidad ?? false,
      edificioId,
      categoriaId,
      estadoId: 1,
      imagen: imagenes[0]?.file || null,
    };

    // ✅ CASO 1: NO HAY INTERNET
    if (!navigator.onLine) {
      await OfflineReportService.save(nuevoReporte);
      alert(
        "⚠️ Estás sin internet. El reporte se guardó y se enviará automáticamente al reconectarse."
      );
      nav("/home");
      return;
    }

    // ✅ CASO 2: HAY INTERNET
    try {
      await ReportService.RegistrarReporte(nuevoReporte);
      alert("✅ Reporte enviado con éxito");
      nav("/home");
    } catch (error) {
      // ✅ Fallback: si algo falla (timeout, red inestable, etc.)
      await OfflineReportService.save(nuevoReporte);
      alert("⚠️ Error de red. El reporte se guardó y se enviará luego.");
      nav("/home");
    }
  };

  return (
    <div className="create-container">
      <header className="create-header">
        <h2>
          Crear Reporte <span>(Formulario)</span>
        </h2>
      </header>

      <form className="create-form" onSubmit={handleSubmit}>
        <label>Privacidad del Reporte</label>
        <select
          name="privacidad"
          value={
            formData.privacidad !== null ? formData.privacidad.toString() : ""
          }
          onChange={handleChange}
          required
        >
          <option value="true">Público</option>
          <option value="false">Privado</option>
        </select>

        <label>Edificio</label>
        <select
          name="edificio"
          value={formData.edificio}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar edificio</option>
          {edificios.map((e) => (
            <option key={`edificio-${e.id_edificio}`} value={e.id_edificio}>
              {e.nombre}
            </option>
          ))}
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
          {categorias.map((c) => (
            <option
              key={`categoria-${c.idcategorias}`}
              value={c.idcategorias?.toString() || ""}
            >
              {c.nombre}
            </option>
          ))}
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
                <div className="preview" key={`preview-${index}`}>
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
