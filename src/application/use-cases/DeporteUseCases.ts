import { DeporteRepository } from '@/domain/repositories/DeporteRepository';
import { Deporte, CreateDeporteData, UpdateDeporteData, NivelDeporte } from '@/domain/entities/Deporte';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createDeporteSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  nivel: z.enum(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'], { message: 'Nivel debe ser PRINCIPIANTE, INTERMEDIO o AVANZADO' }),
});

const updateDeporteSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  descripcion: z.string().optional(),
  nivel: z.enum(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'], { message: 'Nivel debe ser PRINCIPIANTE, INTERMEDIO o AVANZADO' }).optional(),
});

export class DeporteUseCases {
  constructor(private deporteRepository: DeporteRepository) {}

  async getAllDeportes(params?: PaginationParams) {
    return await this.deporteRepository.findAll(params);
  }

  async getDeporteById(id: number): Promise<Deporte> {
    if (!id || isNaN(id)) {
      throw new Error('ID de deporte válido es requerido');
    }

    const deporte = await this.deporteRepository.findById(id);
    if (!deporte) {
      throw new Error('Deporte no encontrado');
    }

    return deporte;
  }

  async createDeporte(deporteData: CreateDeporteData): Promise<Deporte> {
    const validatedData = createDeporteSchema.parse(deporteData);

    // Verificar que no exista ya un deporte con el mismo nombre
    const existingDeporte = await this.deporteRepository.findByNombre(validatedData.nombre);
    if (existingDeporte) {
      throw new Error('Ya existe un deporte con este nombre');
    }

    return await this.deporteRepository.create(validatedData);
  }

  async updateDeporte(id: number, deporteData: UpdateDeporteData): Promise<Deporte> {
    if (!id || isNaN(id)) {
      throw new Error('ID de deporte válido es requerido');
    }

    const validatedData = updateDeporteSchema.parse(deporteData);

    const existingDeporte = await this.deporteRepository.findById(id);
    if (!existingDeporte) {
      throw new Error('Deporte no encontrado');
    }

    // Verificar nombre único si se está actualizando
    if (validatedData.nombre && validatedData.nombre !== existingDeporte.nombre) {
      const deporteWithName = await this.deporteRepository.findByNombre(validatedData.nombre);
      if (deporteWithName) {
        throw new Error('Ya existe un deporte con este nombre');
      }
    }

    const updatedDeporte = await this.deporteRepository.update(id, validatedData);
    if (!updatedDeporte) {
      throw new Error('Error al actualizar deporte');
    }

    return updatedDeporte;
  }

  async deleteDeporte(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de deporte válido es requerido');
    }

    const deporte = await this.deporteRepository.findById(id);
    if (!deporte) {
      throw new Error('Deporte no encontrado');
    }

    await this.deporteRepository.delete(id);
  }
}