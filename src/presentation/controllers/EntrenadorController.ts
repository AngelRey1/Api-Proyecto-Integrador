import { Request, Response } from 'express';
import { EntrenadorUseCases } from '@/application/use-cases/EntrenadorUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class EntrenadorController {
  constructor(private entrenadorUseCases: EntrenadorUseCases) {}

  /**
   * @swagger
   * /entrenadores:
   *   get:
   *     summary: Obtener todos los entrenadores
   *     tags: [🏃‍♂️ Perfiles de Entrenadores]
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
   *         description: Lista de entrenadores
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
   *                         $ref: '#/components/schemas/Entrenador'
   */
  async getEntrenadores(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { entrenadores, total } = await this.entrenadorUseCases.getAllEntrenadores(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, entrenadores, {
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
   * /entrenadores/{id}:
   *   get:
   *     summary: Obtener entrenador por ID
   *     tags: [🏃‍♂️ Perfiles de Entrenadores]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     responses:
   *       200:
   *         description: Entrenador encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Entrenador'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getEntrenadorById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorId = parseInt(id);
      const entrenador = await this.entrenadorUseCases.getEntrenadorById(entrenadorId);
      return ResponseUtil.success(res, entrenador);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /entrenadores:
   *   post:
   *     summary: Crear un nuevo entrenador
   *     tags: [🏃‍♂️ Perfiles de Entrenadores]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEntrenador'
   *     responses:
   *       201:
   *         description: Entrenador creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Entrenador'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createEntrenador(req: Request, res: Response): Promise<Response> {
    try {
      const entrenador = await this.entrenadorUseCases.createEntrenador(req.body);
      return ResponseUtil.success(res, entrenador, 'Entrenador creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /entrenadores/{id}:
   *   put:
   *     summary: Actualizar entrenador
   *     tags: [🏃‍♂️ Perfiles de Entrenadores]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               especialidad:
   *                 type: string
   *               experiencia:
   *                 type: integer
   *               descripcion:
   *                 type: string
   *               foto_url:
   *                 type: string
   *                 format: uri
   *     responses:
   *       200:
   *         description: Entrenador actualizado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateEntrenador(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorId = parseInt(id);
      const entrenador = await this.entrenadorUseCases.updateEntrenador(entrenadorId, req.body);
      return ResponseUtil.success(res, entrenador, 'Entrenador actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /entrenadores/{id}:
   *   delete:
   *     summary: Eliminar entrenador
   *     tags: [🏃‍♂️ Perfiles de Entrenadores]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     responses:
   *       200:
   *         description: Entrenador eliminado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteEntrenador(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const entrenadorId = parseInt(id);
      await this.entrenadorUseCases.deleteEntrenador(entrenadorId);
      return ResponseUtil.success(res, null, 'Entrenador eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}