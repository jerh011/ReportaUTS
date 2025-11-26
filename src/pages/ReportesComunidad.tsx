// src/pages/ReportesComunidad.tsx
import { useEffect, useMemo, useState } from "react";
import "./ReportesComunidad.css";
import BottomNav from "../components/BottomNav";

type CategoriaPrincipal = "Sistemas" | "Mantenimiento";
type Estado = "Pendiente" | "Rechazado" | "Resuelto" | "Abierto";

type Report = {
  id: string;
  titulo: string;
  categoria: CategoriaPrincipal;
  subcategoria: string;
  estado: Estado;
  descripcion?: string;
  votos: number;
  fecha: string;
  evidencias?: string[]; // pruebas (URLs locales en mock)
};

// (MOCK_REPORTS igual al que ya tenías — lo dejo como en tu versión)
const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    titulo: "Pérdida de internet",
    categoria: "Sistemas",
    subcategoria: "Redes",
    estado: "Rechazado",
    descripcion: "Cortes frecuentes de conectividad en la biblioteca.",
    votos: 12,
    fecha: "2025-11-09",
    evidencias: ["/mnt/data/0695693f-6b6a-4c6a-9583-67504729d547.png"],
  },
  {
    id: "r2",
    titulo: "Aire acondicionado fallando",
    categoria: "Mantenimiento",
    subcategoria: "Climatización",
    estado: "Pendiente",
    descripcion: "El salón 204 no enfría bien. Huele raro.",
    votos: 5,
    fecha: "2025-11-10",
    evidencias: [
      "/mnt/data/9baad3a2-0dc7-4843-a17d-895d59d0bcc1.png",
      "/mnt/data/0695693f-6b6a-4c6a-9583-67504729d547.png",
    ],
  },
  {
    id: "r3",
    titulo: "Césped sin podar",
    categoria: "Mantenimiento",
    subcategoria: "Áreas verdes",
    estado: "Pendiente",
    descripcion: "El área verde principal no ha sido podada en meses.",
    votos: 1,
    fecha: "2025-10-25",
    evidencias: [],
  },
  {
    id: "r4",
    titulo: "Ventana rota en aula idiomas 1",
    categoria: "Mantenimiento",
    subcategoria: "Infraestructura",
    estado: "Abierto",
    descripcion: "Vidrio roto desde hace 3 días, riesgo de corte.",
    votos: 4,
    fecha: "2025-11-08",
    evidencias: [],
  },
  {
    id: "r5",
    titulo: "Ruta de camión que no pasó",
    categoria: "Mantenimiento",
    subcategoria: "Transporte",
    estado: "Pendiente",
    descripcion: "Ruta escolar no cumplió su recorrido hoy.",
    votos: 2,
    fecha: "2025-11-07",
    evidencias: [],
  },
  {
    id: "r6",
    titulo: "Problema con acceso al sistema académico",
    categoria: "Sistemas",
    subcategoria: "Software",
    estado: "Pendiente",
    descripcion: "No se puede ingresar al portal de calificaciones.",
    votos: 8,
    fecha: "2025-11-06",
    evidencias: [],
  },
  {
    id: "r7",
    titulo: "Basura acumulada junto al contenedor",
    categoria: "Mantenimiento",
    subcategoria: "Limpieza",
    estado: "Resuelto",
    descripcion: "Se recogió el mismo día, pero vuelve a ocurrir.",
    votos: 3,
    fecha: "2025-10-30",
    evidencias: [],
  },
  {
    id: "r8",
    titulo: "Fuga en laboratorio",
    categoria: "Mantenimiento",
    subcategoria: "Infraestructura",
    estado: "Pendiente",
    descripcion: "Posible fuga de agua en laboratorio B.",
    votos: 6,
    fecha: "2025-10-28",
    evidencias: [],
  },
  {
    id: "r9",
    titulo: "Luces parpadeando en aula 3",
    categoria: "Mantenimiento",
    subcategoria: "Electricidad",
    estado: "Pendiente",
    descripcion: "Intermitencia en iluminación.",
    votos: 0,
    fecha: "2025-11-02",
    evidencias: [],
  },
  {
    id: "r10",
    titulo: "Ruido extraño en ductos",
    categoria: "Mantenimiento",
    subcategoria: "Infraestructura",
    estado: "Pendiente",
    descripcion: "Ruidos por la noche en los ductos de ventilación.",
    votos: 0,
    fecha: "2025-10-22",
    evidencias: [],
  },
];

