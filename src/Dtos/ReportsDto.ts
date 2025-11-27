// models/Edificio.ts
export class ReportsDto {
  titulo?: number;
  categoria?: string;
  estado?: string; // opcional si no siempre viene del backend
  fechaFormateada?: string;
  edificioDescripcion?: string;
}
