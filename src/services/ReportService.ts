// src/services/ReportService.ts
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { AppStorageService } from "../lib/AppStorageService";
import { ImageBase64Converter } from "../lib/ImageBase64Converter";
import { Edificio } from "../Model/EdifiioModel";
import { Categoria } from "../Model/CategoriaMode";
import { env } from "../../env";
const API_URL = env.VITE_API_URL;

export const ReportService = {
  async GetEdificios(): Promise<Edificio[]> {
    const cached = AppStorageService.get<Edificio[]>("Edificios");

    // Si NO hay internet → usar cache si existe
    if (!navigator.onLine) {
      console.warn("Sin conexión, usando categorías en cache");
      return cached ?? [];
    }

    try {
      const response = await fetch(`${API_URL}/Edificio`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const edificios: Edificio[] = await response.json();

      // Guardar en cache
      AppStorageService.set("Edificios", edificios);

      return edificios;
    } catch (error) {
      console.error("Error GetEdificios:", error);

      // Si la API falla, usar cache si existe
      return cached ?? [];
    }
  },

  async GetCategorias(): Promise<Categoria[]> {
    const cached = AppStorageService.get<Categoria[]>("Categorias");

    // Si no hay internet, regresar cache si existe
    if (!navigator.onLine) {
      console.warn("Sin conexión, usando categorías en cache");
      return cached ?? [];
    }

    try {
      const response = await fetch(`${API_URL}/Categoria`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const categorias: Categoria[] = await response.json();

      // Guardar en cache (localStorage)
      AppStorageService.set("Categorias", categorias);

      return categorias;
    } catch (error) {
      console.error("Error GetCategorias:", error);

      // Si ocurre un error, regresamos el cache si hay
      return cached ?? [];
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
        Accept: "*/*",
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
