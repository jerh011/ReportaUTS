export interface ReportePublicoDto {
  reporte_id: number;
  titulo: string;
  categoria: string;
  estado: string;
  privacidadTexto: string;
  fechaFormateada: string;
  descripcion: string;
  imagenUrl: string;
  votos?: number; // Se agregará luego desde el endpoint POST
}
