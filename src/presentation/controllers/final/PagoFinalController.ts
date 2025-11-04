import { Request, Response } from 'express';

export class PagoFinalController {

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
    res.status(200).json({
      success: true,
      data: [
        { id_pago: 1, id_reserva: 1, monto: 50.00, metodo: "TARJETA", estado: "COMPLETADO" },
        { id_pago: 2, id_reserva: 2, monto: 45.00, metodo: "EFECTIVO", estado: "PENDIENTE" }
      ]
    });
    return;
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
    res.status(200).json({
      success: true,
      data: { id_pago: 1, id_reserva: 1, monto: 50.00, metodo: "TARJETA", estado: "COMPLETADO" }
    });
    return;
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
   *                   $ref: '#/components/schemas/Pago'
   *                 message:
   *                   type: string
   *                   example: "Pago procesado exitosamente"
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
    
    res.status(201).json({
      success: true,
      data: { 
        id_pago: Math.floor(Math.random() * 1000) + 100, 
        id_reserva, 
        monto, 
        metodo, 
        estado: "COMPLETADO",
        fecha_pago: new Date().toISOString()
      },
      message: "Pago procesado exitosamente"
    });
    return;
  }
  
  // 🔍 Métodos auxiliares para validaciones
  private async verificarReservaExiste(id_reserva: number, cliente_id: number): Promise<boolean> {
    console.log(`🔍 Verificando reserva ${id_reserva} para cliente ${cliente_id}`);
    return true; // Mock
  }
  
  private async verificarReservaConfirmada(id_reserva: number): Promise<boolean> {
    console.log(`🔍 Verificando si reserva ${id_reserva} está confirmada`);
    return true; // Mock
  }
  
  private async verificarPagoExistente(id_reserva: number): Promise<boolean> {
    console.log(`🔍 Verificando pagos existentes para reserva ${id_reserva}`);
    return false; // Mock
  }
  
  private async verificarMonto(id_reserva: number, monto: number): Promise<boolean> {
    console.log(`🔍 Verificando monto ${monto} para reserva ${id_reserva}`);
    return true; // Mock
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
    res.status(200).json({
      success: true,
      data: { id_pago: 1, estado: "COMPLETADO" }
    });
    return;
  }
}