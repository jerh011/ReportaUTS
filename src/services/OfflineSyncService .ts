// src/services/OfflineSyncService.ts
import { AppStorageService } from "../lib/AppStorageService";
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { ReportService } from "./ReportService";

// const API_URL = import.meta.env.VITE_API_URL;

export interface PendingReport extends ReporteRegistroModel {
  tempId: string; // ID temporal para identificar el reporte
  timestamp: number; // Cuándo se creó
  sending?: boolean; // flag para indicar que ya está siendo enviado
}

const STORAGE_KEY = "pendingReports";

export const OfflineSyncService = {
  _initialized: false, // evita múltiples listeners

  /**
   * Guarda un reporte pendiente cuando no hay internet
   * Evita duplicados simples comparando tempId/ timestamp (si se quiere mejorar, comparar campos clave)
   */
  savePendingReport(reporte: ReporteRegistroModel): string {
    const pendingReports = this.getPendingReports();
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const pendingReport: PendingReport = {
      ...reporte,
      tempId,
      timestamp: Date.now(),
      sending: false,
    };

    pendingReports.push(pendingReport);
    AppStorageService.set(STORAGE_KEY, pendingReports);

    return tempId;
  },

  getPendingReports(): PendingReport[] {
    const pending = AppStorageService.get<PendingReport[]>(STORAGE_KEY);
    return pending ?? [];
  },

  /**
   * Actualiza un pending en storage (por tempId)
   */
  updatePendingReport(tempId: string, patch: Partial<PendingReport>): void {
    const pending = this.getPendingReports();
    const idx = pending.findIndex((p) => p.tempId === tempId);
    if (idx === -1) return;
    pending[idx] = { ...pending[idx], ...patch };
    AppStorageService.set(STORAGE_KEY, pending);
  },

  removePendingReport(tempId: string): void {
    const pending = this.getPendingReports();
    const filtered = pending.filter((r) => r.tempId !== tempId);
    AppStorageService.set(STORAGE_KEY, filtered);
  },

  /**
   * Intenta sincronizar todos los reportes pendientes.
   * Solo procesa pendientes que no estén marcados como sending.
   */
  async syncPendingReports(): Promise<{ success: number; failed: number }> {
    const pending = this.getPendingReports();

    if (pending.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    // Hacemos una copia para evitar problemas mientras actualizamos storage
    const toProcess = pending.filter((p) => !p.sending);

    for (const report of toProcess) {
      const { tempId, timestamp, ...reportData } = report;
      // marcar como sending antes de intentar (persistir)
      try {
        this.updatePendingReport(tempId, { sending: true });
      } catch (e) {
        console.warn("No se pudo marcar como sending:", tempId, e);
      }

      try {
        const result = await ReportService.RegistrarReporte(
          reportData as ReporteRegistroModel,
          { fromSync: true, tempId }
        );

        if (result) {
          // Si fue exitoso, eliminar del pending
          this.removePendingReport(tempId);
          success++;
        } else {
          // Si RegistrarReporte devolvió false, limpiamos sending para reintento posterior
          this.updatePendingReport(tempId, { sending: false });
          failed++;
        }
      } catch (error) {
        console.error(`Error al sincronizar reporte ${report.tempId}:`, error);
        // limpiar sending para reintento posterior
        this.updatePendingReport(tempId, { sending: false });
        failed++;
      }
    }

    return { success, failed };
  },

  hasPendingReports(): boolean {
    return this.getPendingReports().length > 0;
  },

  getPendingCount(): number {
    return this.getPendingReports().length;
  },

  /**
   * Inicializa el listener de conexión para sincronización automática
   * Solo se registra una vez.
   */
  initializeAutoSync(
    onSyncComplete?: (result: { success: number; failed: number }) => void
  ): void {
    if (this._initialized) return;
    this._initialized = true;

    const handler = async () => {
      console.log("Conexión restaurada, iniciando sincronización...");
      if (this.hasPendingReports()) {
        try {
          const result = await this.syncPendingReports();
          console.log(
            `Sincronización completada: ${result.success} exitosos, ${result.failed} fallidos`
          );

          if (onSyncComplete) {
            onSyncComplete(result);
          }
        } catch (error) {
          console.error("Error durante la sincronización automática:", error);
        }
      }
    };

    window.addEventListener("online", handler);
  },
};
