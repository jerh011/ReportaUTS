import React from "react";
import { ReportePorUsuarioWhitImagen } from "../../Dtos/ReportePorUsuarioWhitImagen";
import { MisReportesServices } from "../../services/MisReportesServices";
type ReporteConComentarios = ReportePorUsuarioWhitImagen & {
  comentarios?: string[];
};

type ModalMisReportesProps = {
  selected: ReporteConComentarios;
  closeModal: () => void;
  eliminarReporte: (id: string) => void;
  eliminarEvidencia: (reportId: string, idx: number) => void;
  addComment: () => void;
  handleFilesAdd: (files: FileList | null) => void;
  newComment: string;
  setNewComment: (value: string) => void;
};

const ModalMisReportes: React.FC<ModalMisReportesProps> = ({
  selected,
  closeModal,
  eliminarReporte,
  eliminarEvidencia,
  addComment,
  handleFilesAdd,
  newComment,
  setNewComment,
}) => {
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <img
          src={
            selected.categoria === "Mantenimiento"
              ? "/icons/Categoria-Mantenimiento.png"
              : "/icons/Categoria-Sistemas.png"
          }
          className="modal-cat-icon"
          alt="Icono Categoria"
        /> */}
        
        <img src={selected.categoria  === "Sisteama"? "/icons/Categoria-Sistemas.png":"/icons/Categoria-Mantenimiento.png"}
                  className="modal-cat-icon"
                  alt={selected.categoria }
                />
        <h2 className="modal-title">{selected.titulo}</h2>

        <div className="detail-info">
          <p>
            <strong>Categoría:</strong> {selected.categoria} —{" "}
            {selected.descripcion}
          </p>
        </div>

        <div
          className={`modal-estado-tag privacy-badge ${
            selected.privacidadTexto?.toLowerCase() === "publico"
              ? "pub"
              : "anon"
          }`}
        >
          {selected.privacidadTexto?.toLowerCase() === "publico"
            ? "Público"
            : "Anónimo"}
        </div>
        <div
          className={`modal-estado-tag estado-${selected.estado?.replace(
            /\s+/g,
            "-"
          )}`}
        >
          {selected.estado}
        </div>

        <p>
          <strong>Fecha:</strong> {selected.fechaFormateada}
        </p>
        <p className="modal-desc-label">Descripción:</p>
        <p className="modal-desc">
          {selected.descripcion || "Sin descripción"}
        </p>

        <div className="evidencias">
          <h4>Evidencias</h4>

          {selected.imagenUrl ? (
            <div className="evid-grid">
              <div className="evid-box">
                <img
                  src={MisReportesServices.GetImageReporte(
                    selected.imagenUrl || ""
                  )}
                  alt="evidencia"
                />

                <button
                  className="evid-delete"
                  title="Eliminar imagen"
                  onClick={() => eliminarEvidencia(selected.id_report || "", 0)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <div className="no-evid">Sin evidencias adjuntas</div>
          )}

          {/* upload (solo si no hay imagen) */}
          <div className="upload-controls">
            {!selected.imagenUrl && (
              <>
                <label className="upload-label">
                  Agregar imagen...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFilesAdd(e.target.files)}
                  />
                </label>
                <small className="hint">
                  El modelo actual soporta 1 imagen (imagenUrl)
                </small>
              </>
            )}
          </div>
        </div>

        <div className="modal-sep" />

        <h4 className="comments-title">Comentarios</h4>
        <div className="comments-list">
          {selected.comentarios && selected.comentarios.length > 0 ? (
            selected.comentarios.map((c: string, i: number) => (
              <div key={i} className="comment-item">
                • {c}
              </div>
            ))
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
          <button className="btn-send" onClick={addComment}>
            Enviar comentario
          </button>

          <div className="right-actions">
            <button
              className="btn-delete"
              onClick={() => eliminarReporte(selected.id_report || "")}
            >
              Eliminar reporte
            </button>
            <button className="btn-close" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMisReportes;
