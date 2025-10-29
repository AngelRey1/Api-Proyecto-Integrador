import { Horario } from './Horario';

export interface Sesion {
  id_sesion: number;
  id_horario: number;
  fecha: Date;
  cupos_disponibles: number;
  // Relaciones
  horario?: Horario;
}

export interface CreateSesionData {
  id_horario: number;
  fecha: Date;
  cupos_disponibles: number;
}

export interface UpdateSesionData {
  fecha?: Date;
  cupos_disponibles?: number;
}