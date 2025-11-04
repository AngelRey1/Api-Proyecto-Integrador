import { Request, Response } from 'express';

export class ReseñaFinalController {

  /**
   * @swagger
   * /reseñas:
   *   get:
   *     tags: [⭐ Reseñas]
   *     summary: 📋 Listar reseñas
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de reseñas
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
   *                     $ref: '#/components/schemas/Reseña'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: [
        { id_reseña: 1, id_reserva: 1, calificacion: 5, comentario: "Excelente sesión" },
        { id_reseña: 2, id_reserva: 2, calificacion: 4, comentario: "Muy buena experiencia" }
      ]
    });
    return;
  }

  /**
   * @swagger
   * /reseñas:
   *   post:
   *     tags: [⭐ Reseñas]
   *     summary: ⭐ Crear reseña
   *     description: |
   *       Crea una reseña después de completar una sesión.
   *       **Se ejecuta al final del flujo principal.**
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id_reserva, calificacion]
   *             properties:
   *               id_reserva:
   *                 type: integer
   *                 example: 1
   *               calificacion:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *                 example: 5
   *               comentario:
   *                 type: string
   *                 example: "Excelente sesión, muy profesional"
   *     responses:
   *       201:
   *         description: Reseña creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Reseña'
   *                 message:
   *                   type: string
   *                   example: "Reseña creada exitosamente"
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
   *                     - "No puedes dejar una reseña hasta que la sesión esté completada"
   *                     - "Ya has dejado una reseña para esta sesión"
   *                     - "Solo los clientes pueden crear reseñas"
   *                   example: "No puedes dejar una reseña hasta que la sesión esté completada"
   *                 code:
   *                   type: string
   *                   enum: [RESERVA_INVALIDA, SESION_NO_COMPLETADA, RESENA_DUPLICADA, ROL_NO_AUTORIZADO]
   *                   example: "SESION_NO_COMPLETADA"
   *                 detalles:
   *                   type: string
   *                   example: "Solo puedes reseñar sesiones que hayas completado"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   */
  async create(req: Request, res: Response): Promise<void> {
    const { id_reserva, calificacion, comentario } = req.body;
    const usuario = (req as any).user; // Usuario autenticado
    
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
    
    // 🔍 VALIDACIÓN 2: Verificar que la sesión ya fue completada
    const sesionCompletada = await this.verificarSesionCompletada(id_reserva);
    if (!sesionCompletada) {
      res.status(400).json({
        success: false,
        error: "No puedes dejar una reseña hasta que la sesión esté completada",
        code: "SESION_NO_COMPLETADA"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 3: Verificar que no haya dejado ya una reseña para esta reserva
    const reseñaExistente = await this.verificarReseñaExistente(id_reserva);
    if (reseñaExistente) {
      res.status(400).json({
        success: false,
        error: "Ya has dejado una reseña para esta sesión",
        code: "RESENA_DUPLICADA"
      });
      return;
    }
    
    // ✅ Crear la reseña
    res.status(201).json({
      success: true,
      data: { 
        id_reseña: 3, 
        id_reserva, 
        calificacion, 
        comentario: comentario || "Sin comentarios",
        fecha_creacion: new Date().toISOString(),
        cliente_id: usuario.id
      },
      message: "Reseña creada exitosamente"
    });
    return;
  }
  
  // 🔍 Métodos auxiliares para validaciones
  private async verificarReservaExiste(id_reserva: number, cliente_id: number): Promise<boolean> {
    // En producción: SELECT * FROM reservas WHERE id_reserva = ? AND cliente_id = ?
    console.log(`🔍 Verificando reserva ${id_reserva} para cliente ${cliente_id}`);
    return true; // Mock: simular que la reserva existe
  }
  
  private async verificarSesionCompletada(id_reserva: number): Promise<boolean> {
    // En producción: SELECT estado FROM sesiones WHERE reserva_id = ?
    console.log(`🔍 Verificando si sesión de reserva ${id_reserva} está completada`);
    return true; // Mock: simular que la sesión está completada
  }
  
  private async verificarReseñaExistente(id_reserva: number): Promise<boolean> {
    // En producción: SELECT COUNT(*) FROM reseñas WHERE id_reserva = ?
    console.log(`🔍 Verificando si ya existe reseña para reserva ${id_reserva}`);
    return false; // Mock: simular que no hay reseña duplicada
  }

  /**
   * @swagger
   * /reseñas/{id}:
   *   get:
   *     tags: [⭐ Reseñas]
   *     summary: 🔍 Obtener reseña por ID
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
   *         description: Reseña encontrada
   */
  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_reseña: 1, id_reserva: 1, calificacion: 5, comentario: "Excelente sesión" }
    });
    return;
  }

  /**
   * @swagger
   * /reseñas/{id}:
   *   put:
   *     tags: [⭐ Reseñas]
   *     summary: ✏️ Actualizar reseña
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
   *               calificacion:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *                 example: 4
   *               comentario:
   *                 type: string
   *                 example: "Buena sesión, mejorable"
   *     responses:
   *       200:
   *         description: Reseña actualizada exitosamente
   */
  async update(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_reseña: 1, calificacion: 4, comentario: "Buena sesión, mejorable" }
    });
    return;
  }
}