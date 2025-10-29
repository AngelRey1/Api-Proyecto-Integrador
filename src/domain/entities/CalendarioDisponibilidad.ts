import { Entrenador } from './Entrenador';

export interface CalendarioDisponibilidad {
  id_disponibilidad: number;
  id_entrenador: number;
  fecha: Date;
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  // Relaciones
  entrenador?: Entrenador;
}

export interface CreateCalendarioDisponibilidadData {
  id_entrenador: number;
  fecha: Date;
  hora_inicio: string;
  hora_fin: string;
  disponible?: boolean;
}

export interface UpdateCalendarioDisponibilidadData {
  fecha?: Date;
  hora_inicio?: string;
  hora_fin?: string;
  disponible?: boolean;
}