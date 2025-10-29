import { HorarioRepository } from '@/domain/repositories/HorarioRepository';
import { Horario, CreateHorarioData, UpdateHorarioData, DiaSemana } from '@/domain/entities/Horario';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createHorarioSchema = z.object({
  id_entrenador: z.number().positive('ID de entrenador debe ser un número positivo'),
  dia: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'], { message: 'Día debe ser válido' }),
  hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio debe tener formato HH:MM'),
  hora_fin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin debe tener formato HH:MM'),
});

const updateHorarioSchema = z.object({
  dia: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'], { message: 'Día debe ser válido' }).optional(),
  hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio debe tener formato HH:MM').optional(),
  hora_fin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de fin debe tener formato HH:MM').optional(),
});

export class HorarioUseCases {
  constructor(private horarioRepository: HorarioRepository) {}

  async getAllHorarios(params?: PaginationParams) {
    return await this.horarioRepository.findAll(params);
  }

  async getHorarioById(id: number): Promise<Horario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de horario válido es requerido');
    }

    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }

    return horario;
  }

  async getHorariosByEntrenadorId(entrenadorId: number): Promise<Horario[]> {
    if (!entrenadorId || isNaN(entrenadorId)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    return await this.horarioRepository.findByEntrenadorId(entrenadorId);
  }

  async createHorario(horarioData: CreateHorarioData): Promise<Horario> {
    const validatedData = createHorarioSchema.parse(horarioData);

    // Validar que hora_fin sea mayor que hora_inicio
    const [horaInicioH, horaInicioM] = validatedData.hora_inicio.split(':').map(Number);
    const [horaFinH, horaFinM] = validatedData.hora_fin.split(':').map(Number);
    
    const inicioMinutos = horaInicioH * 60 + horaInicioM;
    const finMinutos = horaFinH * 60 + horaFinM;

    if (finMinutos <= inicioMinutos) {
      throw new Error('La hora de fin debe ser mayor que la hora de inicio');
    }

    return await this.horarioRepository.create(validatedData);
  }

  async updateHorario(id: number, horarioData: UpdateHorarioData): Promise<Horario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de horario válido es requerido');
    }

    const validatedData = updateHorarioSchema.parse(horarioData);

    const existingHorario = await this.horarioRepository.findById(id);
    if (!existingHorario) {
      throw new Error('Horario no encontrado');
    }

    // Validar horas si se proporcionan ambas
    if (validatedData.hora_inicio && validatedData.hora_fin) {
      const [horaInicioH, horaInicioM] = validatedData.hora_inicio.split(':').map(Number);
      const [horaFinH, horaFinM] = validatedData.hora_fin.split(':').map(Number);
      
      const inicioMinutos = horaInicioH * 60 + horaInicioM;
      const finMinutos = horaFinH * 60 + horaFinM;

      if (finMinutos <= inicioMinutos) {
        throw new Error('La hora de fin debe ser mayor que la hora de inicio');
      }
    }

    const updatedHorario = await this.horarioRepository.update(id, validatedData);
    if (!updatedHorario) {
      throw new Error('Error al actualizar horario');
    }

    return updatedHorario;
  }

  async deleteHorario(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de horario válido es requerido');
    }

    const horario = await this.horarioRepository.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }

    await this.horarioRepository.delete(id);
  }
}