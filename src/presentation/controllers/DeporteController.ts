import { Request, Response } from 'express';
import { DeporteUseCases } from '@/application/use-cases/DeporteUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class DeporteController {
  constructor(private deporteUseCases: DeporteUseCases) {}

  /**
   * @swagger
   * /deportes:
   *   get:
   *     summary: Obtener todos los deportes
   *     tags: [04. Catálogos - Deportes]
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
   *         description: Lista de deportes
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Deporte'
   */
  async getDeportes(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { deportes, total } = await this.deporteUseCases.getAllDeportes(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, deportes, {
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
   * /deportes/{id}:
   *   get:
   *     summary: Obtener deporte por ID
   *     tags: [04. Catálogos - Deportes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del deporte
   *     responses:
   *       200:
   *         description: Deporte encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Deporte'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getDeporteById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deporteId = parseInt(id);
      const deporte = await this.deporteUseCases.getDeporteById(deporteId);
      return ResponseUtil.success(res, deporte);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /deportes:
   *   post:
   *     summary: Crear un nuevo deporte
   *     tags: [04. Catálogos - Deportes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDeporte'
   *     responses:
   *       201:
   *         description: Deporte creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Deporte'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const deporte = await this.deporteUseCases.createDeporte(req.body);
      return ResponseUtil.success(res, deporte, 'Deporte creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /deportes/{id}:
   *   put:
   *     summary: Actualizar deporte
   *     tags: [04. Catálogos - Deportes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del deporte
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *                 minLength: 2
   *               descripcion:
   *                 type: string
   *               nivel:
   *                 type: string
   *                 enum: [PRINCIPIANTE, INTERMEDIO, AVANZADO]
   *     responses:
   *       200:
   *         description: Deporte actualizado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deporteId = parseInt(id);
      const deporte = await this.deporteUseCases.updateDeporte(deporteId, req.body);
      return ResponseUtil.success(res, deporte, 'Deporte actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('ya existe') || message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /deportes/{id}:
   *   delete:
   *     summary: Eliminar deporte
   *     tags: [04. Catálogos - Deportes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del deporte
   *     responses:
   *       200:
   *         description: Deporte eliminado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deporteId = parseInt(id);
      await this.deporteUseCases.deleteDeporte(deporteId);
      return ResponseUtil.success(res, null, 'Deporte eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}