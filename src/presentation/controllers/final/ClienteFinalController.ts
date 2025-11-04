import { Request, Response } from 'express';

export class ClienteFinalController {

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
    res.status(200).json({
      success: true,
      data: [
        { id_cliente: 1, id_usuario: 1, telefono: "+34 600 123 456", direccion: "Calle Mayor 123, Madrid" }
      ]
    });
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
    res.status(200).json({
      success: true,
      data: { id_cliente: 1, id_usuario: 1, telefono: "+34 600 123 456", direccion: "Calle Mayor 123, Madrid" }
    });
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
    res.status(201).json({
      success: true,
      data: { id_cliente: 2, id_usuario: 1, telefono: "+34 600 123 456", direccion: "Calle Mayor 123, Madrid" }
    });
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
    res.status(200).json({
      success: true,
      data: { id_cliente: 1, telefono: "+34 600 999 888", direccion: "Avenida Principal 456, Barcelona" }
    });
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
    res.status(200).json({
      success: true,
      message: "Cliente eliminado exitosamente"
    });
  }
}