import { Request, Response } from 'express';
import { DeporteUseCases } from '@/application/use-cases/DeporteUseCases';
import { SupabaseDeporteRepository } from '@/infrastructure/repositories/SupabaseDeporteRepository';

export class DeporteFinalController {
  private deporteUseCases: DeporteUseCases;

  constructor() {
    const repository = new SupabaseDeporteRepository();
    this.deporteUseCases = new DeporteUseCases(repository);
  }

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
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.deporteUseCases.getAllDeportes({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result.deportes,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo deportes:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
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
      
      const deporte = await this.deporteUseCases.getDeporteById(id);
      
      res.status(200).json({
        success: true,
        data: deporte
      });
      
    } catch (error) {
      console.error('Error obteniendo deporte:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Deporte no encontrado",
          code: "DEPORTE_NO_ENCONTRADO"
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
    try {
      const data = req.body;
      
      const nuevoDeporte = await this.deporteUseCases.createDeporte(data);
      
      res.status(201).json({
        success: true,
        data: nuevoDeporte,
        message: "Deporte creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando deporte:', error);
      const message = (error as Error).message;
      
      res.status(400).json({
        success: false,
        error: message || "Error creando deporte",
        code: "ERROR_CREACION"
      });
    }
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
      
      const deporteActualizado = await this.deporteUseCases.updateDeporte(id, data);
      
      res.status(200).json({
        success: true,
        data: deporteActualizado,
        message: "Deporte actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando deporte:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Deporte no encontrado",
          code: "DEPORTE_NO_ENCONTRADO"
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
      
      await this.deporteUseCases.deleteDeporte(id);
      
      res.status(200).json({
        success: true,
        message: "Deporte eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando deporte:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Deporte no encontrado",
          code: "DEPORTE_NO_ENCONTRADO"
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