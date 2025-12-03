// src/pages/MisReportes.tsx
import { useEffect, useMemo, useState } from "react";
import "./MisReportes.css";
import BottomNav from "../../components/BottomNav";
import ModalMisReportes from "./ModalMisReportes";
import { ReportePorUsuarioWhitImagen } from "../../Dtos/ReportePorUsuarioWhitImagen";
import { MisReportesServices } from "../../services/MisReportesServices";

/*
  USANDO DIRECTAMENTE EL MODELO: ReportePorUsuarioWhitImagen
  
  Campos disponibles:
  ✓ id_report
  ✓ titulo
  ✓ categoria
  ✓ estado
  ✓ privacidadTexto
  ✓ fechaFormateada
  ✓ edificioDescripcion
  ✓ imagenUrl
  
  Campos adicionales manejados localmente (NO en el modelo):
  ✗ comentarios (array local para la UI)
*/

// Extendemos el modelo original solo para agregar comentarios locales
type ReporteConComentarios = ReportePorUsuarioWhitImagen & {
  comentarios?: string[]; // Campo local, NO existe en el backend
};

export default function MisReportes() {
  const [reports, setReports] = useState<ReporteConComentarios[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [selected, setSelected] = useState<ReporteConComentarios | null>(null);
  const [newComment, setNewComment] = useState("");

  // Cargar reportes desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await MisReportesServices.ReportsWithImagenes();

        // Agregamos solo el campo de comentarios (que no existe en el modelo)
        const reportsConComentarios: ReporteConComentarios[] = data.map(
          (item) => ({
            ...item,
            comentarios: [], // Campo adicional para manejo local
          })
        );

        setReports(reportsConComentarios);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Bloquear scroll del body cuando hay modal abierto
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    return;
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.titulo?.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q) ||
        r.categoria?.toLowerCase().includes(q)
    );
  }, [reports, query]);

  const openModal = (r: ReporteConComentarios) => {
    setNewComment("");
    setSelected(r);
  };

  const closeModal = () => setSelected(null);

  const eliminarReporte = (id: string) => {
    if (!confirm("¿Eliminar este reporte? Esta acción no se puede deshacer."))
      return;
    setReports((prev) => prev.filter((p) => p.id_report !== id));
    closeModal();
    // TODO: llamar API DELETE /reportes/:id
  };

  const handleFilesAdd = (files: FileList | null) => {
    if (!selected || !files) return;
    // Por ahora solo mantenemos una imagen (imagenUrl es string, no array)
    alert(
      "La funcionalidad de agregar múltiples imágenes requiere actualizar el modelo del backend"
    );
    // TODO: Implementar cuando el backend soporte múltiples imágenes
  };

  const eliminarEvidencia = (reportId: string) => {
    if (!confirm("Eliminar evidencia?")) return;
    // Como imagenUrl es un string único, eliminar significa dejarlo vacío
    setReports((prev) =>
      prev.map((r) =>
        r.id_report === reportId ? { ...r, imagenUrl: undefined } : r
      )
    );
    if (selected?.id_report === reportId) {
      setSelected((s) => (s ? { ...s, imagenUrl: undefined } : s));
    }
  };

  // Los comentarios NO existen en ReportePorUsuarioWhitImagen
  // Se manejan solo localmente en el frontend
  const addComment = () => {
    if (!selected) return;
    const text = newComment.trim();
    if (!text) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id_report === selected.id_report
          ? { ...r, comentarios: [...(r.comentarios || []), text] }
          : r
      )
    );
    setSelected((s) =>
      s ? { ...s, comentarios: [...(s.comentarios || []), text] } : s
    );
    setNewComment("");
    // TODO: POST comment to backend (si el backend implementa comentarios)
  };

  if (loading) {
    return (
      <div className="misreports-page">
        <header className="create-header">
          <h2>
            Mis reportes <span>(Accesos rápidos)</span>
          </h2>
        </header>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Cargando reportes...
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="misreports-page">
      <header className="create-header">
        <h2>
          Mis reportes <span>(Accesos rápidos)</span>
        </h2>
      </header>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, categoría o subcategoría"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <main className="community-content">
        <div className="list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              No se encontraron reportes
            </div>
          ) : (
<<<<<<< HEAD
            filtered.slice(0, visibleCount).map((r) => (
              <article
                key={r.id_report}
                className="report-card"
                onClick={() => openModal(r)}
              >
                <div className="card-left">
                  <img
                    src={
                      r.categoria === "Mantenimiento"
                        ? "/icons/Categoria-Mantenimiento.png"
                        : "/icons/Categoria-Sistemas.png"
                    }
                    alt={r.categoria}
                    className="cat-icon"
                  />
                </div>

                <div className="card-body">
                  <h3 className="report-title">{r.titulo}</h3>
                  <p className="cat-sub">
                    <strong>{r.categoria}</strong> - {r.descripcion}
                  </p>
                </div>

                <div className="card-right">
                  <div
                    className={`privacy-badge ${
                      r.privacidadTexto?.toLowerCase() === "publico"
                        ? "pub"
                        : "anon"
                    }`}
                  >
                    {r.privacidadTexto?.toLowerCase() === "publico"
                      ? "Público"
                      : "Anónimo"}
                  </div>

                  <div
                    className={`estado-tag estado-${r.estado?.replace(
                      /\s+/g,
                      "-"
                    )}`}
                  >
                    {r.estado}
                  </div>
                </div>
              </article>
            ))
=======
            filtered.slice(0, visibleCount).map((r, idx) => {
              // Generar key robusta: preferir id_report, si no existe usar combinacion + index
              const key =
                r.id_report ??
                `${r.titulo ?? "sin-titulo"}-${
                  r.fechaFormateada ?? "sin-fecha"
                }-${idx}`;

              return (
                <article
                  key={key}
                  className="report-card"
                  onClick={() => openModal(r)}
                >
                  <div className="card-left">
                    <img
                      src={MisReportesServices.GetImageReporte(
                        r.imagenUrl || ""
                      )}
                      className="modal-cat-icon"
                      alt={r.categoria}
                    />
                  </div>

                  <div className="card-body">
                    <h3 className="report-title">{r.titulo}</h3>
                    <p className="cat-sub">
                      <strong>{r.categoria}</strong> - {r.descripcion}
                    </p>
                  </div>

                  <div className="card-right">
                    <div
                      className={`privacy-badge ${
                        r.privacidadTexto?.toLowerCase() === "publico"
                          ? "pub"
                          : "anon"
                      }`}
                    >
                      {r.privacidadTexto?.toLowerCase() === "publico"
                        ? "Público"
                        : "Anónimo"}
                    </div>

                    <div
                      className={`estado-tag estado-${(r.estado ?? "")
                        .toString()
                        .replace(/\s+/g, "-")}`}
                    >
                      {r.estado}
                    </div>
                  </div>
                </article>
              );
            })
>>>>>>> origin/main
          )}
        </div>

        <div className="see-more-row">
          {visibleCount < filtered.length ? (
            <button
              className="see-more-btn"
              onClick={() =>
                setVisibleCount((v) => Math.min(v + 5, filtered.length))
              }
            >
              Ver más
            </button>
          ) : (
            filtered.length > 0 && (
              <div className="end-list">No hay más reportes</div>
            )
          )}
        </div>
      </main>

      {selected && (
        <ModalMisReportes
          selected={selected}
          closeModal={closeModal}
          eliminarReporte={eliminarReporte}
          eliminarEvidencia={eliminarEvidencia}
          handleFilesAdd={handleFilesAdd}
          addComment={addComment}
          newComment={newComment}
          setNewComment={setNewComment}
        />
      )}

      <BottomNav />
    </div>
  );
}
