import { ReportePorUsuarioWhitImagen } from "../Dtos/ReportePorUsuarioWhitImagen";

import { env } from "../../env";
const API_URL = env.VITE_API_URL;
const VITE_API_IMAGE = env.VITE_API_IMAGE;
export const MisReportesServices = {
  async ReportsWithImagenes(
    idUsuario: number = 21
  ): Promise<ReportePorUsuarioWhitImagen[]> {
    try {
      const response = await fetch(
        `${API_URL}/Reportes/ReportePorUsuarioWhitImagenDto?idUsuario=${idUsuario}`,
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
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  GetImageReporte(imagen: string): string {
    if (!imagen) return "";

    return `${VITE_API_IMAGE}${imagen}`; // así aseguras la barra
  },
};
