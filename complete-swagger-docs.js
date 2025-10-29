const fs = require('fs');
const path = require('path');

// Plantillas de documentación Swagger completas
const swaggerTemplates = {
  getAll: (entityName, tagName, entityNamePlural) => `
   * @swagger
   * /${entityNamePlural}:
   *   get:
   *     summary: Obtener todos los ${entityNamePlural}
   *     tags: [${tagName}]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Número de elementos por página
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *         description: Campo para ordenar
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: asc
   *         description: Orden de clasificación
   *     responses:
   *       200:
   *         description: Lista paginada de ${entityNamePlural}
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/${entityName}'
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         page:
   *                           type: integer
   *                         limit:
   *                           type: integer
   *                         total:
   *                           type: integer
   *                         totalPages:
   *                           type: integer
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'`,

  getById: (entityName, tagName, entityNamePlural) => `
   * @swagger
   * /${entityNamePlural}/{id}:
   *   get:
   *     summary: Obtener ${entityName.toLowerCase()} por ID
   *     tags: [${tagName}]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del ${entityName.toLowerCase()}
   *     responses:
   *       200:
   *         description: ${entityName} encontrado
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/${entityName}'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'`,

  create: (entityName, tagName, entityNamePlural) => `
   * @swagger
   * /${entityNamePlural}:
   *   post:
   *     summary: Crear nuevo ${entityName.toLowerCase()}
   *     tags: [${tagName}]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Create${entityName}'
   *     responses:
   *       201:
   *         description: ${entityName} creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/${entityName}'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'`,

  update: (entityName, tagName, entityNamePlural) => `
   * @swagger
   * /${entityNamePlural}/{id}:
   *   put:
   *     summary: Actualizar ${entityName.toLowerCase()}
   *     tags: [${tagName}]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del ${entityName.toLowerCase()}
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Create${entityName}'
   *     responses:
   *       200:
   *         description: ${entityName} actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/${entityName}'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'`,

  delete: (entityName, tagName, entityNamePlural) => `
   * @swagger
   * /${entityNamePlural}/{id}:
   *   delete:
   *     summary: Eliminar ${entityName.toLowerCase()}
   *     tags: [${tagName}]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del ${entityName.toLowerCase()}
   *     responses:
   *       200:
   *         description: ${entityName} eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         description: No autorizado
   *       500:
   *         $ref: '#/components/responses/InternalServerError'`
};

// Configuración de entidades
const entities = {
  'ComentarioController.ts': {
    entityName: 'Comentario',
    entityNamePlural: 'comentarios',
    tagName: '11. Reseñas y Comentarios'
  },
  'ReseñaController.ts': {
    entityName: 'Reseña',
    entityNamePlural: 'reseñas',
    tagName: '11. Reseñas y Comentarios'
  },
  'NotificacionController.ts': {
    entityName: 'Notificacion',
    entityNamePlural: 'notificaciones',
    tagName: '12. Sistema - Notificaciones'
  },
  'RetroalimentacionAppController.ts': {
    entityName: 'RetroalimentacionApp',
    entityNamePlural: 'retroalimentacion-app',
    tagName: '13. Sistema - Retroalimentación'
  },
  'CatalogoActividadesController.ts': {
    entityName: 'CatalogoActividades',
    entityNamePlural: 'catalogo-actividades',
    tagName: '06. Actividades Personalizadas'
  },
  'CalendarioDisponibilidadController.ts': {
    entityName: 'CalendarioDisponibilidad',
    entityNamePlural: 'calendario-disponibilidad',
    tagName: '07. Horarios y Disponibilidad'
  }
};

function completeSwaggerDocs() {
  const controllersDir = path.join(__dirname, 'src', 'presentation', 'controllers');
  
  Object.entries(entities).forEach(([filename, config]) => {
    const filePath = path.join(controllersDir, filename);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Buscar métodos que necesitan documentación completa
      const methods = [
        { pattern: /async get\w+\(req: Request, res: Response\): Promise<Response> \{/, template: 'getAll' },
        { pattern: /async get\w+ById\(req: Request, res: Response\): Promise<Response> \{/, template: 'getById' },
        { pattern: /async create\w+\(req: Request, res: Response\): Promise<Response> \{/, template: 'create' },
        { pattern: /async update\w+\(req: Request, res: Response\): Promise<Response> \{/, template: 'update' },
        { pattern: /async delete\w+\(req: Request, res: Response\): Promise<Response> \{/, template: 'delete' }
      ];
      
      methods.forEach(({ pattern, template }) => {
        // Buscar métodos con documentación incompleta
        const incompleteSwaggerRegex = new RegExp(`/\\*\\*\\s*\\*\\s*@swagger[^}]*\\*/\\s*${pattern.source}`, 'g');
        const matches = content.match(incompleteSwaggerRegex);
        
        if (matches) {
          matches.forEach(match => {
            // Si la documentación es muy corta (menos de 200 caracteres), reemplazarla
            if (match.length < 200) {
              const newDoc = swaggerTemplates[template](config.entityName, config.tagName, config.entityNamePlural);
              const methodPart = match.match(pattern)[0];
              const replacement = `  /**${newDoc}
   */
  ${methodPart}`;
              
              content = content.replace(match, replacement);
            }
          });
        }
      });
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Documentación completada para: ${filename}`);
    }
  });
}

console.log('📝 Completando documentación de Swagger...');
completeSwaggerDocs();
console.log('✅ Documentación de Swagger completada!');