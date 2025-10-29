import { Usuario } from './User';

export type TipoFeedback = 'SUGERENCIA' | 'REPORTE_ERROR';

export interface RetroalimentacionApp {
  id_feedback: number;
  id_usuario: number;
  mensaje: string;
  tipo: TipoFeedback;
  fecha_feedback: Date;
  // Relaciones
  usuario?: Usuario;
}

export interface CreateRetroalimentacionAppData {
  id_usuario: number;
  mensaje: string;
  tipo: TipoFeedback;
}

export interface UpdateRetroalimentacionAppData {
  mensaje?: string;
  tipo?: TipoFeedback;
}