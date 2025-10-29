const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function createSampleData() {
  console.log('🌱 Creating sample data for all entities...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Create more users
    console.log('👤 Creating users...');
    const usuarios = [
      { nombre: 'Ana', apellido: 'García', email: 'ana.garcia@ejemplo.com', contrasena: 'password123', rol: 'ENTRENADOR' },
      { nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@ejemplo.com', contrasena: 'password123', rol: 'CLIENTE' },
      { nombre: 'María', apellido: 'Rodríguez', email: 'maria.rodriguez@ejemplo.com', contrasena: 'password123', rol: 'ENTRENADOR' },
      { nombre: 'Pedro', apellido: 'Martínez', email: 'pedro.martinez@ejemplo.com', contrasena: 'password123', rol: 'CLIENTE' }
    ];

    for (const usuario of usuarios) {
      const { data, error } = await supabase
        .from('usuario')
        .insert([usuario])
        .select('id_usuario, nombre, apellido, email, rol')
        .single();

      if (error && error.code !== '23505') { // Skip if already exists
        console.error(`Error creating user ${usuario.nombre}:`, error.message);
      } else if (data) {
        console.log(`✅ Created user: ${data.nombre} ${data.apellido} (${data.rol})`);
      }
    }

    // 2. Create deportes
    console.log('\n⚽ Creating deportes...');
    const deportes = [
      { nombre: 'Fútbol', descripcion: 'Deporte de equipo con balón', nivel: 'INTERMEDIO' },
      { nombre: 'Tenis', descripcion: 'Deporte de raqueta individual o dobles', nivel: 'PRINCIPIANTE' },
      { nombre: 'Natación', descripcion: 'Deporte acuático individual', nivel: 'AVANZADO' },
      { nombre: 'Básquetbol', descripcion: 'Deporte de equipo con canasta', nivel: 'INTERMEDIO' },
      { nombre: 'Yoga', descripcion: 'Práctica de relajación y flexibilidad', nivel: 'PRINCIPIANTE' }
    ];

    for (const deporte of deportes) {
      const { data, error } = await supabase
        .from('deporte')
        .insert([deporte])
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error creating deporte ${deporte.nombre}:`, error.message);
      } else if (data) {
        console.log(`✅ Created deporte: ${data.nombre} (${data.nivel})`);
      }
    }

    // 3. Get users to create entrenadores and clientes
    const { data: allUsers } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellido, rol');

    // 4. Create entrenadores
    console.log('\n🏃‍♂️ Creating entrenadores...');
    const entrenadores = allUsers?.filter(u => u.rol === 'ENTRENADOR') || [];
    
    for (const user of entrenadores) {
      const entrenadorData = {
        id_usuario: user.id_usuario,
        especialidad: user.nombre === 'Ana' ? 'Fitness y Cardio' : 'Deportes de Equipo',
        experiencia: Math.floor(Math.random() * 10) + 1,
        descripcion: `Entrenador profesional especializado en múltiples disciplinas deportivas.`
      };

      const { data, error } = await supabase
        .from('entrenador')
        .insert([entrenadorData])
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error creating entrenador for ${user.nombre}:`, error.message);
      } else if (data) {
        console.log(`✅ Created entrenador: ${user.nombre} ${user.apellido} - ${entrenadorData.especialidad}`);
      }
    }

    // 5. Create clientes
    console.log('\n👥 Creating clientes...');
    const clientes = allUsers?.filter(u => u.rol === 'CLIENTE') || [];
    
    for (const user of clientes) {
      const clienteData = {
        id_usuario: user.id_usuario,
        telefono: `+569${Math.floor(Math.random() * 90000000) + 10000000}`,
        direccion: `Calle ${Math.floor(Math.random() * 999) + 1}, Santiago, Chile`
      };

      const { data, error } = await supabase
        .from('cliente')
        .insert([clienteData])
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error creating cliente for ${user.nombre}:`, error.message);
      } else if (data) {
        console.log(`✅ Created cliente: ${user.nombre} ${user.apellido} - ${clienteData.telefono}`);
      }
    }

    // Summary
    console.log('\n📊 SAMPLE DATA CREATED SUCCESSFULLY!');
    console.log('=====================================');
    
    // Count records
    const counts = {};
    const tables = ['usuario', 'entrenador', 'cliente', 'deporte'];
    
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      counts[table] = count || 0;
    }

    console.log(`👤 Usuarios: ${counts.usuario}`);
    console.log(`🏃‍♂️ Entrenadores: ${counts.entrenador}`);
    console.log(`👥 Clientes: ${counts.cliente}`);
    console.log(`⚽ Deportes: ${counts.deporte}`);

    console.log('\n🚀 NOW YOU CAN TEST THE COMPLETE API!');
    console.log('====================================');
    console.log('📚 Swagger: http://localhost:3000/api-docs');
    console.log('🔗 API: http://localhost:3000/api/v1');
    console.log('');
    console.log('Available endpoints:');
    console.log('• GET /api/v1/usuarios');
    console.log('• GET /api/v1/entrenadores');
    console.log('• GET /api/v1/clientes');
    console.log('• GET /api/v1/deportes');
    console.log('');
    console.log('✅ Run: npm run dev');

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

createSampleData();