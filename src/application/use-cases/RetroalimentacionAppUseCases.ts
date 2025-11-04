import { RetroalimentacionAppRepository } from '@/domain/repositories/RetroalimentacionAppRepository';
import { RetroalimentacionApp, CreateRetroalimentacionAppData, UpdateRetroalimentacionAppData } from '@/domain/entities/RetroalimentacionApp';
import { PaginationParams } from '@/shared/types/api';

export class RetroalimentacionAppUseCases {
  constructor(private retroalimentacionRepository: RetroalimentacionAppRepository) {}

  async getAllRetroalimentaciones(params?: PaginationParams): Promise<{ retroalimentaciones: RetroalimentacionApp[]; total: number }> {
    return await this.retroalimentacionRepository.findAll(params);
  }

  async getRetroalimentacionById(id: number): Promise<RetroalimentacionApp | null> {
    return await this.retroalimentacionRepository.findById(id);
  }

  async getRetroalimentacionesByUsuario(usuarioId: number): Promise<RetroalimentacionApp[]> {
    return await this.retroalimentacionRepository.findByUsuarioId(usuarioId);
  }

  async getRetroalimentacionesByTipo(tipo: string): Promise<RetroalimentacionApp[]> {
    return await this.retroalimentacionRepository.findByTipo(tipo);
  }

  async createRetroalimentacion(data: CreateRetroalimentacionAppData): Promise<RetroalimentacionApp> {
    return await this.retroalimentacionRepository.create(data);
  }

  async updateRetroalimentacion(id: number, data: UpdateRetroalimentacionAppData): Promise<RetroalimentacionApp | null> {
    return await this.retroalimentacionRepository.update(id, data);
  }

  async deleteRetroalimentacion(id: number): Promise<boolean> {
    return await this.retroalimentacionRepository.delete(id);
  }
}