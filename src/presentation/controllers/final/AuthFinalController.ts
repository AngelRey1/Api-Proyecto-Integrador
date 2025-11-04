import { Request, Response } from 'express';
import { generateToken } from '@/shared/middleware/auth';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { PasswordUtils } from '@/shared/utils/password';
import { ResponseUtil } from '@/shared/utils/response';

export class AuthFinalController {
  private userUseCases: UserUseCases;

  constructor() {
    const userRepository = new SupabaseUserRepository();
    this.userUseCases = new UserUseCases(userRepository);
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [🔐 Autenticación]
   *     summary: 📝 Registrar nuevo usuario
   *     description: Crea una nueva cuenta de usuario en el sistema
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
   *                 example: "María"
   *               apellido:
   *                 type: string
   *                 example: "González"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "maria@email.com"
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
   *                   $ref: '#/components/schemas/Usuario'
   *                 message:
   *                   type: string
   *                   example: "Usuario registrado exitosamente"
   *       400:
   *         $ref: '#/components/responses/Error'
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, apellido, email, contrasena, rol } = req.body;
      
      // 🔍 VALIDACIÓN 1: Verificar que todos los campos requeridos estén presentes
      if (!nombre || !apellido || !email || !contrasena || !rol) {
        res.status(400).json({
          success: false,
          error: "Todos los campos son requeridos",
          code: "CAMPOS_REQUERIDOS",
          detalles: "nombre, apellido, email, contrasena y rol son obligatorios"
        });
        return;
      }
      
      // 🔍 VALIDACIÓN 2: Validar formato de contraseña
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
      
      // 🔍 VALIDACIÓN 3: Hashear contraseña
      const hashedPassword = await PasswordUtils.hashPassword(contrasena);
      
      // ✅ Crear usuario en la base de datos
      const nuevoUsuario = await this.userUseCases.createUser({
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        rol
      });
      
      // Generar token JWT para el nuevo usuario
      const token = generateToken({
        id: nuevoUsuario.id_usuario,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      });
      
      res.status(201).json({
        success: true,
        data: { 
          id_usuario: nuevoUsuario.id_usuario, 
          nombre: nuevoUsuario.nombre, 
          apellido: nuevoUsuario.apellido, 
          email: nuevoUsuario.email, 
          rol: nuevoUsuario.rol,
          token: token,
          creado_en: nuevoUsuario.creado_en
        },
        message: "Usuario registrado exitosamente"
      });
      
    } catch (error) {
      console.error('Error en registro:', error);
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
   * /auth/login:
   *   post:
   *     tags: [🔐 Autenticación]
   *     summary: 🔑 Iniciar sesión
   *     description: Autentica un usuario y devuelve un token JWT
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, contrasena]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "maria@email.com"
   *               contrasena:
   *                 type: string
   *                 example: "password123"
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
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                     usuario:
   *                       $ref: '#/components/schemas/Usuario'
   *                 message:
   *                   type: string
   *                   example: "Login exitoso"
   *       401:
   *         $ref: '#/components/responses/Error'
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, contrasena } = req.body;
      
      // 🔍 VALIDACIÓN 1: Verificar que email y contraseña estén presentes
      if (!email || !contrasena) {
        res.status(400).json({
          success: false,
          error: "Email y contraseña son requeridos",
          code: "CREDENCIALES_REQUERIDAS"
        });
        return;
      }
      
      // 🔍 VALIDACIÓN 2: Buscar usuario por email
      let usuario;
      try {
        usuario = await this.userUseCases.getUserByEmail(email);
      } catch (error) {
        res.status(401).json({
          success: false,
          error: "Credenciales inválidas",
          code: "CREDENCIALES_INVALIDAS"
        });
        return;
      }
      
      // 🔍 VALIDACIÓN 3: Verificar contraseña
      const passwordMatch = await PasswordUtils.comparePassword(contrasena, usuario.contrasena!);
      if (!passwordMatch) {
        res.status(401).json({
          success: false,
          error: "Credenciales inválidas",
          code: "CREDENCIALES_INVALIDAS"
        });
        return;
      }
      
      // ✅ Generar token JWT
      const token = generateToken({
        id: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol
      });
      
      // Retornar usuario sin contraseña
      const { contrasena: _, ...usuarioSinPassword } = usuario;
      
      res.status(200).json({
        success: true,
        data: {
          token: token,
          usuario: usuarioSinPassword
        },
        message: "Login exitoso"
      });
      
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /auth/profile:
   *   get:
   *     tags: [🔐 Autenticación]
   *     summary: 👤 Obtener perfil actual
   *     description: Obtiene la información del usuario autenticado
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
   *       401:
   *         $ref: '#/components/responses/Error'
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const usuario = (req as any).user; // Usuario del token JWT
      
      if (!usuario || !usuario.id) {
        res.status(401).json({
          success: false,
          error: "Usuario no autenticado",
          code: "NO_AUTENTICADO"
        });
        return;
      }
      
      // Obtener datos actualizados del usuario desde la base de datos
      const usuarioCompleto = await this.userUseCases.getUserById(usuario.id);
      
      // Retornar usuario sin contraseña
      const { contrasena: _, ...usuarioSinPassword } = usuarioCompleto;
      
      res.status(200).json({
        success: true,
        data: usuarioSinPassword
      });
      
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }
}