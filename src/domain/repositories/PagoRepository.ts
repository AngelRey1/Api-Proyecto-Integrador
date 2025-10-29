import { Pago, CreatePagoData, UpdatePagoData } from '@/domain/entities/Pago';
import { PaginationParams } from '@/shared/types/api';

export interface PagoRepository {
  findAll(params?: PaginationParams): Promise<{ pagos: Pago[]; total: number }>;
  findById(id: number): Promise<Pago | null>;
  findByReservaId(reservaId: number): Promise<Pago[]>;
  create(pagoData: CreatePagoData): Promise<Pago>;
  update(id: number, pagoData: UpdatePagoData): Promise<Pago | null>;
  delete(id: number): Promise<boolean>;
}