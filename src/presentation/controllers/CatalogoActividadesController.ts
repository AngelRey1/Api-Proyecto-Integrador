import { Request, Response } from 'express';
import { CatalogoActividadesUseCases } from '@/application/use-cases/CatalogoActividadesUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoActividadesController {
  constructor(private actividadUseCases: CatalogoActividadesUseCases) {}

  /**
   * @swagger
   * /catalogo-actividades:
   *   get:
   *     summary: Obtener todas las actividades del catálogo
   *     tags: [06. Actividades Personalizadas]
   */
  async getActividades(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { actividades, total } = await this.actividadUseCases.getAllActividades(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, actividades, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async getActividadById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const actividadId = parseInt(id);
      const actividad = await this.actividadUseCases.getActividadById(actividadId);
      return ResponseUtil.success(res, actividad);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async createActividad(req: Request, res: Response): Promise<Response> {
    try {
      const actividad = await this.actividadUseCases.createActividad(req.body);
      return ResponseUtil.success(res, actividad, 'Actividad creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateActividad(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const actividadId = parseInt(id);
      const actividad = await this.actividadUseCases.updateActividad(actividadId, req.body);
      return ResponseUtil.success(res, actividad, 'Actividad actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteActividad(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const actividadId = parseInt(id);
      await this.actividadUseCases.deleteActividad(actividadId);
      return ResponseUtil.success(res, null, 'Actividad eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}