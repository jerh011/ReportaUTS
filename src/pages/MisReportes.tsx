// src/pages/MisReportes.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./MisReportes.css";
import BottomNav from "../components/BottomNav";

type CategoriaPrincipal = "Sistemas" | "Mantenimiento";
type Estado = "Pendiente" | "Rechazado" | "Resuelto" | "Abierto";
type Privacidad = "publico" | "anonimo";

type Report = {
  id: string;
  titulo: string;
  categoria: CategoriaPrincipal;
  subcategoria: string;
  estado: Estado;
  descripcion?: string;
  votos?: number; // no se usa aquí pero podemos mantener
  fecha: string;
  privacidad: Privacidad;
  evidencias?: string[]; // data-urls o rutas
  comentarios?: string[];
};

// MOCK: algunos reportes (sintético)
const MOCK_REPORTS: Report[] = [
  {
    id: "m1",
    titulo: "Fuga en laboratorio B",
    categoria: "Mantenimiento",
    subcategoria: "Infraestructura",
    estado: "Pendiente",
    descripcion: "Se detectó fuga de agua en la zona de máquinas.",
    fecha: "2025-11-10",
    privacidad: "publico",
    evidencias: [],
    comentarios: ["Reportado por mi el 10/11."]
  },
  {
    id: "m2",
    titulo: "Problema con ingreso al portal",
    categoria: "Sistemas",
    subcategoria: "Software",
    estado: "Rechazado", // si tu union no la tiene, es solo mock
    descripcion: "Error 500 al iniciar sesión por la mañana.",
    fecha: "2025-11-09",
    privacidad: "anonimo",
    evidencias: [],
    comentarios: []
  },
  {
    id: "m3",
    titulo: "Basura en pasillo 1101",
    categoria: "Mantenimiento",
    subcategoria: "Limpieza",
    estado: "Resuelto",
    descripcion: "Retiraron el mismo día.",
    fecha: "2025-10-30",
    privacidad: "publico",
    evidencias: [],
    comentarios: ["Gracias al equipo de limpieza"]
  }
];

