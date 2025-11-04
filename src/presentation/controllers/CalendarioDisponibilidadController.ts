import { Request, Response } from 'express';
import { CalendarioDisponibilidadUseCases } from '@/application/use-cases/CalendarioDisponibilidadUseCases';
import { CreateCalendarioDisponibilidadData, UpdateCalendarioDisponibilidadData } from '@/domain/entities/CalendarioDisponibilidad';
import { PaginationParams } from '@/shared/types/api';

export class CalendarioDisponibilidadController {
  constructor(private calendarioUseCases: CalendarioDisponibilidadUseCases) {}

  /**
   * @swagger
   * /disponibilidad:
   *   get:
   *     tags: [📅 Disponibilidad y Horarios]
   *     summary: 📅 Listar disponibilidad de entrenadores
   *     description: Obtiene la disponibilidad de todos los entrenadores
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Disponibilidad obtenida exitosamente
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.calendarioUseCases.getAllDisponibilidades(params);
      
      res.status(200).json({
        success: true,
        data: result.disponibilidades,
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
        message: 'Error fetching disponibilidades',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const disponibilidad = await this.calendarioUseCases.getDisponibilidadById(id);
      
      if (!disponibilidad) {
        res.status(404).json({
          success: false,
          message: 'Disponibilidad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: disponibilidad,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching disponibilidad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByEntrenador(req: Request, res: Response): Promise<void> {
    try {
      const entrenadorId = parseInt(req.params.entrenadorId);
      const disponibilidades = await this.calendarioUseCases.getDisponibilidadesByEntrenador(entrenadorId);
      
      res.status(200).json({
        success: true,
        data: disponibilidades,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching disponibilidades by entrenador',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByFecha(req: Request, res: Response): Promise<void> {
    try {
      const fecha = new Date(req.params.fecha);
      const disponibilidades = await this.calendarioUseCases.getDisponibilidadesByFecha(fecha);
      
      res.status(200).json({
        success: true,
        data: disponibilidades,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching disponibilidades by fecha',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /disponibilidad:
   *   post:
   *     tags: [📅 Disponibilidad y Horarios]
   *     summary: 📅 Crear nueva disponibilidad
   *     description: |
   *       Permite a un entrenador establecer su disponibilidad para una fecha específica.
   *       **Uso típico:** Entrenador configura sus horarios disponibles.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_entrenador
   *               - fecha
   *               - hora_inicio
   *               - hora_fin
   *             properties:
   *               id_entrenador:
   *                 type: integer
   *                 example: 1
   *               fecha:
   *                 type: string
   *                 format: date
   *                 example: "2025-11-05"
   *               hora_inicio:
   *                 type: string
   *                 format: time
   *                 example: "08:00"
   *               hora_fin:
   *                 type: string
   *                 format: time
   *                 example: "18:00"
   *               disponible:
   *                 type: boolean
   *                 default: true
   *     responses:
   *       201:
   *         description: Disponibilidad creada exitosamente
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCalendarioDisponibilidadData = req.body;
      const disponibilidad = await this.calendarioUseCases.createDisponibilidad(data);
      
      res.status(201).json({
        success: true,
        data: disponibilidad,
        message: 'Disponibilidad created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating disponibilidad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCalendarioDisponibilidadData = req.body;
      
      const disponibilidad = await this.calendarioUseCases.updateDisponibilidad(id, data);
      
      if (!disponibilidad) {
        res.status(404).json({
          success: false,
          message: 'Disponibilidad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: disponibilidad,
        message: 'Disponibilidad updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating disponibilidad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.calendarioUseCases.deleteDisponibilidad(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Disponibilidad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Disponibilidad deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting disponibilidad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}