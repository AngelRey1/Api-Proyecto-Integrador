import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/shared/config/environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Deportes - Sistema de Reservas',
      version: '2.0.0',
      description: `
# 🏃‍♂️ API Sistema de Reservas Deportivas

Una API REST completa para gestionar reservas de entrenamientos deportivos.

## 🎯 Funcionalidades Principales
- **Autenticación JWT** con roles (Cliente/Entrenador)
- **Búsqueda y reserva** de sesiones de entrenamiento
- **Gestión de perfiles** de usuarios
- **Sistema de pagos** integrado
- **Reseñas y seguimiento** de progreso
- **Notificaciones** en tiempo real

## 🚀 Cómo Empezar
1. **Autenticarse:** \`POST /auth/login\`
2. **Buscar entrenadores:** \`GET /entrenadores/buscar\`
3. **Hacer reserva:** \`POST /reservas\`
4. **Procesar pago:** \`POST /pagos\`

## 📊 Base de Datos
- **15 tablas** completamente implementadas
- **Relaciones** bien definidas
- **Validaciones** en todos los niveles
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
      // ═══════════════════════════════════════════════════════════════════
      // 🎯 ENDPOINTS PRINCIPALES (Flujo de Usuario)
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '🔐 Autenticación',
        description: 'Login, registro y gestión de sesiones de usuario'
      },
      {
        name: '👥 Usuarios',
        description: 'Gestión de perfiles de usuarios (clientes y entrenadores)'
      },
      {
        name: '🏃‍♂️ Entrenadores',
        description: 'Búsqueda, perfiles y especialidades de entrenadores'
      },
      {
        name: '👤 Clientes',
        description: 'Gestión de perfiles y datos de clientes'
      },
      {
        name: '📅 Reservas',
        description: 'Crear, consultar y gestionar reservas de entrenamientos'
      },
      {
        name: '💰 Pagos',
        description: 'Procesamiento y gestión de pagos de reservas'
      },
      {
        name: '⭐ Reseñas',
        description: 'Sistema de calificaciones y comentarios'
      },
      {
        name: '🔔 Notificaciones',
        description: 'Sistema de alertas y comunicaciones'
      },
      
      // ═══════════════════════════════════════════════════════════════════
      // 📚 CATÁLOGOS Y CONFIGURACIÓN
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '🏆 Deportes',
        description: 'Catálogo de deportes y disciplinas disponibles'
      },
      {
        name: '💪 Entrenamientos',
        description: 'Tipos y categorías de entrenamientos'
      },
      {
        name: '🎯 Actividades',
        description: 'Actividades personalizadas y programas especiales'
      },
      {
        name: '📅 Horarios',
        description: 'Gestión de horarios y disponibilidad'
      },
      {
        name: '🗓️ Sesiones',
        description: 'Sesiones específicas de entrenamiento'
      },
      
      // ═══════════════════════════════════════════════════════════════════
      // 🔧 SISTEMA Y ADMINISTRACIÓN
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '📱 Feedback',
        description: 'Retroalimentación y sugerencias de la aplicación'
      },
      {
        name: '📊 Estadísticas',
        description: 'Métricas y reportes del sistema'
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
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  data: {
                    description: 'Datos de respuesta'
                  },
                  message: {
                    type: 'string',
                    example: 'Operación completada exitosamente'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
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
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    description: 'Mensaje de error'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: 'No autorizado - Token requerido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/responses/Error'
              }
            }
          }
        }
      },
      schemas: {
        // ═══════════════════════════════════════════════════════════════════
        // 👥 ESQUEMAS DE USUARIOS
        // ═══════════════════════════════════════════════════════════════════
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan'
            },
            apellido: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico',
              example: 'juan.perez@email.com'
            },
            rol: {
              type: 'string',
              enum: ['CLIENTE', 'ENTRENADOR'],
              description: 'Rol del usuario en el sistema',
              example: 'CLIENTE'
            },
            creado_en: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de registro'
            }
          }
        },
        
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: {
              type: 'integer',
              example: 1
            },
            id_usuario: {
              type: 'integer',
              example: 1
            },
            telefono: {
              type: 'string',
              example: '+34 600 123 456'
            },
            direccion: {
              type: 'string',
              example: 'Calle Mayor 123, Madrid'
            },
            fecha_registro: {
              type: 'string',
              format: 'date-time'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        
        Entrenador: {
          type: 'object',
          properties: {
            id_entrenador: {
              type: 'integer',
              example: 1
            },
            id_usuario: {
              type: 'integer',
              example: 2
            },
            especialidad: {
              type: 'string',
              example: 'Yoga y Pilates'
            },
            experiencia: {
              type: 'integer',
              description: 'Años de experiencia',
              example: 5
            },
            descripcion: {
              type: 'string',
              example: 'Entrenador certificado con 5 años de experiencia en yoga'
            },
            foto_url: {
              type: 'string',
              format: 'uri',
              example: 'https://ejemplo.com/foto.jpg'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // 🏆 ESQUEMAS DE DEPORTES Y ENTRENAMIENTOS
        // ═══════════════════════════════════════════════════════════════════
        Deporte: {
          type: 'object',
          properties: {
            id_deporte: {
              type: 'integer',
              example: 1
            },
            nombre: {
              type: 'string',
              example: 'Yoga'
            },
            descripcion: {
              type: 'string',
              example: 'Disciplina física y mental que combina posturas, respiración y meditación'
            },
            nivel: {
              type: 'string',
              enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
              example: 'PRINCIPIANTE'
            }
          }
        },
        
        CatalogoEntrenamiento: {
          type: 'object',
          properties: {
            id_catalogo: {
              type: 'integer',
              example: 1
            },
            nombre: {
              type: 'string',
              example: 'Entrenamiento Funcional'
            },
            descripcion: {
              type: 'string',
              example: 'Ejercicios funcionales para el día a día'
            },
            nivel: {
              type: 'string',
              enum: ['BASICO', 'INTERMEDIO', 'AVANZADO'],
              example: 'INTERMEDIO'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // 📅 ESQUEMAS DE RESERVAS Y SESIONES
        // ═══════════════════════════════════════════════════════════════════
        Reserva: {
          type: 'object',
          properties: {
            id_reserva: {
              type: 'integer',
              example: 1
            },
            id_cliente: {
              type: 'integer',
              example: 1
            },
            id_sesion: {
              type: 'integer',
              example: 1
            },
            estado: {
              type: 'string',
              enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
              example: 'CONFIRMADA'
            },
            fecha_reserva: {
              type: 'string',
              format: 'date-time'
            },
            codigo_confirmacion: {
              type: 'string',
              example: 'ABC123'
            },
            cliente: {
              $ref: '#/components/schemas/Cliente'
            },
            sesion: {
              $ref: '#/components/schemas/Sesion'
            }
          }
        },
        
        Sesion: {
          type: 'object',
          properties: {
            id_sesion: {
              type: 'integer',
              example: 1
            },
            id_horario: {
              type: 'integer',
              example: 1
            },
            fecha: {
              type: 'string',
              format: 'date',
              example: '2025-11-05'
            },
            cupos_disponibles: {
              type: 'integer',
              example: 8
            },
            horario: {
              $ref: '#/components/schemas/Horario'
            }
          }
        },
        
        Horario: {
          type: 'object',
          properties: {
            id_horario: {
              type: 'integer',
              example: 1
            },
            id_entrenador: {
              type: 'integer',
              example: 1
            },
            dia: {
              type: 'string',
              enum: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
              example: 'LUNES'
            },
            hora_inicio: {
              type: 'string',
              format: 'time',
              example: '09:00'
            },
            hora_fin: {
              type: 'string',
              format: 'time',
              example: '10:00'
            },
            entrenador: {
              $ref: '#/components/schemas/Entrenador'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // 💰 ESQUEMAS DE PAGOS
        // ═══════════════════════════════════════════════════════════════════
        Pago: {
          type: 'object',
          properties: {
            id_pago: {
              type: 'integer',
              example: 1
            },
            id_reserva: {
              type: 'integer',
              example: 1
            },
            monto: {
              type: 'number',
              format: 'decimal',
              example: 50.00
            },
            metodo: {
              type: 'string',
              enum: ['TARJETA', 'EFECTIVO'],
              example: 'TARJETA'
            },
            estado: {
              type: 'string',
              enum: ['PENDIENTE', 'COMPLETADO'],
              example: 'COMPLETADO'
            },
            fecha_pago: {
              type: 'string',
              format: 'date-time'
            },
            reserva: {
              $ref: '#/components/schemas/Reserva'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // ⭐ ESQUEMAS DE RESEÑAS Y COMENTARIOS
        // ═══════════════════════════════════════════════════════════════════
        Reseña: {
          type: 'object',
          properties: {
            id_reseña: {
              type: 'integer',
              example: 1
            },
            id_reserva: {
              type: 'integer',
              example: 1
            },
            id_cliente: {
              type: 'integer',
              example: 1
            },
            id_entrenador: {
              type: 'integer',
              example: 1
            },
            calificacion: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 5
            },
            comentario: {
              type: 'string',
              example: 'Excelente sesión, muy profesional'
            },
            fecha_reseña: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // 🔔 ESQUEMAS DE NOTIFICACIONES
        // ═══════════════════════════════════════════════════════════════════
        Notificacion: {
          type: 'object',
          properties: {
            id_notificacion: {
              type: 'integer',
              example: 1
            },
            id_usuario: {
              type: 'integer',
              example: 1
            },
            mensaje: {
              type: 'string',
              example: 'Tu reserva ha sido confirmada'
            },
            tipo: {
              type: 'string',
              enum: ['RESERVA', 'PAGO', 'GENERAL'],
              example: 'RESERVA'
            },
            leido: {
              type: 'boolean',
              example: false
            },
            fecha_envio: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
  },
  apis: ['./src/presentation/controllers/*.ts', './src/presentation/routes/*.ts'],
};

export const swaggerSpecClean = swaggerJsdoc(options) as any;