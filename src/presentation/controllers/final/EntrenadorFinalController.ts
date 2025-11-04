import { Request, Response } from 'express';
import { EntrenadorUseCases } from '@/application/use-cases/EntrenadorUseCases';
import { SupabaseEntrenadorRepository } from '@/infrastructure/repositories/SupabaseEntrenadorRepository';

export class EntrenadorFinalController {
  private entrenadorUseCases: EntrenadorUseCases;

  constructor() {
    const entrenadorRepository = new SupabaseEntrenadorRepository();
    this.entrenadorUseCases = new EntrenadorUseCases(entrenadorRepository);
  }

  /**
   * @swagger
   * /entrenadores:
   *   get:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: 📋 Listar entrenadores
   *     description: Obtiene una lista de todos los entrenadores disponibles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: especialidad
   *         schema:
   *           type: string
   *         description: Filtrar por especialidad
   *         example: "Yoga"
   *       - in: query
   *         name: experiencia_min
   *         schema:
   *           type: integer
   *         description: Años mínimos de experiencia
   *         example: 2
   *     responses:
   *       200:
   *         description: Lista de entrenadores obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Entrenador'
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.entrenadorUseCases.getAllEntrenadores({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result.entrenadores,
        pagination: { 
          page, 
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo entrenadores:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

  /**
   * @swagger
   * /entrenadores/{id}:
   *   get:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: 👤 Obtener entrenador por ID
   *     description: Obtiene los detalles completos de un entrenador específico
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
   *         description: Entrenador encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Entrenador'
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
      
      const entrenador = await this.entrenadorUseCases.getEntrenadorById(id);
      
      res.status(200).json({
        success: true,
        data: entrenador
      });
      
    } catch (error) {
      console.error('Error obteniendo entrenador:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Entrenador no encontrado",
          code: "ENTRENADOR_NO_ENCONTRADO"
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
   * /entrenadores:
   *   post:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: ➕ Crear perfil de entrenador
   *     description: Crea un nuevo perfil de entrenador
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id_usuario, especialidad]
   *             properties:
   *               id_usuario:
   *                 type: integer
   *                 example: 2
   *               especialidad:
   *                 type: string
   *                 example: "Yoga y Pilates"
   *               experiencia:
   *                 type: integer
   *                 example: 5
   *               descripcion:
   *                 type: string
   *                 example: "Entrenador certificado con experiencia"
   *               foto_url:
   *                 type: string
   *                 format: uri
   *                 example: "https://ejemplo.com/foto.jpg"
   *     responses:
   *       201:
   *         description: Perfil de entrenador creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Entrenador'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      const nuevoEntrenador = await this.entrenadorUseCases.createEntrenador(data);
      
      res.status(201).json({
        success: true,
        data: nuevoEntrenador,
        message: "Entrenador creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando entrenador:', error);
      const message = (error as Error).message;
      
      res.status(400).json({
        success: false,
        error: message || "Error creando entrenador",
        code: "ERROR_CREACION"
      });
    }
  }

  /**
   * @swagger
   * /entrenadores/{id}:
   *   put:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: ✏️ Actualizar entrenador
   *     description: Actualiza la información de un entrenador
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
   *               especialidad:
   *                 type: string
   *                 example: "Yoga, Pilates y Meditación"
   *               experiencia:
   *                 type: integer
   *                 example: 6
   *               descripcion:
   *                 type: string
   *                 example: "Entrenador certificado con 6 años de experiencia"
   *     responses:
   *       200:
   *         description: Entrenador actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Entrenador'
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
      
      const entrenadorActualizado = await this.entrenadorUseCases.updateEntrenador(id, data);
      
      res.status(200).json({
        success: true,
        data: entrenadorActualizado,
        message: "Entrenador actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando entrenador:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Entrenador no encontrado",
          code: "ENTRENADOR_NO_ENCONTRADO"
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
   * /entrenadores/{id}:
   *   delete:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: 🗑️ Eliminar entrenador
   *     description: Elimina un perfil de entrenador
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
   *         description: Entrenador eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Entrenador eliminado exitosamente"
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
      
      await this.entrenadorUseCases.deleteEntrenador(id);
      
      res.status(200).json({
        success: true,
        message: "Entrenador eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando entrenador:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "Entrenador no encontrado",
          code: "ENTRENADOR_NO_ENCONTRADO"
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
   * /entrenadores/buscar:
   *   get:
   *     tags: [🏃‍♂️ Entrenadores]
   *     summary: 🔍 Buscar entrenadores disponibles
   *     description: |
   *       **ENDPOINT PRINCIPAL** - Busca entrenadores disponibles según criterios.
   *       Este es el punto de entrada para que los clientes encuentren entrenadores.
   *     parameters:
   *       - in: query
   *         name: deporte
   *         schema:
   *           type: string
   *         description: Deporte específico
   *         example: "yoga"
   *       - in: query
   *         name: fecha
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha deseada
   *         example: "2025-11-05"
   *       - in: query
   *         name: ubicacion
   *         schema:
   *           type: string
   *         description: Ciudad o ubicación
   *         example: "madrid"
   *     responses:
   *       200:
   *         description: Entrenadores encontrados exitosamente
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
   *                       id_entrenador:
   *                         type: integer
   *                         example: 1
   *                       nombre:
   *                         type: string
   *                         example: "Carlos Ruiz"
   *                       especialidad:
   *                         type: string
   *                         example: "Yoga y Pilates"
   *                       experiencia:
   *                         type: integer
   *                         example: 5
   *                       calificacion_promedio:
   *                         type: number
   *                         example: 4.8
   *                       disponible:
   *                         type: boolean
   *                         example: true
   */
  async buscar(req: Request, res: Response): Promise<void> {
    const { deporte, fecha, ubicacion } = req.query;
    
    // 🔍 VALIDACIÓN 1: Verificar que la fecha no sea en el pasado
    if (fecha && new Date(fecha as string) < new Date()) {
      res.status(400).json({
        success: false,
        error: "No puedes buscar entrenadores para fechas pasadas",
        code: "FECHA_INVALIDA",
        detalles: "Selecciona una fecha futura"
      });
      return;
    }
    
    // 🔍 VALIDACIÓN 2: Verificar que la fecha no sea muy lejana (máximo 3 meses)
    if (fecha) {
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() + 3);
      if (new Date(fecha as string) > fechaLimite) {
        res.status(400).json({
          success: false,
          error: "Solo puedes buscar entrenadores hasta 3 meses en el futuro",
          code: "FECHA_MUY_LEJANA",
          detalles: "Las reservas están limitadas a 3 meses de anticipación"
        });
        return;
      }
    }
    
    // Buscar entrenadores en la base de datos
    try {
      const filtros = {
        deporte: deporte as string,
        fecha: fecha as string,
        ubicacion: ubicacion as string
      };
      
      const resultados = await this.entrenadorUseCases.getAllEntrenadores({ page: 1, limit: 50 });
      
      res.status(200).json({
        success: true,
        data: resultados.entrenadores,
        filtros_aplicados: {
          deporte: deporte || "todos",
          fecha: fecha || "cualquier_fecha",
          ubicacion: ubicacion || "todas_las_ubicaciones"
        },
        total_encontrados: resultados.entrenadores.length
      });
      
    } catch (error) {
      console.error('Error buscando entrenadores:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }

}