// src/pages/ReportesComunidad.tsx
import { useEffect, useMemo, useState } from "react";
import "./ReportesComunidad.css";
import BottomNav from "../../components/BottomNav";
import { ReportesComunidadService } from "../../services/ReportesComunidadService";
import type { ObtenerReportesPublicosDTO } from "../../Dtos/ObtenerReportesPublicosDTO";
import ModalReporteComunidad from "./ModalReportesComunidad";

type CategoriaPrincipal = "Sistemas" | "Mantenimiento";
type Estado = "Pendiente" | "Rechazado" | "Resuelto" | "Abierto";

type Report = {
  id: number;
  titulo: string;
  categoria: CategoriaPrincipal;
  estado: Estado;
  descripcion?: string;
  votos: number;
  fecha: string;
  evidencias?: string[];
};

export default function ReportesComunidad() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});

  const [query, setQuery] = useState("");
  const [sortByVotes, setSortByVotes] = useState(false);

  const [selected, setSelected] = useState<Report | null>(null);

  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [newComment, setNewComment] = useState("");

  const [visibleCount, setVisibleCount] = useState(3);
  const LOAD_STEP = 3;

  const idUsuario = 50; // <-- puedes cambiarlo

  // -------------------------------------------------------
  // 🔥 CARGAR REPORTES /api/Reportes/ReportesPublicos
  // -------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data: ObtenerReportesPublicosDTO[] =
          await ReportesComunidadService.obtenerReportesPublicos();

        // Mapear DTO → modelo local
        const mapeado: Report[] = data.map((r) => ({
          id: r.reporte_id,
          titulo: r.titulo,
          categoria:
            r.categoria === "Sisteama" ? "Sistemas" : "Mantenimiento",
          estado: r.estado as Estado,
          descripcion: r.descripcion,
          fecha: r.fechaFormateada,
          votos: 0, // se actualizarán cuando voten
          evidencias: r.imagenUrl ? [r.imagenUrl] : [],
        }));

        const commentsInit: Record<number, string[]> = {};
        mapeado.forEach((r) => (commentsInit[r.id] = []));

        setComments(commentsInit);
        setReports(mapeado);
      } catch (err) {
        console.error("Error obteniendo reportes públicos:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // -------------------------------------------------------
  // ⭐ POST /api/Voto (toggle + recibe total actualizado)
  // -------------------------------------------------------
  const votar = async (idReporte: number) => {
    try {
      const totalVotos = await ReportesComunidadService.votar(
        idUsuario,
        idReporte
      );

      // Actualizar número de votos
      setReports((prev) =>
        prev.map((r) =>
          r.id === idReporte ? { ...r, votos: totalVotos } : r
        )
      );

      // Alternar botón
      setUserVotes((prev) => ({
        ...prev,
        [idReporte]: !prev[idReporte],
      }));
    } catch (err) {
      console.error("Error al votar:", err);
    }
  };

  // -------------------------------------------------------
  // 🔎 FILTROS Y ORDEN
  // -------------------------------------------------------
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    let list = reports.filter(
      (r) =>
        r.titulo.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q)
    );

    if (sortByVotes) {
      list = [...list].sort((a, b) => b.votos - a.votos);
    }

    return list;
  }, [reports, query, sortByVotes]);

  // -------------------------------------------------------
  // 🪟 Modal
  // -------------------------------------------------------
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [selected]);

  const openModal = (r: Report) => {
    setSelected(r);
    setNewComment("");
  };

  const closeModal = () => setSelected(null);

  // Comentarios locales
  const addComment = () => {
    if (!selected) return;
    const text = newComment.trim();
    if (!text) return;

    setComments((prev) => ({
      ...prev,
      [selected.id]: [...prev[selected.id], text],
    }));
    setNewComment("");
  };

  const iconFor = (cat: CategoriaPrincipal) =>
    cat === "Mantenimiento"
      ? "/icons/Categoria-Mantenimiento.png"
      : "/icons/Categoria-Sistemas.png";

  // -------------------------------------------------------
  // R E N D E R
  // -------------------------------------------------------
  if (loading) {
    return (
      <div className="community-page">
        <header className="create-header">
          <h2>Cargando reportes...</h2>
        </header>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="community-page">
      <header className="create-header">
        <h2>Reportes de la Comunidad</h2>
      </header>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label className="sort-checkbox">
          <input
            type="checkbox"
            checked={sortByVotes}
            onChange={() => setSortByVotes((s) => !s)}
          />
          Priorizar por votos
        </label>
      </div>

      <main className="community-content">
        <div className="list">
          {filtered.slice(0, visibleCount).map((r) => (
            <article key={r.id} className="report-card">
              <div className="card-left">
                <img src={iconFor(r.categoria)} className="cat-icon" />
              </div>

              <div className="card-body" onClick={() => openModal(r)}>
                <h3 className="report-title">{r.titulo}</h3>
                <p>{r.categoria}</p>
              </div>

              <div className="card-right">
                <button
                  className={`vote-btn ${
                    userVotes[r.id] ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    votar(r.id);
                  }}
                >
                  ▲ <span className="vote-count">{r.votos}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {visibleCount < filtered.length ? (
          <button
            className="see-more-btn"
            onClick={() =>
              setVisibleCount(
                (v) => Math.min(v + LOAD_STEP, filtered.length)
              )
            }
          >
            Ver más
          </button>
        ) : (
          <div className="end-list">No hay más reportes</div>
        )}
      </main>

      {/* ---------------- MODAL ---------------- */}
      {selected && (
            <ModalReporteComunidad
            selected={selected}
            comments={comments[selected.id]}
            newComment={newComment}
            setNewComment={setNewComment}
            addComment={addComment}
            closeModal={closeModal}
          />
        )}


      <BottomNav />
    </div>
  );
}
