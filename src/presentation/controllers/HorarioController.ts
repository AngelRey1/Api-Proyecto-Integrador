import { Request, Response } from 'express';
import { HorarioUseCases } from '@/application/use-cases/HorarioUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class HorarioController {
  constructor(private horarioUseCases: HorarioUseCases) {}

  /**
   * @swagger
   * /horarios:
   *   get:
   *     summary: Obtener todos los horarios
   *     tags: [07. Horarios y Disponibilidad]
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
   *         description: Lista de horarios
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
   *                         $ref: '#/components/schemas/Horario'
   */
  async getHorarios(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { horarios, total } = await this.horarioUseCases.getAllHorarios(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, horarios, {
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
   * /horarios/{id}:
   *   get:
   *     summary: Obtener horario por ID
   *     tags: [07. Horarios y Disponibilidad]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del horario
   *     responses:
   *       200:
   *         description: Horario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Horario'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getHorarioById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const horarioId = parseInt(id);
      const horario = await this.horarioUseCases.getHorarioById(horarioId);
      return ResponseUtil.success(res, horario);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /horarios/entrenador/{entrenadorId}:
   *   get:
   *     summary: Obtener horarios por ID de entrenador
   *     tags: [07. Horarios y Disponibilidad]
   *     parameters:
   *       - in: path
   *         name: entrenadorId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     responses:
   *       200:
   *         description: Horarios del entrenador
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
   *                         $ref: '#/components/schemas/Horario'
   */
  async getHorariosByEntrenador(req: Request, res: Response): Promise<Response> {
    try {
      const { entrenadorId } = req.params;
      const id = parseInt(entrenadorId);
      const horarios = await this.horarioUseCases.getHorariosByEntrenadorId(id);
      return ResponseUtil.success(res, horarios);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /horarios:
   *   post:
   *     summary: Crear un nuevo horario
   *     tags: [07. Horarios y Disponibilidad]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateHorario'
   *     responses:
   *       201:
   *         description: Horario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Horario'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createHorario(req: Request, res: Response): Promise<Response> {
    try {
      const horario = await this.horarioUseCases.createHorario(req.body);
      return ResponseUtil.success(res, horario, 'Horario creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('debe ser') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /horarios/{id}:
   *   put:
   *     summary: Actualizar horario
   *     tags: [07. Horarios y Disponibilidad]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del horario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dia:
   *                 type: string
   *                 enum: [LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO]
   *               hora_inicio:
   *                 type: string
   *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
   *               hora_fin:
   *                 type: string
   *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
   *     responses:
   *       200:
   *         description: Horario actualizado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateHorario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const horarioId = parseInt(id);
      const horario = await this.horarioUseCases.updateHorario(horarioId, req.body);
      return ResponseUtil.success(res, horario, 'Horario actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('debe ser')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /horarios/{id}:
   *   delete:
   *     summary: Eliminar horario
   *     tags: [07. Horarios y Disponibilidad]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del horario
   *     responses:
   *       200:
   *         description: Horario eliminado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteHorario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const horarioId = parseInt(id);
      await this.horarioUseCases.deleteHorario(horarioId);
      return ResponseUtil.success(res, null, 'Horario eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}