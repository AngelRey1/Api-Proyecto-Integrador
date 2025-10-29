import { Request, Response } from 'express';
import { NotificacionUseCases } from '@/application/use-cases/NotificacionUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class NotificacionController {
  constructor(private notificacionUseCases: NotificacionUseCases) {}

  /**
   * @swagger
   * /notificaciones:
   *   get:
   *     summary: Obtener todas las notificaciones
   *     tags: [12. Sistema - Notificaciones]
   */
  async getNotificaciones(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { notificaciones, total } = await this.notificacionUseCases.getAllNotificaciones(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, notificaciones, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async getNotificacionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const notificacionId = parseInt(id);
      const notificacion = await this.notificacionUseCases.getNotificacionById(notificacionId);
      return ResponseUtil.success(res, notificacion);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /notificaciones/usuario/{usuarioId}/no-leidas:
   *   get:
   *     summary: Obtener notificaciones no leídas de un usuario
   *     tags: [12. Sistema - Notificaciones]
   */
  async getNotificacionesNoLeidas(req: Request, res: Response): Promise<Response> {
    try {
      const { usuarioId } = req.params;
      const id = parseInt(usuarioId);
      const notificaciones = await this.notificacionUseCases.getNotificacionesNoLeidas(id);
      return ResponseUtil.success(res, notificaciones);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /notificaciones/{id}/marcar-leida:
   *   put:
   *     summary: Marcar notificación como leída
   *     tags: [12. Sistema - Notificaciones]
   */
  async marcarComoLeida(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const notificacionId = parseInt(id);
      const notificacion = await this.notificacionUseCases.marcarComoLeida(notificacionId);
      return ResponseUtil.success(res, notificacion, 'Notificación marcada como leída');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async createNotificacion(req: Request, res: Response): Promise<Response> {
    try {
      const notificacion = await this.notificacionUseCases.createNotificacion(req.body);
      return ResponseUtil.success(res, notificacion, 'Notificación creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('requerido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateNotificacion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const notificacionId = parseInt(id);
      const notificacion = await this.notificacionUseCases.updateNotificacion(notificacionId, req.body);
      return ResponseUtil.success(res, notificacion, 'Notificación actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('requerido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteNotificacion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const notificacionId = parseInt(id);
      await this.notificacionUseCases.deleteNotificacion(notificacionId);
      return ResponseUtil.success(res, null, 'Notificación eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}