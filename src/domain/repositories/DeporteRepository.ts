import { Deporte, CreateDeporteData, UpdateDeporteData } from '@/domain/entities/Deporte';
import { PaginationParams } from '@/shared/types/api';

export interface DeporteRepository {
  findAll(params?: PaginationParams): Promise<{ deportes: Deporte[]; total: number }>;
  findById(id: number): Promise<Deporte | null>;
  findByNombre(nombre: string): Promise<Deporte | null>;
  create(deporteData: CreateDeporteData): Promise<Deporte>;
  update(id: number, deporteData: UpdateDeporteData): Promise<Deporte | null>;
  delete(id: number): Promise<boolean>;
}