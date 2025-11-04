import { Request, Response } from 'express';

export class DeporteFinalController {

  /**
   * @swagger
   * /deportes:
   *   get:
   *     tags: [🏆 Deportes]
   *     summary: 📋 Listar deportes
   *     description: Obtiene el catálogo completo de deportes disponibles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de deportes obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Deporte'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: [
        { id_deporte: 1, nombre: "Yoga", descripcion: "Disciplina física y mental", nivel: "PRINCIPIANTE" },
        { id_deporte: 2, nombre: "CrossFit", descripcion: "Entrenamiento funcional de alta intensidad", nivel: "AVANZADO" },
        { id_deporte: 3, nombre: "Pilates", descripcion: "Fortalecimiento del core y flexibilidad", nivel: "INTERMEDIO" }
      ]
    });
  }

  /**
   * @swagger
   * /deportes/{id}:
   *   get:
   *     tags: [🏆 Deportes]
   *     summary: 🔍 Obtener deporte por ID
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
   *         description: Deporte encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Deporte'
   */
  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_deporte: 1, nombre: "Yoga", descripcion: "Disciplina física y mental", nivel: "PRINCIPIANTE" }
    });
  }

  /**
   * @swagger
   * /deportes:
   *   post:
   *     tags: [🏆 Deportes]
   *     summary: ➕ Crear deporte
   *     description: Agrega un nuevo deporte al catálogo (solo administradores)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [nombre, nivel]
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: "Natación"
   *               descripcion:
   *                 type: string
   *                 example: "Deporte acuático completo"
   *               nivel:
   *                 type: string
   *                 enum: [PRINCIPIANTE, INTERMEDIO, AVANZADO]
   *                 example: "INTERMEDIO"
   *     responses:
   *       201:
   *         description: Deporte creado exitosamente
   */
  async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({
      success: true,
      data: { id_deporte: 4, nombre: "Natación", descripcion: "Deporte acuático completo", nivel: "INTERMEDIO" }
    });
  }

  /**
   * @swagger
   * /deportes/{id}:
   *   put:
   *     tags: [🏆 Deportes]
   *     summary: ✏️ Actualizar deporte
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
   *               nombre:
   *                 type: string
   *                 example: "Hatha Yoga"
   *               descripcion:
   *                 type: string
   *                 example: "Yoga tradicional con posturas estáticas"
   *               nivel:
   *                 type: string
   *                 enum: [PRINCIPIANTE, INTERMEDIO, AVANZADO]
   *                 example: "PRINCIPIANTE"
   *     responses:
   *       200:
   *         description: Deporte actualizado exitosamente
   */
  async update(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: { id_deporte: 1, nombre: "Hatha Yoga", descripcion: "Yoga tradicional con posturas estáticas", nivel: "PRINCIPIANTE" }
    });
  }

  /**
   * @swagger
   * /deportes/{id}:
   *   delete:
   *     tags: [🏆 Deportes]
   *     summary: 🗑️ Eliminar deporte
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
   *         description: Deporte eliminado exitosamente
   */
  async delete(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Deporte eliminado exitosamente"
    });
  }
}