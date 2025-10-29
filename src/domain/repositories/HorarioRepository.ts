import { Horario, CreateHorarioData, UpdateHorarioData } from '@/domain/entities/Horario';
import { PaginationParams } from '@/shared/types/api';

export interface HorarioRepository {
  findAll(params?: PaginationParams): Promise<{ horarios: Horario[]; total: number }>;
  findById(id: number): Promise<Horario | null>;
  findByEntrenadorId(entrenadorId: number): Promise<Horario[]>;
  create(horarioData: CreateHorarioData): Promise<Horario>;
  update(id: number, horarioData: UpdateHorarioData): Promise<Horario | null>;
  delete(id: number): Promise<boolean>;
}