import { Request, Response } from 'express';

export class UsuarioFinalController {

  /**
   * @swagger
   * /usuarios:
   *   get:
   *     tags: [👥 Usuarios]
   *     summary: 📋 Listar usuarios
   *     description: Obtiene una lista paginada de usuarios
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Elementos por página
   *     responses:
   *       200:
   *         description: Lista de usuarios obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Usuario'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     total:
   *                       type: integer
   *                       example: 50
   */
  async getAll(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: [
        { id_usuario: 1, nombre: "María", apellido: "González", email: "maria@email.com", rol: "CLIENTE" },
        { id_usuario: 2, nombre: "Carlos", apellido: "Ruiz", email: "carlos@email.com", rol: "ENTRENADOR" }
      ],
      pagination: { page: 1, total: 2 }
    });
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   get:
   *     tags: [👥 Usuarios]
   *     summary: 👤 Obtener usuario por ID
   *     description: Obtiene un usuario específico por su ID
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
   *         description: Usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   *       404:
   *         $ref: '#/components/responses/Error'
   */
  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_usuario: 1, nombre: "María", apellido: "González", email: "maria@email.com", rol: "CLIENTE" }
    });
  }

  /**
   * @swagger
   * /usuarios:
   *   post:
   *     tags: [👥 Usuarios]
   *     summary: ➕ Crear usuario
   *     description: Crea un nuevo usuario (solo administradores)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nombre, apellido, email, contrasena, rol]
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: "Ana"
   *               apellido:
   *                 type: string
   *                 example: "Martín"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "ana@email.com"
   *               contrasena:
   *                 type: string
   *                 example: "password123"
   *               rol:
   *                 type: string
   *                 enum: [CLIENTE, ENTRENADOR]
   *                 example: "CLIENTE"
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   */
  async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({
      success: true,
      data: { id_usuario: 3, nombre: "Ana", apellido: "Martín", email: "ana@email.com", rol: "CLIENTE" }
    });
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   put:
   *     tags: [👥 Usuarios]
   *     summary: ✏️ Actualizar usuario
   *     description: Actualiza la información de un usuario
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
   *               nombre:
   *                 type: string
   *                 example: "María Carmen"
   *               apellido:
   *                 type: string
   *                 example: "González López"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "maria.carmen@email.com"
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   */
  async update(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_usuario: 1, nombre: "María Carmen", apellido: "González López", email: "maria.carmen@email.com", rol: "CLIENTE" }
    });
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   delete:
   *     tags: [👥 Usuarios]
   *     summary: 🗑️ Eliminar usuario
   *     description: Elimina un usuario del sistema
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
   *         description: Usuario eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Usuario eliminado exitosamente"
   */
  async delete(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente"
    });
  }
}