import { ReseñaRepository } from '@/domain/repositories/ReseñaRepository';
import { Reseña, CreateReseñaData, UpdateReseñaData } from '@/domain/entities/Reseña';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createReseñaSchema = z.object({
  id_reserva: z.number().positive('ID de reserva debe ser un número positivo'),
  id_cliente: z.number().positive('ID de cliente debe ser un número positivo'),
  id_entrenador: z.number().positive('ID de entrenador debe ser un número positivo'),
  calificacion: z.number().min(1, 'Calificación mínima es 1').max(5, 'Calificación máxima es 5'),
  comentario: z.string().optional(),
});

const updateReseñaSchema = z.object({
  calificacion: z.number().min(1, 'Calificación mínima es 1').max(5, 'Calificación máxima es 5').optional(),
  comentario: z.string().optional(),
});

export class ReseñaUseCases {
  constructor(private reseñaRepository: ReseñaRepository) {}

  async getAllReseñas(params?: PaginationParams) {
    return await this.reseñaRepository.findAll(params);
  }

  async getReseñaById(id: number): Promise<Reseña> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reseña válido es requerido');
    }

    const reseña = await this.reseñaRepository.findById(id);
    if (!reseña) {
      throw new Error('Reseña no encontrada');
    }

    return reseña;
  }

  async getReseñasByEntrenadorId(entrenadorId: number): Promise<Reseña[]> {
    if (!entrenadorId || isNaN(entrenadorId)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    return await this.reseñaRepository.findByEntrenadorId(entrenadorId);
  }

  async getReseñasByClienteId(clienteId: number): Promise<Reseña[]> {
    if (!clienteId || isNaN(clienteId)) {
      throw new Error('ID de cliente válido es requerido');
    }

    return await this.reseñaRepository.findByClienteId(clienteId);
  }

  async createReseña(reseñaData: CreateReseñaData): Promise<Reseña> {
    const validatedData = createReseñaSchema.parse(reseñaData);

    return await this.reseñaRepository.create(validatedData);
  }

  async updateReseña(id: number, reseñaData: UpdateReseñaData): Promise<Reseña> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reseña válido es requerido');
    }

    const validatedData = updateReseñaSchema.parse(reseñaData);

    const existingReseña = await this.reseñaRepository.findById(id);
    if (!existingReseña) {
      throw new Error('Reseña no encontrada');
    }

    const updatedReseña = await this.reseñaRepository.update(id, validatedData);
    if (!updatedReseña) {
      throw new Error('Error al actualizar reseña');
    }

    return updatedReseña;
  }

  async deleteReseña(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de reseña válido es requerido');
    }

    const reseña = await this.reseñaRepository.findById(id);
    if (!reseña) {
      throw new Error('Reseña no encontrada');
    }

    await this.reseñaRepository.delete(id);
  }
}