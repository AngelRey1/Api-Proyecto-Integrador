import { Request, Response } from 'express';
import { ClienteUseCases } from '@/application/use-cases/ClienteUseCases';
import { SupabaseClienteRepository } from '@/infrastructure/repositories/SupabaseClienteRepository';

export class ClienteFinalController {
  private clienteUseCases: ClienteUseCases;

  constructor() {
    const repository = new SupabaseClienteRepository();
    this.clienteUseCases = new ClienteUseCases(repository);
  }

  /**
   * @swagger
   * /clientes:
   *   get:
   *     tags: [👤 Clientes]
   *     summary: 📋 Listar clientes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de clientes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Cliente'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.clienteUseCases.getAllClientes({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result.clientes,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /clientes/{id}:
   *   get:
   *     tags: [👤 Clientes]
   *     summary: 👤 Obtener cliente por ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Cliente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Cliente'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const cliente = await this.clienteUseCases.getClienteById(id);
      
      res.status(200).json({
        success: true,
        data: cliente
      });
      
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Cliente no encontrado",
          code: "CLIENTE_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /clientes:
   *   post:
   *     tags: [👤 Clientes]
   *     summary: ➕ Crear cliente
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id_usuario]
   *             properties:
   *               id_usuario:
   *                 type: integer
   *                 example: 1
   *               telefono:
   *                 type: string
   *                 example: "+34 600 123 456"
   *               direccion:
   *                 type: string
   *                 example: "Calle Mayor 123, Madrid"
   *     responses:
   *       201:
   *         description: Cliente creado exitosamente
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      const nuevoCliente = await this.clienteUseCases.createCliente(data);
      
      res.status(201).json({
        success: true,
        data: nuevoCliente,
        message: "Cliente creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando cliente:', error);
      const message = (error as Error).message;
      
      res.status(400).json({
        success: false,
        error: message || "Error creando cliente",
        code: "ERROR_CREACION"
      });
    }
  }

  /**
   * @swagger
   * /clientes/{id}:
   *   put:
   *     tags: [👤 Clientes]
   *     summary: ✏️ Actualizar cliente
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               telefono:
   *                 type: string
   *                 example: "+34 600 999 888"
   *               direccion:
   *                 type: string
   *                 example: "Avenida Principal 456, Barcelona"
   *     responses:
   *       200:
   *         description: Cliente actualizado exitosamente
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const clienteActualizado = await this.clienteUseCases.updateCliente(id, data);
      
      res.status(200).json({
        success: true,
        data: clienteActualizado,
        message: "Cliente actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Cliente no encontrado",
          code: "CLIENTE_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /clientes/{id}:
   *   delete:
   *     tags: [👤 Clientes]
   *     summary: 🗑️ Eliminar cliente
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Cliente eliminado exitosamente
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      await this.clienteUseCases.deleteCliente(id);
      
      res.status(200).json({
        success: true,
        message: "Cliente eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Cliente no encontrado",
          code: "CLIENTE_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }
}