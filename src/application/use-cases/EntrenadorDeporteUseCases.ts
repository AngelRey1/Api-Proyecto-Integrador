import { EntrenadorDeporteRepository } from '@/domain/repositories/EntrenadorDeporteRepository';
import { EntrenadorDeporte, CreateEntrenadorDeporteData } from '@/domain/entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';

export class EntrenadorDeporteUseCases {
  constructor(private entrenadorDeporteRepository: EntrenadorDeporteRepository) {}

  async getAllEntrenadorDeportes(params?: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }> {
    return await this.entrenadorDeporteRepository.findAll(params);
  }

  async getDeportesByEntrenador(entrenadorId: number): Promise<EntrenadorDeporte[]> {
    return await this.entrenadorDeporteRepository.findByEntrenadorId(entrenadorId);
  }

  async getEntrenadoresByDeporte(deporteId: number): Promise<EntrenadorDeporte[]> {
    return await this.entrenadorDeporteRepository.findByDeporteId(deporteId);
  }

  async assignDeporteToEntrenador(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    return await this.entrenadorDeporteRepository.create(data);
  }

  async removeDeporteFromEntrenador(entrenadorId: number, deporteId: number): Promise<boolean> {
    return await this.entrenadorDeporteRepository.delete(entrenadorId, deporteId);
  }
}