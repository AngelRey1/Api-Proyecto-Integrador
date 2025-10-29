import { SesionRepository } from '@/domain/repositories/SesionRepository';
import { Sesion, CreateSesionData, UpdateSesionData } from '@/domain/entities/Sesion';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createSesionSchema = z.object({
  id_horario: z.number().positive('ID de horario debe ser un número positivo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
  cupos_disponibles: z.number().min(1, 'Cupos disponibles debe ser al menos 1'),
});

const updateSesionSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD').optional(),
  cupos_disponibles: z.number().min(0, 'Cupos disponibles debe ser un número positivo').optional(),
});

export class SesionUseCases {
  constructor(private sesionRepository: SesionRepository) {}

  async getAllSesiones(params?: PaginationParams) {
    return await this.sesionRepository.findAll(params);
  }

  async getSesionById(id: number): Promise<Sesion> {
    if (!id || isNaN(id)) {
      throw new Error('ID de sesión válido es requerido');
    }

    const sesion = await this.sesionRepository.findById(id);
    if (!sesion) {
      throw new Error('Sesión no encontrada');
    }

    return sesion;
  }

  async getSesionesByHorarioId(horarioId: number): Promise<Sesion[]> {
    if (!horarioId || isNaN(horarioId)) {
      throw new Error('ID de horario válido es requerido');
    }

    return await this.sesionRepository.findByHorarioId(horarioId);
  }

  async getSesionesByFecha(fecha: string): Promise<Sesion[]> {
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new Error('Fecha válida es requerida (formato YYYY-MM-DD)');
    }

    return await this.sesionRepository.findByFecha(new Date(fecha));
  }

  async createSesion(sesionData: CreateSesionData): Promise<Sesion> {
    const validatedData = createSesionSchema.parse(sesionData);

    // Convertir fecha string a Date
    const fechaDate = new Date(validatedData.fecha);
    
    return await this.sesionRepository.create({
      ...validatedData,
      fecha: fechaDate,
    });
  }

  async updateSesion(id: number, sesionData: UpdateSesionData): Promise<Sesion> {
    if (!id || isNaN(id)) {
      throw new Error('ID de sesión válido es requerido');
    }

    const validatedData = updateSesionSchema.parse(sesionData);

    const existingSesion = await this.sesionRepository.findById(id);
    if (!existingSesion) {
      throw new Error('Sesión no encontrada');
    }

    // Convertir fecha string a Date si se proporciona
    const updateData: any = { ...validatedData };
    if (validatedData.fecha) {
      updateData.fecha = new Date(validatedData.fecha);
    }

    const updatedSesion = await this.sesionRepository.update(id, updateData);
    if (!updatedSesion) {
      throw new Error('Error al actualizar sesión');
    }

    return updatedSesion;
  }

  async deleteSesion(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de sesión válido es requerido');
    }

    const sesion = await this.sesionRepository.findById(id);
    if (!sesion) {
      throw new Error('Sesión no encontrada');
    }

    await this.sesionRepository.delete(id);
  }
}