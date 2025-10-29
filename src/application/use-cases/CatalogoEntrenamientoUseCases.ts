import { CatalogoEntrenamientoRepository } from '@/domain/repositories/CatalogoEntrenamientoRepository';
import { CatalogoEntrenamiento, CreateCatalogoEntrenamientoData, UpdateCatalogoEntrenamientoData, NivelCatalogo } from '@/domain/entities/CatalogoEntrenamiento';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createCatalogoSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  nivel: z.enum(['BASICO', 'INTERMEDIO', 'AVANZADO'], { message: 'Nivel debe ser BASICO, INTERMEDIO o AVANZADO' }),
});

const updateCatalogoSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  descripcion: z.string().optional(),
  nivel: z.enum(['BASICO', 'INTERMEDIO', 'AVANZADO'], { message: 'Nivel debe ser BASICO, INTERMEDIO o AVANZADO' }).optional(),
});

export class CatalogoEntrenamientoUseCases {
  constructor(private catalogoRepository: CatalogoEntrenamientoRepository) {}

  async getAllCatalogos(params?: PaginationParams) {
    return await this.catalogoRepository.findAll(params);
  }

  async getCatalogoById(id: number): Promise<CatalogoEntrenamiento> {
    if (!id || isNaN(id)) {
      throw new Error('ID de catálogo válido es requerido');
    }

    const catalogo = await this.catalogoRepository.findById(id);
    if (!catalogo) {
      throw new Error('Catálogo no encontrado');
    }

    return catalogo;
  }

  async createCatalogo(catalogoData: CreateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento> {
    const validatedData = createCatalogoSchema.parse(catalogoData);

    const existingCatalogo = await this.catalogoRepository.findByNombre(validatedData.nombre);
    if (existingCatalogo) {
      throw new Error('Ya existe un catálogo con este nombre');
    }

    return await this.catalogoRepository.create(validatedData);
  }

  async updateCatalogo(id: number, catalogoData: UpdateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento> {
    if (!id || isNaN(id)) {
      throw new Error('ID de catálogo válido es requerido');
    }

    const validatedData = updateCatalogoSchema.parse(catalogoData);

    const existingCatalogo = await this.catalogoRepository.findById(id);
    if (!existingCatalogo) {
      throw new Error('Catálogo no encontrado');
    }

    if (validatedData.nombre && validatedData.nombre !== existingCatalogo.nombre) {
      const catalogoWithName = await this.catalogoRepository.findByNombre(validatedData.nombre);
      if (catalogoWithName) {
        throw new Error('Ya existe un catálogo con este nombre');
      }
    }

    const updatedCatalogo = await this.catalogoRepository.update(id, validatedData);
    if (!updatedCatalogo) {
      throw new Error('Error al actualizar catálogo');
    }

    return updatedCatalogo;
  }

  async deleteCatalogo(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de catálogo válido es requerido');
    }

    const catalogo = await this.catalogoRepository.findById(id);
    if (!catalogo) {
      throw new Error('Catálogo no encontrado');
    }

    await this.catalogoRepository.delete(id);
  }
}