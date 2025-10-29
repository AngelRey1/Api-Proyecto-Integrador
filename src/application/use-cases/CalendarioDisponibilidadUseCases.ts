import { CalendarioDisponibilidadRepository } from '@/domain/repositories/CalendarioDisponibilidadRepository';
import { CalendarioDisponibilidad, CreateCalendarioDisponibilidadData, UpdateCalendarioDisponibilidadData } from '@/domain/entities/CalendarioDisponibilidad';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createDisponibilidadSchema = z.object({
  id_entrenador: z.number().positive('ID de entrenador debe ser un número positivo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
  hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio debe tener formato HH:MM'),
  hora_fin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin debe tener formato HH:MM'),
  disponible: z.boolean().optional(),
});

const updateDisponibilidadSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD').optional(),
  hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio debe tener formato HH:MM').optional(),
  hora_fin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin debe tener formato HH:MM').optional(),
  disponible: z.boolean().optional(),
});

export class CalendarioDisponibilidadUseCases {
  constructor(private disponibilidadRepository: CalendarioDisponibilidadRepository) {}

  async getAllDisponibilidades(params?: PaginationParams) {
    return await this.disponibilidadRepository.findAll(params);
  }

  async getDisponibilidadById(id: number): Promise<CalendarioDisponibilidad> {
    if (!id || isNaN(id)) {
      throw new Error('ID de disponibilidad válido es requerido');
    }

    const disponibilidad = await this.disponibilidadRepository.findById(id);
    if (!disponibilidad) {
      throw new Error('Disponibilidad no encontrada');
    }

    return disponibilidad;
  }

  async getDisponibilidadesByEntrenadorId(entrenadorId: number): Promise<CalendarioDisponibilidad[]> {
    if (!entrenadorId || isNaN(entrenadorId)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    return await this.disponibilidadRepository.findByEntrenadorId(entrenadorId);
  }

  async getDisponibilidadesByFecha(fecha: string): Promise<CalendarioDisponibilidad[]> {
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new Error('Fecha válida es requerida (formato YYYY-MM-DD)');
    }

    return await this.disponibilidadRepository.findByFecha(new Date(fecha));
  }

  async createDisponibilidad(disponibilidadData: CreateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad> {
    const validatedData = createDisponibilidadSchema.parse(disponibilidadData);

    if (validatedData.disponible === undefined) {
      validatedData.disponible = true;
    }

    const fechaDate = new Date(validatedData.fecha);
    
    return await this.disponibilidadRepository.create({
      ...validatedData,
      fecha: fechaDate,
    });
  }

  async updateDisponibilidad(id: number, disponibilidadData: UpdateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad> {
    if (!id || isNaN(id)) {
      throw new Error('ID de disponibilidad válido es requerido');
    }

    const validatedData = updateDisponibilidadSchema.parse(disponibilidadData);

    const existingDisponibilidad = await this.disponibilidadRepository.findById(id);
    if (!existingDisponibilidad) {
      throw new Error('Disponibilidad no encontrada');
    }

    const updateData: any = { ...validatedData };
    if (validatedData.fecha) {
      updateData.fecha = new Date(validatedData.fecha);
    }

    const updatedDisponibilidad = await this.disponibilidadRepository.update(id, updateData);
    if (!updatedDisponibilidad) {
      throw new Error('Error al actualizar disponibilidad');
    }

    return updatedDisponibilidad;
  }

  async deleteDisponibilidad(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de disponibilidad válido es requerido');
    }

    const disponibilidad = await this.disponibilidadRepository.findById(id);
    if (!disponibilidad) {
      throw new Error('Disponibilidad no encontrada');
    }

    await this.disponibilidadRepository.delete(id);
  }
}