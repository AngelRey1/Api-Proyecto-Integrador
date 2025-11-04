import { CatalogoEntrenamientoRepository } from '@/domain/repositories/CatalogoEntrenamientoRepository';
import { CatalogoEntrenamiento, CreateCatalogoEntrenamientoData, UpdateCatalogoEntrenamientoData } from '@/domain/entities/CatalogoEntrenamiento';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoEntrenamientoUseCases {
  constructor(private catalogoRepository: CatalogoEntrenamientoRepository) {}

  async getAllCatalogos(params?: PaginationParams): Promise<{ catalogos: CatalogoEntrenamiento[]; total: number }> {
    return await this.catalogoRepository.findAll(params);
  }

  async getCatalogoById(id: number): Promise<CatalogoEntrenamiento | null> {
    return await this.catalogoRepository.findById(id);
  }

  async getCatalogosByNivel(nivel: string): Promise<CatalogoEntrenamiento[]> {
    return await this.catalogoRepository.findByNivel(nivel);
  }

  async createCatalogo(data: CreateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento> {
    return await this.catalogoRepository.create(data);
  }

  async updateCatalogo(id: number, data: UpdateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento | null> {
    return await this.catalogoRepository.update(id, data);
  }

  async deleteCatalogo(id: number): Promise<boolean> {
    return await this.catalogoRepository.delete(id);
  }
}