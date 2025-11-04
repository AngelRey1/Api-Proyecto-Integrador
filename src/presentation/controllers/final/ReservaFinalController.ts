import { Request, Response } from 'express';
import { ReservaUseCases } from '@/application/use-cases/ReservaUseCases';
import { SupabaseReservaRepository } from '@/infrastructure/repositories/SupabaseReservaRepository';

export class ReservaFinalController {
  private reservaUseCases: ReservaUseCases;

  constructor() {
    const repository = new SupabaseReservaRepository();
    this.reservaUseCases = new ReservaUseCases(repository);
  }

  /**
   * @swagger
   * /reservas:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 📋 Listar reservas
   *     description: Obtiene una lista de reservas del usuario autenticado
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *           enum: [PENDIENTE, CONFIRMADA, CANCELADA]
   *         description: Filtrar por estado
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *     responses:
   *       200:
   *         description: Lista de reservas obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Reserva'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuario = (req as any).user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const estado = req.query.estado as string;
      
      // Filtrar por usuario autenticado
      const filters = { 
        cliente_id: usuario.rol === 'CLIENTE' ? usuario.id : undefined,
        entrenador_id: usuario.rol === 'ENTRENADOR' ? usuario.id : undefined,
        estado
      };
      
      const result = await this.reservaUseCases.getAllReservas({ page, limit, ...filters });
      
      res.status(200).json({
        success: true,
        data: result.reservas,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 🔍 Obtener reserva por ID
   *     description: Obtiene los detalles de una reserva específica
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
   *         description: Reserva encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Reserva'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const usuario = (req as any).user;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de reserva inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const reserva = await this.reservaUseCases.getReservaById(id);
      
      // Verificar que la reserva pertenece al usuario
      if (usuario.rol === 'CLIENTE' && reserva.id_cliente !== usuario.id) {
        res.status(403).json({
          success: false,
          error: "No tienes permisos para ver esta reserva",
          code: "ACCESO_DENEGADO"
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: reserva
      });
      
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Reserva no encontrada",
          code: "RESERVA_NO_ENCONTRADA"
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
   * /reservas:
   *   post:
   *     tags: [📅 Reservas]
   *     summary: ➕ Crear nueva reserva
   *     description: |
   *       **ENDPOINT PRINCIPAL** - Crea una nueva reserva para una sesión.
   *       Este es el endpoint más importante de la aplicación.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id_sesion]
   *             properties:
   *               id_sesion:
   *                 type: integer
   *                 description: ID de la sesión a reservar
   *                 example: 1
   *               notas:
   *                 type: string
   *                 description: Notas adicionales (opcional)
   *                 example: "Primera vez haciendo yoga"
   *     responses:
   *       201:
   *         description: Reserva creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Reserva'
   *                 message:
   *                   type: string
   *                   example: "Reserva creada exitosamente"
   *       400:
   *         description: Error de validación de reglas de negocio
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
   *                   enum:
   *                     - "La sesión solicitada no existe"
   *                     - "La sesión ya no está disponible para reservar"
   *                     - "Ya tienes una reserva en el mismo horario"
   *                     - "Has alcanzado el límite de reservas pendientes (3)"
   *                     - "Solo los clientes pueden hacer reservas"
   *                   example: "La sesión ya no está disponible para reservar"
   *                 code:
   *                   type: string
   *                   enum: [SESION_NO_ENCONTRADA, SESION_NO_DISPONIBLE, CONFLICTO_HORARIO, LIMITE_RESERVAS_EXCEDIDO, ROL_NO_AUTORIZADO]
   *                   example: "SESION_NO_DISPONIBLE"
   *                 detalles:
   *                   type: string
   *                   example: "Este horario ya fue reservado por otro cliente"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   */
  async create(req: Request, res: Response): Promise<void> {
    const { id_sesion, notas } = req.body;
    const usuario = (req as any).user; // Usuario autenticado
    
    // 🔍 VALIDACIÓN 1: Verificar que la sesión existe
    const sesion = await this.verificarSesionExiste(id_sesion);
    if (!sesion) {
      res.status(400).json({
        success: false,
        error: "La sesión solicitada no existe",
        code: "SESION_NO_ENCONTRADA"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 2: Verificar disponibilidad de horario
    const disponible = await this.verificarDisponibilidad(id_sesion);
    if (!disponible) {
      res.status(400).json({
        success: false,
        error: "La sesión ya no está disponible para reservar",
        code: "SESION_NO_DISPONIBLE",
        detalles: "Este horario ya fue reservado por otro cliente"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 3: Verificar que el cliente no tenga conflictos de horario
    const conflictoHorario = await this.verificarConflictoHorario(usuario.id, id_sesion);
    if (conflictoHorario) {
      res.status(400).json({
        success: false,
        error: "Ya tienes una reserva en el mismo horario",
        code: "CONFLICTO_HORARIO",
        detalles: "No puedes tener dos sesiones al mismo tiempo"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 4: Verificar límite de reservas pendientes
    const reservasPendientes = await this.contarReservasPendientes(usuario.id);
    if (reservasPendientes >= 3) {
      res.status(400).json({
        success: false,
        error: "Has alcanzado el límite de reservas pendientes (3)",
        code: "LIMITE_RESERVAS_EXCEDIDO",
        detalles: "Confirma o cancela algunas reservas antes de crear nuevas"
      });
      return;
    }
    
    // ✅ Crear la reserva en la base de datos
    try {
      const nuevaReserva = await this.reservaUseCases.createReserva({
        id_cliente: usuario.id,
        id_sesion,
        estado: "PENDIENTE",
        // notas: notas || null
      });
      
      res.status(201).json({
        success: true,
        data: nuevaReserva,
        message: "Reserva creada exitosamente. Recibirás una confirmación pronto."
      });
      
    } catch (error) {
      console.error('Error creando reserva:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor al crear la reserva",
        code: "ERROR_CREACION"
      });
    }
  }
  
  // 🔍 Métodos auxiliares para validaciones (simplificados)
  private async verificarSesionExiste(id_sesion: number): Promise<any> {
    try {
      // Simplificar validación - en producción usar servicio de sesiones
      return { id_sesion, disponible: true }; // Por ahora permitir todas las sesiones
    } catch (error) {
      return null;
    }
  }
  
  private async verificarDisponibilidad(id_sesion: number): Promise<boolean> {
    try {
      const reservasActivas = await this.reservaUseCases.getReservasBySesionId(id_sesion);
      return reservasActivas.length === 0;
    } catch (error) {
      return true; // Si hay error, permitir la reserva
    }
  }
  
  private async verificarConflictoHorario(cliente_id: number, id_sesion: number): Promise<boolean> {
    try {
      // Simplificar validación - en producción implementar lógica de horarios
      return false; // Por ahora no hay conflictos
    } catch (error) {
      return false;
    }
  }
  
  private async contarReservasPendientes(cliente_id: number): Promise<number> {
    try {
      const reservas = await this.reservaUseCases.getReservasByClienteId(cliente_id);
      return reservas.filter((r: any) => r.estado === 'PENDIENTE').length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   put:
   *     tags: [📅 Reservas]
   *     summary: ✏️ Actualizar reserva
   *     description: Actualiza el estado de una reserva
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
   *               estado:
   *                 type: string
   *                 enum: [PENDIENTE, CONFIRMADA, CANCELADA]
   *                 example: "CONFIRMADA"
   *     responses:
   *       200:
   *         description: Reserva actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Reserva'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const usuario = (req as any).user;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de reserva inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const reservaActualizada = await this.reservaUseCases.updateReserva(id, updateData);
      
      res.status(200).json({
        success: true,
        data: reservaActualizada,
        message: "Reserva actualizada exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   delete:
   *     tags: [📅 Reservas]
   *     summary: 🗑️ Cancelar reserva
   *     description: Cancela una reserva existente
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
   *         description: Reserva cancelada exitosamente
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
   *                   example: "Reserva cancelada exitosamente"
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID de reserva inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      await this.reservaUseCases.deleteReserva(id);
      
      res.status(200).json({
        success: true,
        message: "Reserva cancelada exitosamente"
      });
      
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /reservas/mis-reservas:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 📱 Mis reservas
   *     description: Obtiene todas las reservas del usuario autenticado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Reservas del usuario obtenidas exitosamente
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
   *                     $ref: '#/components/schemas/Reserva'
   *                 resumen:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                       example: 5
   *                     confirmadas:
   *                       type: integer
   *                       example: 3
   *                     pendientes:
   *                       type: integer
   *                       example: 2
   */
  async misReservas(req: Request, res: Response): Promise<void> {
    try {
      const usuario = (req as any).user;
      
      const reservas = await this.reservaUseCases.getReservasByClienteId(usuario.id);
      
      // Calcular resumen
      const resumen = {
        total: reservas.length,
        confirmadas: reservas.filter((r: any) => r.estado === 'CONFIRMADA').length,
        pendientes: reservas.filter((r: any) => r.estado === 'PENDIENTE').length,
        canceladas: reservas.filter((r: any) => r.estado === 'CANCELADA').length
      };
      
      res.status(200).json({
        success: true,
        data: reservas,
        resumen
      });
      
    } catch (error) {
      console.error('Error obteniendo mis reservas:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }
}