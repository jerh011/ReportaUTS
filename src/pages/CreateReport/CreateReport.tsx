// src/pages/CreateReport.tsx
import "./CreateReport.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav";

import { ReportService } from "../../services/ReportService";
import { OfflineReportService } from "../../services/OfflineReportService";

import { Edificio } from "../../Model/EdifiioModel";
import { Categoria } from "../../Model/CategoriaMode";
import { ReporteRegistroModel } from "../../Model/ReporteRegistroModel";

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

  /* ======================================================
     CARGA DE CATÁLOGOS
  ====================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setEdificios(await ReportService.GetEdificios());
        setCategorias(await ReportService.GetCategorias());
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      }
    };
    fetchData();
  }, []);

  /* ======================================================
     HANDLE CHANGE
  ====================================================== */
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

  /* ======================================================
     COMPRESIÓN DE IMÁGENES
  ====================================================== */
  const comprimirImagen = (file: File): Promise<File> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1200;

          let { width, height } = img;
          if (width > height && width > MAX) {
            height *= MAX / width;
            width = MAX;
          } else if (height > MAX) {
            width *= MAX / height;
            height = MAX;
          }

          canvas.width = width;
          canvas.height = height;

          canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) =>
              blob
                ? resolve(new File([blob], file.name, { type: "image/jpeg" }))
                : reject(),
            "image/jpeg",
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

  /* ======================================================
     MANEJO DE IMÁGENES (MÁX 2)
  ====================================================== */
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    const permitidas = files.slice(0, 2 - imagenes.length);

    const procesadas = await Promise.all(
      permitidas.map(async (file) => {
        const comp = await comprimirImagen(file);
        return new Promise<{ file: File; url: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) =>
            resolve({ file: comp, url: ev.target?.result as string });
          reader.readAsDataURL(comp);
        });
      })
    );

    setImagenes((prev) => [...prev, ...procesadas].slice(0, 2));
    e.target.value = "";
  };

  const eliminarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  /* ======================================================
     SUBMIT
  ====================================================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagenes.length) {
      alert("⚠️ Debes subir al menos una imagen");
      return;
    }

    if (formData.privacidad === null) {
      alert("⚠️ Selecciona la privacidad");
      return;
    }

    const nuevoReporte: ReporteRegistroModel = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      privacidad: formData.privacidad,
      edificioId: Number(formData.edificio),
      categoriaId: Number(formData.categoria),
      estadoId: 1,
      imagen: imagenes[0].file,
    };

    // ✅ SIN INTERNET → GUARDAR OFFLINE
    if (!navigator.onLine) {
      await OfflineReportService.save(nuevoReporte);
      alert("⚠️ Sin internet. El reporte se guardó y se enviará luego.");
      nav("/home");
      return;
    }

    // ✅ CON INTERNET
    try {
      setEnviando(true);
      await ReportService.RegistrarReporte(nuevoReporte);
      alert("✅ Reporte enviado con éxito");
      nav("/home");
    } catch {
      await OfflineReportService.save(nuevoReporte);
      alert("⚠️ Error de red. El reporte se guardó offline.");
      nav("/home");
    } finally {
      setEnviando(false);
    }
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="create-container">
      <header className="create-header">
        <h2>Crear Reporte</h2>
      </header>

      <form className="create-form" onSubmit={handleSubmit}>
        <label>Privacidad</label>
        <select
          name="privacidad"
          value={formData.privacidad?.toString() || ""}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
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
          <option value="">Seleccionar</option>
          {edificios.map((e) => (
            <option key={e.id_edificio} value={e.id_edificio}>
              {e.nombre}
            </option>
          ))}
        </select>

        <label>Título</label>
        <input
          name="titulo"
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
            <option key={c.idcategorias} value={c.idcategorias}>
              {c.nombre}
            </option>
          ))}
        </select>

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label>Imágenes (máx. 2)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImage}
          disabled={imagenes.length >= 2}
        />

        <div className="preview-container">
          {imagenes.map((img, i) => (
            <div key={i} className="preview">
              <img src={img.url} alt="" />
              <button type="button" onClick={() => eliminarImagen(i)}>
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => nav("/home")}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}
