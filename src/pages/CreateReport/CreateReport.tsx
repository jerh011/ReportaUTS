// src/pages/CreateReport.tsx
import "./CreateReport.css";
import { useState, useEffect } from "react";
import BottomNav from "../../components/BottomNav";
import { ReportService } from "../../services/ReportService";
import { Edificio } from "../../Model/EdifiioModel";
import { Categoria } from "../../Model/CategoriaMode";
import { ReporteRegistroModel } from "../../Model/ReporteRegistroModel";
import { useNavigate } from "react-router-dom";

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
  const [enviando, setEnviando] = useState(false);

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

  // Función para comprimir imágenes
  const comprimirImagen = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Error al comprimir"));
              }
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = () => reject(new Error("Error al cargar imagen"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Error al leer archivo"));
      reader.readAsDataURL(file);
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length === 0) return;

    try {
      // Procesar cada archivo de forma asíncrona
      const promesas = files.slice(0, 2 - imagenes.length).map(async (file) => {
        try {
          // Comprimir la imagen antes de procesarla
          const archivoComprimido = await comprimirImagen(file);

          return new Promise<{ file: File; url: string }>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
              resolve({
                file: archivoComprimido,
                url: event.target?.result as string,
              });
            };

            reader.onerror = () => {
              reject(new Error("Error al leer la imagen"));
            };

            reader.readAsDataURL(archivoComprimido);
          });
        } catch (error) {
          console.error("Error al comprimir imagen:", error);
          throw error;
        }
      });

      // Esperar a que todas las imágenes se procesen
      const nuevasImagenes = await Promise.all(promesas);

      setImagenes((prev) => {
        const total = [...prev, ...nuevasImagenes];
        return total.slice(0, 2); // Solo mantener máximo 2
      });

      console.log("Imágenes cargadas exitosamente:", nuevasImagenes.length);
    } catch (error) {
      console.error("Error procesando imágenes:", error);
      alert("Error al cargar la imagen. Intenta de nuevo.");
    }

    // Limpiar el input para permitir seleccionar la misma imagen de nuevo
    e.target.value = "";
  };

  const eliminarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (imagenes.length === 0) {
      alert("⚠️ Debes subir al menos una imagen");
      return;
    }

    if (formData.privacidad === null) {
      alert("⚠️ Selecciona la privacidad del reporte");
      return;
    }

    const categoriaId = formData.categoria ? Number(formData.categoria) : 0;
    const edificioId = formData.edificio ? Number(formData.edificio) : 0;

    const nuevoReporte: ReporteRegistroModel = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      privacidad: formData.privacidad,
      edificioId,
      categoriaId,
      estadoId: 1,
      imagen: imagenes[0]?.file || null,
    };

    try {
      setEnviando(true);
      console.log("Enviando reporte...", nuevoReporte);

      await ReportService.RegistrarReporte(nuevoReporte);

      console.log("Reporte enviado exitosamente");
      alert("✅ Reporte enviado con éxito");
      nav("/home");
    } catch (error) {
      console.error("Error al registrar el reporte:", error);
      alert(
        `❌ Error al enviar el reporte: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setEnviando(false);
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
          <option value="">Seleccionar privacidad</option>
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

        <label>
          Subir imágenes (máx. 2){" "}
          {imagenes.length > 0 && `- ${imagenes.length}/2`}
        </label>
        <div className="upload-box">
          {/* Input oculto para galería */}
          <input
            id="gallery-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImage}
            disabled={imagenes.length >= 2}
            style={{ display: "none" }}
          />
          <label
            htmlFor="gallery-input"
            className="upload-btn"
            style={{
              opacity: imagenes.length >= 2 ? 0.5 : 1,
              pointerEvents: imagenes.length >= 2 ? "none" : "auto",
              cursor: imagenes.length >= 2 ? "not-allowed" : "pointer",
            }}
          >
            📁 Galería
          </label>

          {/* Input oculto para cámara */}
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImage}
            disabled={imagenes.length >= 2}
            style={{ display: "none" }}
          />
          <label
            htmlFor="camera-input"
            className="upload-btn"
            style={{
              opacity: imagenes.length >= 2 ? 0.5 : 1,
              pointerEvents: imagenes.length >= 2 ? "none" : "auto",
              cursor: imagenes.length >= 2 ? "not-allowed" : "pointer",
            }}
          >
            📷 Cámara
          </label>

          {/* Vista previa de imágenes */}
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
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar Reporte"}
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}
