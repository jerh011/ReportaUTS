export interface ReporteComunidadDto {
  id_report: number; // ✅ CAMBIO CLAVE
  titulo: string;
  descripcion?: string;
  categoria: string;
  estado: string;
  imagenUrl?: string;
  totalVotos: number;
}

