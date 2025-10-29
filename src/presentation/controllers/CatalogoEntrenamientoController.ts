import { Request, Response } from 'express';
import { CatalogoEntrenamientoUseCases } from '@/application/use-cases/CatalogoEntrenamientoUseCases';
import { ResponseUtil } from '@/shared/utils/response';
import { PaginationParams } from '@/shared/types/api';

export class CatalogoEntrenamientoController {
  constructor(private catalogoUseCases: CatalogoEntrenamientoUseCases) {}

  /**
   * @swagger
   * /catalogos-entrenamiento:
   *   get:
   *     summary: Obtener todos los catálogos de entrenamiento
   *     tags: [05. Catálogos - Entrenamientos]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Número de elementos por página
   *     responses:
   *       200:
   *         description: Lista de catálogos de entrenamiento
   */
  async getCatalogos(req: Request, res: Response): Promise<Response> {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 10, 100),
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const { catalogos, total } = await this.catalogoUseCases.getAllCatalogos(params);
      const totalPages = Math.ceil(total / params.limit!);

      return ResponseUtil.paginated(res, catalogos, {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages,
      });
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /catalogos-entrenamiento/{id}:
   *   get:
   *     summary: Obtener catálogo por ID
   *     tags: [05. Catálogos - Entrenamientos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del catálogo
   *     responses:
   *       200:
   *         description: Catálogo encontrado
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  async getCatalogoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const catalogoId = parseInt(id);
      const catalogo = await this.catalogoUseCases.getCatalogoById(catalogoId);
      return ResponseUtil.success(res, catalogo);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  /**
   * @swagger
   * /catalogos-entrenamiento:
   *   post:
   *     summary: Crear un nuevo catálogo de entrenamiento
   *     tags: [05. Catálogos - Entrenamientos]
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
   *                 minLength: 2
   *               descripcion:
   *                 type: string
   *               nivel:
   *                 type: string
   *                 enum: [BASICO, INTERMEDIO, AVANZADO]
   *     responses:
   *       201:
   *         description: Catálogo creado exitosamente
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  async createCatalogo(req: Request, res: Response): Promise<Response> {
    try {
      const catalogo = await this.catalogoUseCases.createCatalogo(req.body);
      return ResponseUtil.success(res, catalogo, 'Catálogo creado exitosamente', 201);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('ya existe') || message.includes('inválido') ? 400 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async updateCatalogo(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const catalogoId = parseInt(id);
      const catalogo = await this.catalogoUseCases.updateCatalogo(catalogoId, req.body);
      return ResponseUtil.success(res, catalogo, 'Catálogo actualizado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      let statusCode = 500;
      if (message.includes('no encontrado')) statusCode = 404;
      else if (message.includes('ya existe') || message.includes('inválido')) statusCode = 400;
      
      return ResponseUtil.error(res, message, statusCode);
    }
  }

  async deleteCatalogo(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const catalogoId = parseInt(id);
      await this.catalogoUseCases.deleteCatalogo(catalogoId);
      return ResponseUtil.success(res, null, 'Catálogo eliminado exitosamente');
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes('no encontrado') ? 404 : 500;
      return ResponseUtil.error(res, message, statusCode);
    }
  }
}