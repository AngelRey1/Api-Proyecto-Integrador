import { Request, Response } from 'express';
import { RetroalimentacionAppUseCases } from '@/application/use-cases/RetroalimentacionAppUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class RetroalimentacionAppController {
  constructor(private retroalimentacionUseCases: RetroalimentacionAppUseCases) {}

  /**
   * @swagger
   * /retroalimentacion-app:
   *   get:
   *     summary: Obtener todas las retroalimentaciones de la app
   *     tags: [13. Sistema - Retroalimentación]
   */
  async getRetroalimentaciones(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { retroalimentaciones, total } = await this.retroalimentacionUseCases.getAllRetroalimentaciones(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, retroalimentaciones, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async getRetroalimentacionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const retroalimentacionId = parseInt(id);
      const retroalimentacion = await this.retroalimentacionUseCases.getRetroalimentacionById(retroalimentacionId);
      return ResponseUtil.success(res, retroalimentacion);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async createRetroalimentacion(req: Request, res: Response): Promise<Response> {
    try {
      const retroalimentacion = await this.retroalimentacionUseCases.createRetroalimentacion(req.body);
      return ResponseUtil.success(res, retroalimentacion, 'Retroalimentación creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('requerido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateRetroalimentacion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const retroalimentacionId = parseInt(id);
      const retroalimentacion = await this.retroalimentacionUseCases.updateRetroalimentacion(retroalimentacionId, req.body);
      return ResponseUtil.success(res, retroalimentacion, 'Retroalimentación actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('requerido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteRetroalimentacion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const retroalimentacionId = parseInt(id);
      await this.retroalimentacionUseCases.deleteRetroalimentacion(retroalimentacionId);
      return ResponseUtil.success(res, null, 'Retroalimentación eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}