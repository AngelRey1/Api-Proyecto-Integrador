import { Request, Response } from 'express';
import { ReseñaUseCases } from '@/application/use-cases/ReseñaUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class ReseñaController {
  constructor(private reseñaUseCases: ReseñaUseCases) {}

  /**
   * @swagger
   * /reseñas:
   *   get:
   *     summary: Obtener todas las reseñas
   *     tags: [📊 4. Seguimiento y Evaluación]
   */
  async getReseñas(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { reseñas, total } = await this.reseñaUseCases.getAllReseñas(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, reseñas, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async getReseñaById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reseñaId = parseInt(id);
      const reseña = await this.reseñaUseCases.getReseñaById(reseñaId);
      return ResponseUtil.success(res, reseña);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async createReseña(req: Request, res: Response): Promise<Response> {
    try {
      const reseña = await this.reseñaUseCases.createReseña(req.body);
      return ResponseUtil.success(res, reseña, 'Reseña creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('debe') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateReseña(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reseñaId = parseInt(id);
      const reseña = await this.reseñaUseCases.updateReseña(reseñaId, req.body);
      return ResponseUtil.success(res, reseña, 'Reseña actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('debe')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteReseña(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reseñaId = parseInt(id);
      await this.reseñaUseCases.deleteReseña(reseñaId);
      return ResponseUtil.success(res, null, 'Reseña eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}