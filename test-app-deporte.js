const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAppDeporte() {
  console.log('🏃‍♂️ Probando App Deporte API...\n');

  try {
    // 1. Probar registro con contraseña válida
    console.log('1️⃣ Probando registro de usuario...');
    const registerData = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez.test@ejemplo.com',
      contrasena: 'password123', // 6+ caracteres
      rol: 'CLIENTE'
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/usuarios/register`, registerData);
      console.log('✅ Registro exitoso:', registerResponse.data.message);
      console.log('🔑 Token generado:', registerResponse.data.data.token.substring(0, 20) + '...');
    } catch (error) {
      if (error.response?.data?.error?.includes('ya existe')) {
        console.log('⚠️ Usuario ya existe (esto es normal)');
      } else {
        console.log('❌ Error en registro:', error.response?.data?.error || error.message);
      }
    }

    // 2. Probar login
    console.log('\n2️⃣ Probando login...');
    const loginData = {
      email: 'ana.garcia@ejemplo.com',
      contrasena: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, loginData);
    console.log('✅ Login exitoso:', loginResponse.data.message);
    const token = loginResponse.data.data.token;
    console.log('🔑 Token obtenido:', token.substring(0, 20) + '...');

    // 3. Probar endpoint protegido con token válido
    console.log('\n3️⃣ Probando endpoint protegido...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const usersResponse = await axios.get(`${BASE_URL}/usuarios?page=1&limit=5`, { headers });
    console.log('✅ Usuarios obtenidos:', usersResponse.data.data.length, 'usuarios');
    console.log('📊 Paginación:', usersResponse.data.pagination);

    // 4. Probar otros endpoints
    console.log('\n4️⃣ Probando otros endpoints...');
    
    // Deportes
    const deportesResponse = await axios.get(`${BASE_URL}/deportes?page=1&limit=3`);
    console.log('✅ Deportes obtenidos:', deportesResponse.data.data?.length || 0, 'deportes');

    // Entrenadores
    const entrenadoresResponse = await axios.get(`${BASE_URL}/entrenadores`, { headers });
    console.log('✅ Entrenadores obtenidos:', entrenadoresResponse.data.data?.length || 0, 'entrenadores');

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('\n📚 Swagger UI disponible en: http://localhost:3000/api-docs');
    console.log('🔗 API Base URL: http://localhost:3000/api/v1');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testAppDeporte();