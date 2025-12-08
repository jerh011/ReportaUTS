import React from "react";
import { ReportesComunidadService } from "../../services/ReportesComunidadService";

type Report = {
  id: number;
  titulo: string;
  categoria: "Sistemas" | "Mantenimiento";
  estado: string;
  descripcion?: string;
  fecha: string;
  votos: number;
  evidencias?: string[] | null;
};

type ModalReporteComunidadProps = {
  selected: Report;
  comments: string[];
  newComment: string;
  setNewComment: (value: string) => void;
  addComment: () => void;
  closeModal: () => void;
};

const ModalReporteComunidad: React.FC<ModalReporteComunidadProps> = ({
  selected,
  comments,
  newComment,
  setNewComment,
  addComment,
  closeModal
}) => {
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Icono categoría */}
        <img
          src={
            selected.categoria === "Sistemas"
              ? "/icons/Categoria-Sistemas.png"
              : "/icons/Categoria-Mantenimiento.png"
          }
          className="modal-cat-icon"
          alt={selected.categoria}
        />

        <h2 className="modal-title">{selected.titulo}</h2>

        {/* Información básica */}
        <div className="detail-info">
          <span><strong>Categoría:</strong> {selected.categoria}</span>
          <span><strong>Fecha:</strong> {selected.fecha}</span>
        </div>

        <div className={`modal-estado-tag estado-${selected.estado}`}>
          {selected.estado}
        </div>

        {/* Descripción */}
        <p className="modal-desc-label">Descripción</p>
        <p className="modal-desc">{selected.descripcion || "Sin descripción"}</p>

        {/* Evidencias */}
        <div className="evidencias">
          <h4>Evidencias</h4>

          {selected.evidencias && selected.evidencias.length > 0 ? (
            <div className="evid-grid">
              {selected.evidencias.map((img, i) => (
                <div className="evid-box" key={i}>
                  <img
                    src={ReportesComunidadService.GetImageReporte(img)}
                    alt={`evidencia-${i}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-evid">Sin evidencias adjuntas</div>
          )}
        </div>

        <div className="modal-sep" />

        {/* Comentarios */}
        <h4 className="comments-title">Comentarios</h4>

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">Sin comentarios.</div>
          ) : (
            comments.map((c, i) => (
              <div className="comment-item" key={i}>
                {c}
              </div>
            ))
          )}
        </div>

        {/* Nuevo comentario */}
        <textarea
          className="comment-input"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        {/* Botones */}
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
  );
};

export default ModalReporteComunidad;
