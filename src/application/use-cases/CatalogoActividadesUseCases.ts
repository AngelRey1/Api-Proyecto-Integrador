import { CatalogoActividadesRepository } from '@/domain/repositories/CatalogoActividadesRepository';
import { CatalogoActividades, CreateCatalogoActividadesData, UpdateCatalogoActividadesData } from '@/domain/entities/CatalogoActividades';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoActividadesUseCases {
  constructor(private actividadesRepository: CatalogoActividadesRepository) {}

  async getAllActividades(params?: PaginationParams): Promise<{ actividades: CatalogoActividades[]; total: number }> {
    return await this.actividadesRepository.findAll(params);
  }

  async getActividadById(id: number): Promise<CatalogoActividades | null> {
    return await this.actividadesRepository.findById(id);
  }

  async getActividadesByEntrenador(entrenadorId: number): Promise<CatalogoActividades[]> {
    return await this.actividadesRepository.findByEntrenadorId(entrenadorId);
  }

  async getActividadesByCliente(clienteId: number): Promise<CatalogoActividades[]> {
    return await this.actividadesRepository.findByClienteId(clienteId);
  }

  async getActividadesByEstado(estado: string): Promise<CatalogoActividades[]> {
    return await this.actividadesRepository.findByEstado(estado);
  }

  async createActividad(data: CreateCatalogoActividadesData): Promise<CatalogoActividades> {
    return await this.actividadesRepository.create(data);
  }

  async updateActividad(id: number, data: UpdateCatalogoActividadesData): Promise<CatalogoActividades | null> {
    return await this.actividadesRepository.update(id, data);
  }

  async deleteActividad(id: number): Promise<boolean> {
    return await this.actividadesRepository.delete(id);
  }
}