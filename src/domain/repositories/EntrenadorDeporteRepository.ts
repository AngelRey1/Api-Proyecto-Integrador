import { EntrenadorDeporte, CreateEntrenadorDeporteData, UpdateEntrenadorDeporteData } from '../entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';

export interface EntrenadorDeporteRepository {
  findAll(params?: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }>;
  findByEntrenadorId(entrenadorId: number): Promise<EntrenadorDeporte[]>;
  findByDeporteId(deporteId: number): Promise<EntrenadorDeporte[]>;
  create(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte>;
  delete(entrenadorId: number, deporteId: number): Promise<boolean>;
}