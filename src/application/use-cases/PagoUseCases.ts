import { PagoRepository } from '@/domain/repositories/PagoRepository';
import { Pago, CreatePagoData, UpdatePagoData, MetodoPago, EstadoPago } from '@/domain/entities/Pago';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createPagoSchema = z.object({
  id_reserva: z.number().positive('ID de reserva debe ser un número positivo'),
  monto: z.number().positive('Monto debe ser un número positivo'),
  metodo: z.enum(['TARJETA', 'EFECTIVO'], { message: 'Método debe ser TARJETA o EFECTIVO' }),
  estado: z.enum(['PENDIENTE', 'COMPLETADO'], { message: 'Estado debe ser PENDIENTE o COMPLETADO' }).optional(),
});

const updatePagoSchema = z.object({
  monto: z.number().positive('Monto debe ser un número positivo').optional(),
  metodo: z.enum(['TARJETA', 'EFECTIVO'], { message: 'Método debe ser TARJETA o EFECTIVO' }).optional(),
  estado: z.enum(['PENDIENTE', 'COMPLETADO'], { message: 'Estado debe ser PENDIENTE o COMPLETADO' }).optional(),
});

export class PagoUseCases {
  constructor(private pagoRepository: PagoRepository) {}

  async getAllPagos(params?: PaginationParams) {
    return await this.pagoRepository.findAll(params);
  }

  async getPagoById(id: number): Promise<Pago> {
    if (!id || isNaN(id)) {
      throw new Error('ID de pago válido es requerido');
    }

    const pago = await this.pagoRepository.findById(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    return pago;
  }

  async getPagosByReservaId(reservaId: number): Promise<Pago[]> {
    if (!reservaId || isNaN(reservaId)) {
      throw new Error('ID de reserva válido es requerido');
    }

    return await this.pagoRepository.findByReservaId(reservaId);
  }

  async createPago(pagoData: CreatePagoData): Promise<Pago> {
    const validatedData = createPagoSchema.parse(pagoData);

    if (!validatedData.estado) {
      validatedData.estado = 'PENDIENTE';
    }

    return await this.pagoRepository.create(validatedData);
  }

  async updatePago(id: number, pagoData: UpdatePagoData): Promise<Pago> {
    if (!id || isNaN(id)) {
      throw new Error('ID de pago válido es requerido');
    }

    const validatedData = updatePagoSchema.parse(pagoData);

    const existingPago = await this.pagoRepository.findById(id);
    if (!existingPago) {
      throw new Error('Pago no encontrado');
    }

    const updatedPago = await this.pagoRepository.update(id, validatedData);
    if (!updatedPago) {
      throw new Error('Error al actualizar pago');
    }

    return updatedPago;
  }

  async deletePago(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de pago válido es requerido');
    }

    const pago = await this.pagoRepository.findById(id);
    if (!pago) {
      throw new Error('Pago no encontrado');
    }

    await this.pagoRepository.delete(id);
  }
}