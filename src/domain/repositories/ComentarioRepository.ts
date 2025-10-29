import { Comentario, CreateComentarioData, UpdateComentarioData } from '@/domain/entities/Comentario';
import { PaginationParams } from '@/shared/types/api';

export interface ComentarioRepository {
  findAll(params?: PaginationParams): Promise<{ comentarios: Comentario[]; total: number }>;
  findById(id: number): Promise<Comentario | null>;
  findByReseñaId(reseñaId: number): Promise<Comentario[]>;
  findByClienteId(clienteId: number): Promise<Comentario[]>;
  create(comentarioData: CreateComentarioData): Promise<Comentario>;
  update(id: number, comentarioData: UpdateComentarioData): Promise<Comentario | null>;
  delete(id: number): Promise<boolean>;
}