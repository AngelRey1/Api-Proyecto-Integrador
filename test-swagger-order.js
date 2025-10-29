const axios = require('axios');

async function testSwaggerOrder() {
  try {
    console.log('🔍 Verificando orden de endpoints en Swagger...');
    
    const response = await axios.get('http://localhost:3000/api-docs.json');
    const swaggerSpec = response.data;
    
    // Extraer todos los tags únicos y ordenarlos
    const tags = new Set();
    
    Object.entries(swaggerSpec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, spec]) => {
        if (spec.tags && spec.tags[0]) {
          tags.add(spec.tags[0]);
        }
      });
    });
    
    const sortedTags = Array.from(tags).sort();
    
    console.log('\n📋 ORDEN ACTUAL DE TAGS EN SWAGGER:');
    console.log('=====================================');
    sortedTags.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag}`);
    });
    
    // Verificar si el orden es correcto
    const expectedOrder = [
      '01. Autenticación y Usuarios',
      '02. Gestión de Perfiles - Clientes',
      '03. Gestión de Perfiles - Entrenadores',
      '04. Catálogos - Deportes',
      '05. Catálogos - Entrenamientos',
      '06. Actividades Personalizadas',
      '07. Horarios y Disponibilidad',
      '08. Sesiones',
      '09. Reservas',
      '10. Pagos',
      '11. Reseñas y Comentarios',
      '12. Sistema - Notificaciones',
      '13. Sistema - Retroalimentación'
    ];
    
    console.log('\n🎯 ORDEN ESPERADO:');
    console.log('==================');
    expectedOrder.forEach((tag, index) => {
      console.log(`${index + 1}. ${tag}`);
    });
    
    // Comparar órdenes
    const isCorrectOrder = JSON.stringify(sortedTags) === JSON.stringify(expectedOrder);
    
    if (isCorrectOrder) {
      console.log('\n✅ ¡PERFECTO! Los endpoints están en el orden correcto');
    } else {
      console.log('\n❌ Los endpoints NO están en el orden correcto');
      console.log('\n🔧 Tags que faltan o están mal:');
      expectedOrder.forEach(expected => {
        if (!sortedTags.includes(expected)) {
          console.log(`   - Falta: ${expected}`);
        }
      });
    }
    
    console.log('\n🌐 Swagger UI disponible en: http://localhost:3000/api-docs');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ No se puede conectar al servidor');
      console.log('💡 Asegúrate de que el servidor esté ejecutándose con: npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testSwaggerOrder();