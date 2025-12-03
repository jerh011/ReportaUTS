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
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const idUsuario =
        (parsed as LoginResponse)?.user?.idUsuario ??
        (parsed as any)?.idUsuario ??
        (parsed as any)?.id ??
        (parsed as any)?.userId ??
        null;

      if (!idUsuario) {
        console.error(
          "No se encontró idUsuario en el objeto guardado:",
          parsed
        );
        return [];
      }
      // Petición al API
      const response = await fetch(
        `${API_URL}/api/Reportes/ReportePorUsuarioDto?idUsuario=${encodeURIComponent(
          String(idUsuario)
        )}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );
      AppStorageService.set("reportesHome", response);
      if (!response.ok) {
        console.error(
          "Error al obtener reportes:",
          response.status,
          response.statusText
        );
        return [];
      }
      const data = (await response.json()) as ReportsDto[];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error en HomeService.Reports:", error);
      return [];
    }
  },
  async getReportes(): Promise<ReportsDto[]> {
    const data = await this.Reports();
    return data;
  },
};
