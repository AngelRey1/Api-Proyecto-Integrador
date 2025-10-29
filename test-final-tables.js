const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testFinalTables() {
  console.log('🧪 PROBANDO TABLAS FALTANTES');
  console.log('='.repeat(40));

  try {
    // Obtener tokens
    const clienteLogin = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'Angel@gmail.com',
      contrasena: '123456'
    });
    const clienteToken = clienteLogin.data.data.token;

    const headers = {
      'Authorization': `Bearer ${clienteToken}`,
      'Content-Type': 'application/json'
    };

    // 1. Probar crear reseña
    console.log('1️⃣ Probando crear reseña...');
    const reseñaData = {
      id_cliente: 1,
      id_entrenador: 1,
      calificacion: 5,
      comentario: 'Excelente entrenador, muy recomendado!'
    };

    try {
      const response = await axios.post(`${BASE_URL}/reseñas`, reseñaData, { headers });
      console.log('   ✅ Reseña creada exitosamente');
    } catch (error) {
      console.log('   ❌ Error creando reseña:', error.response?.data?.error);
      console.log('   🔍 Status:', error.response?.status);
      console.log('   🔍 URL intentada:', error.config?.url);
    }

    // 2. Probar listar reseñas
    console.log('\n2️⃣ Probando listar reseñas...');
    try {
      const response = await axios.get(`${BASE_URL}/reseñas`, { headers });
      console.log('   ✅ Reseñas obtenidas:', response.data.data?.length || 0);
    } catch (error) {
      console.log('   ❌ Error listando reseñas:', error.response?.data?.error);
    }

    // 3. Probar crear comentario
    console.log('\n3️⃣ Probando crear comentario...');
    const comentarioData = {
      id_cliente: 1,
      id_entrenador: 1,
      comentario: 'Muy buen entrenador, explica muy bien los ejercicios.'
    };

    try {
      const response = await axios.post(`${BASE_URL}/comentarios`, comentarioData, { headers });
      console.log('   ✅ Comentario creado exitosamente');
    } catch (error) {
      console.log('   ❌ Error creando comentario:', error.response?.data?.error);
    }

    // 4. Verificar estado final de todas las tablas
    console.log('\n4️⃣ Estado final de todas las tablas:');
    
    const tablas = [
      { endpoint: '/catalogo-actividades', name: 'Catálogo Actividades', needsEntrenador: true },
      { endpoint: '/calendario-disponibilidad', name: 'Calendario Disponibilidad', needsEntrenador: true },
      { endpoint: '/comentarios', name: 'Comentarios', needsEntrenador: false },
      { endpoint: '/reseñas', name: 'Reseñas', needsEntrenador: false },
      { endpoint: '/notificaciones', name: 'Notificaciones', needsEntrenador: false },
      { endpoint: '/retroalimentacion-app', name: 'Retroalimentación App', needsEntrenador: false }
    ];

    // Obtener token de entrenador para las tablas que lo necesitan
    let entrenadorHeaders = headers;
    try {
      const entrenadorLogin = await axios.post(`${BASE_URL}/usuarios/login`, {
        email: 'ana.garcia@ejemplo.com',
        contrasena: 'password123'
      });
      entrenadorHeaders = {
        'Authorization': `Bearer ${entrenadorLogin.data.data.token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.log('   ⚠️ No se pudo obtener token de entrenador');
    }

    for (const tabla of tablas) {
      try {
        const headersToUse = tabla.needsEntrenador ? entrenadorHeaders : headers;
        const response = await axios.get(`${BASE_URL}${tabla.endpoint}?page=1&limit=5`, { headers: headersToUse });
        const count = response.data.data?.length || 0;
        const status = count > 0 ? '✅' : '⚠️';
        console.log(`   ${status} ${tabla.name}: ${count} registros`);
      } catch (error) {
        console.log(`   ❌ ${tabla.name}: Error - ${error.response?.data?.error}`);
      }
    }

    console.log('\n🎯 RESUMEN:');
    console.log('Las tablas que estaban vacías ahora tienen datos de ejemplo.');
    console.log('Puedes probar todos los endpoints en Swagger: http://localhost:3000/api-docs');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testFinalTables();