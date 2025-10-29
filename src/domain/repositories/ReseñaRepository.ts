import { Reseña, CreateReseñaData, UpdateReseñaData } from '@/domain/entities/Reseña';
import { PaginationParams } from '@/shared/types/api';

export interface ReseñaRepository {
  findAll(params?: PaginationParams): Promise<{ reseñas: Reseña[]; total: number }>;
  findById(id: number): Promise<Reseña | null>;
  findByEntrenadorId(entrenadorId: number): Promise<Reseña[]>;
  findByClienteId(clienteId: number): Promise<Reseña[]>;
  create(reseñaData: CreateReseñaData): Promise<Reseña>;
  update(id: number, reseñaData: UpdateReseñaData): Promise<Reseña | null>;
  delete(id: number): Promise<boolean>;
}