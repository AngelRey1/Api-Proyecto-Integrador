const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testAuth() {
  console.log('🔐 Testing JWT Authentication...');
  
  try {
    // 1. Test Health (público)
    console.log('\n1️⃣ Testing Health endpoint (público)...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health:', healthResponse.data.message);

    // 2. Test Register
    console.log('\n2️⃣ Testing Register...');
    const registerData = {
      nombre: 'Test',
      apellido: 'User',
      email: 'test@ejemplo.com',
      contrasena: 'password123',
      rol: 'CLIENTE'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Register exitoso:', registerResponse.data.message);
    const token = registerResponse.data.data.token;
    console.log('🎫 Token obtenido:', token.substring(0, 50) + '...');

    // 3. Test Login
    console.log('\n3️⃣ Testing Login...');
    const loginData = {
      email: 'test@ejemplo.com',
      contrasena: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login exitoso:', loginResponse.data.message);
    const loginToken = loginResponse.data.data.token;

    // 4. Test Profile (protegido)
    console.log('\n4️⃣ Testing Profile (protegido)...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    console.log('✅ Profile obtenido:', profileResponse.data.data.nombre);

    // 5. Test endpoint protegido sin token
    console.log('\n5️⃣ Testing endpoint protegido SIN token...');
    try {
      await axios.get(`${API_BASE}/usuarios`);
      console.log('❌ ERROR: Debería haber fallado');
    } catch (error) {
      console.log('✅ Correctamente bloqueado:', error.response.data.error);
    }

    // 6. Test endpoint protegido CON token
    console.log('\n6️⃣ Testing endpoint protegido CON token...');
    const usuariosResponse = await axios.get(`${API_BASE}/usuarios`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    console.log('✅ Usuarios obtenidos:', usuariosResponse.data.data.length, 'usuarios');

    // 7. Test endpoint solo para entrenadores (debería fallar con cliente)
    console.log('\n7️⃣ Testing endpoint solo ENTRENADORES con token de CLIENTE...');
    try {
      await axios.get(`${API_BASE}/horarios`, {
        headers: {
          'Authorization': `Bearer ${loginToken}`
        }
      });
      console.log('❌ ERROR: Debería haber fallado por permisos');
    } catch (error) {
      console.log('✅ Correctamente bloqueado por rol:', error.response.data.error);
    }

    console.log('\n🎉 TODAS LAS PRUEBAS DE AUTENTICACIÓN PASARON!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Health endpoint (público)');
    console.log('✅ Register funcionando');
    console.log('✅ Login funcionando');
    console.log('✅ Profile protegido funcionando');
    console.log('✅ Endpoints protegidos por token');
    console.log('✅ Endpoints protegidos por rol');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Solo ejecutar si el servidor está corriendo
console.log('🚀 Asegúrate de que el servidor esté corriendo: npm run dev');
console.log('⏳ Esperando 3 segundos antes de empezar las pruebas...\n');

setTimeout(testAuth, 3000);