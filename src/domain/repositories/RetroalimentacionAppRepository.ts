import { RetroalimentacionApp, CreateRetroalimentacionAppData, UpdateRetroalimentacionAppData } from '@/domain/entities/RetroalimentacionApp';
import { PaginationParams } from '@/shared/types/api';

export interface RetroalimentacionAppRepository {
  findAll(params?: PaginationParams): Promise<{ retroalimentaciones: RetroalimentacionApp[]; total: number }>;
  findById(id: number): Promise<RetroalimentacionApp | null>;
  findByUsuarioId(usuarioId: number): Promise<RetroalimentacionApp[]>;
  findByTipo(tipo: string): Promise<RetroalimentacionApp[]>;
  create(retroalimentacionData: CreateRetroalimentacionAppData): Promise<RetroalimentacionApp>;
  update(id: number, retroalimentacionData: UpdateRetroalimentacionAppData): Promise<RetroalimentacionApp | null>;
  delete(id: number): Promise<boolean>;
}