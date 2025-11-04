import { Request, Response } from 'express';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { PasswordUtils } from '@/shared/utils/password';

export class UsuarioFinalController {
  private userUseCases: UserUseCases;

  constructor() {
    const userRepository = new SupabaseUserRepository();
    this.userUseCases = new UserUseCases(userRepository);
  }

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
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.userUseCases.getAllUsers({ page, limit });
      
      // Remover contraseñas de la respuesta
      const usuariosSinPassword = result.users.map(user => {
        const { contrasena, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json({
        success: true,
        data: usuariosSinPassword,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
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
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const usuario = await this.userUseCases.getUserById(id);
      
      // Remover contraseña de la respuesta
      const { contrasena, ...usuarioSinPassword } = usuario;
      
      res.status(200).json({
        success: true,
        data: usuarioSinPassword
      });
      
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
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
    try {
      const { nombre, apellido, email, contrasena, rol } = req.body;
      
      // Validaciones
      if (!nombre || !apellido || !email || !contrasena || !rol) {
        res.status(400).json({
          success: false,
          error: "Todos los campos son requeridos",
          code: "CAMPOS_REQUERIDOS"
        });
        return;
      }
      
      // Validar contraseña
      const passwordValidation = PasswordUtils.validatePassword(contrasena);
      if (!passwordValidation.isValid) {
        res.status(400).json({
          success: false,
          error: "Contraseña no cumple con los requisitos",
          code: "CONTRASENA_INVALIDA",
          detalles: passwordValidation.errors.join(', ')
        });
        return;
      }
      
      // Hashear contraseña
      const hashedPassword = await PasswordUtils.hashPassword(contrasena);
      
      const nuevoUsuario = await this.userUseCases.createUser({
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        rol
      });
      
      // Remover contraseña de la respuesta
      const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario;
      
      res.status(201).json({
        success: true,
        data: usuarioSinPassword,
        message: "Usuario creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Ya existe un usuario con este email')) {
        res.status(400).json({
          success: false,
          error: "Ya existe un usuario con este email",
          code: "EMAIL_DUPLICADO"
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
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const usuarioActualizado = await this.userUseCases.updateUser(id, updateData);
      
      // Remover contraseña de la respuesta
      const { contrasena, ...usuarioSinPassword } = usuarioActualizado;
      
      res.status(200).json({
        success: true,
        data: usuarioSinPassword,
        message: "Usuario actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
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
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de usuario inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      await this.userUseCases.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      const message = (error as Error).message;
      
      if (message.includes('Usuario no encontrado')) {
        res.status(404).json({
          success: false,
          error: "Usuario no encontrado",
          code: "USUARIO_NO_ENCONTRADO"
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