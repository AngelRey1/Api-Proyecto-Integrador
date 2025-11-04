import { Request, Response } from 'express';
import { CatalogoActividadesUseCases } from '@/application/use-cases/CatalogoActividadesUseCases';
import { CreateCatalogoActividadesData, UpdateCatalogoActividadesData } from '@/domain/entities/CatalogoActividades';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoActividadesController {
  constructor(private actividadesUseCases: CatalogoActividadesUseCases) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.actividadesUseCases.getAllActividades(params);
      
      res.status(200).json({
        success: true,
        data: result.actividades,
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
        message: 'Error fetching actividades',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const actividad = await this.actividadesUseCases.getActividadById(id);
      
      if (!actividad) {
        res.status(404).json({
          success: false,
          message: 'Actividad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: actividad,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching actividad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByEntrenador(req: Request, res: Response): Promise<void> {
    try {
      const entrenadorId = parseInt(req.params.entrenadorId);
      const actividades = await this.actividadesUseCases.getActividadesByEntrenador(entrenadorId);
      
      res.status(200).json({
        success: true,
        data: actividades,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching actividades by entrenador',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByCliente(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const actividades = await this.actividadesUseCases.getActividadesByCliente(clienteId);
      
      res.status(200).json({
        success: true,
        data: actividades,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching actividades by cliente',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByEstado(req: Request, res: Response): Promise<void> {
    try {
      const estado = req.params.estado;
      const actividades = await this.actividadesUseCases.getActividadesByEstado(estado);
      
      res.status(200).json({
        success: true,
        data: actividades,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching actividades by estado',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCatalogoActividadesData = req.body;
      const actividad = await this.actividadesUseCases.createActividad(data);
      
      res.status(201).json({
        success: true,
        data: actividad,
        message: 'Actividad created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating actividad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCatalogoActividadesData = req.body;
      
      const actividad = await this.actividadesUseCases.updateActividad(id, data);
      
      if (!actividad) {
        res.status(404).json({
          success: false,
          message: 'Actividad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: actividad,
        message: 'Actividad updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating actividad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.actividadesUseCases.deleteActividad(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Actividad not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Actividad deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting actividad',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}