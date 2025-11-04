const fs = require('fs');

console.log('🔧 Conectando todos los controladores finales a la base de datos...\n');

// Configuración de controladores y sus dependencias
const controllers = [
  {
    name: 'ClienteFinalController',
    path: 'src/presentation/controllers/final/ClienteFinalController.ts',
    useCases: 'ClienteUseCases',
    repository: 'SupabaseClienteRepository',
    useCasesPath: '@/application/use-cases/ClienteUseCases',
    repositoryPath: '@/infrastructure/repositories/SupabaseClienteRepository'
  },
  {
    name: 'DeporteFinalController', 
    path: 'src/presentation/controllers/final/DeporteFinalController.ts',
    useCases: 'DeporteUseCases',
    repository: 'SupabaseDeporteRepository',
    useCasesPath: '@/application/use-cases/DeporteUseCases',
    repositoryPath: '@/infrastructure/repositories/SupabaseDeporteRepository'
  },
  {
    name: 'ReservaFinalController',
    path: 'src/presentation/controllers/final/ReservaFinalController.ts', 
    useCases: 'ReservaUseCases',
    repository: 'SupabaseReservaRepository',
    useCasesPath: '@/application/use-cases/ReservaUseCases',
    repositoryPath: '@/infrastructure/repositories/SupabaseReservaRepository'
  },
  {
    name: 'PagoFinalController',
    path: 'src/presentation/controllers/final/PagoFinalController.ts',
    useCases: 'PagoUseCases', 
    repository: 'SupabasePagoRepository',
    useCasesPath: '@/application/use-cases/PagoUseCases',
    repositoryPath: '@/infrastructure/repositories/SupabasePagoRepository'
  },
  {
    name: 'ReseñaFinalController',
    path: 'src/presentation/controllers/final/ReseñaFinalController.ts',
    useCases: 'ReseñaUseCases',
    repository: 'SupabaseReseñaRepository', 
    useCasesPath: '@/application/use-cases/ReseñaUseCases',
    repositoryPath: '@/infrastructure/repositories/SupabaseReseñaRepository'
  }
];

controllers.forEach(controller => {
  console.log(`📝 Actualizando ${controller.name}...`);
  
  let content = fs.readFileSync(controller.path, 'utf8');
  
  // 1. Agregar imports si no existen
  if (!content.includes(controller.useCasesPath)) {
    content = content.replace(
      "import { Request, Response } from 'express';",
      `import { Request, Response } from 'express';
import { ${controller.useCases} } from '${controller.useCasesPath}';
import { ${controller.repository} } from '${controller.repositoryPath}';`
    );
  }
  
  // 2. Agregar constructor si no existe
  if (!content.includes('constructor()')) {
    const className = controller.name;
    const useCasesVar = controller.useCases.charAt(0).toLowerCase() + controller.useCases.slice(1);
    
    content = content.replace(
      `export class ${className} {`,
      `export class ${className} {
  private ${useCasesVar}: ${controller.useCases};

  constructor() {
    const repository = new ${controller.repository}();
    this.${useCasesVar} = new ${controller.useCases}(repository);
  }`
    );
  }
  
  fs.writeFileSync(controller.path, content);
  console.log(`✅ ${controller.name} actualizado`);
});

console.log('\n🎉 Todos los controladores han sido actualizados con las dependencias necesarias');
console.log('⚠️  Nota: Los métodos individuales aún necesitan ser actualizados manualmente para usar los casos de uso reales');