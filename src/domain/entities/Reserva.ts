import { Cliente } from './Cliente';
import { Sesion } from './Sesion';

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

export interface Reserva {
  id_reserva: number;
  id_cliente: number;
  id_sesion: number;
  estado: EstadoReserva;
  fecha_reserva: Date;
  // Relaciones
  cliente?: Cliente;
  sesion?: Sesion;
}

export interface CreateReservaData {
  id_cliente: number;
  id_sesion: number;
  estado?: EstadoReserva;
}

export interface UpdateReservaData {
  estado?: EstadoReserva;
}