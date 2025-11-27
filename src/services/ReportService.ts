// src/services/ReportService.ts
import { Edificio } from "../Model/EdifiioModel";
import { Categoria } from "../Model/CategoriaMode";
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { AppStorageService } from "../lib/AppStorageService";

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

 async RegistrarReporte(reporte: ReporteRegistroModel): Promise<void> {
  const rawUser = AppStorageService.get("user");
  const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
  
  const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
  if (!usuarioId) throw new Error("Usuario no autenticado");

  reporte.usuarioId = usuarioId;
  reporte.estadoId = 1;
  reporte.imagen = reporte.imagen || "imagen_placeholder.jpg";

  // console.log("Reporte a registrar:", reporte);

  const response = await fetch(`${API_URL}/Reportes/RegistrarReporte`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*"
    },
    body: JSON.stringify(reporte)
  });

  if (!response.ok) {
    // const errorText = await response.text();
    // console.error("Error al registrar el reporte:", errorText);
    throw new Error("Error al registrar reporte");
  }

  // console.log("Reporte registrado correctamente");
}

};
