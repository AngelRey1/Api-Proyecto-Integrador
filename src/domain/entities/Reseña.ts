import { Reserva } from './Reserva';
import { Cliente } from './Cliente';
import { Entrenador } from './Entrenador';

export interface Reseña {
  id_reseña: number;
  id_reserva: number;
  id_cliente: number;
  id_entrenador: number;
  calificacion: number;
  comentario?: string;
  fecha_reseña: Date;
  // Relaciones
  reserva?: Reserva;
  cliente?: Cliente;
  entrenador?: Entrenador;
}

export interface CreateReseñaData {
  id_reserva: number;
  id_cliente: number;
  id_entrenador: number;
  calificacion: number;
  comentario?: string;
}

export interface UpdateReseñaData {
  calificacion?: number;
  comentario?: string;
}