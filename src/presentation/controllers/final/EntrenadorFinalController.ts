import { Request, Response } from 'express';

export class EntrenadorFinalController {

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
    res.status(200).json({
      success: true,
      data: [
        { 
          id_entrenador: 1, 
          id_usuario: 2, 
          especialidad: "Yoga y Pilates", 
          experiencia: 5, 
          descripcion: "Entrenador certificado con 5 años de experiencia",
          foto_url: "https://ejemplo.com/foto1.jpg"
        },
        { 
          id_entrenador: 2, 
          id_usuario: 3, 
          especialidad: "CrossFit", 
          experiencia: 3, 
          descripcion: "Especialista en entrenamiento funcional",
          foto_url: "https://ejemplo.com/foto2.jpg"
        }
      ]
    });
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
    res.status(200).json({
      success: true,
      data: { 
        id_entrenador: 1, 
        id_usuario: 2, 
        especialidad: "Yoga y Pilates", 
        experiencia: 5, 
        descripcion: "Entrenador certificado con 5 años de experiencia",
        foto_url: "https://ejemplo.com/foto1.jpg"
      }
    });
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
    res.status(201).json({
      success: true,
      data: { 
        id_entrenador: 3, 
        id_usuario: 4, 
        especialidad: "Natación", 
        experiencia: 2, 
        descripcion: "Instructor de natación certificado"
      }
    });
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
    res.status(200).json({
      success: true,
      data: { 
        id_entrenador: 1, 
        especialidad: "Yoga, Pilates y Meditación", 
        experiencia: 6, 
        descripcion: "Entrenador certificado con 6 años de experiencia"
      }
    });
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
    res.status(200).json({
      success: true,
      message: "Entrenador eliminado exitosamente"
    });
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
    
    // Simular búsqueda con filtros aplicados
    const resultados = await this.buscarEntrenadoresDisponibles(deporte as string, fecha as string, ubicacion as string);
    
    res.status(200).json({
      success: true,
      data: resultados,
      filtros_aplicados: {
        deporte: deporte || "todos",
        fecha: fecha || "cualquier_fecha",
        ubicacion: ubicacion || "todas_las_ubicaciones"
      },
      total_encontrados: resultados.length
    });
  }
  
  // 🔍 Método auxiliar para búsqueda
  private async buscarEntrenadoresDisponibles(deporte?: string, fecha?: string, ubicacion?: string): Promise<any[]> {
    console.log(`🔍 Buscando entrenadores - Deporte: ${deporte}, Fecha: ${fecha}, Ubicación: ${ubicacion}`);
    
    // Mock de resultados filtrados
    return [
        {
          id_entrenador: 1,
          nombre: "Carlos Ruiz",
          especialidad: "Yoga y Pilates",
          experiencia: 5,
          calificacion_promedio: 4.8,
          disponible: true,
          precio_por_sesion: 50.00,
          ubicacion: "Madrid Centro"
        },
        {
          id_entrenador: 2,
          nombre: "Ana García",
          especialidad: "CrossFit",
          experiencia: 3,
          calificacion_promedio: 4.6,
          disponible: true,
          precio_por_sesion: 45.00,
          ubicacion: "Madrid Norte"
        }
      ];
  }
}