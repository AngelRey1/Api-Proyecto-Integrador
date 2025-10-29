import { Notificacion, CreateNotificacionData, UpdateNotificacionData } from '@/domain/entities/Notificacion';
import { PaginationParams } from '@/shared/types/api';

export interface NotificacionRepository {
  findAll(params?: PaginationParams): Promise<{ notificaciones: Notificacion[]; total: number }>;
  findById(id: number): Promise<Notificacion | null>;
  findByUsuarioId(usuarioId: number): Promise<Notificacion[]>;
  findNoLeidas(usuarioId: number): Promise<Notificacion[]>;
  create(notificacionData: CreateNotificacionData): Promise<Notificacion>;
  update(id: number, notificacionData: UpdateNotificacionData): Promise<Notificacion | null>;
  delete(id: number): Promise<boolean>;
}