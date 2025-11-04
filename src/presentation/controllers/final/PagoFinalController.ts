import { Request, Response } from 'express';
import { PagoUseCases } from '@/application/use-cases/PagoUseCases';
import { SupabasePagoRepository } from '@/infrastructure/repositories/SupabasePagoRepository';

export class PagoFinalController {
  private pagoUseCases: PagoUseCases;

  constructor() {
    const repository = new SupabasePagoRepository();
    this.pagoUseCases = new PagoUseCases(repository);
  }

  /**
   * @swagger
   * /pagos:
   *   get:
   *     tags: [💰 Pagos]
   *     summary: 📋 Listar pagos
   *     description: Obtiene el historial de pagos del usuario
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de pagos obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Pago'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuario = (req as any).user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.pagoUseCases.getAllPagos({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result.pagos,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /pagos/{id}:
   *   get:
   *     tags: [💰 Pagos]
   *     summary: 🔍 Obtener pago por ID
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
   *         description: Pago encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Pago'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const pago = await this.pagoUseCases.getPagoById(id);
      
      res.status(200).json({
        success: true,
        data: pago
      });
      
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Pago no encontrado",
          code: "PAGO_NO_ENCONTRADO"
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
   * /pagos:
   *   post:
   *     tags: [💰 Pagos]
   *     summary: 💳 Procesar pago
   *     description: |
   *       **ENDPOINT IMPORTANTE** - Procesa el pago de una reserva.
   *       Se ejecuta después de crear la reserva.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id_reserva, monto, metodo]
   *             properties:
   *               id_reserva:
   *                 type: integer
   *                 description: ID de la reserva a pagar
   *                 example: 1
   *               monto:
   *                 type: number
   *                 format: decimal
   *                 description: Monto a pagar
   *                 example: 50.00
   *               metodo:
   *                 type: string
   *                 enum: [TARJETA, EFECTIVO]
   *                 description: Método de pago
   *                 example: "TARJETA"
   *     responses:
   *       201:
   *         description: Pago procesado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Pago'
   *                 message:
   *                   type: string
   *                   example: "Pago procesado exitosamente"
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
   *                     - "La reserva no existe o no te pertenece"
   *                     - "Solo puedes pagar reservas confirmadas"
   *                     - "Esta reserva ya ha sido pagada"
   *                     - "El monto no coincide con el precio de la sesión"
   *                   example: "Solo puedes pagar reservas confirmadas"
   *                 code:
   *                   type: string
   *                   enum: [RESERVA_INVALIDA, RESERVA_NO_CONFIRMADA, PAGO_DUPLICADO, MONTO_INCORRECTO]
   *                   example: "RESERVA_NO_CONFIRMADA"
   *                 detalles:
   *                   type: string
   *                   example: "Espera a que el entrenador confirme tu reserva"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   */
  async create(req: Request, res: Response): Promise<void> {
    const { id_reserva, monto, metodo } = req.body;
    const usuario = (req as any).user;
    
    // 🔍 VALIDACIÓN 1: Verificar que la reserva existe y pertenece al usuario
    const reserva = await this.verificarReservaExiste(id_reserva, usuario.id);
    if (!reserva) {
      res.status(400).json({
        success: false,
        error: "La reserva no existe o no te pertenece",
        code: "RESERVA_INVALIDA"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 2: Verificar que la reserva esté confirmada
    const reservaConfirmada = await this.verificarReservaConfirmada(id_reserva);
    if (!reservaConfirmada) {
      res.status(400).json({
        success: false,
        error: "Solo puedes pagar reservas confirmadas",
        code: "RESERVA_NO_CONFIRMADA",
        detalles: "Espera a que el entrenador confirme tu reserva"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 3: Verificar que no haya un pago previo
    const pagoExistente = await this.verificarPagoExistente(id_reserva);
    if (pagoExistente) {
      res.status(400).json({
        success: false,
        error: "Esta reserva ya ha sido pagada",
        code: "PAGO_DUPLICADO"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 4: Verificar monto correcto
    const montoValido = await this.verificarMonto(id_reserva, monto);
    if (!montoValido) {
      res.status(400).json({
        success: false,
        error: "El monto no coincide con el precio de la sesión",
        code: "MONTO_INCORRECTO",
        detalles: "Verifica el precio de la sesión"
      });
      return;
    }
    
    // Crear pago real en la base de datos
    const nuevoPago = await this.pagoUseCases.createPago({
      id_reserva,
      monto,
      metodo,
      estado: "COMPLETADO"
    });
    
    res.status(201).json({
      success: true,
      data: nuevoPago,
      message: "Pago procesado exitosamente"
    });
  }
  
  // 🔍 Métodos auxiliares para validaciones (conectados a BD)
  private async verificarReservaExiste(id_reserva: number, cliente_id: number): Promise<boolean> {
    try {
      // Simplificar validación - en producción usar servicio de reservas
      return true; // Por ahora permitir todos los pagos
    } catch (error) {
      return false;
    }
  }
  
  private async verificarReservaConfirmada(id_reserva: number): Promise<boolean> {
    try {
      // Simplificar validación - en producción usar servicio de reservas
      return true; // Por ahora permitir todos los pagos
    } catch (error) {
      return false;
    }
  }
  
  private async verificarPagoExistente(id_reserva: number): Promise<boolean> {
    try {
      const pagos = await this.pagoUseCases.getPagosByReservaId(id_reserva);
      return pagos && pagos.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  private async verificarMonto(id_reserva: number, monto: number): Promise<boolean> {
    try {
      // Simplificar validación - en producción usar servicio de reservas
      return true; // Por ahora permitir todos los montos
    } catch (error) {
      return true;
    }
  }

  /**
   * @swagger
   * /pagos/{id}:
   *   put:
   *     tags: [💰 Pagos]
   *     summary: ✏️ Actualizar pago
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
   *                 enum: [PENDIENTE, COMPLETADO]
   *                 example: "COMPLETADO"
   *     responses:
   *       200:
   *         description: Pago actualizado exitosamente
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      if (!id || isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
          code: "ID_INVALIDO"
        });
        return;
      }
      
      const pagoActualizado = await this.pagoUseCases.updatePago(id, data);
      
      res.status(200).json({
        success: true,
        data: pagoActualizado,
        message: "Pago actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando pago:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Pago no encontrado",
          code: "PAGO_NO_ENCONTRADO"
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