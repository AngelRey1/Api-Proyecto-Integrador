import { EntrenadorDeporte, CreateEntrenadorDeporteData, UpdateEntrenadorDeporteData } from '../entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';

export interface EntrenadorDeporteRepository {
  findAll(params: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }>;
  findById(id: number): Promise<EntrenadorDeporte | null>;
  findByEntrenadorId(entrenadorId: number): Promise<EntrenadorDeporte[]>;
  findByDeporteId(deporteId: number): Promise<EntrenadorDeporte[]>;
  create(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte>;
  update(id: number, data: UpdateEntrenadorDeporteData): Promise<EntrenadorDeporte>;
  delete(id: number): Promise<void>;
}