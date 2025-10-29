import { Reserva } from './Reserva';

export type MetodoPago = 'TARJETA' | 'EFECTIVO';
export type EstadoPago = 'PENDIENTE' | 'COMPLETADO';

export interface Pago {
  id_pago: number;
  id_reserva: number;
  monto: number;
  metodo: MetodoPago;
  estado: EstadoPago;
  fecha_pago?: Date;
  // Relaciones
  reserva?: Reserva;
}

export interface CreatePagoData {
  id_reserva: number;
  monto: number;
  metodo: MetodoPago;
  estado?: EstadoPago;
}

export interface UpdatePagoData {
  monto?: number;
  metodo?: MetodoPago;
  estado?: EstadoPago;
}