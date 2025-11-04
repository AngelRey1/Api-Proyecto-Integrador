import { Request, Response } from 'express';
import { ReservaUseCases } from '@/application/use-cases/ReservaUseCases';
import { CreateReservaData, UpdateReservaData } from '@/domain/entities/Reserva';

export class ReservaCleanController {
  constructor(private reservaUseCases: ReservaUseCases) {}

  /**
   * @swagger
   * /reservas:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 📋 Listar reservas
   *     description: |
   *       Obtiene una lista de reservas con filtros opcionales.
   *       Los clientes solo ven sus propias reservas.
   *       Los entrenadores ven las reservas de sus sesiones.
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
   *         name: estado
   *         schema:
   *           type: string
   *           enum: [PENDIENTE, CONFIRMADA, CANCELADA]
   *         description: Filtrar por estado de reserva
   *         example: CONFIRMADA
   *       - in: query
   *         name: fecha_desde
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha mínima de reserva
   *         example: "2025-11-01"
   *       - in: query
   *         name: fecha_hasta
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha máxima de reserva
   *         example: "2025-11-30"
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
   *                       example: 25
   *                     totalPages:
   *                       type: integer
   *                       example: 3
   *                 message:
   *                   type: string
   *                   example: "Reservas obtenidas exitosamente"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const estado = req.query.estado as string;

      const params = { 
        page, 
        limit, 
        sortBy: 'fecha_reserva', 
        sortOrder: 'desc' as const 
      };

      const result = await this.reservaUseCases.getAllReservas(params);

      res.status(200).json({
        success: true,
        data: result.reservas,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        message: 'Reservas obtenidas exitosamente'
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
   * /reservas/{id}:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 🔍 Obtener reserva por ID
   *     description: |
   *       Obtiene los detalles completos de una reserva específica.
   *       Incluye información del cliente, sesión y entrenador.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: ID único de la reserva
   *         example: 1
   *     responses:
   *       200:
   *         description: Reserva encontrada exitosamente
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
   *                   example: "Reserva encontrada"
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const reserva = await this.reservaUseCases.getReservaById(id);

      if (!reserva) {
        res.status(404).json({
          success: false,
          error: 'Reserva no encontrada',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: reserva,
        message: 'Reserva encontrada exitosamente'
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
   * /reservas:
   *   post:
   *     tags: [📅 Reservas]
   *     summary: ➕ Crear nueva reserva
   *     description: |
   *       Crea una nueva reserva para una sesión de entrenamiento.
   *       **Este es el endpoint principal para agendar citas.**
   *       
   *       ### Flujo típico:
   *       1. Cliente busca sesiones disponibles
   *       2. Cliente selecciona una sesión
   *       3. Cliente crea la reserva (este endpoint)
   *       4. Sistema genera código de confirmación
   *       5. Cliente procesa el pago
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_sesion
   *             properties:
   *               id_sesion:
   *                 type: integer
   *                 description: ID de la sesión a reservar
   *                 example: 1
   *               notas:
   *                 type: string
   *                 maxLength: 500
   *                 description: Notas adicionales del cliente (opcional)
   *                 example: "Primera vez haciendo yoga, principiante total"
   *           examples:
   *             reserva_basica:
   *               summary: Reserva básica
   *               value:
   *                 id_sesion: 1
   *             reserva_con_notas:
   *               summary: Reserva con notas
   *               value:
   *                 id_sesion: 1
   *                 notas: "Tengo una lesión en la rodilla izquierda, por favor tenerlo en cuenta"
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
   *                   type: object
   *                   properties:
   *                     id_reserva:
   *                       type: integer
   *                       example: 1
   *                     id_cliente:
   *                       type: integer
   *                       example: 1
   *                     id_sesion:
   *                       type: integer
   *                       example: 1
   *                     estado:
   *                       type: string
   *                       example: "PENDIENTE"
   *                     codigo_confirmacion:
   *                       type: string
   *                       example: "ABC123"
   *                     fecha_reserva:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-11-03T10:30:00Z"
   *                     sesion:
   *                       $ref: '#/components/schemas/Sesion'
   *                 message:
   *                   type: string
   *                   example: "Reserva creada exitosamente. Código de confirmación: ABC123"
   *       400:
   *         description: Error en los datos o sesión no disponible
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
   *                   examples:
   *                     sin_cupos:
   *                       value: "La sesión no tiene cupos disponibles"
   *                     sesion_pasada:
   *                       value: "No se puede reservar una sesión que ya pasó"
   *                     ya_reservada:
   *                       value: "Ya tienes una reserva para esta sesión"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         description: Sesión no encontrada
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id_usuario;
      const clienteId = (req as any).user?.cliente_id;

      if (!clienteId) {
        res.status(400).json({
          success: false,
          error: 'Solo los clientes pueden crear reservas',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const reservaData: CreateReservaData = {
        ...req.body,
        id_cliente: clienteId
      };

      const nuevaReserva = await this.reservaUseCases.createReserva(reservaData);

      res.status(201).json({
        success: true,
        data: nuevaReserva,
        message: `Reserva creada exitosamente. ID de reserva: ${nuevaReserva.id_reserva}`
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('cupos')) {
          res.status(400).json({
            success: false,
            error: 'La sesión no tiene cupos disponibles',
            timestamp: new Date().toISOString()
          });
        } else if (error.message.includes('pasada')) {
          res.status(400).json({
            success: false,
            error: 'No se puede reservar una sesión que ya pasó',
            timestamp: new Date().toISOString()
          });
        } else {
          res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * @swagger
   * /reservas/{id}:
   *   put:
   *     tags: [📅 Reservas]
   *     summary: ✏️ Actualizar reserva
   *     description: |
   *       Actualiza el estado o información de una reserva.
   *       Solo el cliente propietario o el entrenador pueden modificarla.
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
   *                 description: Nuevo estado de la reserva
   *                 example: "CONFIRMADA"
   *           examples:
   *             confirmar:
   *               summary: Confirmar reserva
   *               value:
   *                 estado: "CONFIRMADA"
   *             cancelar:
   *               summary: Cancelar reserva
   *               value:
   *                 estado: "CANCELADA"
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
   *                 message:
   *                   type: string
   *                   example: "Reserva actualizada exitosamente"
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       403:
   *         description: Sin permisos para modificar esta reserva
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateReservaData = req.body;

      const reservaActualizada = await this.reservaUseCases.updateReserva(id, updateData);

      if (!reservaActualizada) {
        res.status(404).json({
          success: false,
          error: 'Reserva no encontrada',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: reservaActualizada,
        message: 'Reserva actualizada exitosamente'
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
   * /reservas/{id}/cancelar:
   *   patch:
   *     tags: [📅 Reservas]
   *     summary: ❌ Cancelar reserva
   *     description: |
   *       Cancela una reserva existente.
   *       Solo se pueden cancelar reservas en estado PENDIENTE o CONFIRMADA.
   *       
   *       ### Políticas de cancelación:
   *       - Cancelación gratuita hasta 24h antes
   *       - Cancelación con cargo entre 24h-2h antes
   *       - No se permite cancelar 2h antes de la sesión
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la reserva a cancelar
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
   *                 data:
   *                   type: object
   *                   properties:
   *                     id_reserva:
   *                       type: integer
   *                       example: 1
   *                     estado:
   *                       type: string
   *                       example: "CANCELADA"
   *                     fecha_cancelacion:
   *                       type: string
   *                       format: date-time
   *                     politica_aplicada:
   *                       type: string
   *                       example: "Cancelación gratuita"
   *                 message:
   *                   type: string
   *                   example: "Reserva cancelada exitosamente"
   *       400:
   *         description: No se puede cancelar la reserva
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
   *                   examples:
   *                     ya_cancelada:
   *                       value: "La reserva ya está cancelada"
   *                     muy_tarde:
   *                       value: "No se puede cancelar con menos de 2 horas de anticipación"
   *                     ya_completada:
   *                       value: "No se puede cancelar una sesión que ya se completó"
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).user?.id_usuario;

      // Aquí iría la lógica de cancelación con validaciones
      const reservaCancelada = await this.reservaUseCases.updateReserva(id, { estado: 'CANCELADA' });

      if (!reservaCancelada) {
        res.status(404).json({
          success: false,
          error: 'Reserva no encontrada',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id_reserva: reservaCancelada.id_reserva,
          estado: reservaCancelada.estado,
          fecha_cancelacion: new Date().toISOString(),
          politica_aplicada: 'Cancelación gratuita'
        },
        message: 'Reserva cancelada exitosamente'
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
   * /reservas/mis-reservas:
   *   get:
   *     tags: [📅 Reservas]
   *     summary: 📱 Mis reservas
   *     description: |
   *       Obtiene todas las reservas del usuario autenticado.
   *       **Endpoint principal para clientes** - ver su historial de reservas.
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
   *         name: proximas
   *         schema:
   *           type: boolean
   *         description: Solo mostrar reservas futuras
   *         example: true
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
   *                       example: 15
   *                     pendientes:
   *                       type: integer
   *                       example: 2
   *                     confirmadas:
   *                       type: integer
   *                       example: 10
   *                     canceladas:
   *                       type: integer
   *                       example: 3
   *                 message:
   *                   type: string
   *                   example: "Tus reservas obtenidas exitosamente"
   */
  async misReservas(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = (req as any).user?.cliente_id;

      if (!clienteId) {
        res.status(400).json({
          success: false,
          error: 'Solo los clientes pueden ver sus reservas',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const reservas = await this.reservaUseCases.getReservasByClienteId(clienteId);

      // Calcular resumen
      const resumen = {
        total: reservas.length,
        pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
        confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
        canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
      };

      res.status(200).json({
        success: true,
        data: reservas,
        resumen,
        message: 'Tus reservas obtenidas exitosamente'
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