import { ReportePorUsuarioWhitImagen } from "../Dtos/ReportePorUsuarioWhitImagen";
import { AppStorageService } from "../lib/AppStorageService";
<<<<<<< HEAD
import { env } from "../../env";
const API_URL = env.VITE_API_URL;
const VITE_API_IMAGE = env.VITE_API_IMAGE;
export const MisReportesServices = {
  async ReportsWithImagenes(): Promise<ReportePorUsuarioWhitImagen[]> {
    const rawUser = AppStorageService.get("user");
    console.log(rawUser);
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
    // alert(usuarioId);
    try {
      const response = await fetch(
        `${API_URL}/Reportes/ReportePorUsuarioWhitImagenDto?idUsuario=${usuarioId}`,
=======
const API_URL = import.meta.env.VITE_API_URL;

export const MisReportesServices = {
  async ReportsWithImagenes(): Promise<ReportePorUsuarioWhitImagen[]> {
    const rawUser = AppStorageService.get("user");
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
    try {
      const response = await fetch(
        `${API_URL}/api/Reportes/ReportePorUsuarioWhitImagenDto?idUsuario=${usuarioId}`,
>>>>>>> origin/main
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
<<<<<<< HEAD

=======
>>>>>>> origin/main
      if (!response.ok) {
        throw new Error(
          `Error en la petición: ${response.status} - ${response.statusText}`
        );
      }
<<<<<<< HEAD

=======
>>>>>>> origin/main
      const data: ReportePorUsuarioWhitImagen[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
<<<<<<< HEAD
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  GetImageReporte(imagen: string): string {
    if (!imagen) return "";

    return `${VITE_API_IMAGE}${imagen}`; // así aseguras la barra
=======
      throw error;
    }
  },
  GetImageReporte(imagen: string): string {
    if (!imagen) return "";
    return `${API_URL}${imagen}`;
>>>>>>> origin/main
  },
};
