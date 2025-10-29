import { Request, Response } from 'express';
import { ReservaUseCases } from '@/application/use-cases/ReservaUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class ReservaController {
  constructor(private reservaUseCases: ReservaUseCases) {}

  /**
   * @swagger
   * /reservas:
   *   get:
   *     summary: Obtener todas las reservas
   *     tags: [09. Reservas]
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
   *         description: Lista de reservas
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
   *                         $ref: '#/components/schemas/Reserva'
   */
  async getReservas(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { reservas, total } = await this.reservaUseCases.getAllReservas(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, reservas, {
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
   * /reservas/{id}:
   *   get:
   *     summary: Obtener reserva por ID
   *     tags: [09. Reservas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la reserva
   *     responses:
   *       200:
   *         description: Reserva encontrada
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Reserva'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getReservaById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reservaId = parseInt(id);
      const reserva = await this.reservaUseCases.getReservaById(reservaId);
      return ResponseUtil.success(res, reserva);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /reservas:
   *   post:
   *     summary: Crear una nueva reserva
   *     tags: [09. Reservas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateReserva'
   *     responses:
   *       201:
   *         description: Reserva creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Reserva'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createReserva(req: Request, res: Response): Promise<Response> {
    try {
      const reserva = await this.reservaUseCases.createReserva(req.body);
      return ResponseUtil.success(res, reserva, 'Reserva creada exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   put:
   *     summary: Actualizar reserva
   *     tags: [09. Reservas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la reserva
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               estado:
   *                 type: string
   *                 enum: [PENDIENTE, CONFIRMADA, CANCELADA]
   *     responses:
   *       200:
   *         description: Reserva actualizada exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateReserva(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reservaId = parseInt(id);
      const reserva = await this.reservaUseCases.updateReserva(reservaId, req.body);
      return ResponseUtil.success(res, reserva, 'Reserva actualizada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrada')) statusCode = 404;
      else if (message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   delete:
   *     summary: Eliminar reserva
   *     tags: [09. Reservas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la reserva
   *     responses:
   *       200:
   *         description: Reserva eliminada exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteReserva(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const reservaId = parseInt(id);
      await this.reservaUseCases.deleteReserva(reservaId);
      return ResponseUtil.success(res, null, 'Reserva eliminada exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrada') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}