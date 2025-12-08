// src/Dtos/ObtenerReportesPublicosDTO.ts

export interface ObtenerReportesPublicosDTO {
  reporte_id: number;
  titulo: string;
  categoria: string;
  estado: string;
  privacidadTexto: string;
  fechaFormateada: string;
  descripcion: string;
  imagenUrl: string | null;
  votos?: number; // opcional, lo traemos del otro endpoint
}
