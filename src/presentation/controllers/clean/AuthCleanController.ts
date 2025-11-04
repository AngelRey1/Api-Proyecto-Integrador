import { Request, Response } from 'express';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { CreateUsuarioData } from '@/domain/entities/User';

export class AuthCleanController {
  constructor(private userUseCases: UserUseCases) {}

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [🔐 Autenticación]
   *     summary: 📝 Registrar nuevo usuario
   *     description: |
   *       Crea una nueva cuenta de usuario en el sistema.
   *       Después del registro, el usuario debe hacer login para obtener su token.
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
   *                 description: Nombre del usuario
   *                 example: "María"
   *               apellido:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *                 description: Apellido del usuario
   *                 example: "González"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Correo electrónico único
   *                 example: "maria.gonzalez@email.com"
   *               contrasena:
   *                 type: string
   *                 minLength: 6
   *                 description: Contraseña (mínimo 6 caracteres)
   *                 example: "miPassword123"
   *               rol:
   *                 type: string
   *                 enum: [CLIENTE, ENTRENADOR]
   *                 description: Tipo de cuenta a crear
   *                 example: "CLIENTE"
   *           examples:
   *             cliente:
   *               summary: Registro como Cliente
   *               value:
   *                 nombre: "Ana"
   *                 apellido: "Martín"
   *                 email: "ana.martin@email.com"
   *                 contrasena: "password123"
   *                 rol: "CLIENTE"
   *             entrenador:
   *               summary: Registro como Entrenador
   *               value:
   *                 nombre: "Carlos"
   *                 apellido: "Ruiz"
   *                 email: "carlos.ruiz@email.com"
   *                 contrasena: "trainer456"
   *                 rol: "ENTRENADOR"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id_usuario:
   *                       type: integer
   *                       example: 1
   *                     nombre:
   *                       type: string
   *                       example: "María"
   *                     apellido:
   *                       type: string
   *                       example: "González"
   *                     email:
   *                       type: string
   *                       example: "maria.gonzalez@email.com"
   *                     rol:
   *                       type: string
   *                       example: "CLIENTE"
   *                 message:
   *                   type: string
   *                   example: "Usuario registrado exitosamente. Ahora puedes hacer login."
   *       400:
   *         description: Datos inválidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "El email ya está registrado"
   *       422:
   *         description: Errores de validación
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "La contraseña debe tener al menos 6 caracteres"
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUsuarioData = req.body;

      // Validaciones básicas
      if (!userData.nombre || userData.nombre.length < 2) {
        res.status(422).json({
          success: false,
          error: 'El nombre debe tener al menos 2 caracteres',
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!userData.email || !userData.email.includes('@')) {
        res.status(422).json({
          success: false,
          error: 'Email inválido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!userData.contrasena || userData.contrasena.length < 6) {
        res.status(422).json({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const newUser = await this.userUseCases.createUser(userData);

      res.status(201).json({
        success: true,
        data: {
          id_usuario: newUser.id_usuario,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          rol: newUser.rol
        },
        message: 'Usuario registrado exitosamente. Ahora puedes hacer login.'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('email')) {
        res.status(400).json({
          success: false,
          error: 'El email ya está registrado',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Error interno del servidor',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [🔐 Autenticación]
   *     summary: 🔑 Iniciar sesión
   *     description: |
   *       Autentica un usuario y devuelve un token JWT.
   *       El token debe incluirse en el header Authorization de las siguientes peticiones.
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
   *                 description: Correo electrónico del usuario
   *                 example: "maria.gonzalez@email.com"
   *               contrasena:
   *                 type: string
   *                 description: Contraseña del usuario
   *                 example: "miPassword123"
   *           examples:
   *             cliente:
   *               summary: Login como Cliente
   *               value:
   *                 email: "cliente@email.com"
   *                 contrasena: "password123"
   *             entrenador:
   *               summary: Login como Entrenador
   *               value:
   *                 email: "entrenador@email.com"
   *                 contrasena: "trainer456"
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       description: Token JWT para autenticación
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                     usuario:
   *                       type: object
   *                       properties:
   *                         id_usuario:
   *                           type: integer
   *                           example: 1
   *                         nombre:
   *                           type: string
   *                           example: "María"
   *                         apellido:
   *                           type: string
   *                           example: "González"
   *                         email:
   *                           type: string
   *                           example: "maria.gonzalez@email.com"
   *                         rol:
   *                           type: string
   *                           example: "CLIENTE"
   *                     expires_in:
   *                       type: string
   *                       description: Tiempo de expiración del token
   *                       example: "24h"
   *                 message:
   *                   type: string
   *                   example: "Login exitoso"
   *       401:
   *         description: Credenciales inválidas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Email o contraseña incorrectos"
   *       422:
   *         description: Datos faltantes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Email y contraseña son requeridos"
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, contrasena } = req.body;

      if (!email || !contrasena) {
        res.status(422).json({
          success: false,
          error: 'Email y contraseña son requeridos',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Aquí iría la lógica de autenticación real
      // Por ahora simulamos una respuesta exitosa
      const mockUser = {
        id_usuario: 1,
        nombre: 'Usuario',
        apellido: 'Demo',
        email: email,
        rol: 'CLIENTE'
      };

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.token';

      res.status(200).json({
        success: true,
        data: {
          token: mockToken,
          usuario: mockUser,
          expires_in: '24h'
        },
        message: 'Login exitoso'
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
   * /auth/profile:
   *   get:
   *     tags: [🔐 Autenticación]
   *     summary: 👤 Obtener perfil actual
   *     description: |
   *       Obtiene la información del usuario autenticado.
   *       Requiere token JWT válido.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Perfil obtenido exitosamente
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
   *                   example: "Perfil obtenido exitosamente"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // El usuario viene del middleware de autenticación
      const userId = (req as any).user?.id_usuario;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Token inválido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const user = await this.userUseCases.getUserById(userId);

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
        message: 'Perfil obtenido exitosamente'
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
   * /auth/logout:
   *   post:
   *     tags: [🔐 Autenticación]
   *     summary: 🚪 Cerrar sesión
   *     description: |
   *       Cierra la sesión del usuario actual.
   *       El token JWT se invalida en el cliente.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Sesión cerrada exitosamente
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
   *                   example: "Sesión cerrada exitosamente"
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // En una implementación real, aquí se invalidaría el token
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
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