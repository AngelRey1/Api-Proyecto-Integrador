const fs = require('fs');
const path = require('path');

// Mapeo de tags antiguos a nuevos
const tagMapping = {
  '🎯 Agendamiento': '🎯 2. Agendamiento Principal',
  '01. Autenticación y Usuarios': '🔐 1. Autenticación y Onboarding',
  '02. Gestión de Perfiles - Clientes': '👤 Perfiles de Clientes',
  '03. Gestión de Perfiles - Entrenadores': '🏃‍♂️ Perfiles de Entrenadores',
  '04. Catálogos - Deportes': '🏆 Catálogo de Deportes',
  '05. Catálogos - Entrenamientos': '💪 Catálogo de Entrenamientos',
  '06. Actividades Personalizadas': '🎯 Catálogo de Actividades',
  '07. Horarios y Disponibilidad': '📅 Disponibilidad y Horarios',
  '08. Sesiones': '🔧 Sesiones Técnicas',
  '09. Reservas': '🔧 Reservas Técnicas',
  '10. Pagos': '💰 3. Gestión de Pagos',
  '11. Reseñas y Comentarios': '📊 4. Seguimiento y Evaluación',
  '12. Sistema - Notificaciones': '🔔 5. Notificaciones y Comunicación',
  '13. Sistema - Retroalimentación': '📱 6. Retroalimentación de la App'
};

function updateSwaggerTags(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Actualizar tags en comentarios Swagger
    for (const [oldTag, newTag] of Object.entries(tagMapping)) {
      const oldPattern = new RegExp(`tags:\\s*\\[${oldTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
      const newPattern = `tags: [${newTag}]`;
      
      if (content.match(oldPattern)) {
        content = content.replace(oldPattern, newPattern);
        updated = true;
        console.log(`✅ Updated tag in ${filePath}: "${oldTag}" → "${newTag}"`);
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
    }

    return updated;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalUpdated = 0;

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      totalUpdated += processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      if (updateSwaggerTags(fullPath)) {
        totalUpdated++;
      }
    }
  }

  return totalUpdated;
}

console.log('🔧 Actualizando tags de Swagger...');
const controllersPath = path.join(__dirname, 'src', 'presentation', 'controllers');
const routesPath = path.join(__dirname, 'src', 'presentation', 'routes');

let totalFiles = 0;
totalFiles += processDirectory(controllersPath);
totalFiles += processDirectory(routesPath);

console.log(`\n✅ Proceso completado. ${totalFiles} archivos actualizados.`);