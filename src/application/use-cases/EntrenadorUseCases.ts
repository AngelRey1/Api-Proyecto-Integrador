import { EntrenadorRepository } from '@/domain/repositories/EntrenadorRepository';
import { Entrenador, CreateEntrenadorData, UpdateEntrenadorData } from '@/domain/entities/Entrenador';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createEntrenadorSchema = z.object({
  id_usuario: z.number().positive('ID de usuario debe ser un número positivo'),
  especialidad: z.string().min(2, 'Especialidad debe tener al menos 2 caracteres').optional(),
  experiencia: z.number().min(0, 'Experiencia debe ser un número positivo').optional(),
  descripcion: z.string().optional(),
  foto_url: z.string().url('URL de foto debe ser válida').optional(),
});

const updateEntrenadorSchema = z.object({
  especialidad: z.string().min(2, 'Especialidad debe tener al menos 2 caracteres').optional(),
  experiencia: z.number().min(0, 'Experiencia debe ser un número positivo').optional(),
  descripcion: z.string().optional(),
  foto_url: z.string().url('URL de foto debe ser válida').optional(),
});

export class EntrenadorUseCases {
  constructor(private entrenadorRepository: EntrenadorRepository) {}

  async getAllEntrenadores(params?: PaginationParams) {
    return await this.entrenadorRepository.findAll(params);
  }

  async getEntrenadorById(id: number): Promise<Entrenador> {
    if (!id || isNaN(id)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    const entrenador = await this.entrenadorRepository.findById(id);
    if (!entrenador) {
      throw new Error('Entrenador no encontrado');
    }

    return entrenador;
  }

  async getEntrenadorByUsuarioId(usuarioId: number): Promise<Entrenador> {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuario válido es requerido');
    }

    const entrenador = await this.entrenadorRepository.findByUsuarioId(usuarioId);
    if (!entrenador) {
      throw new Error('Entrenador no encontrado para este usuario');
    }

    return entrenador;
  }

  async createEntrenador(entrenadorData: CreateEntrenadorData): Promise<Entrenador> {
    const validatedData = createEntrenadorSchema.parse(entrenadorData);

    // Verificar que no exista ya un entrenador para este usuario
    const existingEntrenador = await this.entrenadorRepository.findByUsuarioId(validatedData.id_usuario);
    if (existingEntrenador) {
      throw new Error('Ya existe un perfil de entrenador para este usuario');
    }

    return await this.entrenadorRepository.create(validatedData);
  }

  async updateEntrenador(id: number, entrenadorData: UpdateEntrenadorData): Promise<Entrenador> {
    if (!id || isNaN(id)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    const validatedData = updateEntrenadorSchema.parse(entrenadorData);

    const existingEntrenador = await this.entrenadorRepository.findById(id);
    if (!existingEntrenador) {
      throw new Error('Entrenador no encontrado');
    }

    const updatedEntrenador = await this.entrenadorRepository.update(id, validatedData);
    if (!updatedEntrenador) {
      throw new Error('Error al actualizar entrenador');
    }

    return updatedEntrenador;
  }

  async deleteEntrenador(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    const entrenador = await this.entrenadorRepository.findById(id);
    if (!entrenador) {
      throw new Error('Entrenador no encontrado');
    }

    await this.entrenadorRepository.delete(id);
  }
}