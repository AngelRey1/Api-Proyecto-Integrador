import { Request, Response } from 'express';
import { CatalogoEntrenamientoUseCases } from '@/application/use-cases/CatalogoEntrenamientoUseCases';
import { CreateCatalogoEntrenamientoData, UpdateCatalogoEntrenamientoData } from '@/domain/entities/CatalogoEntrenamiento';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoEntrenamientoController {
  constructor(private catalogoUseCases: CatalogoEntrenamientoUseCases) {}

  /**
   * @swagger
   * /catalogo/entrenamientos:
   *   get:
   *     tags: [💪 Catálogo de Entrenamientos]
   *     summary: 💪 Listar tipos de entrenamientos
   *     description: |
   *       Obtiene el catálogo completo de tipos de entrenamientos disponibles.
   *       Incluye entrenamientos como: Funcional, Cardio, Yoga, Pilates, etc.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Catálogo obtenido exitosamente
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
   *                     type: object
   *                     properties:
   *                       id_catalogo:
   *                         type: integer
   *                         example: 1
   *                       nombre:
   *                         type: string
   *                         example: "Entrenamiento Funcional"
   *                       descripcion:
   *                         type: string
   *                         example: "Ejercicios funcionales para el día a día"
   *                       nivel:
   *                         type: string
   *                         enum: [BASICO, INTERMEDIO, AVANZADO]
   *                         example: "INTERMEDIO"
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await this.catalogoUseCases.getAllCatalogos(params);
      
      res.status(200).json({
        success: true,
        data: result.catalogos,
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
        message: 'Error fetching catalogos',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const catalogo = await this.catalogoUseCases.getCatalogoById(id);
      
      if (!catalogo) {
        res.status(404).json({
          success: false,
          message: 'Catalogo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: catalogo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching catalogo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getByNivel(req: Request, res: Response): Promise<void> {
    try {
      const nivel = req.params.nivel;
      const catalogos = await this.catalogoUseCases.getCatalogosByNivel(nivel);
      
      res.status(200).json({
        success: true,
        data: catalogos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching catalogos by nivel',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * @swagger
   * /catalogo/entrenamientos:
   *   post:
   *     tags: [💪 Catálogo de Entrenamientos]
   *     summary: 💪 Crear nuevo tipo de entrenamiento
   *     description: |
   *       **Solo Administradores** - Agrega un nuevo tipo de entrenamiento al catálogo.
   *       Ejemplos: CrossFit, HIIT, Pilates Avanzado, etc.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nombre
   *               - nivel
   *             properties:
   *               nombre:
   *                 type: string
   *                 example: "HIIT Avanzado"
   *               descripcion:
   *                 type: string
   *                 example: "Entrenamiento de intervalos de alta intensidad"
   *               nivel:
   *                 type: string
   *                 enum: [BASICO, INTERMEDIO, AVANZADO]
   *                 example: "AVANZADO"
   *     responses:
   *       201:
   *         description: Tipo de entrenamiento creado exitosamente
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCatalogoEntrenamientoData = req.body;
      const catalogo = await this.catalogoUseCases.createCatalogo(data);
      
      res.status(201).json({
        success: true,
        data: catalogo,
        message: 'Catalogo created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating catalogo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCatalogoEntrenamientoData = req.body;
      
      const catalogo = await this.catalogoUseCases.updateCatalogo(id, data);
      
      if (!catalogo) {
        res.status(404).json({
          success: false,
          message: 'Catalogo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: catalogo,
        message: 'Catalogo updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating catalogo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.catalogoUseCases.deleteCatalogo(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Catalogo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Catalogo deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting catalogo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}