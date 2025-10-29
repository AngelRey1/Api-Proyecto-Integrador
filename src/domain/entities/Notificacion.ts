import { Usuario } from './User';

export type TipoNotificacion = 'RESERVA' | 'PAGO' | 'GENERAL';

export interface Notificacion {
  id_notificacion: number;
  id_usuario: number;
  mensaje: string;
  tipo: TipoNotificacion;
  leido: boolean;
  fecha_envio: Date;
  // Relaciones
  usuario?: Usuario;
}

export interface CreateNotificacionData {
  id_usuario: number;
  mensaje: string;
  tipo: TipoNotificacion;
  leido?: boolean;
}

export interface UpdateNotificacionData {
  mensaje?: string;
  tipo?: TipoNotificacion;
  leido?: boolean;
}