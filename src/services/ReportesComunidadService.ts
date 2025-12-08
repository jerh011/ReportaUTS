// src/services/ReportesComunidadService.ts
import type { ObtenerReportesPublicosDTO } from "../Dtos/ObtenerReportesPublicosDTO";

const API = import.meta.env.VITE_API_URL;

export const ReportesComunidadService = {
  
  // ===========================================
  // Obtener reportes públicos
  // ===========================================
  async obtenerReportesPublicos(): Promise<ObtenerReportesPublicosDTO[]> {
    const res = await fetch(`${API}/api/Reportes/ReportesPublicos`);

    if (!res.ok) {
      throw new Error(`Error al obtener reportes públicos: ${res.status}`);
    }

    const data = await res.json();
    return data as ObtenerReportesPublicosDTO[];
  },

  // ===========================================
  // Registrar / quitar voto (toggle)
  // El backend devuelve el total actualizado
  // ===========================================
  async votar(idUsuario: number, idReporte: number): Promise<number> {
    const res = await fetch(`${API}/api/Voto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUsuario,
        idReporte,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error al votar: ${res.status}`);
    }

    const data = await res.json(); // total votos
    return data as number;
  },

  GetImageReporte(imagen: string): string {
  if (!imagen) return "";
  return `${API}${imagen}`;
},

};
