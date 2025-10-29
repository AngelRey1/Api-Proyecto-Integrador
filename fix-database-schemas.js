const fs = require('fs');
const path = require('path');

// Basado en la imagen de la base de datos, estos son los endpoints que cada controlador debe tener
const databaseEndpoints = {
  'UsuarioController.ts': {
    entity: 'usuario',
    endpoints: [
      'POST /usuarios/register - Registrar nuevo usuario',
      'POST /usuarios/login - Iniciar sesión',
      'GET /usuarios - Obtener todos los usuarios',
      'GET /usuarios/{id} - Obtener usuario por ID',
      'PUT /usuarios/{id} - Actualizar usuario',
      'DELETE /usuarios/{id} - Eliminar usuario'
    ]
  },
  'ClienteController.ts': {
    entity: 'cliente',
    endpoints: [
      'GET /clientes - Obtener todos los clientes',
      'POST /clientes - Crear nuevo cliente',
      'GET /clientes/{id} - Obtener cliente por ID',
      'PUT /clientes/{id} - Actualizar cliente',
      'DELETE /clientes/{id} - Eliminar cliente'
    ]
  },
  'EntrenadorController.ts': {
    entity: 'entrenador',
    endpoints: [
      'GET /entrenadores - Obtener todos los entrenadores',
      'POST /entrenadores - Crear nuevo entrenador',
      'GET /entrenadores/{id} - Obtener entrenador por ID',
      'PUT /entrenadores/{id} - Actualizar entrenador',
      'DELETE /entrenadores/{id} - Eliminar entrenador'
    ]
  },
  'DeporteController.ts': {
    entity: 'deporte',
    endpoints: [
      'GET /deportes - Obtener todos los deportes',
      'POST /deportes - Crear nuevo deporte',
      'GET /deportes/{id} - Obtener deporte por ID',
      'PUT /deportes/{id} - Actualizar deporte',
      'DELETE /deportes/{id} - Eliminar deporte'
    ]
  },
  'CatalogoEntrenamientoController.ts': {
    entity: 'catalogoentrenamiento',
    endpoints: [
      'GET /catalogos-entrenamiento - Obtener todos los catálogos',
      'POST /catalogos-entrenamiento - Crear nuevo catálogo',
      'GET /catalogos-entrenamiento/{id} - Obtener catálogo por ID',
      'PUT /catalogos-entrenamiento/{id} - Actualizar catálogo',
      'DELETE /catalogos-entrenamiento/{id} - Eliminar catálogo'
    ]
  },
  'CatalogoActividadesController.ts': {
    entity: 'catalogoactividades',
    endpoints: [
      'GET /catalogo-actividades - Obtener todas las actividades'
    ]
  },
  'HorarioController.ts': {
    entity: 'horario',
    endpoints: [
      'GET /horarios - Obtener todos los horarios',
      'POST /horarios - Crear nuevo horario',
      'GET /horarios/{id} - Obtener horario por ID',
      'PUT /horarios/{id} - Actualizar horario',
      'DELETE /horarios/{id} - Eliminar horario',
      'GET /horarios/entrenador/{entrenadorId} - Obtener horarios por entrenador'
    ]
  },
  'CalendarioDisponibilidadController.ts': {
    entity: 'calendariodisponibilidad',
    endpoints: [
      'GET /calendario-disponibilidad - Obtener todas las disponibilidades'
    ]
  },
  'SesionController.ts': {
    entity: 'sesion',
    endpoints: [
      'GET /sesiones - Obtener todas las sesiones',
      'POST /sesiones - Crear nueva sesión',
      'GET /sesiones/{id} - Obtener sesión por ID',
      'GET /sesiones/horario/{horarioId} - Obtener sesiones por horario',
      'GET /sesiones/fecha/{fecha} - Obtener sesiones por fecha'
    ]
  },
  'ReservaController.ts': {
    entity: 'reserva',
    endpoints: [
      'GET /reservas - Obtener todas las reservas',
      'POST /reservas - Crear nueva reserva',
      'GET /reservas/{id} - Obtener reserva por ID',
      'PUT /reservas/{id} - Actualizar reserva',
      'DELETE /reservas/{id} - Eliminar reserva'
    ]
  },
  'PagoController.ts': {
    entity: 'pago',
    endpoints: [
      'GET /pagos - Obtener todos los pagos',
      'POST /pagos - Crear nuevo pago',
      'GET /pagos/{id} - Obtener pago por ID'
    ]
  },
  'ComentarioController.ts': {
    entity: 'comentario',
    endpoints: [
      'GET /comentarios - Obtener todos los comentarios'
    ]
  },
  'ReseñaController.ts': {
    entity: 'reseña',
    endpoints: [
      'GET /reseñas - Obtener todas las reseñas'
    ]
  },
  'NotificacionController.ts': {
    entity: 'notificacion',
    endpoints: [
      'GET /notificaciones - Obtener todas las notificaciones',
      'GET /notificaciones/usuario/{usuarioId}/no-leidas - Obtener notificaciones no leídas',
      'PUT /notificaciones/{id}/marcar-leida - Marcar notificación como leída'
    ]
  },
  'RetroalimentacionAppController.ts': {
    entity: 'retroalimentacionapp',
    endpoints: [
      'GET /retroalimentacion-app - Obtener todas las retroalimentaciones'
    ]
  }
};

function analyzeControllers() {
  const controllersDir = path.join(__dirname, 'src', 'presentation', 'controllers');
  
  console.log('📊 ANÁLISIS DE CONTROLADORES SEGÚN BASE DE DATOS');
  console.log('='.repeat(60));
  
  Object.entries(databaseEndpoints).forEach(([filename, config]) => {
    const filePath = path.join(controllersDir, filename);
    
    console.log(`\n🔍 ${filename}`);
    console.log(`Entidad: ${config.entity}`);
    console.log('Endpoints esperados:');
    
    config.endpoints.forEach(endpoint => {
      console.log(`  ✓ ${endpoint}`);
    });
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Contar métodos async
      const asyncMethods = content.match(/async \w+\(/g) || [];
      console.log(`Métodos implementados: ${asyncMethods.length}`);
      
      // Verificar si tiene documentación Swagger
      const swaggerDocs = content.match(/@swagger/g) || [];
      console.log(`Documentación Swagger: ${swaggerDocs.length} endpoints documentados`);
      
    } else {
      console.log('❌ Archivo no existe');
    }
  });
  
  console.log('\n📋 RESUMEN DE ENDPOINTS REQUERIDOS:');
  console.log('='.repeat(40));
  
  let totalEndpoints = 0;
  Object.values(databaseEndpoints).forEach(config => {
    totalEndpoints += config.endpoints.length;
  });
  
  console.log(`Total de endpoints requeridos: ${totalEndpoints}`);
  console.log('\nEndpoints por categoría:');
  console.log('• CRUD completo: Usuario, Cliente, Entrenador, Deporte, CatalogoEntrenamiento, Horario, Reserva');
  console.log('• CRUD parcial: Sesion, Pago');
  console.log('• Solo lectura: CatalogoActividades, CalendarioDisponibilidad, Comentario, Reseña, RetroalimentacionApp');
  console.log('• Especiales: Notificacion (con endpoints específicos)');
}

analyzeControllers();