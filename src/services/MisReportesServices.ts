import { ReportePorUsuarioWhitImagen } from "../Dtos/ReportePorUsuarioWhitImagen";
import { AppStorageService } from "../lib/AppStorageService";
const API_URL = import.meta.env.VITE_API_URL;

export const MisReportesServices = {
  async ReportsWithImagenes(): Promise<ReportePorUsuarioWhitImagen[]> {
    const rawUser = AppStorageService.get("user");
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
    try {
      const response = await fetch(
        `${API_URL}/api/Reportes/ReportePorUsuarioWhitImagenDto?idUsuario=${usuarioId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error en la petición: ${response.status} - ${response.statusText}`
        );
      }
      const data: ReportePorUsuarioWhitImagen[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
      throw error;
    }
  },
  GetImageReporte(imagen: string): string {
    if (!imagen) return "";
    return `${API_URL}${imagen}`;
  },
};
