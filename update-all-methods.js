const fs = require('fs');

console.log('🔧 Actualizando TODOS los métodos de los controladores finales...\n');

// Plantillas de métodos genéricos
const methodTemplates = {
  getAll: (useCasesVar, entityName, entityPlural) => `
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.${useCasesVar}.getAll${entityPlural}({ page, limit });
      
      res.status(200).json({
        success: true,
        data: result.${entityName.toLowerCase()}s || result.data || result,
        pagination: { 
          page, 
          limit,
          total: result.total || 0,
          pages: Math.ceil((result.total || 0) / limit)
        }
      });
      
    } catch (error) {
      console.error('Error obteniendo ${entityName.toLowerCase()}s:', error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }`,

  getById: (useCasesVar, entityName) => `
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
      
      const ${entityName.toLowerCase()} = await this.${useCasesVar}.get${entityName}ById(id);
      
      res.status(200).json({
        success: true,
        data: ${entityName.toLowerCase()}
      });
      
    } catch (error) {
      console.error('Error obteniendo ${entityName.toLowerCase()}:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "${entityName} no encontrado",
          code: "${entityName.toUpperCase()}_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }`,

  create: (useCasesVar, entityName) => `
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      const nuevo${entityName} = await this.${useCasesVar}.create${entityName}(data);
      
      res.status(201).json({
        success: true,
        data: nuevo${entityName},
        message: "${entityName} creado exitosamente"
      });
      
    } catch (error) {
      console.error('Error creando ${entityName.toLowerCase()}:', error);
      const message = (error as Error).message;
      
      res.status(400).json({
        success: false,
        error: message || "Error creando ${entityName.toLowerCase()}",
        code: "ERROR_CREACION"
      });
    }
  }`,

  update: (useCasesVar, entityName) => `
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
      
      const ${entityName.toLowerCase()}Actualizado = await this.${useCasesVar}.update${entityName}(id, data);
      
      res.status(200).json({
        success: true,
        data: ${entityName.toLowerCase()}Actualizado,
        message: "${entityName} actualizado exitosamente"
      });
      
    } catch (error) {
      console.error('Error actualizando ${entityName.toLowerCase()}:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "${entityName} no encontrado",
          code: "${entityName.toUpperCase()}_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }`,

  delete: (useCasesVar, entityName) => `
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
      
      await this.${useCasesVar}.delete${entityName}(id);
      
      res.status(200).json({
        success: true,
        message: "${entityName} eliminado exitosamente"
      });
      
    } catch (error) {
      console.error('Error eliminando ${entityName.toLowerCase()}:', error);
      const message = (error as Error).message;
      
      if (message.includes('no encontrado') || message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: "${entityName} no encontrado",
          code: "${entityName.toUpperCase()}_NO_ENCONTRADO"
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
        code: "ERROR_INTERNO"
      });
    }
  }`
};

// Configuración de controladores
const controllers = [
  {
    name: 'DeporteFinalController',
    path: 'src/presentation/controllers/final/DeporteFinalController.ts',
    useCasesVar: 'deporteUseCases',
    entityName: 'Deporte',
    entityPlural: 'Deportes',
    methods: ['getAll', 'getById', 'create', 'update', 'delete']
  },
  {
    name: 'ClienteFinalController',
    path: 'src/presentation/controllers/final/ClienteFinalController.ts',
    useCasesVar: 'clienteUseCases',
    entityName: 'Cliente',
    entityPlural: 'Clientes',
    methods: ['getAll', 'getById', 'create', 'update', 'delete']
  }
];

// Función para reemplazar métodos
function replaceMethod(content, methodName, newMethodContent) {
  // Buscar el método existente
  const methodRegex = new RegExp(
    `async ${methodName}\\(req: Request, res: Response\\): Promise<void> \\{[\\s\\S]*?\\n  \\}`,
    'g'
  );
  
  if (methodRegex.test(content)) {
    return content.replace(methodRegex, newMethodContent.trim());
  }
  
  return content;
}

// Procesar cada controlador
controllers.forEach(controller => {
  console.log(`📝 Actualizando métodos de ${controller.name}...`);
  
  let content = fs.readFileSync(controller.path, 'utf8');
  
  // Actualizar cada método
  controller.methods.forEach(methodName => {
    if (methodTemplates[methodName]) {
      const newMethodContent = methodTemplates[methodName](
        controller.useCasesVar,
        controller.entityName,
        controller.entityPlural
      );
      
      content = replaceMethod(content, methodName, newMethodContent);
      console.log(`  ✅ Método ${methodName} actualizado`);
    }
  });
  
  fs.writeFileSync(controller.path, content);
  console.log(`✅ ${controller.name} completamente actualizado\n`);
});

console.log('🎉 Todos los métodos han sido actualizados para usar la base de datos real!');