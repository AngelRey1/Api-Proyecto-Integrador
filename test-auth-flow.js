const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAuthFlow() {
  console.log('🔐 Probando flujo completo de autenticación...\n');

  try {
    // 1. Probar endpoint SIN autenticación (debe funcionar)
    console.log('1️⃣ Probando endpoint público (deportes)...');
    const deportesResponse = await axios.get(`${BASE_URL}/deportes`);
    console.log('✅ Deportes (público):', deportesResponse.status, '-', deportesResponse.data.data?.length || 0, 'deportes');

    // 2. Probar endpoint CON autenticación SIN token (debe fallar)
    console.log('\n2️⃣ Probando endpoint protegido SIN token...');
    try {
      await axios.get(`${BASE_URL}/usuarios`);
      console.log('❌ ERROR: Debería haber fallado sin token');
    } catch (error) {
      console.log('✅ Correctamente rechazado sin token:', error.response?.status, '-', error.response?.data?.error);
    }

    // 3. Hacer login para obtener token FRESCO
    console.log('\n3️⃣ Obteniendo token fresco...');
    const loginData = {
      email: 'ana.garcia@ejemplo.com',
      contrasena: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, loginData);
    const token = loginResponse.data.data.token;
    console.log('✅ Login exitoso, token obtenido');
    console.log('🔑 Token:', token.substring(0, 30) + '...');

    // 4. Probar endpoint protegido CON token fresco
    console.log('\n4️⃣ Probando endpoint protegido CON token fresco...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const usuariosResponse = await axios.get(`${BASE_URL}/usuarios?page=1&limit=2`, { headers });
      console.log('✅ Usuarios (protegido):', usuariosResponse.status, '-', usuariosResponse.data.data?.length || 0, 'usuarios');
    } catch (error) {
      console.log('❌ Error con token fresco:', error.response?.status, '-', error.response?.data?.error);
      
      // Debug del token
      console.log('\n🔍 Debug del token:');
      console.log('Header enviado:', headers.Authorization.substring(0, 50) + '...');
      
      // Verificar si el problema es el formato
      console.log('\n5️⃣ Probando diferentes formatos...');
      
      // Probar con authorization en minúsculas
      try {
        const headers2 = { 'authorization': `Bearer ${token}` };
        await axios.get(`${BASE_URL}/usuarios?page=1&limit=1`, { headers: headers2 });
        console.log('✅ Funciona con "authorization" en minúsculas');
      } catch (e) {
        console.log('❌ No funciona con "authorization" en minúsculas');
      }
    }

    // 5. Probar otros endpoints protegidos
    console.log('\n6️⃣ Probando otros endpoints protegidos...');
    
    const protectedEndpoints = [
      { url: '/clientes', name: 'Clientes' },
      { url: '/entrenadores', name: 'Entrenadores' },
      { url: '/sesiones', name: 'Sesiones' },
      { url: '/reservas', name: 'Reservas' }
    ];

    for (const endpoint of protectedEndpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint.url}?page=1&limit=1`, { headers });
        console.log(`✅ ${endpoint.name}:`, response.status, '-', response.data.data?.length || 0, 'registros');
      } catch (error) {
        console.log(`❌ ${endpoint.name}:`, error.response?.status, '-', error.response?.data?.error);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

testAuthFlow();