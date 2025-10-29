const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Datos de prueba
const testData = {
  usuario: {
    nombre: 'Test',
    apellido: 'Usuario',
    email: 'test.usuario@ejemplo.com',
    contrasena: 'password123',
    rol: 'CLIENTE'
  },
  entrenador: {
    nombre: 'Test',
    apellido: 'Entrenador',
    email: 'test.entrenador@ejemplo.com',
    contrasena: 'password123',
    rol: 'ENTRENADOR'
  },
  cliente: {
    id_usuario: 1,
    telefono: '1234567890',
    direccion: 'Calle Test 123'
  },
  deporte: {
    nombre: 'Fútbol Test',
    descripcion: 'Deporte de prueba',
    nivel: 'PRINCIPIANTE'
  }
};

let clienteToken = '';
let entrenadorToken = '';

async function testCompleteAPISecurity() {
  console.log('🔐 PRUEBA COMPLETA DE SEGURIDAD - APP DEPORTE API');
  console.log('='.repeat(60));
  console.log('Verificando que TODOS los endpoints requieren autenticación\n');

  try {
    // ========================================
    // FASE 1: ENDPOINTS PÚBLICOS (Solo 2)
    // ========================================
    console.log('📋 FASE 1: ENDPOINTS PÚBLICOS (Solo register y login)');
    console.log('-'.repeat(50));

    // 1.1 Register (debe funcionar sin token)
    console.log('1️⃣ POST /usuarios/register (público)');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/usuarios/register`, testData.usuario);
      console.log('   ✅ Register exitoso:', registerResponse.status);
      clienteToken = registerResponse.data.data.token;
    } catch (error) {
      if (error.response?.data?.error?.includes('ya existe')) {
        console.log('   ⚠️ Usuario ya existe, haciendo login...');
        const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
          email: testData.usuario.email,
          contrasena: testData.usuario.contrasena
        });
        clienteToken = loginResponse.data.data.token;
        console.log('   ✅ Login exitoso para obtener token');
      } else {
        console.log('   ❌ Error en register:', error.response?.data?.error);
      }
    }

    // 1.2 Login (debe funcionar sin token)
    console.log('2️⃣ POST /usuarios/login (público)');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
        email: 'ana.garcia@ejemplo.com',
        contrasena: 'password123'
      });
      console.log('   ✅ Login exitoso:', loginResponse.status);
      entrenadorToken = loginResponse.data.data.token;
    } catch (error) {
      console.log('   ❌ Error en login:', error.response?.data?.error);
    }

    console.log('\n🔑 Tokens obtenidos:');
    console.log('   Cliente:', clienteToken ? clienteToken.substring(0, 20) + '...' : 'No obtenido');
    console.log('   Entrenador:', entrenadorToken ? entrenadorToken.substring(0, 20) + '...' : 'No obtenido');

    // ========================================
    // FASE 2: VERIFICAR QUE TODOS LOS DEMÁS ENDPOINTS REQUIEREN TOKEN
    // ========================================
    console.log('\n📋 FASE 2: VERIFICAR SEGURIDAD (Todos deben requerir token)');
    console.log('-'.repeat(50));

    const protectedEndpoints = [
      // Usuarios
      { method: 'GET', url: '/usuarios', name: 'Listar usuarios' },
      { method: 'GET', url: '/usuarios/1', name: 'Obtener usuario por ID' },
      
      // Deportes (ahora protegido)
      { method: 'GET', url: '/deportes', name: 'Listar deportes' },
      { method: 'POST', url: '/deportes', name: 'Crear deporte', data: testData.deporte },
      
      // Catálogos entrenamiento (ahora protegido)
      { method: 'GET', url: '/catalogos-entrenamiento', name: 'Listar catálogos entrenamiento' },
      
      // Clientes
      { method: 'GET', url: '/clientes', name: 'Listar clientes' },
      { method: 'POST', url: '/clientes', name: 'Crear cliente', data: testData.cliente },
      
      // Entrenadores
      { method: 'GET', url: '/entrenadores', name: 'Listar entrenadores' },
      
      // Horarios
      { method: 'GET', url: '/horarios', name: 'Listar horarios' },
      
      // Sesiones
      { method: 'GET', url: '/sesiones', name: 'Listar sesiones' },
      
      // Reservas
      { method: 'GET', url: '/reservas', name: 'Listar reservas' },
      
      // Pagos
      { method: 'GET', url: '/pagos', name: 'Listar pagos' },
      
      // Reseñas
      { method: 'GET', url: '/reseñas', name: 'Listar reseñas' },
      
      // Comentarios
      { method: 'GET', url: '/comentarios', name: 'Listar comentarios' },
      
      // Catálogo actividades
      { method: 'GET', url: '/catalogo-actividades', name: 'Listar actividades' },
      
      // Notificaciones
      { method: 'GET', url: '/notificaciones', name: 'Listar notificaciones' },
      
      // Retroalimentación
      { method: 'GET', url: '/retroalimentacion-app', name: 'Listar retroalimentación' }
    ];

    // 2.1 Probar SIN token (todos deben fallar)
    console.log('\n🚫 Probando endpoints SIN token (todos deben fallar con 401):');
    let securityTestsPassed = 0;
    let securityTestsTotal = protectedEndpoints.length;

    for (const endpoint of protectedEndpoints) {
      try {
        const config = {
          method: endpoint.method.toLowerCase(),
          url: `${BASE_URL}${endpoint.url}`,
        };
        
        if (endpoint.data) {
          config.data = endpoint.data;
        }

        await axios(config);
        console.log(`   ❌ ${endpoint.name}: NO requiere token (FALLO DE SEGURIDAD)`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   ✅ ${endpoint.name}: Correctamente protegido (401)`);
          securityTestsPassed++;
        } else {
          console.log(`   ⚠️ ${endpoint.name}: Error ${error.response?.status} - ${error.response?.data?.error}`);
        }
      }
    }

    console.log(`\n📊 Resultado de seguridad: ${securityTestsPassed}/${securityTestsTotal} endpoints correctamente protegidos`);

    // ========================================
    // FASE 3: PROBAR CON TOKEN VÁLIDO
    // ========================================
    console.log('\n📋 FASE 3: PROBAR CON TOKEN VÁLIDO (Todos deben funcionar)');
    console.log('-'.repeat(50));

    const headers = {
      'Authorization': `Bearer ${clienteToken}`,
      'Content-Type': 'application/json'
    };

    let functionalTestsPassed = 0;
    let functionalTestsTotal = 0;

    for (const endpoint of protectedEndpoints) {
      functionalTestsTotal++;
      try {
        const config = {
          method: endpoint.method.toLowerCase(),
          url: `${BASE_URL}${endpoint.url}`,
          headers: headers
        };
        
        if (endpoint.data) {
          config.data = endpoint.data;
        }

        const response = await axios(config);
        console.log(`   ✅ ${endpoint.name}: ${response.status} - Funciona con token`);
        functionalTestsPassed++;
      } catch (error) {
        if (error.response?.status === 403 && endpoint.url.includes('horarios')) {
          console.log(`   ⚠️ ${endpoint.name}: 403 - Requiere rol ENTRENADOR (correcto)`);
          functionalTestsPassed++; // Esto es correcto
        } else if (error.response?.status === 403 && endpoint.url.includes('catalogo-actividades')) {
          console.log(`   ⚠️ ${endpoint.name}: 403 - Requiere rol ENTRENADOR (correcto)`);
          functionalTestsPassed++; // Esto es correcto
        } else {
          console.log(`   ❌ ${endpoint.name}: Error ${error.response?.status} - ${error.response?.data?.error}`);
        }
      }
    }

    console.log(`\n📊 Resultado funcional: ${functionalTestsPassed}/${functionalTestsTotal} endpoints funcionando correctamente`);

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n🎯 RESUMEN FINAL');
    console.log('='.repeat(40));
    console.log(`✅ Endpoints públicos: 2 (register, login)`);
    console.log(`🔐 Endpoints protegidos: ${securityTestsTotal}`);
    console.log(`🛡️ Seguridad: ${securityTestsPassed}/${securityTestsTotal} correctamente protegidos`);
    console.log(`⚡ Funcionalidad: ${functionalTestsPassed}/${functionalTestsTotal} funcionando con token`);
    
    const securityPercentage = Math.round((securityTestsPassed / securityTestsTotal) * 100);
    const functionalPercentage = Math.round((functionalTestsPassed / functionalTestsTotal) * 100);
    
    console.log(`\n📈 Puntuación de seguridad: ${securityPercentage}%`);
    console.log(`📈 Puntuación funcional: ${functionalPercentage}%`);

    if (securityPercentage === 100 && functionalPercentage >= 90) {
      console.log('\n🎉 ¡API COMPLETAMENTE SEGURA Y FUNCIONAL!');
    } else if (securityPercentage >= 90) {
      console.log('\n✅ API mayormente segura, revisar endpoints con problemas');
    } else {
      console.log('\n⚠️ PROBLEMAS DE SEGURIDAD DETECTADOS - Revisar endpoints no protegidos');
    }

  } catch (error) {
    console.error('❌ Error general en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testCompleteAPISecurity();