import { Request, Response } from 'express';
import { EntrenadorDeporteUseCases } from '@/application/use-cases/EntrenadorDeporteUseCases';
import { CreateEntrenadorDeporteData } from '@/domain/entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';

export class EntrenadorDeporteController {
  constructor(private entrenadorDeporteUseCases: EntrenadorDeporteUseCases) {}

  /**
   * @swagger
   * /especialidades:
   *   get:
   *     tags: [🏆 Especialidades de Entrenadores]
   *     summary: 🏆 Listar todas las especialidades de entrenadores
   *     description: Obtiene todas las relaciones entre entrenadores y deportes con paginación
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Elementos por página
   *     responses:
   *       200:
   *         description: Lista de especialidades obtenida exitosamente
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
   *                     $ref: '#/components/schemas/EntrenadorDeporte'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     total:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.entrenadorDeporteUseCases.getAllEntrenadorDeportes(params);
      
      res.status(200).json({
        success: true,
        data: result.entrenadorDeportes,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / (params.limit || 10)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching entrenador deportes',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /especialidades/entrenador/{entrenadorId}:
   *   get:
   *     tags: [🏆 Especialidades de Entrenadores]
   *     summary: 🏆 Obtener deportes de un entrenador
   *     description: Lista todos los deportes que puede entrenar un entrenador específico
   *     parameters:
   *       - in: path
   *         name: entrenadorId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del entrenador
   *     responses:
   *       200:
   *         description: Deportes del entrenador obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/EntrenadorDeporte'
   */
  async getDeportesByEntrenador(req: Request, res: Response): Promise<void> {
    try {
      const entrenadorId = parseInt(req.params.entrenadorId);
      const deportes = await this.entrenadorDeporteUseCases.getDeportesByEntrenador(entrenadorId);
      
      res.status(200).json({
        success: true,
        data: deportes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching deportes by entrenador',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getEntrenadoresByDeporte(req: Request, res: Response): Promise<void> {
    try {
      const deporteId = parseInt(req.params.deporteId);
      const entrenadores = await this.entrenadorDeporteUseCases.getEntrenadoresByDeporte(deporteId);
      
      res.status(200).json({
        success: true,
        data: entrenadores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching entrenadores by deporte',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /especialidades:
   *   post:
   *     tags: [🏆 Especialidades de Entrenadores]
   *     summary: 🏆 Asignar deporte a entrenador
   *     description: Crea una nueva especialidad deportiva para un entrenador
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEntrenadorDeporte'
   *           example:
   *             id_entrenador: 1
   *             id_deporte: 2
   *     responses:
   *       201:
   *         description: Especialidad asignada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/EntrenadorDeporte'
   *                 message:
   *                   type: string
   *                   example: "Deporte assigned to entrenador successfully"
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateEntrenadorDeporteData = req.body;
      const entrenadorDeporte = await this.entrenadorDeporteUseCases.assignDeporteToEntrenador(data);
      
      res.status(201).json({
        success: true,
        data: entrenadorDeporte,
        message: 'Deporte assigned to entrenador successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error assigning deporte to entrenador',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const entrenadorId = parseInt(req.params.entrenadorId);
      const deporteId = parseInt(req.params.deporteId);
      
      const deleted = await this.entrenadorDeporteUseCases.removeDeporteFromEntrenador(entrenadorId, deporteId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Entrenador deporte relationship not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Deporte removed from entrenador successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing deporte from entrenador',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}