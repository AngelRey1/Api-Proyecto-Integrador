const axios = require('axios');

async function testSwagger() {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Dar tiempo para que el servidor inicie
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📋 Verificando Swagger UI...');
    const swaggerResponse = await axios.get('http://localhost:3000/api-docs');
    
    if (swaggerResponse.status === 200) {
      console.log('✅ Swagger UI disponible en: http://localhost:3000/api-docs');
    }
    
    console.log('📊 Verificando JSON de Swagger...');
    const swaggerJsonResponse = await axios.get('http://localhost:3000/api-docs.json');
    
    if (swaggerJsonResponse.status === 200) {
      const swaggerSpec = swaggerJsonResponse.data;
      
      console.log('\n🎯 ENDPOINTS DISPONIBLES EN SWAGGER:');
      console.log('=====================================');
      
      // Extraer y mostrar todos los paths organizados por tags
      const pathsByTag = {};
      
      Object.entries(swaggerSpec.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, spec]) => {
          if (spec.tags && spec.tags[0]) {
            const tag = spec.tags[0];
            if (!pathsByTag[tag]) {
              pathsByTag[tag] = [];
            }
            pathsByTag[tag].push({
              method: method.toUpperCase(),
              path: path,
              summary: spec.summary
            });
          }
        });
      });
      
      // Mostrar ordenado por tags
      Object.keys(pathsByTag).sort().forEach(tag => {
        console.log(`\n${tag}:`);
        pathsByTag[tag].forEach(endpoint => {
          console.log(`  ${endpoint.method} ${endpoint.path} - ${endpoint.summary}`);
        });
      });
      
      console.log('\n✅ Swagger configurado correctamente');
      console.log('🌐 Accede a: http://localhost:3000/api-docs');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor esté ejecutándose con: npm start');
    }
  }
}

testSwagger();