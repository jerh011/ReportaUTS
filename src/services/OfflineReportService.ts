// src/services/OfflineReportService.ts
import { v4 as uuidv4 } from "uuid";
import { ReporteRegistroModel } from "../Model/ReporteRegistroModel";
import { ReportService } from "./ReportService";

export type OfflineReporte = {
  tempId: string;
  data: ReporteRegistroModel;
  createdAt: number;
};

const STORAGE_KEY = "offline_reports_v1";

function readStorage(): OfflineReporte[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineReporte[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(list: OfflineReporte[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ================= IMÁGENES ================= */

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function dataURLtoFile(dataUrl: string, filename = "image"): File | null {
  const arr = dataUrl.split(",");
  if (arr.length < 2) return null;
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/png";
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], `${filename}.png`, { type: mime });
}

async function ensureImageFile(
  model: ReporteRegistroModel
): Promise<ReporteRegistroModel> {
  const copy = { ...model };

  if (copy.imagen instanceof File || copy.imagen == null) return copy;

  if (typeof copy.imagen === "string") {
    copy.imagen = dataURLtoFile(copy.imagen);
  }

  return copy;
}

/* ================= SERVICE ================= */

export const OfflineReportService = {
  async save(reporte: ReporteRegistroModel): Promise<string> {
    let image: string | null = null;

    if (reporte.imagen instanceof File) {
      image = await fileToDataURL(reporte.imagen);
    } else if (typeof reporte.imagen === "string") {
      image = reporte.imagen;
    }

    const tempId = uuidv4();

    const entry: OfflineReporte = {
      tempId,
      createdAt: Date.now(),
      data: {
        ...reporte,
        imagen: image,
      },
    };

    const list = readStorage();
    list.push(entry);
    writeStorage(list);

    return tempId;
  },

  getAll(): OfflineReporte[] {
    return readStorage();
  },

  remove(tempId: string) {
    writeStorage(readStorage().filter((r) => r.tempId !== tempId));
  },

  /**
   * ✅ SINCRONIZACIÓN CORRECTA (ARREGLADO)
   */
  async sync(): Promise<{ success: number; failed: number }> {
    const stored = readStorage();
    if (!stored.length) return { success: 0, failed: 0 };

    const pendientes: OfflineReporte[] = [];
    let success = 0;
    let failed = 0;

    for (const item of stored) {
      try {
        const prepared = await ensureImageFile(item.data);
        await ReportService.RegistrarReporte(prepared);
        success++;
      } catch (error) {
        pendientes.push(item); // 👈 se conserva
        failed++;
      }
    }

    // ✅ SOLO guardamos los que fallaron
    writeStorage(pendientes);

    return { success, failed };
  },
};

export default OfflineReportService;
