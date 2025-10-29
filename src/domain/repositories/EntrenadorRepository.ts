import { Entrenador, CreateEntrenadorData, UpdateEntrenadorData } from '@/domain/entities/Entrenador';
import { PaginationParams } from '@/shared/types/api';

export interface EntrenadorRepository {
  findAll(params?: PaginationParams): Promise<{ entrenadores: Entrenador[]; total: number }>;
  findById(id: number): Promise<Entrenador | null>;
  findByUsuarioId(usuarioId: number): Promise<Entrenador | null>;
  create(entrenadorData: CreateEntrenadorData): Promise<Entrenador>;
  update(id: number, entrenadorData: UpdateEntrenadorData): Promise<Entrenador | null>;
  delete(id: number): Promise<boolean>;
}