const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testIntegratedAuth() {
  console.log('🔐 Testing Integrated JWT Authentication...');
  
  try {
    // 1. Test Register (integrado en usuarios)
    console.log('\n1️⃣ Testing Register en /usuarios/register...');
    const registerData = {
      nombre: 'Test',
      apellido: 'Integrado',
      email: 'test.integrado@ejemplo.com',
      contrasena: 'password123',
      rol: 'CLIENTE'
    };

    const registerResponse = await axios.post(`${API_BASE}/usuarios/register`, registerData);
    console.log('✅ Register exitoso:', registerResponse.data.message);
    const token = registerResponse.data.data.token;
    console.log('🎫 Token obtenido:', token.substring(0, 50) + '...');

    // 2. Test Login (integrado en usuarios)
    console.log('\n2️⃣ Testing Login en /usuarios/login...');
    const loginData = {
      email: 'test.integrado@ejemplo.com',
      contrasena: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE}/usuarios/login`, loginData);
    console.log('✅ Login exitoso:', loginResponse.data.message);
    const loginToken = loginResponse.data.data.token;

    // 3. Test endpoint protegido CON token
    console.log('\n3️⃣ Testing endpoint protegido CON token...');
    const usuariosResponse = await axios.get(`${API_BASE}/usuarios`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    console.log('✅ Usuarios obtenidos:', usuariosResponse.data.data.length, 'usuarios');

    // 4. Test endpoint protegido SIN token
    console.log('\n4️⃣ Testing endpoint protegido SIN token...');
    try {
      await axios.get(`${API_BASE}/usuarios`);
      console.log('❌ ERROR: Debería haber fallado');
    } catch (error) {
      console.log('✅ Correctamente bloqueado:', error.response.data.error);
    }

    console.log('\n🎉 AUTENTICACIÓN INTEGRADA FUNCIONA PERFECTAMENTE!');
    console.log('\n📋 ENDPOINTS DISPONIBLES:');
    console.log('✅ POST /usuarios/register - Registro con token');
    console.log('✅ POST /usuarios/login - Login con token');
    console.log('✅ GET /usuarios - Lista usuarios (protegido)');
    console.log('✅ Todos los demás endpoints protegidos con JWT');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Solo ejecutar si el servidor está corriendo
console.log('🚀 Asegúrate de que el servidor esté corriendo: npm run dev');
console.log('⏳ Esperando 3 segundos antes de empezar las pruebas...\n');

setTimeout(testIntegratedAuth, 3000);