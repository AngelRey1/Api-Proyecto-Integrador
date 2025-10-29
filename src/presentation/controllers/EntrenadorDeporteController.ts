import { Request, Response } from 'express';
import { EntrenadorDeporteUseCases } from '@/application/use-cases/EntrenadorDeporteUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class EntrenadorDeporteController {
  constructor(private entrenadorDeporteUseCases: EntrenadorDeporteUseCases) {}

  /**
   * @swagger
   * /entrenador-deportes:
   *   get:
   *     summary: Obtener todas las relaciones entrenador-deporte
   *     tags: [03. Gestión de Perfiles - Entrenadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Número de elementos por página
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *         description: Campo para ordenar
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *         description: Orden de clasificación
   *     responses:
   *       200:
   *         description: Lista paginada de relaciones entrenador-deporte
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
   *                         $ref: '#/components/schemas/EntrenadorDeporte'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getEntrenadorDeportes(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { entrenadorDeportes, total } = await this.entrenadorDeporteUseCases.getAllEntrenadorDeportes(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, entrenadorDeportes, {
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
   * /entrenador-deportes/{id}:
   *   get:
   *     summary: Obtener relación entrenador-deporte por ID
   *     tags: [03. Gestión de Perfiles - Entrenadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la relación entrenador-deporte
   *     responses:
   *       200:
   *         description: Relación entrenador-deporte encontrada
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/EntrenadorDeporte'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getEntrenadorDeporteById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorDeporteId = parseInt(id);
      const entrenadorDeporte = await this.entrenadorDeporteUseCases.getEntrenadorDeporteById(entrenadorDeporteId);
      return ResponseUtil.success(res, entrenadorDeporte);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /entrenador-deportes:
   *   post:
   *     summary: Crear nueva relación entrenador-deporte
   *     tags: [03. Gestión de Perfiles - Entrenadores]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEntrenadorDeporte'
   *     responses:
   *       201:
   *         description: Relación entrenador-deporte creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/EntrenadorDeporte'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async createEntrenadorDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const entrenadorDeporte = await this.entrenadorDeporteUseCases.createEntrenadorDeporte(req.body);
      return ResponseUtil.success(res, entrenadorDeporte, 'Relación entrenador-deporte creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('requerido') || message.includes('debe ser') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /entrenador-deportes/entrenador/{entrenadorId}:
   *   get:
   *     summary: Obtener deportes de un entrenador
   *     tags: [03. Gestión de Perfiles - Entrenadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: entrenadorId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     responses:
   *       200:
   *         description: Lista de deportes del entrenador
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
   *                         $ref: '#/components/schemas/EntrenadorDeporte'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getDeportesByEntrenador(req: Request, res: Response): Promise<Response> {
    try {
      const { entrenadorId } = req.params;
      const deportes = await this.entrenadorDeporteUseCases.getDeportesByEntrenadorId(parseInt(entrenadorId));
      return ResponseUtil.success(res, deportes);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /entrenador-deportes/deporte/{deporteId}:
   *   get:
   *     summary: Obtener entrenadores de un deporte
   *     tags: [04. Catálogos - Deportes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: deporteId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del deporte
   *     responses:
   *       200:
   *         description: Lista de entrenadores del deporte
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
   *                         $ref: '#/components/schemas/EntrenadorDeporte'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getEntrenadoresByDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const { deporteId } = req.params;
      const entrenadores = await this.entrenadorDeporteUseCases.getEntrenadoresByDeporteId(parseInt(deporteId));
      return ResponseUtil.success(res, entrenadores);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  async updateEntrenadorDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorDeporteId = parseInt(id);
      const entrenadorDeporte = await this.entrenadorDeporteUseCases.updateEntrenadorDeporte(entrenadorDeporteId, req.body);
      return ResponseUtil.success(res, entrenadorDeporte, 'Relación entrenador-deporte actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('debe ser')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteEntrenadorDeporte(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorDeporteId = parseInt(id);
      await this.entrenadorDeporteUseCases.deleteEntrenadorDeporte(entrenadorDeporteId);
      return ResponseUtil.success(res, null, 'Relación entrenador-deporte eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}