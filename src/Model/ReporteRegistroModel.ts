export class ReporteRegistroModel {
  titulo?: string;
  descripcion?: string;
  privacidad?: boolean;
  edificioId?: number;
  categoriaId?: number;
  usuarioId?: number;
  estadoId?: number;
  imagen?: File | string; // <-- aquí
}
