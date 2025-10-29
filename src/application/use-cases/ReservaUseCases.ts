import { ReservaRepository } from '@/domain/repositories/ReservaRepository';
import { Reserva, CreateReservaData, UpdateReservaData, EstadoReserva } from '@/domain/entities/Reserva';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createReservaSchema = z.object({
  id_cliente: z.number().positive('ID de cliente debe ser un número positivo'),
  id_sesion: z.number().positive('ID de sesión debe ser un número positivo'),
  estado: z.enum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA'], { message: 'Estado debe ser PENDIENTE, CONFIRMADA o CANCELADA' }).optional(),
});

const updateReservaSchema = z.object({
  estado: z.enum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA'], { message: 'Estado debe ser PENDIENTE, CONFIRMADA o CANCELADA' }).optional(),
});

export class ReservaUseCases {
  constructor(private reservaRepository: ReservaRepository) {}

  async getAllReservas(params?: PaginationParams) {
    return await this.reservaRepository.findAll(params);
  }

  async getReservaById(id: number): Promise<Reserva> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reserva válido es requerido');
    }

    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    return reserva;
  }

  async getReservasByClienteId(clienteId: number): Promise<Reserva[]> {
    if (!clienteId || isNaN(clienteId)) {
      throw new Error('ID de cliente válido es requerido');
    }

    return await this.reservaRepository.findByClienteId(clienteId);
  }

  async getReservasBySesionId(sesionId: number): Promise<Reserva[]> {
    if (!sesionId || isNaN(sesionId)) {
      throw new Error('ID de sesión válido es requerido');
    }

    return await this.reservaRepository.findBySesionId(sesionId);
  }

  async createReserva(reservaData: CreateReservaData): Promise<Reserva> {
    const validatedData = createReservaSchema.parse(reservaData);

    // Establecer estado por defecto si no se proporciona
    if (!validatedData.estado) {
      validatedData.estado = 'PENDIENTE';
    }

    return await this.reservaRepository.create(validatedData);
  }

  async updateReserva(id: number, reservaData: UpdateReservaData): Promise<Reserva> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reserva válido es requerido');
    }

    const validatedData = updateReservaSchema.parse(reservaData);

    const existingReserva = await this.reservaRepository.findById(id);
    if (!existingReserva) {
      throw new Error('Reserva no encontrada');
    }

    const updatedReserva = await this.reservaRepository.update(id, validatedData);
    if (!updatedReserva) {
      throw new Error('Error al actualizar reserva');
    }

    return updatedReserva;
  }

  async deleteReserva(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reserva válido es requerido');
    }

    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    await this.reservaRepository.delete(id);
  }
}