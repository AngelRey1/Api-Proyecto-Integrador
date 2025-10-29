export type NivelDeporte = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';

export interface Deporte {
  id_deporte: number;
  nombre: string;
  descripcion?: string;
  nivel: NivelDeporte;
}

export interface CreateDeporteData {
  nombre: string;
  descripcion?: string;
  nivel: NivelDeporte;
}

export interface UpdateDeporteData {
  nombre?: string;
  descripcion?: string;
  nivel?: NivelDeporte;
}