const fs = require('fs');
const path = require('path');

// Mapeo correcto con números para forzar orden en Swagger
const tagMappings = {
  'UsuarioController.ts': {
    'tags: [1. Autenticación]': 'tags: ["01. Autenticación"]',
    'tags: [2. Gestión de Usuarios]': 'tags: ["02. Gestión de Usuarios"]'
  },
  'EntrenadorController.ts': {
    'tags: [2. Gestión de Perfiles - Entrenadores]': 'tags: ["03. Entrenadores"]'
  },
  'ClienteController.ts': {
    'tags: [2. Gestión de Perfiles - Clientes]': 'tags: ["04. Clientes"]'
  },
  'DeporteController.ts': {
    'tags: [3. Catálogos - Deportes]': 'tags: ["05. Deportes"]'
  },
  'CatalogoEntrenamientoController.ts': {
    'tags: [3. Catálogos - Entrenamientos]': 'tags: ["06. Catálogos de Entrenamiento"]'
  },
  'HorarioController.ts': {
    'tags: [4. Horarios y Disponibilidad]': 'tags: ["07. Horarios"]'
  },
  'CalendarioDisponibilidadController.ts': {
    'tags: [4. Horarios y Disponibilidad]': 'tags: ["08. Calendario de Disponibilidad"]'
  },
  'SesionController.ts': {
    'tags: [5. Sesiones]': 'tags: ["09. Sesiones"]'
  },
  'ReservaController.ts': {
    'tags: [6. Reservas]': 'tags: ["10. Reservas"]'
  },
  'PagoController.ts': {
    'tags: [7. Pagos]': 'tags: ["11. Pagos"]'
  },
  'ReseñaController.ts': {
    'tags: [8. Reseñas y Comentarios]': 'tags: ["12. Reseñas"]'
  },
  'ComentarioController.ts': {
    'tags: [8. Reseñas y Comentarios]': 'tags: ["13. Comentarios"]'
  },
  'CatalogoActividadesController.ts': {
    'tags: [9. Actividades Personalizadas]': 'tags: ["14. Catálogo de Actividades"]'
  },
  'NotificacionController.ts': {
    'tags: [10. Sistema - Notificaciones]': 'tags: ["15. Notificaciones"]'
  },
  'RetroalimentacionAppController.ts': {
    'tags: [10. Sistema - Retroalimentación]': 'tags: ["16. Retroalimentación de App"]'
  }
};

const controllersPath = 'src/presentation/controllers';

Object.entries(tagMappings).forEach(([filename, replacements]) => {
  const filePath = path.join(controllersPath, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Aplicar todos los reemplazos para este archivo
    Object.entries(replacements).forEach(([oldTag, newTag]) => {
      content = content.replace(new RegExp(oldTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTag);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filename}`);
  } else {
    console.log(`❌ File not found: ${filename}`);
  }
});

console.log('\n🎉 All Swagger tags reordered successfully!');