import { Request, Response } from 'express';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { CreateUsuarioData, UpdateUsuarioData } from '@/domain/entities/User';

export class UsuarioCleanController {
  constructor(private userUseCases: UserUseCases) {}

  /**
   * @swagger
   * /usuarios:
   *   get:
   *     tags: [👥 Usuarios]
   *     summary: 📋 Listar todos los usuarios
   *     description: |
   *       Obtiene una lista paginada de todos los usuarios del sistema.
   *       Incluye información básica de perfil y rol.
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
   *         description: Elementos por página
   *       - in: query
   *         name: rol
   *         schema:
   *           type: string
   *           enum: [CLIENTE, ENTRENADOR]
   *         description: Filtrar por rol de usuario
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
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total:
   *                       type: integer
   *                       example: 50
   *                     totalPages:
   *                       type: integer
   *                       example: 5
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/Error'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const rol = req.query.rol as string;

      const params = { page, limit, sortBy: 'creado_en', sortOrder: 'desc' as const };
      const result = await this.userUseCases.getAllUsers(params);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        message: 'Usuarios obtenidos exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   get:
   *     tags: [👥 Usuarios]
   *     summary: 👤 Obtener usuario por ID
   *     description: |
   *       Obtiene la información detallada de un usuario específico.
   *       Incluye datos de perfil completos.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: ID único del usuario
   *         example: 1
   *     responses:
   *       200:
   *         description: Usuario encontrado exitosamente
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
   *                 message:
   *                   type: string
   *                   example: "Usuario encontrado"
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userUseCases.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'Usuario encontrado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * @swagger
   * /usuarios:
   *   post:
   *     tags: [👥 Usuarios]
   *     summary: ➕ Crear nuevo usuario
   *     description: |
   *       Crea un nuevo usuario en el sistema.
   *       **Nota:** Este endpoint es para administradores. 
   *       Los usuarios normales deben usar `/auth/register`.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - apellido
   *               - email
   *               - contrasena
   *               - rol
   *             properties:
   *               nombre:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *                 example: "Juan"
   *               apellido:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *                 example: "Pérez"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@email.com"
   *               contrasena:
   *                 type: string
   *                 minLength: 6
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
   *                 message:
   *                   type: string
   *                   example: "Usuario creado exitosamente"
   *       400:
   *         description: Datos inválidos
   *       409:
   *         description: Email ya existe
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUsuarioData = req.body;
      const newUser = await this.userUseCases.createUser(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   put:
   *     tags: [👥 Usuarios]
   *     summary: ✏️ Actualizar usuario
   *     description: Actualiza la información de un usuario existente
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
   *                 example: "Juan Carlos"
   *               apellido:
   *                 type: string
   *                 example: "Pérez García"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.carlos@email.com"
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateUsuarioData = req.body;
      
      const updatedUser = await this.userUseCases.updateUser(id, updateData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   delete:
   *     tags: [👥 Usuarios]
   *     summary: 🗑️ Eliminar usuario
   *     description: |
   *       Elimina un usuario del sistema.
   *       **Advertencia:** Esta acción es irreversible.
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
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.userUseCases.deleteUser(id);

      // Usuario eliminado exitosamente

      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  }
}