import { Request, Response } from 'express';
import { CalendarioDisponibilidadUseCases } from '@/application/use-cases/CalendarioDisponibilidadUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class CalendarioDisponibilidadController {
  constructor(private disponibilidadUseCases: CalendarioDisponibilidadUseCases) {}

  /**
   * @swagger
   * /calendario-disponibilidad:
   *   get:
   *     summary: Obtener todas las disponibilidades del calendario
   *     tags: [07. Horarios y Disponibilidad]
   */
  async getDisponibilidades(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { disponibilidades, total } = await this.disponibilidadUseCases.getAllDisponibilidades(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, disponibilidades, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async getDisponibilidadById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const disponibilidadId = parseInt(id);
      const disponibilidad = await this.disponibilidadUseCases.getDisponibilidadById(disponibilidadId);
      return ResponseUtil.success(res, disponibilidad);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async createDisponibilidad(req: Request, res: Response): Promise<Response> {
    try {
      const disponibilidad = await this.disponibilidadUseCases.createDisponibilidad(req.body);
      return ResponseUtil.success(res, disponibilidad, 'Disponibilidad creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('debe') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateDisponibilidad(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const disponibilidadId = parseInt(id);
      const disponibilidad = await this.disponibilidadUseCases.updateDisponibilidad(disponibilidadId, req.body);
      return ResponseUtil.success(res, disponibilidad, 'Disponibilidad actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('debe')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteDisponibilidad(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const disponibilidadId = parseInt(id);
      await this.disponibilidadUseCases.deleteDisponibilidad(disponibilidadId);
      return ResponseUtil.success(res, null, 'Disponibilidad eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}