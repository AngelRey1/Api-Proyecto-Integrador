import { NotificacionRepository } from '@/domain/repositories/NotificacionRepository';
import { Notificacion, CreateNotificacionData, UpdateNotificacionData, TipoNotificacion } from '@/domain/entities/Notificacion';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createNotificacionSchema = z.object({
  id_usuario: z.number().positive('ID de usuario debe ser un número positivo'),
  mensaje: z.string().min(1, 'Mensaje es requerido'),
  tipo: z.enum(['RESERVA', 'PAGO', 'GENERAL'], { message: 'Tipo debe ser RESERVA, PAGO o GENERAL' }),
  leido: z.boolean().optional(),
});

const updateNotificacionSchema = z.object({
  mensaje: z.string().min(1, 'Mensaje es requerido').optional(),
  tipo: z.enum(['RESERVA', 'PAGO', 'GENERAL'], { message: 'Tipo debe ser RESERVA, PAGO o GENERAL' }).optional(),
  leido: z.boolean().optional(),
});

export class NotificacionUseCases {
  constructor(private notificacionRepository: NotificacionRepository) {}

  async getAllNotificaciones(params?: PaginationParams) {
    return await this.notificacionRepository.findAll(params);
  }

  async getNotificacionById(id: number): Promise<Notificacion> {
    if (!id || isNaN(id)) {
      throw new Error('ID de notificación válido es requerido');
    }

    const notificacion = await this.notificacionRepository.findById(id);
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }

    return notificacion;
  }

  async getNotificacionesByUsuarioId(usuarioId: number): Promise<Notificacion[]> {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuario válido es requerido');
    }

    return await this.notificacionRepository.findByUsuarioId(usuarioId);
  }

  async getNotificacionesNoLeidas(usuarioId: number): Promise<Notificacion[]> {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuario válido es requerido');
    }

    return await this.notificacionRepository.findNoLeidas(usuarioId);
  }

  async createNotificacion(notificacionData: CreateNotificacionData): Promise<Notificacion> {
    const validatedData = createNotificacionSchema.parse(notificacionData);

    if (validatedData.leido === undefined) {
      validatedData.leido = false;
    }

    return await this.notificacionRepository.create(validatedData);
  }

  async updateNotificacion(id: number, notificacionData: UpdateNotificacionData): Promise<Notificacion> {
    if (!id || isNaN(id)) {
      throw new Error('ID de notificación válido es requerido');
    }

    const validatedData = updateNotificacionSchema.parse(notificacionData);

    const existingNotificacion = await this.notificacionRepository.findById(id);
    if (!existingNotificacion) {
      throw new Error('Notificación no encontrada');
    }

    const updatedNotificacion = await this.notificacionRepository.update(id, validatedData);
    if (!updatedNotificacion) {
      throw new Error('Error al actualizar notificación');
    }

    return updatedNotificacion;
  }

  async marcarComoLeida(id: number): Promise<Notificacion> {
    return await this.updateNotificacion(id, { leido: true });
  }

  async deleteNotificacion(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de notificación válido es requerido');
    }

    const notificacion = await this.notificacionRepository.findById(id);
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }

    await this.notificacionRepository.delete(id);
  }
}