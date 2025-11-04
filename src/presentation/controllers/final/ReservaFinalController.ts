import { Request, Response } from 'express';

export class ReservaFinalController {

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
    res.status(200).json({
      success: true,
      data: [
        { id_reserva: 1, id_cliente: 1, id_sesion: 1, estado: "CONFIRMADA", fecha_reserva: "2025-11-04T10:00:00Z" },
        { id_reserva: 2, id_cliente: 1, id_sesion: 2, estado: "PENDIENTE", fecha_reserva: "2025-11-05T14:00:00Z" }
      ]
    });
    return;
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
    res.status(200).json({
      success: true,
      data: { id_reserva: 1, id_cliente: 1, id_sesion: 1, estado: "CONFIRMADA", fecha_reserva: "2025-11-04T10:00:00Z" }
    });
    return;
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
    
    // ✅ Crear la reserva
    const nuevaReserva = {
      id_reserva: Math.floor(Math.random() * 1000) + 100,
      id_cliente: usuario.id,
      id_sesion,
      estado: "PENDIENTE",
      fecha_reserva: new Date().toISOString(),
      notas: notas || null,
      fecha_creacion: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      data: nuevaReserva,
      message: "Reserva creada exitosamente. Recibirás una confirmación pronto."
    });
    return;
  }
  
  // 🔍 Métodos auxiliares para validaciones
  private async verificarSesionExiste(id_sesion: number): Promise<any> {
    // En producción: SELECT * FROM sesiones WHERE id_sesion = ? AND activa = true
    console.log(`🔍 Verificando existencia de sesión ${id_sesion}`);
    return { id_sesion, entrenador_id: 2, fecha: "2025-11-05T10:00:00Z" }; // Mock
  }
  
  private async verificarDisponibilidad(id_sesion: number): Promise<boolean> {
    // En producción: 
    // SELECT COUNT(*) FROM reservas 
    // WHERE id_sesion = ? AND estado IN ('PENDIENTE', 'CONFIRMADA')
    console.log(`🔍 Verificando disponibilidad de sesión ${id_sesion}`);
    return true; // Mock: simular que está disponible
  }
  
  private async verificarConflictoHorario(cliente_id: number, id_sesion: number): Promise<boolean> {
    // En producción:
    // SELECT COUNT(*) FROM reservas r 
    // JOIN sesiones s1 ON r.id_sesion = s1.id_sesion 
    // JOIN sesiones s2 ON s2.id_sesion = ?
    // WHERE r.id_cliente = ? AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
    // AND s1.fecha_inicio < s2.fecha_fin AND s1.fecha_fin > s2.fecha_inicio
    console.log(`🔍 Verificando conflictos de horario para cliente ${cliente_id} y sesión ${id_sesion}`);
    return false; // Mock: simular que no hay conflictos
  }
  
  private async contarReservasPendientes(cliente_id: number): Promise<number> {
    // En producción: SELECT COUNT(*) FROM reservas WHERE id_cliente = ? AND estado = 'PENDIENTE'
    console.log(`🔍 Contando reservas pendientes para cliente ${cliente_id}`);
    return 1; // Mock: simular que tiene 1 reserva pendiente
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
    res.status(200).json({
      success: true,
      data: { id_reserva: 1, id_cliente: 1, id_sesion: 1, estado: "CONFIRMADA", fecha_reserva: "2025-11-04T10:00:00Z" }
    });
    return;
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
    res.status(200).json({
      success: true,
      message: "Reserva cancelada exitosamente"
    });
    return;
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
    res.status(200).json({
      success: true,
      data: [
        { id_reserva: 1, estado: "CONFIRMADA", fecha_reserva: "2025-11-04T10:00:00Z" },
        { id_reserva: 2, estado: "PENDIENTE", fecha_reserva: "2025-11-05T14:00:00Z" }
      ],
      resumen: { total: 2, confirmadas: 1, pendientes: 1 }
    });
    return;
  }
}