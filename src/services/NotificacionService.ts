// src/services/NotificacionesService.ts

export type TipoNotificacion = "success" | "error" | "warning" | "info";

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  duracion?: number; // en milisegundos, undefined = no se cierra automáticamente
}

type NotificacionListener = (notificacion: Notificacion) => void;

export const NotificacionService = {
  listeners: new Set<NotificacionListener>(),

  /**
   * Suscribe un componente para recibir notificaciones
   */
  suscribir(listener: NotificacionListener): () => void {
    this.listeners.add(listener);

    // Retorna función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  },

  /**
   * Muestra una notificación
   */
  mostrar(
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    duracion?: number
  ): void {
    const notificacion: Notificacion = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      titulo,
      mensaje,
      duracion: duracion ?? (tipo === "error" ? undefined : 5000),
    };

    this.listeners.forEach((listener) => listener(notificacion));
  },

  /**
   * Atajos para tipos específicos de notificaciones
   */
  exito(titulo: string, mensaje: string, duracion?: number): void {
    this.mostrar("success", titulo, mensaje, duracion);
  },

  error(titulo: string, mensaje: string, duracion?: number): void {
    this.mostrar("error", titulo, mensaje, duracion);
  },

  advertencia(titulo: string, mensaje: string, duracion?: number): void {
    this.mostrar("warning", titulo, mensaje, duracion);
  },

  info(titulo: string, mensaje: string, duracion?: number): void {
    this.mostrar("info", titulo, mensaje, duracion);
  },

  /**
   * Notificaciones específicas para el sistema offline
   */
  reporteGuardadoOffline(cantidad: number): void {
    this.advertencia(
      "Sin conexión",
      `Reporte guardado. Se sincronizará cuando vuelva la conexión. (${cantidad} pendiente${
        cantidad > 1 ? "s" : ""
      })`,
      7000
    );
  },

  sincronizacionIniciada(): void {
    this.info(
      "Sincronizando",
      "Conexión restaurada. Sincronizando reportes pendientes...",
      3000
    );
  },

  sincronizacionCompletada(exitosos: number, fallidos: number): void {
    if (fallidos === 0) {
      this.exito(
        "Sincronización completada",
        `${exitosos} reporte${
          exitosos > 1 ? "s sincronizados" : " sincronizado"
        } exitosamente.`,
        5000
      );
    } else {
      this.advertencia(
        "Sincronización parcial",
        `${exitosos} exitoso${exitosos > 1 ? "s" : ""}, ${fallidos} fallido${
          fallidos > 1 ? "s" : ""
        }. Intenta de nuevo más tarde.`,
        7000
      );
    }
  },

  sinConexion(): void {
    this.error(
      "Sin conexión",
      "No hay conexión a internet. Los reportes se guardarán y sincronizarán cuando vuelva la conexión.",
      5000
    );
  },

  conexionRestaurada(): void {
    this.exito(
      "Conexión restaurada",
      "La conexión a internet se ha recuperado.",
      3000
    );
  },

  conexionPerdida(): void {
    this.advertencia(
      "Sin conexión",
      "No hay conexión a internet. Los reportes se guardarán localmente.",
      5000
    );
  },
};
