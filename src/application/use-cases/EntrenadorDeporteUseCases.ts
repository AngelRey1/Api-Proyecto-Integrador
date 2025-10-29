import { EntrenadorDeporteRepository } from '@/domain/repositories/EntrenadorDeporteRepository';
import { EntrenadorDeporte, CreateEntrenadorDeporteData, UpdateEntrenadorDeporteData } from '@/domain/entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';

export class EntrenadorDeporteUseCases {
  constructor(private entrenadorDeporteRepository: EntrenadorDeporteRepository) {}

  async getAllEntrenadorDeportes(params: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }> {
    return await this.entrenadorDeporteRepository.findAll(params);
  }

  async getEntrenadorDeporteById(id: number): Promise<EntrenadorDeporte> {
    const entrenadorDeporte = await this.entrenadorDeporteRepository.findById(id);
    if (!entrenadorDeporte) {
      throw new Error('Relación entrenador-deporte no encontrada');
    }
    return entrenadorDeporte;
  }

  async getDeportesByEntrenadorId(entrenadorId: number): Promise<EntrenadorDeporte[]> {
    return await this.entrenadorDeporteRepository.findByEntrenadorId(entrenadorId);
  }

  async getEntrenadoresByDeporteId(deporteId: number): Promise<EntrenadorDeporte[]> {
    return await this.entrenadorDeporteRepository.findByDeporteId(deporteId);
  }

  async createEntrenadorDeporte(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    // Validaciones básicas
    if (!data.id_entrenador || !data.id_deporte) {
      throw new Error('ID de entrenador e ID de deporte son requeridos');
    }

    if (!['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'].includes(data.nivel_experiencia)) {
      throw new Error('Nivel de experiencia debe ser PRINCIPIANTE, INTERMEDIO o AVANZADO');
    }

    return await this.entrenadorDeporteRepository.create(data);
  }

  async updateEntrenadorDeporte(id: number, data: UpdateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    // Verificar que existe
    await this.getEntrenadorDeporteById(id);

    // Validar nivel de experiencia si se proporciona
    if (data.nivel_experiencia && !['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'].includes(data.nivel_experiencia)) {
      throw new Error('Nivel de experiencia debe ser PRINCIPIANTE, INTERMEDIO o AVANZADO');
    }

    return await this.entrenadorDeporteRepository.update(id, data);
  }

  async deleteEntrenadorDeporte(id: number): Promise<void> {
    // Verificar que existe
    await this.getEntrenadorDeporteById(id);
    
    await this.entrenadorDeporteRepository.delete(id);
  }
}