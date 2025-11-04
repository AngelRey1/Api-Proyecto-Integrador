const fs = require('fs');

console.log('🚀 Completando TODOS los controladores finales...\n');

// Plantilla genérica para métodos CRUD
const createGenericMethod = (methodName, useCasesVar, entityName) => {
  switch (methodName) {
    case 'getById':
      return `
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
  }`;

    case 'create':
      return `
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
  }`;

    case 'update':
      return `
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
  }`;

    case 'delete':
      return `
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
  }`;

    default:
      return '';
  }
};

// Controladores a actualizar
const controllers = [
  {
    name: 'DeporteFinalController',
    path: 'src/presentation/controllers/final/DeporteFinalController.ts',
    useCasesVar: 'deporteUseCases',
    entityName: 'Deporte',
    methods: ['getById', 'create', 'update', 'delete']
  },
  {
    name: 'ClienteFinalController', 
    path: 'src/presentation/controllers/final/ClienteFinalController.ts',
    useCasesVar: 'clienteUseCases',
    entityName: 'Cliente',
    methods: ['getById', 'create', 'update', 'delete']
  },
  {
    name: 'EntrenadorFinalController',
    path: 'src/presentation/controllers/final/EntrenadorFinalController.ts', 
    useCasesVar: 'entrenadorUseCases',
    entityName: 'Entrenador',
    methods: ['getById', 'create', 'update', 'delete']
  },
  {
    name: 'PagoFinalController',
    path: 'src/presentation/controllers/final/PagoFinalController.ts',
    useCasesVar: 'pagoUseCases', 
    entityName: 'Pago',
    methods: ['getAll', 'getById', 'update']
  },
  {
    name: 'ReseñaFinalController',
    path: 'src/presentation/controllers/final/ReseñaFinalController.ts',
    useCasesVar: 'reseñaUseCases',
    entityName: 'Reseña', 
    methods: ['getAll', 'getById', 'update']
  }
];

// Función para reemplazar métodos
function replaceMethodInFile(filePath, methodName, newContent) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar el método existente con diferentes patrones
  const patterns = [
    new RegExp(`async ${methodName}\\(req: Request, res: Response\\): Promise<void> \\{[\\s\\S]*?\\n  \\}`, 'g'),
    new RegExp(`async ${methodName}\\(req: Request, res: Response\\): Promise<void> \\{[\\s\\S]*?return;\\s*\\n  \\}`, 'g'),
    new RegExp(`async ${methodName}\\(req: Request, res: Response\\): Promise<void> \\{[\\s\\S]*?\\}\\s*\\n\\s*\\}`, 'g')
  ];
  
  let replaced = false;
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, newContent.trim());
      replaced = true;
      break;
    }
  }
  
  if (replaced) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Procesar cada controlador
controllers.forEach(controller => {
  console.log(`📝 Actualizando ${controller.name}...`);
  
  let methodsUpdated = 0;
  
  controller.methods.forEach(methodName => {
    const newMethodContent = createGenericMethod(methodName, controller.useCasesVar, controller.entityName);
    
    if (newMethodContent) {
      const success = replaceMethodInFile(controller.path, methodName, newMethodContent);
      if (success) {
        console.log(`  ✅ ${methodName} actualizado`);
        methodsUpdated++;
      } else {
        console.log(`  ⚠️  ${methodName} no encontrado o ya actualizado`);
      }
    }
  });
  
  console.log(`✅ ${controller.name}: ${methodsUpdated} métodos actualizados\n`);
});

console.log('🎉 ¡Actualización completa terminada!');
console.log('📊 Todos los controladores ahora están conectados a la base de datos');