import { Entrenador } from './Entrenador';
import { Deporte } from './Deporte';

export interface EntrenadorDeporte {
  id_entrenador_deporte: number;
  id_entrenador: number;
  id_deporte: number;
  nivel_experiencia: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  certificado: boolean;
  fecha_certificacion?: Date;
  // Relaciones
  entrenador?: Entrenador;
  deporte?: Deporte;
}

export interface CreateEntrenadorDeporteData {
  id_entrenador: number;
  id_deporte: number;
  nivel_experiencia: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  certificado: boolean;
  fecha_certificacion?: Date;
}

export interface UpdateEntrenadorDeporteData {
  nivel_experiencia?: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  certificado?: boolean;
  fecha_certificacion?: Date;
}