import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/shared/config/environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Reservas Deportivas',
      version: '1.0.0',
      description: `
# 🏃‍♂️ API Sistema de Reservas Deportivas

Una API REST completa para gestionar reservas de entrenamientos deportivos.

## 🎯 Flujo Principal de Uso
1. **Registrarse/Login:** \`POST /auth/register\` → \`POST /auth/login\`
2. **Buscar entrenadores:** \`GET /entrenadores/buscar\`
3. **Crear reserva:** \`POST /reservas\`
4. **Procesar pago:** \`POST /pagos\`
5. **Evaluar sesión:** \`POST /reseñas\`

## 📊 Base de Datos
- **15 tablas** implementadas
- **Autenticación JWT** con roles
- **Arquitectura limpia** y escalable
      `,
      contact: {
        name: 'Soporte API',
        email: 'soporte@apideportes.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.api.prefix}/${config.api.version}`,
        description: 'Servidor de Desarrollo',
      },
    ],
    tags: [
      {
        name: '🔐 Autenticación',
        description: 'Registro, login y gestión de sesiones'
      },
      {
        name: '👥 Usuarios',
        description: 'Gestión de perfiles de usuarios'
      },
      {
        name: '🏃‍♂️ Entrenadores',
        description: 'Búsqueda y gestión de entrenadores'
      },
      {
        name: '👤 Clientes',
        description: 'Gestión de perfiles de clientes'
      },
      {
        name: '📅 Reservas',
        description: 'Sistema principal de reservas'
      },
      {
        name: '💰 Pagos',
        description: 'Procesamiento de pagos'
      },
      {
        name: '⭐ Reseñas',
        description: 'Sistema de calificaciones'
      },
      {
        name: '🏆 Deportes',
        description: 'Catálogo de deportes'
      },
      {
        name: '📊 Sistema',
        description: 'Estado y estadísticas de la API'
      }
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT. Formato: "Bearer {token}"',
        },
      },
      responses: {
        Success: {
          description: 'Operación exitosa',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { description: 'Datos de respuesta' },
                  message: { type: 'string', example: 'Operación exitosa' }
                }
              }
            }
          }
        },
        Error: {
          description: 'Error en la operación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { type: 'string', description: 'Mensaje de error' },
                  code: { type: 'string', description: 'Código específico del error' },
                  detalles: { type: 'string', description: 'Información adicional del error' }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación de reglas de negocio',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'No puedes dejar una reseña sin haber completado una sesión con este entrenador' },
                  code: { 
                    type: 'string', 
                    enum: [
                      'SESION_REQUERIDA', 
                      'RESENA_DUPLICADA', 
                      'SESION_NO_DISPONIBLE', 
                      'CONFLICTO_HORARIO', 
                      'LIMITE_RESERVAS_EXCEDIDO', 
                      'ROL_NO_AUTORIZADO',
                      'RESERVA_INVALIDA',
                      'SESION_NO_COMPLETADA',
                      'SESION_NO_ENCONTRADA',
                      'PAGO_REQUERIDO',
                      'HORARIO_INVALIDO'
                    ],
                    example: 'SESION_REQUERIDA' 
                  },
                  detalles: { type: 'string', example: 'Solo puedes reseñar sesiones que hayas completado' }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: 'Token inválido o no proporcionado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'Token inválido o expirado' }
                }
              }
            }
          }
        },
        Forbidden: {
          description: 'Sin permisos para realizar esta acción',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'Solo los clientes pueden hacer reservas' },
                  code: { type: 'string', example: 'ROL_NO_AUTORIZADO' }
                }
              }
            }
          }
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@email.com' },
            rol: { type: 'string', enum: ['CLIENTE', 'ENTRENADOR'], example: 'CLIENTE' },
            creado_en: { type: 'string', format: 'date-time' }
          }
        },
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: { type: 'integer', example: 1 },
            id_usuario: { type: 'integer', example: 1 },
            telefono: { type: 'string', example: '+34 600 123 456' },
            direccion: { type: 'string', example: 'Calle Mayor 123, Madrid' },
            fecha_registro: { type: 'string', format: 'date-time' }
          }
        },
        Entrenador: {
          type: 'object',
          properties: {
            id_entrenador: { type: 'integer', example: 1 },
            id_usuario: { type: 'integer', example: 2 },
            especialidad: { type: 'string', example: 'Yoga y Pilates' },
            experiencia: { type: 'integer', example: 5 },
            descripcion: { type: 'string', example: 'Entrenador certificado' },
            foto_url: { type: 'string', format: 'uri' }
          }
        },
        Deporte: {
          type: 'object',
          properties: {
            id_deporte: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Yoga' },
            descripcion: { type: 'string', example: 'Disciplina física y mental' },
            nivel: { type: 'string', enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'] }
          }
        },
        Reserva: {
          type: 'object',
          properties: {
            id_reserva: { type: 'integer', example: 1 },
            id_cliente: { type: 'integer', example: 1 },
            id_sesion: { type: 'integer', example: 1 },
            estado: { type: 'string', enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'] },
            fecha_reserva: { type: 'string', format: 'date-time' }
          }
        },
        Pago: {
          type: 'object',
          properties: {
            id_pago: { type: 'integer', example: 1 },
            id_reserva: { type: 'integer', example: 1 },
            monto: { type: 'number', format: 'decimal', example: 50.00 },
            metodo: { type: 'string', enum: ['TARJETA', 'EFECTIVO'] },
            estado: { type: 'string', enum: ['PENDIENTE', 'COMPLETADO'] }
          }
        },
        Reseña: {
          type: 'object',
          properties: {
            id_reseña: { type: 'integer', example: 1 },
            id_reserva: { type: 'integer', example: 1 },
            calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comentario: { type: 'string', example: 'Excelente sesión' }
          }
        }
      }
    },
  },
  apis: ['./src/presentation/controllers/final/*.ts'],
};

export const swaggerSpecFinal = swaggerJsdoc(options) as any;