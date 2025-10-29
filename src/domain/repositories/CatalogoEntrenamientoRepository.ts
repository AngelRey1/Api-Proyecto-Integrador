import { CatalogoEntrenamiento, CreateCatalogoEntrenamientoData, UpdateCatalogoEntrenamientoData } from '@/domain/entities/CatalogoEntrenamiento';
import { PaginationParams } from '@/shared/types/api';

export interface CatalogoEntrenamientoRepository {
  findAll(params?: PaginationParams): Promise<{ catalogos: CatalogoEntrenamiento[]; total: number }>;
  findById(id: number): Promise<CatalogoEntrenamiento | null>;
  findByNombre(nombre: string): Promise<CatalogoEntrenamiento | null>;
  create(catalogoData: CreateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento>;
  update(id: number, catalogoData: UpdateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento | null>;
  delete(id: number): Promise<boolean>;
}