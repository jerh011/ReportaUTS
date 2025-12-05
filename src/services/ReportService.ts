// src/services/ReportService.ts
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { AppStorageService } from "../lib/AppStorageService";
import { ImageBase64Converter } from "../lib/ImageBase64Converter";
import { Edificio } from "../Model/EdifiioModel";
import { Categoria } from "../Model/CategoriaMode";
import { OfflineSyncService } from "./OfflineSyncService ";
import { NotificacionService } from "./NotificacionService";

const API_URL = import.meta.env.VITE_API_URL;

type RegistrarOptions = {
  fromSync?: boolean; // si true -> estamos enviando desde el proceso de sincronización
  tempId?: string; // id temporal del pending (si aplica)
};

export const ReportService = {
  async GetEdificios(): Promise<Edificio[]> {
    const cached = AppStorageService.get<Edificio[]>("Edificios");

    if (!navigator.onLine) {
      console.warn("Sin conexión, usando edificios en cache");
      return cached ?? [];
    }

    try {
      const response = await fetch(`${API_URL}/api/Edificio`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const edificios: Edificio[] = await response.json();
      AppStorageService.set("Edificios", edificios);

      return edificios;
    } catch (error) {
      console.error("Error GetEdificios:", error);
      return cached ?? [];
    }
  },

  async GetCategorias(): Promise<Categoria[]> {
    const cached = AppStorageService.get<Categoria[]>("Categorias");

    if (!navigator.onLine) {
      console.warn("Sin conexión, usando categorías en cache");
      return cached ?? [];
    }

    try {
      const response = await fetch(`${API_URL}/api/Categoria`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const categorias: Categoria[] = await response.json();
      AppStorageService.set("Categorias", categorias);

      return categorias;
    } catch (error) {
      console.error("Error GetCategorias:", error);
      return cached ?? [];
    }
  },

  /**
   * RegistrarReporte ahora acepta opciones: fromSync y tempId.
   * Si fromSync === true, no se vuelve a guardar offline en caso de fallo
   * porque ya viene de la cola de pendientes.
   * tempId se envía como Idempotency-Key/X-Temp-Id para que el servidor
   * pueda detectar duplicados si lo soporta.
   */
  async RegistrarReporte(
    reporte: ReporteRegistroModel,
    options?: RegistrarOptions
  ): Promise<boolean> {
    const fromSync = options?.fromSync ?? false;
    const tempId = options?.tempId;

    const rawUser = AppStorageService.get("user");
    const usuario = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    const usuarioId = usuario?.idUsuario ?? usuario?.id ?? null;
    if (!usuarioId) throw new Error("Usuario no autenticado");

    reporte.usuarioId = usuarioId;
    reporte.estadoId = 1;

    if (reporte.imagen instanceof File) {
      reporte.imagen = await ImageBase64Converter.fileToBase64(reporte.imagen);
    } else {
      reporte.imagen = reporte.imagen || "imagen_placeholder.jpg";
    }

    // Si no hay conexión y NO venimos del proceso de sincronización,
    // guardar offline y notificar.
    if (!navigator.onLine) {
      if (!fromSync) {
        OfflineSyncService.savePendingReport(reporte);
        const pendingCount = OfflineSyncService.getPendingCount();
        NotificacionService.reporteGuardadoOffline(pendingCount);
      }
      return true;
    }

    // Preparar headers; si nos pasan tempId lo añadimos como clave de idempotencia.
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    if (tempId) {
      headers["Idempotency-Key"] = tempId;
      // algunos servidores esperan cabeceras personalizadas:
      headers["X-Temp-Id"] = tempId;
    }

    try {
      const response = await fetch(`${API_URL}/api/Reportes/RegistrarReporte`, {
        method: "POST",
        headers,
        body: JSON.stringify(reporte),
      });

      if (response.ok) {
        NotificacionService.exito(
          "Reporte enviado",
          "El reporte se ha registrado exitosamente."
        );
        return true;
      }

      let errorMensaje = "Error al registrar reporte";
      try {
        const texto = await response.text();
        if (texto) errorMensaje += `: ${texto}`;
      } catch {}

      // Si el backend devolvió error, lo consideramos fallo (no guardamos en pending
      // si vinimos desde sync).
      throw new Error(errorMensaje);
    } catch (error) {
      console.error("RegistrarReporte error:", error);

      // Si falla el envío por fetch/network y NO venimos de sincronización,
      // guardarlo offline (porque probablemente fue un envío en tiempo real).
      if (
        !fromSync &&
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        OfflineSyncService.savePendingReport(reporte);
        const pendingCount = OfflineSyncService.getPendingCount();
        NotificacionService.reporteGuardadoOffline(pendingCount);
        return true;
      }

      // Si venimos de sincronización (fromSync === true) o falla con otro tipo de error,
      // reportamos false para que el sync manager decida qué hacer (no re-guardar).
      return false;
    }
  },
};
