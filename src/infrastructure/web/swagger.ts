import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/shared/config/environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'App Deporte',
      version: '1.0.0',
      description: 'API REST para aplicación de deportes y entrenamiento personal',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.api.prefix}/${config.api.version}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: '01. Autenticación y Usuarios',
        description: 'Endpoints para autenticación y gestión de usuarios'
      },
      {
        name: '02. Gestión de Perfiles - Clientes',
        description: 'Endpoints para gestión de perfiles de clientes'
      },
      {
        name: '03. Gestión de Perfiles - Entrenadores',
        description: 'Endpoints para gestión de perfiles de entrenadores'
      },
      {
        name: '04. Catálogos - Deportes',
        description: 'Endpoints para gestión del catálogo de deportes'
      },
      {
        name: '05. Catálogos - Entrenamientos',
        description: 'Endpoints para gestión del catálogo de entrenamientos'
      },
      {
        name: '06. Actividades Personalizadas',
        description: 'Endpoints para gestión de actividades personalizadas'
      },
      {
        name: '07. Horarios y Disponibilidad',
        description: 'Endpoints para gestión de horarios y disponibilidad'
      },
      {
        name: '08. Sesiones',
        description: 'Endpoints para gestión de sesiones de entrenamiento'
      },
      {
        name: '09. Reservas',
        description: 'Endpoints para gestión de reservas'
      },
      {
        name: '10. Pagos',
        description: 'Endpoints para gestión de pagos'
      },
      {
        name: '11. Reseñas y Comentarios',
        description: 'Endpoints para gestión de reseñas y comentarios'
      },
      {
        name: '12. Sistema - Notificaciones',
        description: 'Endpoints para gestión de notificaciones del sistema'
      },
      {
        name: '13. Sistema - Retroalimentación',
        description: 'Endpoints para gestión de retroalimentación de la aplicación'
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
          description: 'Ingresa tu JWT token. Ejemplo: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
            },
            data: {
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            error: {
              type: 'string',
              description: 'Error message if any',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Usuario schemas
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: {
              type: 'integer',
              description: 'ID único del usuario',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            apellido: {
              type: 'string',
              description: 'Apellido del usuario',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Dirección de email del usuario',
            },
            rol: {
              type: 'string',
              enum: ['CLIENTE', 'ENTRENADOR'],
              description: 'Rol del usuario en el sistema',
            },
            creado_en: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario',
            },
          },
        },
        CreateUsuario: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'contrasena', 'rol'],
          properties: {
            nombre: {
              type: 'string',
              minLength: 2,
              description: 'Nombre del usuario',
            },
            apellido: {
              type: 'string',
              minLength: 2,
              description: 'Apellido del usuario',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Dirección de email del usuario',
            },
            contrasena: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña del usuario',
            },
            rol: {
              type: 'string',
              enum: ['CLIENTE', 'ENTRENADOR'],
              description: 'Rol del usuario en el sistema',
            },
          },
        },
        // Cliente schemas
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: {
              type: 'integer',
              description: 'ID único del cliente',
            },
            id_usuario: {
              type: 'integer',
              description: 'ID del usuario asociado',
            },
            telefono: {
              type: 'string',
              description: 'Número de teléfono del cliente',
            },
            direccion: {
              type: 'string',
              description: 'Dirección del cliente',
            },
            fecha_registro: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de registro del cliente',
            },
            usuario: {
              $ref: '#/components/schemas/Usuario',
              description: 'Datos del usuario asociado',
            },
          },
        },
        CreateCliente: {
          type: 'object',
          required: ['id_usuario'],
          properties: {
            id_usuario: {
              type: 'integer',
              description: 'ID del usuario asociado',
            },
            telefono: {
              type: 'string',
              minLength: 8,
              description: 'Número de teléfono del cliente',
            },
            direccion: {
              type: 'string',
              minLength: 5,
              description: 'Dirección del cliente',
            },
          },
        },
        // Entrenador schemas
        Entrenador: {
          type: 'object',
          properties: {
            id_entrenador: {
              type: 'integer',
              description: 'ID único del entrenador',
            },
            id_usuario: {
              type: 'integer',
              description: 'ID del usuario asociado',
            },
            especialidad: {
              type: 'string',
              description: 'Especialidad del entrenador',
            },
            experiencia: {
              type: 'integer',
              description: 'Años de experiencia',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del entrenador',
            },
            foto_url: {
              type: 'string',
              format: 'uri',
              description: 'URL de la foto del entrenador',
            },
            usuario: {
              $ref: '#/components/schemas/Usuario',
              description: 'Datos del usuario asociado',
            },
          },
        },
        CreateEntrenador: {
          type: 'object',
          required: ['id_usuario'],
          properties: {
            id_usuario: {
              type: 'integer',
              description: 'ID del usuario asociado',
            },
            especialidad: {
              type: 'string',
              minLength: 2,
              description: 'Especialidad del entrenador',
            },
            experiencia: {
              type: 'integer',
              minimum: 0,
              description: 'Años de experiencia',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del entrenador',
            },
            foto_url: {
              type: 'string',
              format: 'uri',
              description: 'URL de la foto del entrenador',
            },
          },
        },
        // Deporte schemas
        Deporte: {
          type: 'object',
          properties: {
            id_deporte: {
              type: 'integer',
              description: 'ID único del deporte',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del deporte',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del deporte',
            },
            nivel: {
              type: 'string',
              enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
              description: 'Nivel de dificultad del deporte',
            },
          },
        },
        CreateDeporte: {
          type: 'object',
          required: ['nombre', 'nivel'],
          properties: {
            nombre: {
              type: 'string',
              minLength: 2,
              description: 'Nombre del deporte',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del deporte',
            },
            nivel: {
              type: 'string',
              enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
              description: 'Nivel de dificultad del deporte',
            },
          },
        },
        // Resto de esquemas...
        Horario: {
          type: 'object',
          properties: {
            id_horario: {
              type: 'integer',
              description: 'ID único del horario',
            },
            id_entrenador: {
              type: 'integer',
              description: 'ID del entrenador',
            },
            dia: {
              type: 'string',
              enum: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
              description: 'Día de la semana',
            },
            hora_inicio: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de inicio (formato HH:MM)',
            },
            hora_fin: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de fin (formato HH:MM)',
            },
          },
        },
        CreateHorario: {
          type: 'object',
          required: ['id_entrenador', 'dia', 'hora_inicio', 'hora_fin'],
          properties: {
            id_entrenador: {
              type: 'integer',
              description: 'ID del entrenador',
            },
            dia: {
              type: 'string',
              enum: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
              description: 'Día de la semana',
            },
            hora_inicio: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de inicio (formato HH:MM)',
            },
            hora_fin: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              description: 'Hora de fin (formato HH:MM)',
            },
          },
        },
        // EntrenadorDeporte schemas
        EntrenadorDeporte: {
          type: 'object',
          properties: {
            id_entrenador_deporte: {
              type: 'integer',
              description: 'ID único de la relación entrenador-deporte',
            },
            id_entrenador: {
              type: 'integer',
              description: 'ID del entrenador',
            },
            id_deporte: {
              type: 'integer',
              description: 'ID del deporte',
            },
            nivel_experiencia: {
              type: 'string',
              enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
              description: 'Nivel de experiencia del entrenador en este deporte',
            },
            certificado: {
              type: 'boolean',
              description: 'Indica si el entrenador tiene certificación en este deporte',
            },
            fecha_certificacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de certificación (opcional)',
            },
            entrenador: {
              $ref: '#/components/schemas/Entrenador',
              description: 'Datos del entrenador',
            },
            deporte: {
              $ref: '#/components/schemas/Deporte',
              description: 'Datos del deporte',
            },
          },
        },
        CreateEntrenadorDeporte: {
          type: 'object',
          required: ['id_entrenador', 'id_deporte', 'nivel_experiencia', 'certificado'],
          properties: {
            id_entrenador: {
              type: 'integer',
              description: 'ID del entrenador',
            },
            id_deporte: {
              type: 'integer',
              description: 'ID del deporte',
            },
            nivel_experiencia: {
              type: 'string',
              enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
              description: 'Nivel de experiencia del entrenador en este deporte',
            },
            certificado: {
              type: 'boolean',
              description: 'Indica si el entrenador tiene certificación en este deporte',
            },
            fecha_certificacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de certificación (opcional)',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts', './src/presentation/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options) as any;