import { Usuario, CreateUsuarioData, UpdateUsuarioData } from '@/domain/entities/User';
import { PaginationParams } from '@/shared/types/api';

export interface UserRepository {
  findAll(params?: PaginationParams): Promise<{ users: Usuario[]; total: number }>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(userData: CreateUsuarioData): Promise<Usuario>;
  update(id: number, userData: UpdateUsuarioData): Promise<Usuario | null>;
  delete(id: number): Promise<boolean>;
}