export default function MisReportes() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [selected, setSelected] = useState<Report | null>(null);

  // para agregar imagenes en el modal (previews temporales antes de send)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  // comment input local dentro del modal
  const [newComment, setNewComment] = useState("");

  // bloquear scroll del body cuando hay modal abierto
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
        r.titulo.toLowerCase().includes(q) ||
        r.subcategoria.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q)
    );
  }, [reports, query]);

  // abrir modal y reset estado de subida/comentario
  const openModal = (r: Report) => {
    setUploadingFiles([]);
    setNewComment("");
    setSelected(r);
  };

  const closeModal = () => setSelected(null);

  // eliminar reporte (local)
  const eliminarReporte = (id: string) => {
    if (!confirm("¿Eliminar este reporte? Esta acción no se puede deshacer.")) return;
    setReports((prev) => prev.filter((p) => p.id !== id));
    closeModal();
    // TODO: llamar API DELETE /reportes/:id
  };

  // subir imagenes (solo hasta completar 2 evidencias)
  const handleFilesAdd = (files: FileList | null) => {
    if (!selected || !files) return;
    const existing = selected.evidencias || [];
    const maxRemaining = 2 - existing.length;
    if (maxRemaining <= 0) {
      alert("Máximo 2 evidencias permitidas.");
      return;
    }
    const arr = Array.from(files).slice(0, maxRemaining);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        // update report's evidencias
        setReports((prev) =>
          prev.map((r) =>
            r.id === selected.id
              ? { ...r, evidencias: [...(r.evidencias || []), url] }
              : r
          )
        );
        // refresh selected reference to show preview immediately
        setSelected((s) => (s ? { ...s, evidencias: [...(s.evidencias || []), url] } : s));
      };
      reader.readAsDataURL(file);
    });
  };

  // eliminar imagen del reporte (por index)
  const eliminarEvidencia = (reportId: string, idx: number) => {
    if (!confirm("Eliminar evidencia?")) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, evidencias: (r.evidencias || []).filter((_, i) => i !== idx) }
          : r
      )
    );
    // si el modal muestra ese reporte, actualizarlo también
    if (selected?.id === reportId) {
      setSelected((s) => (s ? { ...s, evidencias: (s.evidencias || []).filter((_, i) => i !== idx) } : s));
    }
    // TODO: llamar API para borrar recurso en backend si fuera necesario
  };

  // agregar comentario (local)
  const addComment = () => {
    if (!selected) return;
    const text = newComment.trim();
    if (!text) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selected.id ? { ...r, comentarios: [...(r.comentarios || []), text] } : r
      )
    );
    setSelected((s) => (s ? { ...s, comentarios: [...(s.comentarios || []), text] } : s));
    setNewComment("");
    // TODO: POST comment to backend
  };

  return (
    <div className="misreports-page">
      <header className="create-header">
        <h2>Mis reportes <span>(Accesos rápidos)</span></h2>
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
          {filtered.slice(0, visibleCount).map((r) => (
            <article key={r.id} className="report-card" onClick={() => openModal(r)}>
              <div className="card-left">
                {/* icon según categoría - cambia rutas a tus iconos */}
                <img
                  src={r.categoria === "Mantenimiento" ? "/icons/Categoria-Mantenimiento.png" : "/icons/Categoria-Sistemas.png"}
                  alt={r.categoria}
                  className="cat-icon"
                />
              </div>

              <div className="card-body">
                <h3 className="report-title">{r.titulo}</h3>
                <p className="cat-sub">
                  <strong>{r.categoria}</strong> - {r.subcategoria}
                </p>
              </div>

              <div className="card-right">
                {/* privacidad en esquina superior pequeña */}
                <div className={`privacy-badge ${r.privacidad === "publico" ? "pub" : "anon"}`}>
                  {r.privacidad === "publico" ? "Público" : "Anónimo"}
                </div>

                <div className={`estado-tag estado-${r.estado.replace(/\s+/g, "-")}`}>
                  {r.estado}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="see-more-row">
          {visibleCount < filtered.length ? (
            <button
              className="see-more-btn"
              onClick={() => setVisibleCount((v) => Math.min(v + 5, filtered.length))}
            >
              Ver más
            </button>
          ) : (
            filtered.length > 0 && <div className="end-list">No hay más reportes</div>
          )}
        </div>
      </main>

      {/* MODAL: ver / editar evidencias / comentarios / eliminar */}
      {selected && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={selected.categoria === "Mantenimiento" ? "/icons/Categoria-Mantenimiento.png" : "/icons/Categoria-Sistemas.png"}
                className="modal-cat-icon"
                alt="Icono Categoria"
              />
              <h2 className="modal-title">{selected.titulo}</h2>

              <div className="detail-info">
              <p><strong>Categoría:</strong> {selected.categoria} — {selected.subcategoria}</p>
            </div>

            {/* <div className={`modal-estado-tag privacy.${selected.privacidad.replace(/\s+/g, ".")}`} >
                {selected.privacidad}
            </div> */}
            <div className={`modal-estado-tag privacy-badge ${selected.privacidad === "publico" ? "pub" : "anon"}`}>
                  {selected.privacidad === "publico" ? "Público" : "Anónimo"}
                </div>
            <div className={`modal-estado-tag estado-${selected.estado.replace(/\s+/g, "-")}`}>
              {selected.estado}
            </div>

            
            <p><strong>Fecha:</strong> {selected.fecha}</p>
            <p className="modal-desc-label">Descripción:</p>
            <p className="modal-desc">{selected.descripcion || "Sin descripción"}</p>

            <div className="evidencias">
              <h4>Evidencias</h4>

              {selected.evidencias && selected.evidencias.length > 0 ? (
                <div className="evid-grid">
                  {selected.evidencias.map((src, i) => (
                    <div key={i} className="evid-box">
                      <img src={src} alt={`evid-${i}`} />
                      <button
                        className="evid-delete"
                        title="Eliminar imagen"
                        onClick={() => eliminarEvidencia(selected.id, i)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-evid">Sin evidencias adjuntas</div>
              )}

              {/* upload (solo si quedan espacios) */}
              <div className="upload-controls">
                {((selected.evidencias?.length || 0) < 2) && (
                  <>
                    <label className="upload-label">
                      Agregar imagen...
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFilesAdd(e.target.files)}
                      />
                    </label>
                    <small className="hint">Máx 2 imágenes (se guardan localmente en esta demo)</small>
                  </>
                )}
              </div>
            </div>

            <div className="modal-sep" />

            <h4 className="comments-title">Comentarios</h4>
            <div className="comments-list">
              {(selected.comentarios && selected.comentarios.length > 0) ? (
                selected.comentarios.map((c, i) => (<div key={i} className="comment-item">• {c}</div>))
              ) : (
                <div className="no-comments">Sin comentarios.</div>
              )}
            </div>

            <textarea
              className="comment-input"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="btn-send" onClick={addComment}>Enviar comentario</button>

              <div className="right-actions">
                <button className="btn-delete" onClick={() => eliminarReporte(selected.id)}>Eliminar reporte</button>
                <button className="btn-close" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
