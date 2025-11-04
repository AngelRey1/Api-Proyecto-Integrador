import { Request, Response } from 'express';
import { RetroalimentacionAppUseCases } from '@/application/use-cases/RetroalimentacionAppUseCases';
import { CreateRetroalimentacionAppData, UpdateRetroalimentacionAppData } from '@/domain/entities/RetroalimentacionApp';
import { PaginationParams } from '@/shared/types/api';

export class RetroalimentacionAppController {
  constructor(private retroalimentacionUseCases: RetroalimentacionAppUseCases) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.retroalimentacionUseCases.getAllRetroalimentaciones(params);
      
      res.status(200).json({
        success: true,
        data: result.retroalimentaciones,
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
        message: 'Error fetching retroalimentaciones',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const retroalimentacion = await this.retroalimentacionUseCases.getRetroalimentacionById(id);
      
      if (!retroalimentacion) {
        res.status(404).json({
          success: false,
          message: 'Retroalimentacion not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: retroalimentacion,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching retroalimentacion',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const retroalimentaciones = await this.retroalimentacionUseCases.getRetroalimentacionesByUsuario(usuarioId);
      
      res.status(200).json({
        success: true,
        data: retroalimentaciones,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching retroalimentaciones by usuario',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByTipo(req: Request, res: Response): Promise<void> {
    try {
      const tipo = req.params.tipo;
      const retroalimentaciones = await this.retroalimentacionUseCases.getRetroalimentacionesByTipo(tipo);
      
      res.status(200).json({
        success: true,
        data: retroalimentaciones,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching retroalimentaciones by tipo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateRetroalimentacionAppData = req.body;
      const retroalimentacion = await this.retroalimentacionUseCases.createRetroalimentacion(data);
      
      res.status(201).json({
        success: true,
        data: retroalimentacion,
        message: 'Retroalimentacion created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating retroalimentacion',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateRetroalimentacionAppData = req.body;
      
      const retroalimentacion = await this.retroalimentacionUseCases.updateRetroalimentacion(id, data);
      
      if (!retroalimentacion) {
        res.status(404).json({
          success: false,
          message: 'Retroalimentacion not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: retroalimentacion,
        message: 'Retroalimentacion updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating retroalimentacion',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.retroalimentacionUseCases.deleteRetroalimentacion(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Retroalimentacion not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Retroalimentacion deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting retroalimentacion',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}