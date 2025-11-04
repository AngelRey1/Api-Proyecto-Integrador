const fs = require('fs');

const content = `import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/shared/config/environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'App Deporte API',
      version: '1.0.0',
      description: 'API REST para sistema de agendamiento de entrenadores deportivos',
      contact: { name: 'Soporte API', email: 'soporte@appdeporte.com' },
    },
    servers: [
      { url: \\http://localhost:\$\{config.port\}\$\{config.api.prefix\}/\$\{config.api.version\}\\, description: 'Desarrollo' },
      { url: \\https://api.appdeporte.com\$\{config.api.prefix\}/\$\{config.api.version\}\\, description: 'Producción' }
    ],
    tags: [
      { name: 'Usuarios', description: 'Autenticación y gestión de usuarios' },
      { name: 'Clientes', description: 'Gestión de perfiles de clientes' },
      { name: 'Entrenadores', description: 'Gestión de perfiles de entrenadores' },
      { name: 'Deportes', description: 'Catálogo de deportes disponibles' },
      { name: 'Entrenador-Deportes', description: 'Relación entre entrenadores y deportes' },
      { name: 'Horarios', description: 'Horarios de disponibilidad de entrenadores' },
      { name: 'Calendario Disponibilidad', description: 'Calendario detallado de disponibilidad' },
      { name: 'Sesiones', description: 'Sesiones de entrenamiento disponibles' },
      { name: 'Reservas', description: 'Reservas de sesiones' },
      { name: 'Pagos', description: 'Procesamiento de pagos' },
      { name: 'Reseñas', description: 'Calificaciones y reseñas de entrenadores' },
      { name: 'Comentarios', description: 'Comentarios en reseñas' },
      { name: 'Notificaciones', description: 'Notificaciones del sistema' },
      { name: 'Catálogo Entrenamientos', description: 'Tipos de entrenamientos' },
      { name: 'Catálogo Actividades', description: 'Actividades personalizadas' },
      { name: 'Retroalimentación', description: 'Feedback de la aplicación' },
      { name: 'Agendamiento', description: 'Endpoints principales de agendamiento' },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT obtenido al iniciar sesión' },
      },
      schemas: {
        ApiResponse: { type: 'object', properties: { success: { type: 'boolean' }, data: {}, message: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } },
        Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, error: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } }
      }
    }
  },
  apis: ['./src/presentation/controllers/**/*.ts', './src/presentation/routes/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
\\;

fs.writeFileSync('src/infrastructure/web/swagger.ts', content, 'utf8');
console.log('Swagger creado exitosamente');
