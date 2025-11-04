import { Request, Response } from 'express';
import { generateToken } from '@/shared/middleware/auth';

export class AuthFinalController {

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
    const { nombre, apellido, email, rol } = req.body;
    
    // Usuario registrado (en producción, guardar en base de datos)
    const usuario = { 
      id: 1, 
      nombre: nombre || "María", 
      email: email || "maria@email.com", 
      rol: rol || "CLIENTE" 
    };
    
    // Generar token JWT para el nuevo usuario
    const token = generateToken(usuario);
    
    res.status(201).json({
      success: true,
      data: { 
        id_usuario: usuario.id, 
        nombre: usuario.nombre, 
        apellido: apellido || "González", 
        email: usuario.email, 
        rol: usuario.rol,
        token: token
      },
      message: "Usuario registrado exitosamente"
    });
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
    // Simular validación de credenciales (en producción, validar contra base de datos)
    const { email, contrasena } = req.body;
    
    // Usuario de ejemplo para testing
    const usuario = { 
      id: 1, 
      nombre: "María", 
      email: email || "maria@email.com", 
      rol: "CLIENTE" 
    };
    
    // Generar token JWT real
    const token = generateToken(usuario);
    
    res.status(200).json({
      success: true,
      data: {
        token: token,
        usuario: { id_usuario: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
      },
      message: "Login exitoso"
    });
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
    res.status(200).json({
      success: true,
      data: { id_usuario: 1, nombre: "María", email: "maria@email.com", rol: "CLIENTE" }
    });
  }
}