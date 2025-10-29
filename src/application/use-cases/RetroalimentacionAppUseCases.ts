import { RetroalimentacionAppRepository } from '@/domain/repositories/RetroalimentacionAppRepository';
import { RetroalimentacionApp, CreateRetroalimentacionAppData, UpdateRetroalimentacionAppData, TipoFeedback } from '@/domain/entities/RetroalimentacionApp';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createRetroalimentacionSchema = z.object({
  id_usuario: z.number().positive('ID de usuario debe ser un número positivo'),
  mensaje: z.string().min(1, 'Mensaje es requerido'),
  tipo: z.enum(['SUGERENCIA', 'REPORTE_ERROR'], { message: 'Tipo debe ser SUGERENCIA o REPORTE_ERROR' }),
});

const updateRetroalimentacionSchema = z.object({
  mensaje: z.string().min(1, 'Mensaje es requerido').optional(),
  tipo: z.enum(['SUGERENCIA', 'REPORTE_ERROR'], { message: 'Tipo debe ser SUGERENCIA o REPORTE_ERROR' }).optional(),
});

export class RetroalimentacionAppUseCases {
  constructor(private retroalimentacionRepository: RetroalimentacionAppRepository) {}

  async getAllRetroalimentaciones(params?: PaginationParams) {
    return await this.retroalimentacionRepository.findAll(params);
  }

  async getRetroalimentacionById(id: number): Promise<RetroalimentacionApp> {
    if (!id || isNaN(id)) {
      throw new Error('ID de retroalimentación válido es requerido');
    }

    const retroalimentacion = await this.retroalimentacionRepository.findById(id);
    if (!retroalimentacion) {
      throw new Error('Retroalimentación no encontrada');
    }

    return retroalimentacion;
  }

  async getRetroalimentacionesByUsuarioId(usuarioId: number): Promise<RetroalimentacionApp[]> {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuario válido es requerido');
    }

    return await this.retroalimentacionRepository.findByUsuarioId(usuarioId);
  }

  async getRetroalimentacionesByTipo(tipo: TipoFeedback): Promise<RetroalimentacionApp[]> {
    if (!tipo) {
      throw new Error('Tipo de retroalimentación es requerido');
    }

    return await this.retroalimentacionRepository.findByTipo(tipo);
  }

  async createRetroalimentacion(retroalimentacionData: CreateRetroalimentacionAppData): Promise<RetroalimentacionApp> {
    const validatedData = createRetroalimentacionSchema.parse(retroalimentacionData);

    return await this.retroalimentacionRepository.create(validatedData);
  }

  async updateRetroalimentacion(id: number, retroalimentacionData: UpdateRetroalimentacionAppData): Promise<RetroalimentacionApp> {
    if (!id || isNaN(id)) {
      throw new Error('ID de retroalimentación válido es requerido');
    }

    const validatedData = updateRetroalimentacionSchema.parse(retroalimentacionData);

    const existingRetroalimentacion = await this.retroalimentacionRepository.findById(id);
    if (!existingRetroalimentacion) {
      throw new Error('Retroalimentación no encontrada');
    }

    const updatedRetroalimentacion = await this.retroalimentacionRepository.update(id, validatedData);
    if (!updatedRetroalimentacion) {
      throw new Error('Error al actualizar retroalimentación');
    }

    return updatedRetroalimentacion;
  }

  async deleteRetroalimentacion(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de retroalimentación válido es requerido');
    }

    const retroalimentacion = await this.retroalimentacionRepository.findById(id);
    if (!retroalimentacion) {
      throw new Error('Retroalimentación no encontrada');
    }

    await this.retroalimentacionRepository.delete(id);
  }
}