import { Reserva, CreateReservaData, UpdateReservaData } from '@/domain/entities/Reserva';
import { PaginationParams } from '@/shared/types/api';

export interface ReservaRepository {
  findAll(params?: PaginationParams): Promise<{ reservas: Reserva[]; total: number }>;
  findById(id: number): Promise<Reserva | null>;
  findByClienteId(clienteId: number): Promise<Reserva[]>;
  findBySesionId(sesionId: number): Promise<Reserva[]>;
  create(reservaData: CreateReservaData): Promise<Reserva>;
  update(id: number, reservaData: UpdateReservaData): Promise<Reserva | null>;
  delete(id: number): Promise<boolean>;
}