// src/services/HomeServise.ts
import { ReportsDto } from "../Dtos/ReportsDto";
import { AppStorageService } from "../lib/AppStorageService";
import type { LoginResponse } from "../Response/LoginResponse";
const API_URL = import.meta.env.VITE_API_URL;

export const HomeService = {
  async Reports(): Promise<ReportsDto[]> {
    try {
      // raw puede ser null, string JSON, UserModel o LoginResponse
      const raw = AppStorageService.get("user");
      // console.log("HomeService: raw from storage ->", raw);

      if (!raw) {
        console.error("No se encontró 'user' en localStorage.");
        return [];
      }

      // Si viene como string JSON, parsearlo
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

      // Intentar obtener idUsuario en varias ubicaciones posibles
      const idUsuario =
        // LoginResponse.user.idUsuario
        (parsed as LoginResponse)?.user?.idUsuario ??
        // UserModel.idUsuario (usuario guardado directamente)
        (parsed as any)?.idUsuario ??
        // alternativas comunes
        (parsed as any)?.id ?? (parsed as any)?.userId ?? null;

      if (!idUsuario) {
        console.error("No se encontró idUsuario en el objeto guardado:", parsed);
        return [];
      }

      // Petición al API
      const response = await fetch(
        `${API_URL}/Reportes/ReportePorUsuarioDto?idUsuario=${encodeURIComponent(String(idUsuario))}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        console.error("Error al obtener reportes:", response.status, response.statusText);
        return [];
      }

      const data = (await response.json()) as ReportsDto[];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error en HomeService.Reports:", error);
      return [];
    }
  },
};
