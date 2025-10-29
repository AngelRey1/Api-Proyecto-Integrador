import { Request, Response } from 'express';
import { ComentarioUseCases } from '@/application/use-cases/ComentarioUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class ComentarioController {
  constructor(private comentarioUseCases: ComentarioUseCases) {}

  /**
   * @swagger
   * /comentarios:
   *   get:
   *     summary: Obtener todos los comentarios
   *     tags: [11. Reseñas y Comentarios]
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
   *         description: Lista paginada de comentarios
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
   *                         $ref: '#/components/schemas/Comentario'
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         page:
   *                           type: integer
   *                         limit:
   *                           type: integer
   *                         total:
   *                           type: integer
   *                         totalPages:
   *                           type: integer
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getComentarios(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { comentarios, total } = await this.comentarioUseCases.getAllComentarios(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, comentarios, {
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
   * /comentarios/{id}:
   *   get:
   *     summary: Obtener comentario por ID
   *     tags: [11. Reseñas y Comentarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del comentario
   *     responses:
   *       200:
   *         description: Comentario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Comentario'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getComentarioById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const comentarioId = parseInt(id);
      const comentario = await this.comentarioUseCases.getComentarioById(comentarioId);
      return ResponseUtil.success(res, comentario);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /comentarios:
   *   post:
   *     summary: Crear nuevo comentario
   *     tags: [11. Reseñas y Comentarios]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateComentario'
   *     responses:
   *       201:
   *         description: Comentario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Comentario'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async createComentario(req: Request, res: Response): Promise<Response> {
    try {
      const comentario = await this.comentarioUseCases.createComentario(req.body);
      return ResponseUtil.success(res, comentario, 'Comentario creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('requerido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateComentario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const comentarioId = parseInt(id);
      const comentario = await this.comentarioUseCases.updateComentario(comentarioId, req.body);
      return ResponseUtil.success(res, comentario, 'Comentario actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('requerido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteComentario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const comentarioId = parseInt(id);
      await this.comentarioUseCases.deleteComentario(comentarioId);
      return ResponseUtil.success(res, null, 'Comentario eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}