import { CatalogoActividades, CreateCatalogoActividadesData, UpdateCatalogoActividadesData } from '@/domain/entities/CatalogoActividades';
import { PaginationParams } from '@/shared/types/api';

export interface CatalogoActividadesRepository {
  findAll(params?: PaginationParams): Promise<{ actividades: CatalogoActividades[]; total: number }>;
  findById(id: number): Promise<CatalogoActividades | null>;
  findByEntrenadorId(entrenadorId: number): Promise<CatalogoActividades[]>;
  findByClienteId(clienteId: number): Promise<CatalogoActividades[]>;
  findByEstado(estado: string): Promise<CatalogoActividades[]>;
  create(actividadData: CreateCatalogoActividadesData): Promise<CatalogoActividades>;
  update(id: number, actividadData: UpdateCatalogoActividadesData): Promise<CatalogoActividades | null>;
  delete(id: number): Promise<boolean>;
}