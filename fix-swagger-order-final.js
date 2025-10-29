const fs = require('fs');
const path = require('path');

// Mapeo correcto con números de dos dígitos para forzar orden alfabético
const tagMapping = {
  'UsuarioController.ts': '01. Autenticación y Usuarios',
  'ClienteController.ts': '02. Gestión de Perfiles - Clientes', 
  'EntrenadorController.ts': '03. Gestión de Perfiles - Entrenadores',
  'DeporteController.ts': '04. Catálogos - Deportes',
  'CatalogoEntrenamientoController.ts': '05. Catálogos - Entrenamientos',
  'CatalogoActividadesController.ts': '06. Actividades Personalizadas',
  'HorarioController.ts': '07. Horarios y Disponibilidad',
  'CalendarioDisponibilidadController.ts': '07. Horarios y Disponibilidad',
  'SesionController.ts': '08. Sesiones',
  'ReservaController.ts': '09. Reservas',
  'PagoController.ts': '10. Pagos',
  'ComentarioController.ts': '11. Reseñas y Comentarios',
  'ReseñaController.ts': '11. Reseñas y Comentarios',
  'NotificacionController.ts': '12. Sistema - Notificaciones',
  'RetroalimentacionAppController.ts': '13. Sistema - Retroalimentación'
};

const controllersDir = path.join(__dirname, 'src', 'presentation', 'controllers');

Object.entries(tagMapping).forEach(([filename, newTag]) => {
  const filePath = path.join(controllersDir, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar y reemplazar TODOS los tags en el archivo
    const tagRegex = /tags:\s*\[[^\]]*\]/g;
    const newTagString = `tags: [${newTag}]`;
    
    // Contar cuántos tags hay
    const matches = content.match(tagRegex);
    if (matches && matches.length > 0) {
      content = content.replace(tagRegex, newTagString);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Actualizado ${matches.length} tags en: ${filename} -> ${newTag}`);
    } else {
      console.log(`⚠️  No se encontraron tags en: ${filename}`);
    }
  } else {
    console.log(`❌ No existe: ${filename}`);
  }
});

console.log('\n🎯 Orden correcto esperado en Swagger:');
console.log('01. Autenticación y Usuarios');
console.log('02. Gestión de Perfiles - Clientes');
console.log('03. Gestión de Perfiles - Entrenadores');
console.log('04. Catálogos - Deportes');
console.log('05. Catálogos - Entrenamientos');
console.log('06. Actividades Personalizadas');
console.log('07. Horarios y Disponibilidad');
console.log('08. Sesiones');
console.log('09. Reservas');
console.log('10. Pagos');
console.log('11. Reseñas y Comentarios');
console.log('12. Sistema - Notificaciones');
console.log('13. Sistema - Retroalimentación');