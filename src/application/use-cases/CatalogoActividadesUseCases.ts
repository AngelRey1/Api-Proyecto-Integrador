import { CatalogoActividadesRepository } from '@/domain/repositories/CatalogoActividadesRepository';
import { CatalogoActividades, CreateCatalogoActividadesData, UpdateCatalogoActividadesData, EstadoActividad } from '@/domain/entities/CatalogoActividades';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createActividadSchema = z.object({
  id_entrenador: z.number().positive().optional(),
  id_cliente: z.number().positive().optional(),
  id_deporte: z.number().positive().optional(),
  id_catalogo: z.number().positive().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  estado: z.enum(['EN_CURSO', 'FINALIZADO', 'PENDIENTE']).optional(),
  notas: z.string().optional(),
});

const updateActividadSchema = z.object({
  id_entrenador: z.number().positive().optional(),
  id_cliente: z.number().positive().optional(),
  id_deporte: z.number().positive().optional(),
  id_catalogo: z.number().positive().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  estado: z.enum(['EN_CURSO', 'FINALIZADO', 'PENDIENTE']).optional(),
  notas: z.string().optional(),
});

export class CatalogoActividadesUseCases {
  constructor(private actividadRepository: CatalogoActividadesRepository) {}

  async getAllActividades(params?: PaginationParams) {
    return await this.actividadRepository.findAll(params);
  }

  async getActividadById(id: number): Promise<CatalogoActividades> {
    if (!id || isNaN(id)) {
      throw new Error('ID de actividad válido es requerido');
    }

    const actividad = await this.actividadRepository.findById(id);
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }

    return actividad;
  }

  async getActividadesByEntrenadorId(entrenadorId: number): Promise<CatalogoActividades[]> {
    if (!entrenadorId || isNaN(entrenadorId)) {
      throw new Error('ID de entrenador válido es requerido');
    }

    return await this.actividadRepository.findByEntrenadorId(entrenadorId);
  }

  async getActividadesByClienteId(clienteId: number): Promise<CatalogoActividades[]> {
    if (!clienteId || isNaN(clienteId)) {
      throw new Error('ID de cliente válido es requerido');
    }

    return await this.actividadRepository.findByClienteId(clienteId);
  }

  async createActividad(actividadData: CreateCatalogoActividadesData): Promise<CatalogoActividades> {
    const validatedData = createActividadSchema.parse(actividadData);

    if (!validatedData.estado) {
      validatedData.estado = 'PENDIENTE';
    }

    // Convertir fechas string a Date si existen
    const createData: any = { ...validatedData };
    if (validatedData.fecha_inicio) {
      createData.fecha_inicio = new Date(validatedData.fecha_inicio);
    }
    if (validatedData.fecha_fin) {
      createData.fecha_fin = new Date(validatedData.fecha_fin);
    }

    return await this.actividadRepository.create(createData);
  }

  async updateActividad(id: number, actividadData: UpdateCatalogoActividadesData): Promise<CatalogoActividades> {
    if (!id || isNaN(id)) {
      throw new Error('ID de actividad válido es requerido');
    }

    const validatedData = updateActividadSchema.parse(actividadData);

    const existingActividad = await this.actividadRepository.findById(id);
    if (!existingActividad) {
      throw new Error('Actividad no encontrada');
    }

    // Convertir fechas string a Date si existen
    const updateData: any = { ...validatedData };
    if (validatedData.fecha_inicio) {
      updateData.fecha_inicio = new Date(validatedData.fecha_inicio);
    }
    if (validatedData.fecha_fin) {
      updateData.fecha_fin = new Date(validatedData.fecha_fin);
    }

    const updatedActividad = await this.actividadRepository.update(id, updateData);
    if (!updatedActividad) {
      throw new Error('Error al actualizar actividad');
    }

    return updatedActividad;
  }

  async deleteActividad(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de actividad válido es requerido');
    }

    const actividad = await this.actividadRepository.findById(id);
    if (!actividad) {
      throw new Error('Actividad no encontrada');
    }

    await this.actividadRepository.delete(id);
  }
}