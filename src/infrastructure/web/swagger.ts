import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/shared/config/environment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏋️ App Deporte - Sistema de Agendamiento de Entrenadores',
      version: '1.0.0',
      description: `
# 🎯 API REST para Agendamiento de Entrenamiento Personal

## 📋 Descripción General
Sistema completo de gestión de citas entre **clientes** y **entrenadores personales**. 
Esta API permite buscar entrenadores, gestionar disponibilidad, agendar sesiones y procesar pagos de manera integrada.

## 🚀 Flujo Principal de Usuario

### Para Clientes:
1. **Registro/Login** → Crear cuenta y obtener token JWT
2. **Buscar Entrenadores** → Filtrar por especialidad, fecha y disponibilidad
3. **Agendar Cita** → Reservar sesión con entrenador seleccionado
4. **Realizar Pago** → Confirmar reserva mediante pago
5. **Dejar Reseña** → Calificar experiencia

### Para Entrenadores:
1. **Registro/Login** → Crear cuenta como entrenador
2. **Configurar Perfil** → Especialidades, experiencia, descripción
3. **Gestionar Horarios** → Definir disponibilidad semanal
4. **Crear Sesiones** → Publicar sesiones disponibles
5. **Recibir Reservas** → Gestionar citas de clientes

## 🔐 Autenticación
- **Tipo**: Bearer Token (JWT)
- **Duración**: 24 horas
- **Formato**: \`Authorization: Bearer <token>\`
- **Roles**: CLIENTE | ENTRENADOR

## 📌 URL Base
\`${config.api.prefix}/${config.api.version}\`
      `,
      contact: {
        name: 'Soporte API',
        email: 'soporte@appdeporte.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.api.prefix}/${config.api.version}`,
        description: 'Servidor de Desarrollo',
      },
      {
        url: `https://api.appdeporte.com${config.api.prefix}/${config.api.version}`,
        description: 'Servidor de Producción (Próximamente)',
      }
    ],
    tags: [
      // ═══════════════════════════════════════════════════════════════════
      // 🎯 FLUJO PRINCIPAL - ORDEN DE USO PARA DEMOSTRACIÓN
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '🔐 1. Autenticación',
        description: `
**PASO 1: Crear cuenta y autenticarse**

Endpoints esenciales para iniciar sesión en la aplicación:
- Registro de nuevos usuarios (clientes o entrenadores)
- Login y obtención de token JWT
- Gestión de perfil de usuario

⚠️ **Importante**: El token JWT debe incluirse en todas las peticiones protegidas.
        `
      },
      {
        name: '� 2. Crear Perfil',
        description: `
**PASO 2: Completar perfil según el rol**

Después de registrarse, el usuario debe crear su perfil específico:
- **Clientes**: Agregar teléfono, dirección y preferencias
- **Entrenadores**: Especialidad, experiencia, descripción, foto

💡 Este paso es **obligatorio** para poder usar la aplicación.
        `
      },
      {
        name: '� 3. Configurar Disponibilidad',
        description: `
**PASO 3: Solo para Entrenadores**

Los entrenadores deben configurar:
- Horarios disponibles por día de la semana
- Deportes y especialidades que ofrecen
- Crear sesiones específicas con cupos

🏃‍♂️ Los clientes pueden **saltar este paso** e ir directamente a buscar entrenadores.
        `
      },
      {
        name: '🎯 4. Agendamiento (CORE)',
        description: `
**PASO 4: Funcionalidad Principal - Agendar Citas** ⭐

Este es el **FLUJO CORE** de la aplicación:

1. **Buscar Sesiones** → Ver entrenadores y horarios disponibles
2. **Agendar Cita** → Reservar sesión con entrenador (requiere autenticación)
3. **Ver Mis Reservas** → Consultar citas agendadas
4. **Cancelar Reserva** → Cancelar citas si es necesario

📌 **Endpoint Principal**: \`POST /agendamiento/agendar\`
        `
      },
      {
        name: '� 5. Pagos',
        description: `
**PASO 5: Procesar pago de la sesión**

Después de agendar, el cliente debe:
- Crear un registro de pago
- Confirmar el pago para activar la reserva
- Ver historial de pagos

💳 Estados de pago: PENDIENTE | COMPLETADO | FALLIDO
        `
      },
      {
        name: '⭐ 6. Reseñas y Feedback',
        description: `
**PASO 6: Después de la sesión**

Los clientes pueden:
- Calificar al entrenador (1-5 estrellas)
- Dejar comentarios sobre la experiencia
- Ver reseñas de otros usuarios

📊 Esto ayuda a otros clientes a elegir entrenadores.
        `
      },
      {
        name: '� 7. Notificaciones',
        description: `
**Sistema de Notificaciones**

Los usuarios reciben alertas sobre:
- Confirmación de reservas
- Recordatorios de sesiones próximas
- Cambios en horarios
- Pagos procesados

📱 Notificaciones en tiempo real para mantener informados a los usuarios.
        `
      },
      
      // ═══════════════════════════════════════════════════════════════════
      // 📚 CATÁLOGOS Y CONFIGURACIÓN DEL SISTEMA
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '📚 Catálogos - Deportes',
        description: '🏆 Gestión del catálogo de deportes disponibles en la plataforma'
      },
      {
        name: '� Catálogos - Entrenamientos',
        description: '� Tipos de entrenamientos y niveles (PRINCIPIANTE, INTERMEDIO, AVANZADO)'
      },
      {
        name: '📚 Catálogos - Actividades',
        description: '🎯 Actividades personalizadas que los entrenadores pueden ofrecer'
      },
      
      // ═══════════════════════════════════════════════════════════════════
      // � ENDPOINTS TÉCNICOS AVANZADOS
      // ═══════════════════════════════════════════════════════════════════
      {
        name: '� Gestión Avanzada - Entrenadores',
        description: '�‍🏫 CRUD completo de perfiles de entrenadores (para administración)'
      },
      {
        name: '🔧 Gestión Avanzada - Clientes',
        description: '� CRUD completo de perfiles de clientes (para administración)'
      },
      {
        name: '🔧 Gestión Avanzada - Sesiones',
        description: '�️ Gestión técnica de sesiones (creación, edición, eliminación)'
      },
      {
        name: '🔧 Gestión Avanzada - Reservas',
        description: '� Gestión técnica de reservas (para soporte y administración)'
      },
      {
        name: '🔧 Sistema - Retroalimentación',
        description: '📱 Feedback general de la aplicación, reportes de bugs y sugerencias'
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
        // ═══════════════════════════════════════════════════════════════════
        // 🎯 ESQUEMAS PARA AGENDAMIENTO PRINCIPAL (CORE DE LA API)
        // ═══════════════════════════════════════════════════════════════════
        
        // Schema para buscar sesiones disponibles
        BuscarSesionesRequest: {
          type: 'object',
          properties: {
            fecha: {
              type: 'string',
              format: 'date',
              example: '2025-11-05',
              description: 'Fecha deseada para la sesión (formato: YYYY-MM-DD)'
            },
            especialidad: {
              type: 'string',
              example: 'yoga',
              description: 'Especialidad del entrenador (ej: yoga, fitness, crossfit)'
            },
            entrenador_id: {
              type: 'integer',
              example: 1,
              description: 'ID específico del entrenador (opcional)'
            }
          }
        },
        
        // Respuesta de sesiones disponibles
        SesionDisponible: {
          type: 'object',
          properties: {
            id_sesion: {
              type: 'integer',
              example: 1,
              description: 'ID único de la sesión'
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-05T10:00:00Z',
              description: 'Fecha y hora de la sesión'
            },
            cupos_disponibles: {
              type: 'integer',
              example: 5,
              description: 'Cupos disponibles en la sesión'
            },
            cupos_ocupados: {
              type: 'integer',
              example: 3,
              description: 'Cupos ya reservados'
            },
            entrenador: {
              type: 'object',
              properties: {
                id_entrenador: {
                  type: 'integer',
                  example: 1
                },
                especialidad: {
                  type: 'string',
                  example: 'Entrenamiento funcional'
                },
                experiencia: {
                  type: 'integer',
                  example: 5,
                  description: 'Años de experiencia'
                },
                descripcion: {
                  type: 'string',
                  example: 'Entrenador certificado en fitness y nutrición'
                },
                usuario: {
                  type: 'object',
                  properties: {
                    nombre: {
                      type: 'string',
                      example: 'Juan'
                    },
                    apellido: {
                      type: 'string',
                      example: 'Pérez'
                    }
                  }
                }
              }
            }
          }
        },
        
        // ⭐ ENDPOINT PRINCIPAL: Agendar Cita
        AgendarCitaRequest: {
          type: 'object',
          required: ['sesion_id', 'fecha_hora'],
          properties: {
            sesion_id: {
              type: 'integer',
              example: 1,
              description: '⚠️ REQUERIDO: ID de la sesión a reservar (obtenido de /buscar-sesiones)'
            },
            fecha_hora: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-05T10:00:00Z',
              description: '⚠️ REQUERIDO: Fecha y hora exacta de la cita (formato ISO 8601)'
            },
            notas: {
              type: 'string',
              example: 'Primera sesión, tengo experiencia previa en gimnasio',
              description: 'Notas adicionales para el entrenador (opcional)'
            }
          }
        },
        
        // Respuesta al agendar cita
        AgendarCitaResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Reserva agendada exitosamente'
            },
            data: {
              type: 'object',
              properties: {
                id_reserva: {
                  type: 'integer',
                  example: 15,
                  description: 'ID único de la reserva creada'
                },
                cliente: {
                  type: 'object',
                  properties: {
                    id_cliente: {
                      type: 'integer',
                      example: 5
                    },
                    nombre: {
                      type: 'string',
                      example: 'María'
                    },
                    apellido: {
                      type: 'string',
                      example: 'González'
                    },
                    telefono: {
                      type: 'string',
                      example: '+52 555 1234567'
                    }
                  }
                },
                sesion: {
                  type: 'object',
                  properties: {
                    id_sesion: {
                      type: 'integer',
                      example: 1
                    },
                    fecha: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-11-05T10:00:00Z'
                    },
                    cupos_disponibles: {
                      type: 'integer',
                      example: 4,
                      description: 'Cupos restantes después de esta reserva'
                    },
                    entrenador: {
                      type: 'object',
                      properties: {
                        id_entrenador: {
                          type: 'integer',
                          example: 1
                        },
                        especialidad: {
                          type: 'string',
                          example: 'Entrenamiento funcional'
                        },
                        nombre: {
                          type: 'string',
                          example: 'Juan'
                        },
                        apellido: {
                          type: 'string',
                          example: 'Pérez'
                        }
                      }
                    }
                  }
                },
                estado: {
                  type: 'string',
                  enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
                  example: 'PENDIENTE',
                  description: 'Estado inicial de la reserva'
                },
                fecha_reserva: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-11-03T14:30:00Z',
                  description: 'Fecha en que se creó la reserva'
                },
                notas: {
                  type: 'string',
                  example: 'Primera sesión, tengo experiencia previa en gimnasio'
                },
                codigo_confirmacion: {
                  type: 'string',
                  example: 'RES-2025110315',
                  description: 'Código único de confirmación'
                },
                instrucciones: {
                  type: 'string',
                  example: 'Por favor, llegar 10 minutos antes. El pago se procesa después de agendar.',
                  description: 'Instrucciones adicionales para el cliente'
                }
              }
            }
          }
        },
        
        // Mis reservas
        MisReservasResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ReservaDetallada'
              }
            },
            total: {
              type: 'integer',
              example: 5,
              description: 'Total de reservas del cliente'
            }
          }
        },
        
        ReservaDetallada: {
          type: 'object',
          properties: {
            id_reserva: {
              type: 'integer',
              example: 15
            },
            estado: {
              type: 'string',
              enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
              example: 'CONFIRMADA'
            },
            fecha_reserva: {
              type: 'string',
              format: 'date-time',
              example: '2025-11-03T14:30:00Z'
            },
            sesion: {
              type: 'object',
              properties: {
                id_sesion: {
                  type: 'integer',
                  example: 1
                },
                fecha: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-11-05T10:00:00Z'
                },
                entrenador: {
                  type: 'object',
                  properties: {
                    nombre: {
                      type: 'string',
                      example: 'Juan'
                    },
                    apellido: {
                      type: 'string',
                      example: 'Pérez'
                    },
                    especialidad: {
                      type: 'string',
                      example: 'Entrenamiento funcional'
                    },
                    experiencia: {
                      type: 'integer',
                      example: 5
                    }
                  }
                }
              }
            },
            puede_cancelar: {
              type: 'boolean',
              example: true,
              description: 'Indica si la reserva puede ser cancelada'
            },
            tiempo_restante: {
              type: 'string',
              example: '2 días, 4 horas',
              description: 'Tiempo restante hasta la sesión'
            }
          }
        },
        
        // Pago de sesión
        CrearPagoRequest: {
          type: 'object',
          required: ['id_reserva', 'monto', 'metodo_pago'],
          properties: {
            id_reserva: {
              type: 'integer',
              example: 15,
              description: '⚠️ REQUERIDO: ID de la reserva a pagar'
            },
            monto: {
              type: 'number',
              format: 'decimal',
              example: 350.00,
              description: '⚠️ REQUERIDO: Monto a pagar (debe coincidir con el precio de la sesión)'
            },
            metodo_pago: {
              type: 'string',
              enum: ['tarjeta', 'transferencia', 'efectivo', 'paypal'],
              example: 'tarjeta',
              description: '⚠️ REQUERIDO: Método de pago seleccionado'
            },
            referencia_pago: {
              type: 'string',
              example: 'TXN-20251103-ABC123',
              description: 'Referencia de la transacción (opcional)'
            }
          }
        },
        
        PagoResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Pago registrado exitosamente'
            },
            data: {
              type: 'object',
              properties: {
                id_pago: {
                  type: 'integer',
                  example: 8
                },
                id_reserva: {
                  type: 'integer',
                  example: 15
                },
                monto: {
                  type: 'number',
                  example: 350.00
                },
                metodo_pago: {
                  type: 'string',
                  example: 'tarjeta'
                },
                estado_pago: {
                  type: 'string',
                  enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO'],
                  example: 'COMPLETADO'
                },
                fecha_pago: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-11-03T15:00:00Z'
                },
                comprobante_url: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://storage.example.com/comprobantes/pago-8.pdf',
                  description: 'URL del comprobante de pago generado'
                }
              }
            }
          }
        },
        
        // Reseña
        CrearReseñaRequest: {
          type: 'object',
          required: ['id_entrenador', 'id_cliente', 'calificacion'],
          properties: {
            id_entrenador: {
              type: 'integer',
              example: 1,
              description: '⚠️ REQUERIDO: ID del entrenador a calificar'
            },
            id_cliente: {
              type: 'integer',
              example: 5,
              description: '⚠️ REQUERIDO: ID del cliente que califica'
            },
            calificacion: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 5,
              description: '⚠️ REQUERIDO: Calificación de 1 a 5 estrellas'
            },
            comentario: {
              type: 'string',
              example: 'Excelente entrenador, muy profesional y atento. Logré mis objetivos en pocas sesiones.',
              description: 'Comentario opcional sobre la experiencia'
            }
          }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // OTROS ESQUEMAS AUXILIARES
        // ═══════════════════════════════════════════════════════════════════
        
        EntrenadorDisponible: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del entrenador',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del entrenador',
            },
            apellido: {
              type: 'string',
              description: 'Apellido del entrenador',
            },
            especialidades: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de especialidades del entrenador',
            },
            calificacion_promedio: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Calificación promedio del entrenador',
            },
            tarifa_por_hora: {
              type: 'number',
              minimum: 0,
              description: 'Tarifa por hora en la moneda local',
            },
            experiencia_anos: {
              type: 'integer',
              minimum: 0,
              description: 'Años de experiencia',
            },
            biografia: {
              type: 'string',
              description: 'Biografía del entrenador',
            },
            foto_url: {
              type: 'string',
              format: 'uri',
              description: 'URL de la foto del entrenador',
            },
            deportes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID del deporte',
                  },
                  nombre: {
                    type: 'string',
                    description: 'Nombre del deporte',
                  },
                  nivel_competencia: {
                    type: 'string',
                    description: 'Nivel de competencia del entrenador',
                  },
                },
              },
              description: 'Deportes que maneja el entrenador',
            },
            horarios_disponibles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  fecha: {
                    type: 'string',
                    format: 'date',
                    description: 'Fecha disponible',
                  },
                  hora_inicio: {
                    type: 'string',
                    format: 'time',
                    description: 'Hora de inicio disponible',
                  },
                  hora_fin: {
                    type: 'string',
                    format: 'time',
                    description: 'Hora de fin disponible',
                  },
                  disponible: {
                    type: 'boolean',
                    description: 'Indica si está disponible',
                  },
                },
              },
              description: 'Horarios disponibles del entrenador',
            },
            ubicacion: {
              type: 'string',
              description: 'Ubicación del entrenador',
            },
            distancia: {
              type: 'number',
              description: 'Distancia en kilómetros (si se proporcionó ubicación)',
            },
          },
        },
        DisponibilidadEntrenador: {
          type: 'object',
          properties: {
            entrenador: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del entrenador',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre completo del entrenador',
                },
                apellido: {
                  type: 'string',
                  description: 'Apellido del entrenador',
                },
                tarifa_por_hora: {
                  type: 'number',
                  description: 'Tarifa por hora',
                },
              },
            },
            disponibilidad: {
              type: 'object',
              properties: {
                fechas_disponibles: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'date',
                  },
                  description: 'Fechas con disponibilidad',
                },
                horarios_ocupados: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      fecha: {
                        type: 'string',
                        format: 'date',
                      },
                      hora_inicio: {
                        type: 'string',
                        format: 'time',
                      },
                      hora_fin: {
                        type: 'string',
                        format: 'time',
                      },
                    },
                  },
                  description: 'Horarios ya ocupados',
                },
                proximas_fechas_libres: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'date-time',
                  },
                  description: 'Próximas fechas y horas libres',
                },
              },
            },
            zona_horaria: {
              type: 'string',
              description: 'Zona horaria del entrenador',
            },
          },
        },
        CitaAgendada: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la cita',
            },
            entrenador: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del entrenador',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre del entrenador',
                },
                apellido: {
                  type: 'string',
                  description: 'Apellido del entrenador',
                },
                telefono: {
                  type: 'string',
                  description: 'Teléfono del entrenador',
                },
              },
            },
            cliente: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del cliente',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre del cliente',
                },
                apellido: {
                  type: 'string',
                  description: 'Apellido del cliente',
                },
              },
            },
            deporte: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del deporte',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre del deporte',
                },
              },
            },
            fecha_hora: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la cita',
            },
            duracion_minutos: {
              type: 'integer',
              minimum: 30,
              maximum: 180,
              description: 'Duración de la sesión en minutos',
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
              description: 'Estado actual de la cita',
            },
            precio_total: {
              type: 'number',
              minimum: 0,
              description: 'Precio total de la sesión',
            },
            ubicacion: {
              type: 'string',
              description: 'Ubicación donde se realizará la sesión',
            },
            notas: {
              type: 'string',
              description: 'Notas adicionales del cliente',
            },
            codigo_confirmacion: {
              type: 'string',
              description: 'Código de confirmación único',
            },
            instrucciones_pago: {
              type: 'string',
              description: 'Instrucciones para realizar el pago',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación de la cita',
            },
          },
        },
        CitaDetallada: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la cita',
            },
            entrenador: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del entrenador',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre del entrenador',
                },
                apellido: {
                  type: 'string',
                  description: 'Apellido del entrenador',
                },
                foto_url: {
                  type: 'string',
                  format: 'uri',
                  description: 'URL de la foto del entrenador',
                },
              },
            },
            deporte: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'ID del deporte',
                },
                nombre: {
                  type: 'string',
                  description: 'Nombre del deporte',
                },
              },
            },
            fecha_hora: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la cita',
            },
            duracion_minutos: {
              type: 'integer',
              description: 'Duración en minutos',
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
              description: 'Estado de la cita',
            },
            precio: {
              type: 'number',
              description: 'Precio de la sesión',
            },
            notas: {
              type: 'string',
              description: 'Notas de la cita',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
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