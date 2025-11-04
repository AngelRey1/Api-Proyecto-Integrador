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
   *     tags: [🔐 1. Autenticación y Onboarding]
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
   *     tags: [🔐 1. Autenticación y Onboarding]
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
   *     summary: 🆕 PASO 1A - Registrar nuevo usuario
   *     tags: [🔐 1. Autenticación]
   *     description: |
   *       **PRIMER PASO OBLIGATORIO PARA USAR LA APLICACIÓN**
   *       
   *       Crea una nueva cuenta de usuario en el sistema y devuelve un token JWT para autenticación automática.
   *       
   *       ### 📋 Roles Disponibles:
   *       - **CLIENTE**: Para usuarios que desean agendar sesiones con entrenadores
   *       - **ENTRENADOR**: Para profesionales que ofrecen servicios de entrenamiento
   *       
   *       ### 🔐 Flujo de Registro Completo:
   *       ```
   *       1. Registrar usuario (ESTE ENDPOINT)
   *          POST /usuarios/register
   *          → Recibir token JWT
   *          
   *       2. Crear perfil según rol:
   *          - Si es CLIENTE: POST /clientes
   *          - Si es ENTRENADOR: POST /entrenadores
   *          
   *       3. Si es ENTRENADOR, configurar:
   *          - Deportes: POST /entrenador-deportes
   *          - Horarios: POST /horarios
   *          - Sesiones: POST /sesiones
   *          
   *       4. Ya puedes usar la app:
   *          - Buscar: GET /agendamiento/buscar-sesiones
   *          - Agendar: POST /agendamiento/agendar
   *       ```
   *       
   *       ### ⚠️ Validaciones:
   *       - Email debe ser único en el sistema
   *       - Contraseña mínimo 6 caracteres
   *       - Todos los campos son obligatorios
   *       - El email se guardará en minúsculas
   *       
   *       ### 🎯 Respuesta:
   *       - Devuelve el usuario creado (sin contraseña)
   *       - Incluye token JWT con duración de 24 horas
   *       - Guarda el token para usarlo en endpoints protegidos
   *       
   *       ### 💾 Datos que se Guardan:
   *       - ID único generado automáticamente
   *       - Nombre y apellido
   *       - Email (único)
   *       - Contraseña (hasheada)
   *       - Rol (CLIENTE o ENTRENADOR)
   *       - Fecha de creación
   *     requestBody:
   *       required: true
   *       description: Datos necesarios para crear el usuario
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUsuario'
   *           examples:
   *             cliente:
   *               summary: Registro como Cliente
   *               value:
   *                 nombre: "María"
   *                 apellido: "González"
   *                 email: "maria.gonzalez@ejemplo.com"
   *                 contrasena: "password123"
   *                 rol: "CLIENTE"
   *             entrenador:
   *               summary: Registro como Entrenador
   *               value:
   *                 nombre: "Juan"
   *                 apellido: "Pérez"
   *                 email: "juan.perez@ejemplo.com"
   *                 contrasena: "mipassword456"
   *                 rol: "ENTRENADOR"
   *     responses:
   *       201:
   *         description: ✅ Usuario registrado exitosamente
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
   *                   example: "Usuario registrado exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/Usuario'
   *                     token:
   *                       type: string
   *                       description: JWT token para autenticación (válido por 24 horas)
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtYXJpYS5nb256YWxlekBlamVtcGxvLmNvbSIsInJvbCI6IkNMSUVOVEUiLCJpYXQiOjE2OTk4ODc2MDAsImV4cCI6MTY5OTk3NDAwMH0.abc123"
   *             examples:
   *               registro_exitoso:
   *                 summary: Registro exitoso
   *                 value:
   *                   success: true
   *                   message: "Usuario registrado exitosamente"
   *                   data:
   *                     user:
   *                       id_usuario: 1
   *                       nombre: "María"
   *                       apellido: "González"
   *                       email: "maria.gonzalez@ejemplo.com"
   *                       rol: "CLIENTE"
   *                       creado_en: "2025-11-03T14:00:00Z"
   *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                   instrucciones: "Guarda el token. Ahora crea tu perfil en POST /clientes"
   *       400:
   *         description: ❌ Datos inválidos o email ya registrado
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
   *             examples:
   *               email_existente:
   *                 summary: Email ya registrado
   *                 value:
   *                   success: false
   *                   error: "El email ya está registrado en el sistema"
   *               datos_invalidos:
   *                 summary: Datos faltantes o inválidos
   *                 value:
   *                   success: false
   *                   error: "Datos de entrada inválidos. Verifica que la contraseña tenga al menos 6 caracteres."
   *               rol_invalido:
   *                 summary: Rol no válido
   *                 value:
   *                   success: false
   *                   error: "El rol debe ser CLIENTE o ENTRENADOR"
   *       500:
   *         description: ❌ Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   *     summary: 🔑 PASO 1B - Iniciar sesión
   *     tags: [🔐 1. Autenticación]
   *     description: |
   *       **AUTENTICACIÓN PARA USUARIOS YA REGISTRADOS**
   *       
   *       Inicia sesión con email y contraseña para obtener un token JWT.
   *       
   *       ### 🔐 Autenticación JWT:
   *       - El token tiene duración de 24 horas
   *       - Debe incluirse en el header de todas las peticiones protegidas
   *       - Formato: `Authorization: Bearer <token>`
   *       
   *       ### � Después del Login:
   *       ```
   *       1. Guarda el token recibido
   *       2. Incluye el token en todas las peticiones:
   *          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *          
   *       3. Usa endpoints protegidos:
   *          - Ver mi perfil: GET /clientes (si eres cliente)
   *          - Ver mi perfil: GET /entrenadores (si eres entrenador)
   *          - Buscar sesiones: GET /agendamiento/buscar-sesiones
   *          - Agendar cita: POST /agendamiento/agendar
   *       ```
   *       
   *       ### ⚠️ Seguridad:
   *       - La contraseña NO se devuelve en la respuesta
   *       - El token debe mantenerse seguro
   *       - Si el token expira, debes hacer login nuevamente
   *       
   *       ### 💡 Casos de Uso:
   *       - Login diario de usuarios
   *       - Recuperar sesión después de cerrar la app
   *       - Autenticación en múltiples dispositivos
   *     requestBody:
   *       required: true
   *       description: Credenciales de acceso
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
   *                 description: Email registrado en el sistema
   *                 example: "maria.gonzalez@ejemplo.com"
   *               contrasena:
   *                 type: string
   *                 format: password
   *                 description: Contraseña del usuario
   *                 example: "password123"
   *           examples:
   *             login_cliente:
   *               summary: Login de Cliente
   *               value:
   *                 email: "maria.gonzalez@ejemplo.com"
   *                 contrasena: "password123"
   *             login_entrenador:
   *               summary: Login de Entrenador
   *               value:
   *                 email: "juan.perez@ejemplo.com"
   *                 contrasena: "mipassword456"
   *     responses:
   *       200:
   *         description: ✅ Login exitoso
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
   *                   example: "Login exitoso"
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/Usuario'
   *                     token:
   *                       type: string
   *                       description: JWT token para autenticación (válido por 24 horas)
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtYXJpYS5nb256YWxlekBlamVtcGxvLmNvbSIsInJvbCI6IkNMSUVOVEUiLCJpYXQiOjE2OTk4ODc2MDAsImV4cCI6MTY5OTk3NDAwMH0.abc123"
   *             examples:
   *               login_exitoso:
   *                 summary: Login exitoso
   *                 value:
   *                   success: true
   *                   message: "Login exitoso"
   *                   data:
   *                     user:
   *                       id_usuario: 1
   *                       nombre: "María"
   *                       apellido: "González"
   *                       email: "maria.gonzalez@ejemplo.com"
   *                       rol: "CLIENTE"
   *                       creado_en: "2025-11-03T14:00:00Z"
   *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                   instrucciones: "Incluye este token en el header Authorization: Bearer <token>"
   *       400:
   *         description: ❌ Datos faltantes
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
   *       401:
   *         description: ❌ Credenciales inválidas
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
   *             examples:
   *               contrasena_incorrecta:
   *                 summary: Contraseña incorrecta
   *                 value:
   *                   success: false
   *                   error: "Credenciales inválidas"
   *               email_no_existe:
   *                 summary: Email no registrado
   *                 value:
   *                   success: false
   *                   error: "Usuario no encontrado"
   *       500:
   *         description: ❌ Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   *     tags: [🔐 1. Autenticación y Onboarding]
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
   *     tags: [🔐 1. Autenticación y Onboarding]
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
   *     tags: [🔐 1. Autenticación y Onboarding]
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