import { Request, Response } from 'express';
import { PagoUseCases } from '@/application/use-cases/PagoUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class PagoController {
  constructor(private pagoUseCases: PagoUseCases) {}

  /**
   * @swagger
   * /pagos:
   *   get:
   *     summary: 💰 Listar historial de pagos
   *     tags: [💰 3. Gestión de Pagos]
   *     description: |
   *       Obtiene el historial completo de pagos del usuario autenticado.
   *       Incluye información de reservas asociadas.
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
   *         description: Lista de pagos
   */
  async getPagos(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { pagos, total } = await this.pagoUseCases.getAllPagos(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, pagos, {
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
   * /pagos/{id}:
   *   get:
   *     summary: Obtener pago por ID
   *     tags: [💰 3. Gestión de Pagos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del pago
   *     responses:
   *       200:
   *         description: Pago encontrado
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getPagoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const pagoId = parseInt(id);
      const pago = await this.pagoUseCases.getPagoById(pagoId);
      return ResponseUtil.success(res, pago);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /pagos:
   *   post:
   *     summary: Crear un nuevo pago
   *     tags: [💰 3. Gestión de Pagos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_reserva
   *               - monto
   *               - metodo
   *             properties:
   *               id_reserva:
   *                 type: integer
   *               monto:
   *                 type: number
   *                 minimum: 0
   *               metodo:
   *                 type: string
   *                 enum: [TARJETA, EFECTIVO]
   *               estado:
   *                 type: string
   *                 enum: [PENDIENTE, COMPLETADO]
   *     responses:
   *       201:
   *         description: Pago creado exitosamente
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createPago(req: Request, res: Response): Promise<Response> {
    try {
      const pago = await this.pagoUseCases.createPago(req.body);
      return ResponseUtil.success(res, pago, 'Pago creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('inválido') || message.includes('debe') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updatePago(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const pagoId = parseInt(id);
      const pago = await this.pagoUseCases.updatePago(pagoId, req.body);
      return ResponseUtil.success(res, pago, 'Pago actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('inválido') || message.includes('debe')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deletePago(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const pagoId = parseInt(id);
      await this.pagoUseCases.deletePago(pagoId);
      return ResponseUtil.success(res, null, 'Pago eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}