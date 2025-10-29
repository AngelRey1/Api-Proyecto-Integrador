import { Entrenador } from './Entrenador';

export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface Horario {
  id_horario: number;
  id_entrenador: number;
  dia: DiaSemana;
  hora_inicio: string; // TIME format
  hora_fin: string; // TIME format
  // Relaciones
  entrenador?: Entrenador;
}

export interface CreateHorarioData {
  id_entrenador: number;
  dia: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
}

export interface UpdateHorarioData {
  dia?: DiaSemana;
  hora_inicio?: string;
  hora_fin?: string;
}