const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testCompleteAPI() {
  console.log('🧪 Testing Complete API with all entities...');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Test Usuario
    console.log('\n👤 Testing Usuario...');
    const { data: usuarios, error: usuarioError } = await supabase
      .from('usuario')
      .select('*')
      .limit(3);

    if (usuarioError) {
      console.error('❌ Error with usuarios:', usuarioError.message);
    } else {
      console.log(`✅ Usuarios found: ${usuarios.length}`);
      usuarios.forEach(u => console.log(`  - ${u.nombre} ${u.apellido} (${u.rol})`));
    }

    // 2. Test Entrenador
    console.log('\n🏃‍♂️ Testing Entrenador...');
    const { data: entrenadores, error: entrenadorError } = await supabase
      .from('entrenador')
      .select(`
        *,
        usuario:id_usuario(nombre, apellido, email, rol)
      `)
      .limit(3);

    if (entrenadorError) {
      console.error('❌ Error with entrenadores:', entrenadorError.message);
    } else {
      console.log(`✅ Entrenadores found: ${entrenadores.length}`);
      entrenadores.forEach(e => {
        const usuario = e.usuario || {};
        console.log(`  - ${usuario.nombre || 'N/A'} ${usuario.apellido || 'N/A'} - ${e.especialidad || 'Sin especialidad'}`);
      });
    }

    // 3. Test Cliente
    console.log('\n👥 Testing Cliente...');
    const { data: clientes, error: clienteError } = await supabase
      .from('cliente')
      .select(`
        *,
        usuario:id_usuario(nombre, apellido, email, rol)
      `)
      .limit(3);

    if (clienteError) {
      console.error('❌ Error with clientes:', clienteError.message);
    } else {
      console.log(`✅ Clientes found: ${clientes.length}`);
      clientes.forEach(c => {
        const usuario = c.usuario || {};
        console.log(`  - ${usuario.nombre || 'N/A'} ${usuario.apellido || 'N/A'} - ${c.telefono || 'Sin teléfono'}`);
      });
    }

    // 4. Test Deporte
    console.log('\n⚽ Testing Deporte...');
    const { data: deportes, error: deporteError } = await supabase
      .from('deporte')
      .select('*')
      .limit(5);

    if (deporteError) {
      console.error('❌ Error with deportes:', deporteError.message);
    } else {
      console.log(`✅ Deportes found: ${deportes.length}`);
      deportes.forEach(d => console.log(`  - ${d.nombre} (${d.nivel})`));
    }

    // 5. Test Horario
    console.log('\n🕐 Testing Horario...');
    const { data: horarios, error: horarioError } = await supabase
      .from('horario')
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .limit(3);

    if (horarioError) {
      console.error('❌ Error with horarios:', horarioError.message);
    } else {
      console.log(`✅ Horarios found: ${horarios.length}`);
      horarios.forEach(h => {
        const entrenador = h.entrenador?.usuario || {};
        console.log(`  - ${h.dia} ${h.hora_inicio}-${h.hora_fin} (${entrenador.nombre || 'N/A'})`);
      });
    }

    // 6. Test Reserva
    console.log('\n📅 Testing Reserva...');
    const { data: reservas, error: reservaError } = await supabase
      .from('reserva')
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .limit(3);

    if (reservaError) {
      console.error('❌ Error with reservas:', reservaError.message);
    } else {
      console.log(`✅ Reservas found: ${reservas.length}`);
      reservas.forEach(r => {
        const cliente = r.cliente?.usuario || {};
        console.log(`  - ${cliente.nombre || 'N/A'} - ${r.estado} (${r.fecha_reserva})`);
      });
    }

    // Summary
    console.log('\n📊 RESUMEN DE LA BASE DE DATOS:');
    console.log('================================');
    console.log(`👤 Usuarios: ${usuarios?.length || 0}`);
    console.log(`🏃‍♂️ Entrenadores: ${entrenadores?.length || 0}`);
    console.log(`👥 Clientes: ${clientes?.length || 0}`);
    console.log(`⚽ Deportes: ${deportes?.length || 0}`);
    console.log(`🕐 Horarios: ${horarios?.length || 0}`);
    console.log(`📅 Reservas: ${reservas?.length || 0}`);

    console.log('\n🚀 API ENDPOINTS DISPONIBLES:');
    console.log('=============================');
    console.log('📚 Documentación: http://localhost:3000/api-docs');
    console.log('🔗 Base URL: http://localhost:3000/api/v1');
    console.log('');
    console.log('👤 Usuarios:');
    console.log('   GET    /api/v1/usuarios');
    console.log('   POST   /api/v1/usuarios');
    console.log('   GET    /api/v1/usuarios/:id');
    console.log('   PUT    /api/v1/usuarios/:id');
    console.log('   DELETE /api/v1/usuarios/:id');
    console.log('');
    console.log('🏃‍♂️ Entrenadores:');
    console.log('   GET    /api/v1/entrenadores');
    console.log('   POST   /api/v1/entrenadores');
    console.log('   GET    /api/v1/entrenadores/:id');
    console.log('   PUT    /api/v1/entrenadores/:id');
    console.log('   DELETE /api/v1/entrenadores/:id');

    console.log('\n✅ ¡Base de datos lista! Ejecuta: npm run dev');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testCompleteAPI();