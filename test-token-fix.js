const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Tu token del login
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJBbmdlbEBnbWFpbC5jb20iLCJyb2wiOiJDTElFTlRFIiwiaWF0IjoxNzYxNzUxMDg1LCJleHAiOjE3NjE4Mzc0ODV9.CfebeY8rS2xAGOdZaZbodXc1nBljulK4Fyw3I5iwMKQ';

async function testTokenFix() {
  console.log('🔧 Probando fix del token "Bearer Bearer"...\n');

  try {
    // 1. Probar con el formato correcto
    console.log('1️⃣ Probando con formato correcto: "Bearer token"');
    const headers1 = {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    };

    try {
      const response1 = await axios.get(`${BASE_URL}/deportes?page=1&limit=2`, { headers: headers1 });
      console.log('   ✅ Funciona con "Bearer token":', response1.status);
      console.log('   📊 Deportes obtenidos:', response1.data.data?.length || 0);
    } catch (error) {
      console.log('   ❌ Error con "Bearer token":', error.response?.status, '-', error.response?.data?.error);
    }

    // 2. Probar con el formato problemático (Bearer Bearer)
    console.log('\n2️⃣ Probando con formato problemático: "Bearer Bearer token"');
    const headers2 = {
      'Authorization': `Bearer Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    };

    try {
      const response2 = await axios.get(`${BASE_URL}/deportes?page=1&limit=2`, { headers: headers2 });
      console.log('   ✅ Funciona con "Bearer Bearer token":', response2.status);
      console.log('   📊 Deportes obtenidos:', response2.data.data?.length || 0);
    } catch (error) {
      console.log('   ❌ Error con "Bearer Bearer token":', error.response?.status, '-', error.response?.data?.error);
    }

    // 3. Probar solo con el token
    console.log('\n3️⃣ Probando solo con el token (sin Bearer)');
    const headers3 = {
      'Authorization': TOKEN,
      'Content-Type': 'application/json'
    };

    try {
      const response3 = await axios.get(`${BASE_URL}/deportes?page=1&limit=2`, { headers: headers3 });
      console.log('   ✅ Funciona solo con token:', response3.status);
      console.log('   📊 Deportes obtenidos:', response3.data.data?.length || 0);
    } catch (error) {
      console.log('   ❌ Error solo con token:', error.response?.status, '-', error.response?.data?.error);
    }

    // 4. Verificar que el token no haya expirado
    console.log('\n4️⃣ Verificando expiración del token');
    const tokenParts = TOKEN.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        
        console.log('   🕐 Token expira en:', new Date(payload.exp * 1000));
        console.log('   🕐 Tiempo actual:', new Date());
        console.log('   ⏳ Token válido:', !isExpired);
        
        if (isExpired) {
          console.log('   ⚠️ EL TOKEN HA EXPIRADO - Necesitas hacer login nuevamente');
        }
      } catch (e) {
        console.log('   ❌ Error decodificando token:', e.message);
      }
    }

    console.log('\n💡 INSTRUCCIONES PARA SWAGGER:');
    console.log('1. Haz clic en "Authorize" en Swagger UI');
    console.log('2. En el campo "Value", pon SOLO el token (sin "Bearer"):');
    console.log(`   ${TOKEN}`);
    console.log('3. NO pongas "Bearer" porque Swagger lo agrega automáticamente');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testTokenFix();