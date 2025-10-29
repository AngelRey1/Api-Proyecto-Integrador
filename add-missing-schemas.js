const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, 'src', 'infrastructure', 'web', 'swagger.ts');
let swaggerContent = fs.readFileSync(swaggerPath, 'utf8');

// Esquemas que faltan
const missingSchemas = `
// Comentario schemas
swaggerSpec.components.schemas.Comentario = {
  type: 'object',
  properties: {
    id_comentario: {
      type: 'integer',
      description: 'ID único del comentario',
    },
    id_cliente: {
      type: 'integer',
      description: 'ID del cliente que hace el comentario',
    },
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador comentado',
    },
    comentario: {
      type: 'string',
      description: 'Texto del comentario',
    },
    fecha_comentario: {
      type: 'string',
      format: 'date-time',
      description: 'Fecha del comentario',
    },
    cliente: {
      $ref: '#/components/schemas/Cliente',
      description: 'Datos del cliente',
    },
    entrenador: {
      $ref: '#/components/schemas/Entrenador',
      description: 'Datos del entrenador',
    },
  },
};

swaggerSpec.components.schemas.CreateComentario = {
  type: 'object',
  required: ['id_cliente', 'id_entrenador', 'comentario'],
  properties: {
    id_cliente: {
      type: 'integer',
      description: 'ID del cliente que hace el comentario',
    },
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador comentado',
    },
    comentario: {
      type: 'string',
      minLength: 1,
      description: 'Texto del comentario',
    },
  },
};

// Reseña schemas
swaggerSpec.components.schemas.Reseña = {
  type: 'object',
  properties: {
    id_reseña: {
      type: 'integer',
      description: 'ID único de la reseña',
    },
    id_cliente: {
      type: 'integer',
      description: 'ID del cliente que hace la reseña',
    },
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador reseñado',
    },
    calificacion: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
      description: 'Calificación de 1 a 5 estrellas',
    },
    comentario: {
      type: 'string',
      description: 'Comentario de la reseña',
    },
    fecha_reseña: {
      type: 'string',
      format: 'date-time',
      description: 'Fecha de la reseña',
    },
    cliente: {
      $ref: '#/components/schemas/Cliente',
      description: 'Datos del cliente',
    },
    entrenador: {
      $ref: '#/components/schemas/Entrenador',
      description: 'Datos del entrenador',
    },
  },
};

swaggerSpec.components.schemas.CreateReseña = {
  type: 'object',
  required: ['id_cliente', 'id_entrenador', 'calificacion'],
  properties: {
    id_cliente: {
      type: 'integer',
      description: 'ID del cliente que hace la reseña',
    },
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador reseñado',
    },
    calificacion: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
      description: 'Calificación de 1 a 5 estrellas',
    },
    comentario: {
      type: 'string',
      description: 'Comentario de la reseña',
    },
  },
};

// Notificacion schemas
swaggerSpec.components.schemas.Notificacion = {
  type: 'object',
  properties: {
    id_notificacion: {
      type: 'integer',
      description: 'ID único de la notificación',
    },
    id_usuario: {
      type: 'integer',
      description: 'ID del usuario destinatario',
    },
    titulo: {
      type: 'string',
      description: 'Título de la notificación',
    },
    mensaje: {
      type: 'string',
      description: 'Mensaje de la notificación',
    },
    leida: {
      type: 'boolean',
      description: 'Indica si la notificación fue leída',
    },
    fecha_creacion: {
      type: 'string',
      format: 'date-time',
      description: 'Fecha de creación de la notificación',
    },
    usuario: {
      $ref: '#/components/schemas/Usuario',
      description: 'Datos del usuario destinatario',
    },
  },
};

swaggerSpec.components.schemas.CreateNotificacion = {
  type: 'object',
  required: ['id_usuario', 'titulo', 'mensaje'],
  properties: {
    id_usuario: {
      type: 'integer',
      description: 'ID del usuario destinatario',
    },
    titulo: {
      type: 'string',
      minLength: 1,
      description: 'Título de la notificación',
    },
    mensaje: {
      type: 'string',
      minLength: 1,
      description: 'Mensaje de la notificación',
    },
    leida: {
      type: 'boolean',
      default: false,
      description: 'Indica si la notificación fue leída',
    },
  },
};

// RetroalimentacionApp schemas
swaggerSpec.components.schemas.RetroalimentacionApp = {
  type: 'object',
  properties: {
    id_retroalimentacion: {
      type: 'integer',
      description: 'ID único de la retroalimentación',
    },
    id_usuario: {
      type: 'integer',
      description: 'ID del usuario que da la retroalimentación',
    },
    calificacion: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
      description: 'Calificación de la aplicación de 1 a 5 estrellas',
    },
    comentario: {
      type: 'string',
      description: 'Comentario sobre la aplicación',
    },
    fecha_retroalimentacion: {
      type: 'string',
      format: 'date-time',
      description: 'Fecha de la retroalimentación',
    },
    usuario: {
      $ref: '#/components/schemas/Usuario',
      description: 'Datos del usuario',
    },
  },
};

swaggerSpec.components.schemas.CreateRetroalimentacionApp = {
  type: 'object',
  required: ['id_usuario', 'calificacion'],
  properties: {
    id_usuario: {
      type: 'integer',
      description: 'ID del usuario que da la retroalimentación',
    },
    calificacion: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
      description: 'Calificación de la aplicación de 1 a 5 estrellas',
    },
    comentario: {
      type: 'string',
      description: 'Comentario sobre la aplicación',
    },
  },
};

// CatalogoActividades schemas
swaggerSpec.components.schemas.CatalogoActividades = {
  type: 'object',
  properties: {
    id_actividad: {
      type: 'integer',
      description: 'ID único de la actividad',
    },
    nombre: {
      type: 'string',
      description: 'Nombre de la actividad',
    },
    descripcion: {
      type: 'string',
      description: 'Descripción de la actividad',
    },
    duracion: {
      type: 'integer',
      description: 'Duración en minutos',
    },
    nivel: {
      type: 'string',
      enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
      description: 'Nivel de dificultad',
    },
  },
};

swaggerSpec.components.schemas.CreateCatalogoActividades = {
  type: 'object',
  required: ['nombre', 'nivel'],
  properties: {
    nombre: {
      type: 'string',
      minLength: 2,
      description: 'Nombre de la actividad',
    },
    descripcion: {
      type: 'string',
      description: 'Descripción de la actividad',
    },
    duracion: {
      type: 'integer',
      minimum: 1,
      description: 'Duración en minutos',
    },
    nivel: {
      type: 'string',
      enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
      description: 'Nivel de dificultad',
    },
  },
};

// CalendarioDisponibilidad schemas
swaggerSpec.components.schemas.CalendarioDisponibilidad = {
  type: 'object',
  properties: {
    id_disponibilidad: {
      type: 'integer',
      description: 'ID único de la disponibilidad',
    },
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador',
    },
    fecha: {
      type: 'string',
      format: 'date',
      description: 'Fecha de disponibilidad',
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
    disponible: {
      type: 'boolean',
      description: 'Indica si está disponible',
    },
    entrenador: {
      $ref: '#/components/schemas/Entrenador',
      description: 'Datos del entrenador',
    },
  },
};

swaggerSpec.components.schemas.CreateCalendarioDisponibilidad = {
  type: 'object',
  required: ['id_entrenador', 'fecha', 'hora_inicio', 'hora_fin'],
  properties: {
    id_entrenador: {
      type: 'integer',
      description: 'ID del entrenador',
    },
    fecha: {
      type: 'string',
      format: 'date',
      description: 'Fecha de disponibilidad',
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
    disponible: {
      type: 'boolean',
      default: true,
      description: 'Indica si está disponible',
    },
  },
};
`;

// Agregar los esquemas al final del archivo, antes del último }
const insertPosition = swaggerContent.lastIndexOf('};');
const beforeClosing = swaggerContent.substring(0, insertPosition);
const afterClosing = swaggerContent.substring(insertPosition);

const newContent = beforeClosing + missingSchemas + afterClosing;

fs.writeFileSync(swaggerPath, newContent);
console.log('✅ Esquemas faltantes agregados al archivo swagger.ts');