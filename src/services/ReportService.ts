// src/services/ReportService.ts
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { AppStorageService } from "../lib/AppStorageService";
import { ImageBase64Converter } from "../lib/ImageBase64Converter";
import { Edificio } from "../Model/EdifiioModel";
import { Categoria } from "../Model/CategoriaMode";
const API_URL = import.meta.env.VITE_API_URL;

export const ReportService = {
   async GetEdificios(): Promise<Edificio[]> {
    try {
      const response = await fetch(`${API_URL}/Edificio`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Error GetEdificios:", error);
      return [];
    }
  },

  async GetCategorias(): Promise<Categoria[]> {
    try {
      const response = await fetch(`${API_URL}/Categoria`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Error GetCategorias:", error);
      return [];
    }
  },
  
  async RegistrarReporte(reporte: ReporteRegistroModel): Promise<boolean> {
    // Obtener usuario
    const rawUser = AppStorageService.get("user");
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
    if (!usuarioId) throw new Error("Usuario no autenticado");

    reporte.usuarioId = usuarioId;
    reporte.estadoId = 1;

    // Convertir la imagen a Base64 si es un File
    if (reporte.imagen instanceof File) {
      reporte.imagen = await ImageBase64Converter.fileToBase64(reporte.imagen);
    } else {
      reporte.imagen = reporte.imagen || "imagen_placeholder.jpg";
    }

    // Enviar al backend
    const response = await fetch(`${API_URL}/Reportes/RegistrarReporte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      body: JSON.stringify(reporte),
    });

    if (response.ok) return true;

    let errorMensaje = "Error al registrar reporte";
    try {
      const texto = await response.text();
      if (texto) errorMensaje += `: ${texto}`;
    } catch {}

    throw new Error(errorMensaje);
  },
};
