const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testAPI() {
  console.log('🧪 Testing API with real data...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Test creating a user directly in database
    console.log('📝 Creating test user...');
    const { data: newUser, error: createError } = await supabase
      .from('usuario')
      .insert([{
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        contrasena: 'password123',
        rol: 'CLIENTE'
      }])
      .select('id_usuario, nombre, apellido, email, rol, creado_en')
      .single();

    if (createError) {
      if (createError.code === '23505') { // Unique constraint violation
        console.log('ℹ️  User already exists, that\'s OK');
      } else {
        console.error('❌ Error creating user:', createError.message);
        return;
      }
    } else {
      console.log('✅ User created:', newUser);
    }

    // 2. Test reading users
    console.log('📖 Reading users...');
    const { data: users, error: readError } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellido, email, rol, creado_en')
      .limit(5);

    if (readError) {
      console.error('❌ Error reading users:', readError.message);
      return;
    }

    console.log('✅ Users found:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.nombre} ${user.apellido} (${user.email}) - ${user.rol}`);
    });

    // 3. Test API endpoints are ready
    console.log('🚀 Database is ready! You can now start the API server with:');
    console.log('   npm run dev');
    console.log('');
    console.log('📚 Then visit: http://localhost:3000/api-docs');
    console.log('🔗 API Base: http://localhost:3000/api/v1');
    console.log('');
    console.log('🧪 Test endpoints:');
    console.log('   GET  /api/v1/usuarios');
    console.log('   POST /api/v1/usuarios');
    console.log('   GET  /api/v1/usuarios/:id');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAPI();