import { Request, Response } from 'express';
import { ClienteUseCases } from '@/application/use-cases/ClienteUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class ClienteController {
  constructor(private clienteUseCases: ClienteUseCases) {}

  /**
   * @swagger
   * /clientes:
   *   get:
   *     summary: Obtener todos los clientes
   *     tags: [👤 Perfiles de Clientes]
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
   *         description: Lista de clientes
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
   *                         $ref: '#/components/schemas/Cliente'
   */
  async getClientes(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { clientes, total } = await this.clienteUseCases.getAllClientes(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, clientes, {
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
   * /clientes/{id}:
   *   get:
   *     summary: Obtener cliente por ID
   *     tags: [👤 Perfiles de Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del cliente
   *     responses:
   *       200:
   *         description: Cliente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Cliente'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getClienteById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const clienteId = parseInt(id);
      const cliente = await this.clienteUseCases.getClienteById(clienteId);
      return ResponseUtil.success(res, cliente);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /clientes:
   *   post:
   *     summary: Crear un nuevo cliente
   *     tags: [👤 Perfiles de Clientes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCliente'
   *     responses:
   *       201:
   *         description: Cliente creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Cliente'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createCliente(req: Request, res: Response): Promise<Response> {
    try {
      const cliente = await this.clienteUseCases.createCliente(req.body);
      return ResponseUtil.success(res, cliente, 'Cliente creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /clientes/{id}:
   *   put:
   *     summary: Actualizar cliente
   *     tags: [👤 Perfiles de Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del cliente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               telefono:
   *                 type: string
   *                 minLength: 8
   *               direccion:
   *                 type: string
   *                 minLength: 5
   *     responses:
   *       200:
   *         description: Cliente actualizado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateCliente(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const clienteId = parseInt(id);
      const cliente = await this.clienteUseCases.updateCliente(clienteId, req.body);
      return ResponseUtil.success(res, cliente, 'Cliente actualizado exitosamente');
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
   * /clientes/{id}:
   *   delete:
   *     summary: Eliminar cliente
   *     tags: [👤 Perfiles de Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del cliente
   *     responses:
   *       200:
   *         description: Cliente eliminado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteCliente(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const clienteId = parseInt(id);
      await this.clienteUseCases.deleteCliente(clienteId);
      return ResponseUtil.success(res, null, 'Cliente eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}