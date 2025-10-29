import { Sesion, CreateSesionData, UpdateSesionData } from '@/domain/entities/Sesion';
import { PaginationParams } from '@/shared/types/api';

export interface SesionRepository {
  findAll(params?: PaginationParams): Promise<{ sesiones: Sesion[]; total: number }>;
  findById(id: number): Promise<Sesion | null>;
  findByHorarioId(horarioId: number): Promise<Sesion[]>;
  findByFecha(fecha: Date): Promise<Sesion[]>;
  create(sesionData: CreateSesionData): Promise<Sesion>;
  update(id: number, sesionData: UpdateSesionData): Promise<Sesion | null>;
  delete(id: number): Promise<boolean>;
}