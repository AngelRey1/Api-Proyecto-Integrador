import { Entrenador } from './Entrenador';
import { Deporte } from './Deporte';

export interface EntrenadorDeporte {
  id_entrenador: number;
  id_deporte: number;
  // Relaciones
  entrenador?: Entrenador;
  deporte?: Deporte;
}

export interface CreateEntrenadorDeporteData {
  id_entrenador: number;
  id_deporte: number;
}

export interface UpdateEntrenadorDeporteData {
  id_entrenador?: number;
  id_deporte?: number;
}