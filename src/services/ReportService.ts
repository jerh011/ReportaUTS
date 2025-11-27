// src/services/ReportService.ts
import { Edificio } from "../Model/EdifiioModel";
import { Categoria } from "../Model/CategoriaMode";
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { AppStorageService } from "../lib/AppStorageService";

const API_URL = "http://localhost:5276/api";

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
    console.log("Usuario obtenido del almacenamiento:", rawUser);

    // Asegúrate de que rawUser sea un objeto
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;

    // Asigna el idUsuario al reporte de forma segura
    reporte.usuarioId = usuario?.idUsuario ?? null;

    console.log("Reporte listo para enviar:", reporte);
    // if (!rawUser) {
    //   console.error(
    //     "Usuario no autenticado. No se puede registrar el reporte."
    //   );
    //   throw new Error("Usuario no autenticado");
    // }

    // // Parse seguro del usuario desde JSON
    // const usuario = JSON.parse(rawUser) as { id: number };

    // // Asignar usuario y estado
    // reporte.usuarioId = usuario.id;
    // reporte.estadoId = 1; // Pendiente
    // reporte.imagen = reporte.imagen || "imagen_placeholder.jpg";

    // console.log("Reporte a registrar:", reporte);
  },
};
