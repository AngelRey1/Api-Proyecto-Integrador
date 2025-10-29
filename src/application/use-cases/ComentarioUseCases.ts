import { ComentarioRepository } from '@/domain/repositories/ComentarioRepository';
import { Comentario, CreateComentarioData, UpdateComentarioData } from '@/domain/entities/Comentario';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createComentarioSchema = z.object({
  id_cliente: z.number().positive('ID de cliente debe ser un número positivo'),
  id_reseña: z.number().positive('ID de reseña debe ser un número positivo'),
  contenido: z.string().min(1, 'Contenido es requerido'),
});

const updateComentarioSchema = z.object({
  contenido: z.string().min(1, 'Contenido es requerido').optional(),
});

export class ComentarioUseCases {
  constructor(private comentarioRepository: ComentarioRepository) {}

  async getAllComentarios(params?: PaginationParams) {
    return await this.comentarioRepository.findAll(params);
  }

  async getComentarioById(id: number): Promise<Comentario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de comentario válido es requerido');
    }

    const comentario = await this.comentarioRepository.findById(id);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }

    return comentario;
  }

  async getComentariosByReseñaId(reseñaId: number): Promise<Comentario[]> {
    if (!reseñaId || isNaN(reseñaId)) {
      throw new Error('ID de reseña válido es requerido');
    }

    return await this.comentarioRepository.findByReseñaId(reseñaId);
  }

  async getComentariosByClienteId(clienteId: number): Promise<Comentario[]> {
    if (!clienteId || isNaN(clienteId)) {
      throw new Error('ID de cliente válido es requerido');
    }

    return await this.comentarioRepository.findByClienteId(clienteId);
  }

  async createComentario(comentarioData: CreateComentarioData): Promise<Comentario> {
    const validatedData = createComentarioSchema.parse(comentarioData);

    return await this.comentarioRepository.create(validatedData);
  }

  async updateComentario(id: number, comentarioData: UpdateComentarioData): Promise<Comentario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de comentario válido es requerido');
    }

    const validatedData = updateComentarioSchema.parse(comentarioData);

    const existingComentario = await this.comentarioRepository.findById(id);
    if (!existingComentario) {
      throw new Error('Comentario no encontrado');
    }

    const updatedComentario = await this.comentarioRepository.update(id, validatedData);
    if (!updatedComentario) {
      throw new Error('Error al actualizar comentario');
    }

    return updatedComentario;
  }

  async deleteComentario(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de comentario válido es requerido');
    }

    const comentario = await this.comentarioRepository.findById(id);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }

    await this.comentarioRepository.delete(id);
  }
}