import { CalendarioDisponibilidad, CreateCalendarioDisponibilidadData, UpdateCalendarioDisponibilidadData } from '@/domain/entities/CalendarioDisponibilidad';
import { PaginationParams } from '@/shared/types/api';

export interface CalendarioDisponibilidadRepository {
  findAll(params?: PaginationParams): Promise<{ disponibilidades: CalendarioDisponibilidad[]; total: number }>;
  findById(id: number): Promise<CalendarioDisponibilidad | null>;
  findByEntrenadorId(entrenadorId: number): Promise<CalendarioDisponibilidad[]>;
  findByFecha(fecha: Date): Promise<CalendarioDisponibilidad[]>;
  create(disponibilidadData: CreateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad>;
  update(id: number, disponibilidadData: UpdateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad | null>;
  delete(id: number): Promise<boolean>;
}