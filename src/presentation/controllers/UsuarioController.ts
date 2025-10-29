import { Request, Response } from 'express';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';
import { generateToken } from '@/shared/middleware/auth';

export class UsuarioController {
  constructor(private userUseCases: UserUseCases) {}

  /**
   * @swagger
   * /usuarios:
   *   get:
   *     summary: Obtener todos los usuarios
   *     tags: [01. Autenticación y Usuarios]
   *     security:
   *       - bearerAuth: []
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
   *         description: Orden de clasificación
   *     responses:
   *       200:
   *         description: Lista de usuarios
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
   *                         $ref: '#/components/schemas/Usuario'
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
   */
  async getUsuarios(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { users, total } = await this.userUseCases.getAllUsers(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, users, {
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
   * /usuarios/{id}:
   *   get:
   *     summary: Obtener usuario por ID
   *     tags: [01. Autenticación y Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Usuario'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getUsuarioById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const user = await this.userUseCases.getUserById(userId);
      return ResponseUtil.success(res, user);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /usuarios/register:
   *   post:
   *     summary: Registrar nuevo usuario (devuelve token JWT)
   *     tags: [01. Autenticación y Usuarios]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUsuario'
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         user:
   *                           $ref: '#/components/schemas/Usuario'
   *                         token:
   *                           type: string
   *                           description: JWT token para autenticación
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async registerUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userUseCases.createUser(req.body);
      
      // Generar token JWT
      const token = generateToken({
        id: user.id_usuario,
        email: user.email,
        rol: user.rol,
      });

      return ResponseUtil.success(res, { user, token }, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      // Si es un error de validación de Zod, devolver 400
      if (message.includes('code') && message.includes('minimum')) {
        return ResponseUtil.error(res, 'Datos de entrada inválidos. Verifica que la contraseña tenga al menos 6 caracteres.', 400);
      }
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /usuarios/login:
   *   post:
   *     summary: Iniciar sesión (devuelve token JWT)
   *     tags: [01. Autenticación y Usuarios]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - contrasena
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@ejemplo.com"
   *               contrasena:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         user:
   *                           $ref: '#/components/schemas/Usuario'
   *                         token:
   *                           type: string
   *                           description: JWT token para autenticación
   *       401:
   *         description: Credenciales inválidas
   */
  async loginUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { email, contrasena } = req.body;

      if (!email || !contrasena) {
        return ResponseUtil.error(res, 'Email y contraseña son requeridos', 400);
      }

      // Buscar usuario por email
      const user = await this.userUseCases.getUserByEmail(email);
      
      // Verificar contraseña (en producción usar bcrypt)
      if (user.contrasena !== contrasena) {
        return ResponseUtil.error(res, 'Credenciales inválidas', 401);
      }

      // Generar token JWT
      const token = generateToken({
        id: user.id_usuario,
        email: user.email,
        rol: user.rol,
      });

      // Retornar usuario sin contraseña
      const { contrasena: _, ...userWithoutPassword } = user;

      return ResponseUtil.success(res, { user: userWithoutPassword, token }, 'Login exitoso');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 401 : 500;
      return ResponseUtil.error(res, 'Credenciales inválidas', statusCode);
    }
  }

  /**
   * @swagger
   * /usuarios:
   *   post:
   *     summary: Crear usuario (admin)
   *     tags: [01. Autenticación y Usuarios]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUsuario'
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Usuario'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userUseCases.createUser(req.body);
      return ResponseUtil.success(res, user, 'Usuario creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   put:
   *     summary: Actualizar usuario
   *     tags: [01. Autenticación y Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *                 minLength: 2
   *               apellido:
   *                 type: string
   *                 minLength: 2
   *               email:
   *                 type: string
   *                 format: email
   *               rol:
   *                 type: string
   *                 enum: [CLIENTE, ENTRENADOR]
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/Usuario'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async updateUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const user = await this.userUseCases.updateUser(userId, req.body);
      return ResponseUtil.success(res, user, 'Usuario actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('ya existe') || message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /usuarios/{id}:
   *   delete:
   *     summary: Eliminar usuario
   *     tags: [01. Autenticación y Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      await this.userUseCases.deleteUser(userId);
      return ResponseUtil.success(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}