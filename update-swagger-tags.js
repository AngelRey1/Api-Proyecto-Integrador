const fs = require('fs');
const path = require('path');

// Mapeo de archivos y sus nuevos tags
const tagMappings = {
  'EntrenadorController.ts': '2. Gestión de Perfiles - Entrenadores',
  'ClienteController.ts': '2. Gestión de Perfiles - Clientes', 
  'DeporteController.ts': '3. Catálogos - Deportes',
  'CatalogoEntrenamientoController.ts': '3. Catálogos - Entrenamientos',
  'HorarioController.ts': '4. Horarios y Disponibilidad',
  'CalendarioDisponibilidadController.ts': '4. Horarios y Disponibilidad',
  'SesionController.ts': '5. Sesiones',
  'ReservaController.ts': '6. Reservas',
  'PagoController.ts': '7. Pagos',
  'ReseñaController.ts': '8. Reseñas y Comentarios',
  'ComentarioController.ts': '8. Reseñas y Comentarios',
  'CatalogoActividadesController.ts': '9. Actividades Personalizadas',
  'NotificacionController.ts': '10. Sistema - Notificaciones',
  'RetroalimentacionAppController.ts': '10. Sistema - Retroalimentación'
};

const controllersPath = 'src/presentation/controllers';

Object.entries(tagMappings).forEach(([filename, newTag]) => {
  const filePath = path.join(controllersPath, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazar todos los tags existentes con el nuevo tag
    content = content.replace(/tags: \[[^\]]+\]/g, `tags: [${newTag}]`);
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filename} with tag: ${newTag}`);
  } else {
    console.log(`❌ File not found: ${filename}`);
  }
});

console.log('\n🎉 All Swagger tags updated successfully!');