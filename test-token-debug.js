const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function debugTokenIssue() {
  console.log('🔍 Debuggeando problema de token...\n');

  try {
    // 1. Hacer login para obtener un token fresco
    console.log('1️⃣ Obteniendo token fresco...');
    const loginData = {
      email: 'ana.garcia@ejemplo.com',
      contrasena: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, loginData);
    console.log('✅ Login exitoso');
    
    const token = loginResponse.data.data.token;
    console.log('🔑 Token obtenido:', token.substring(0, 50) + '...');
    console.log('📏 Longitud del token:', token.length);

    // 2. Probar el token inmediatamente
    console.log('\n2️⃣ Probando token inmediatamente...');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📤 Headers enviados:', {
      'Authorization': `Bearer ${token.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    });

    try {
      const testResponse = await axios.get(`${BASE_URL}/usuarios?page=1&limit=1`, { headers });
      console.log('✅ Token válido! Respuesta:', testResponse.status);
      console.log('📊 Datos recibidos:', testResponse.data.data?.length || 0, 'usuarios');
    } catch (error) {
      console.log('❌ Error con token:', error.response?.status, error.response?.data?.error);
      
      // Probar diferentes formatos
      console.log('\n3️⃣ Probando diferentes formatos de Authorization...');
      
      // Sin Bearer
      try {
        const headers2 = { 'Authorization': token };
        await axios.get(`${BASE_URL}/usuarios?page=1&limit=1`, { headers: headers2 });
        console.log('✅ Funciona sin "Bearer"');
      } catch (e) {
        console.log('❌ No funciona sin "Bearer"');
      }

      // Con Bearer pero sin espacio
      try {
        const headers3 = { 'Authorization': `Bearer${token}` };
        await axios.get(`${BASE_URL}/usuarios?page=1&limit=1`, { headers: headers3 });
        console.log('✅ Funciona sin espacio después de Bearer');
      } catch (e) {
        console.log('❌ No funciona sin espacio después de Bearer');
      }
    }

    // 4. Verificar la estructura del token
    console.log('\n4️⃣ Analizando estructura del token...');
    const tokenParts = token.split('.');
    console.log('🔍 Partes del JWT:', tokenParts.length);
    
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('📋 Payload del token:', payload);
        console.log('⏰ Expira en:', new Date(payload.exp * 1000));
        console.log('🕐 Tiempo actual:', new Date());
        console.log('⏳ Token válido:', payload.exp * 1000 > Date.now());
      } catch (e) {
        console.log('❌ Error decodificando payload:', e.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

debugTokenIssue();