import { Request, Response } from 'express';
import { SesionUseCases } from '@/application/use-cases/SesionUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class SesionController {
  constructor(private sesionUseCases: SesionUseCases) {}

  /**
   * @swagger
   * /sesiones:
   *   get:
   *     summary: Obtener todas las sesiones
   *     tags: [08. Sesiones]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Número de elementos por página
   *     responses:
   *       200:
   *         description: Lista de sesiones
   */
  async getSesiones(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { sesiones, total } = await this.sesionUseCases.getAllSesiones(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, sesiones, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /sesiones/{id}:
   *   get:
   *     summary: Obtener sesión por ID
   *     tags: [08. Sesiones]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la sesión
   *     responses:
   *       200:
   *         description: Sesión encontrada
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getSesionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const sesionId = parseInt(id);
      const sesion = await this.sesionUseCases.getSesionById(sesionId);
      return ResponseUtil.success(res, sesion);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /sesiones/horario/{horarioId}:
   *   get:
   *     summary: Obtener sesiones por ID de horario
   *     tags: [08. Sesiones]
   *     parameters:
   *       - in: path
   *         name: horarioId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del horario
   *     responses:
   *       200:
   *         description: Sesiones del horario
   */
  async getSesionesByHorario(req: Request, res: Response): Promise<Response> {
    try {
      const { horarioId } = req.params;
      const id = parseInt(horarioId);
      const sesiones = await this.sesionUseCases.getSesionesByHorarioId(id);
      return ResponseUtil.success(res, sesiones);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /sesiones/fecha/{fecha}:
   *   get:
   *     summary: Obtener sesiones por fecha
   *     tags: [08. Sesiones]
   *     parameters:
   *       - in: path
   *         name: fecha
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Sesiones de la fecha
   */
  async getSesionesByFecha(req: Request, res: Response): Promise<Response> {
    try {
      const { fecha } = req.params;
      const sesiones = await this.sesionUseCases.getSesionesByFecha(fecha);
      return ResponseUtil.success(res, sesiones);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 400);
    }
  }

  /**
   * @swagger
   * /sesiones:
   *   post:
   *     summary: Crear una nueva sesión
   *     tags: [08. Sesiones]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_horario
   *               - fecha
   *               - cupos_disponibles
   *             properties:
   *               id_horario:
   *                 type: integer
   *               fecha:
   *                 type: string
   *                 format: date
   *               cupos_disponibles:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       201:
   *         description: Sesión creada exitosamente
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createSesion(req: Request, res: Response): Promise<Response> {
    try {
      const sesion = await this.sesionUseCases.createSesion(req.body);
      return ResponseUtil.success(res, sesion, 'Sesión creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('debe') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateSesion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const sesionId = parseInt(id);
      const sesion = await this.sesionUseCases.updateSesion(sesionId, req.body);
      return ResponseUtil.success(res, sesion, 'Sesión actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('debe')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteSesion(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const sesionId = parseInt(id);
      await this.sesionUseCases.deleteSesion(sesionId);
      return ResponseUtil.success(res, null, 'Sesión eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}