export default function ReportesComunidad() {
  // userVotes: 0 = no votó, 1 = votó positivo
  const [userVotes, setUserVotes] = useState<Record<string, 0 | 1>>({});
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [query, setQuery] = useState("");
  const [sortByVotes, setSortByVotes] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);

  // comentarios de ejemplo (por reporte)
  const [comments, setComments] = useState<Record<string, string[]>>({
    r1: [
      "También falló en el edificio D.",
      "Confirmo, no hay internet desde temprano.",
    ],
    r2: ["hola", "apoco si as"],
    r3: [],
    r4: [],
    r5: [],
    r6: [],
    r7: [],
    r8: [],
    r9: [],
    r10: [],
  });

  const [newComment, setNewComment] = useState("");

  // Ver más: cantidad visible inicialmente y por incremento
  const [visibleCount, setVisibleCount] = useState(3);
  const LOAD_STEP = 3;

  // toggle upvote (solo positivo)
  const toggleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const voted = userVotes[id] === 1;
        return { ...r, votos: voted ? r.votos - 1 : r.votos + 1 };
      })
    );
    setUserVotes((prev) => ({ ...prev, [id]: prev[id] === 1 ? 0 : 1 }));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = reports.filter(
      (r) =>
        r.titulo.toLowerCase().includes(q) ||
        r.subcategoria.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q)
    );
    if (sortByVotes) {
      list = [...list].sort((a, b) => b.votos - a.votos);
    }
    return list;
  }, [reports, query, sortByVotes]);

  // bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    // si selected es null, nada que restaurar aquí (el cleanup del anterior ya restaura)
    return;
  }, [selected]);

  // abrir modal
  const openModal = (r: Report) => {
    setNewComment("");
    setSelected(r);
  };
  const closeModal = () => setSelected(null);

  const addComment = () => {
    if (!selected) return;
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => {
      const arr = prev[selected.id] || [];
      return { ...prev, [selected.id]: [...arr, text] };
    });
    setNewComment("");
  };

  const iconFor = (cat: CategoriaPrincipal) =>
    cat === "Mantenimiento"
      ? "/icons/Categoria-Mantenimiento.png"
      : "/icons/Categoria-Sistemas.png";

  return (
    <div className="community-page">
      {/* Encabezado */}
      <header className="create-header">
        <h2>
          Reportes de la Comunidad <span>(Foro)</span>
        </h2>
      </header>

      {/* Minimal page-header (banda blanca con titulo) */}
      {/* <div className="page-header">
        <h1>Reportes de la Comunidad</h1>
      </div> */}

      {/* Search area under title */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, categoría o subcategoría"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* <button className="search-icon" aria-label="buscar">🔎</button> */}
        <label className="sort-checkbox">
          <input
            type="checkbox"
            checked={sortByVotes}
            onChange={() => setSortByVotes((s) => !s)}
          />
          Priorizar por votos
        </label>
      </div>

      {/* Lista */}
      <main className="community-content" aria-live="polite">
        <div className="list">
          {filtered.slice(0, visibleCount).map((r) => (
            <article
              key={r.id}
              className="report-card"
              aria-labelledby={`title-${r.id}`}
            >
              <div className="card-left">
                <img
                  src={iconFor(r.categoria)}
                  alt={r.categoria}
                  className="cat-icon"
                />
              </div>

              <div className="card-body" onClick={() => openModal(r)}>
                <h3 id={`title-${r.id}`} className="report-title">
                  {r.titulo}
                </h3>
                <p className="cat-sub">
                  <strong>{r.categoria}</strong> - {r.subcategoria}
                </p>
              </div>

              <div className="card-right">
                <div className="vote-col">
                  <button
                    className={`vote-btn ${
                      userVotes[r.id] === 1 ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUpvote(r.id);
                    }}
                    aria-label="Votar"
                    title={userVotes[r.id] === 1 ? "Quitar voto" : "Votar útil"}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M12 4l-8 8h5v8h6v-8h5l-8-8z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="vote-count">{r.votos}</span>
                  </button>
                </div>

                <div
                  className={`estado-tag estado-${r.estado.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  {r.estado}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Ver más */}
        <div className="see-more-row">
          {visibleCount < filtered.length ? (
            <button
              className="see-more-btn"
              onClick={() =>
                setVisibleCount((v) => Math.min(v + LOAD_STEP, filtered.length))
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

      {/* Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={iconFor(selected.categoria)}
              alt=""
              className="modal-cat-icon"
            />
            <h2 className="modal-title">{selected.titulo}</h2>

            <div className="detail-info">
              <p>
                <strong>Categoría:</strong> {selected.categoria}
              </p>
              <p>
                <strong>Subcategoría:</strong> {selected.subcategoria}
              </p>
            </div>

            <div
              className={`modal-estado-tag estado-${selected.estado.replace(
                /\s+/g,
                "-"
              )}`}
            >
              {selected.estado}
            </div>

            <p className="modal-desc-label">Descripción:</p>
            <p className="modal-desc">{selected.descripcion}</p>

            {/* Evidencias (máx 2) */}
            <div className="evidencias">
              <h4>Evidencias:</h4>
              {selected.evidencias && selected.evidencias.length > 0 ? (
                <div className="evid-grid">
                  {selected.evidencias.slice(0, 2).map((src, i) => (
                    <div key={i} className="evid-box">
                      <img src={src} alt={`evidencia-${i}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-evid">Sin evidencias adjuntas</div>
              )}
            </div>

            <div className="modal-sep" />

            <h4 className="comments-title">Comentarios</h4>
            <div className="comments-list">
              {comments[selected.id] && comments[selected.id].length > 0 ? (
                comments[selected.id].map((c, i) => (
                  <div key={i} className="comment-item">
                    • {c}
                  </div>
                ))
              ) : (
                <div className="no-comments">No hay comentarios aún</div>
              )}
            </div>

            <textarea
              className="comment-input"
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="btn-send" onClick={addComment}>
                Enviar comentario
              </button>
              <button className="btn-close" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
