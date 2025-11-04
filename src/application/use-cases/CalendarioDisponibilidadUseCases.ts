import { CalendarioDisponibilidadRepository } from '@/domain/repositories/CalendarioDisponibilidadRepository';
import { CalendarioDisponibilidad, CreateCalendarioDisponibilidadData, UpdateCalendarioDisponibilidadData } from '@/domain/entities/CalendarioDisponibilidad';
import { PaginationParams } from '@/shared/types/api';

export class CalendarioDisponibilidadUseCases {
  constructor(private calendarioRepository: CalendarioDisponibilidadRepository) {}

  async getAllDisponibilidades(params?: PaginationParams): Promise<{ disponibilidades: CalendarioDisponibilidad[]; total: number }> {
    return await this.calendarioRepository.findAll(params);
  }

  async getDisponibilidadById(id: number): Promise<CalendarioDisponibilidad | null> {
    return await this.calendarioRepository.findById(id);
  }

  async getDisponibilidadesByEntrenador(entrenadorId: number): Promise<CalendarioDisponibilidad[]> {
    return await this.calendarioRepository.findByEntrenadorId(entrenadorId);
  }

  async getDisponibilidadesByFecha(fecha: Date): Promise<CalendarioDisponibilidad[]> {
    return await this.calendarioRepository.findByFecha(fecha);
  }

  async createDisponibilidad(data: CreateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad> {
    return await this.calendarioRepository.create(data);
  }

  async updateDisponibilidad(id: number, data: UpdateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad | null> {
    return await this.calendarioRepository.update(id, data);
  }

  async deleteDisponibilidad(id: number): Promise<boolean> {
    return await this.calendarioRepository.delete(id);
  }
}