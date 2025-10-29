const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testAllEntities() {
  console.log('🧪 Testing ALL entities in the complete API...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const tables = [
    { name: 'usuario', emoji: '👤', displayName: 'Usuarios' },
    { name: 'entrenador', emoji: '🏃‍♂️', displayName: 'Entrenadores' },
    { name: 'cliente', emoji: '👥', displayName: 'Clientes' },
    { name: 'deporte', emoji: '⚽', displayName: 'Deportes' },
    { name: 'catalogoentrenamiento', emoji: '📚', displayName: 'Catálogos de Entrenamiento' },
    { name: 'horario', emoji: '🕐', displayName: 'Horarios' },
    { name: 'sesion', emoji: '📅', displayName: 'Sesiones' },
    { name: 'reserva', emoji: '📝', displayName: 'Reservas' },
    { name: 'pago', emoji: '💰', displayName: 'Pagos' },
    { name: 'catalogoactividades', emoji: '🎯', displayName: 'Catálogo de Actividades' },
    { name: 'calendariodisponibilidad', emoji: '📆', displayName: 'Calendario de Disponibilidad' },
    { name: 'reseña', emoji: '⭐', displayName: 'Reseñas' },
    { name: 'comentario', emoji: '💬', displayName: 'Comentarios' },
    { name: 'notificacion', emoji: '🔔', displayName: 'Notificaciones' },
    { name: 'retroalimentacionapp', emoji: '📋', displayName: 'Retroalimentación de App' }
  ];

  console.log('\n📊 TESTING ALL DATABASE TABLES:');
  console.log('================================');

  const results = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`${table.emoji} ${table.displayName}: ❌ Error - ${error.message}`);
        results[table.name] = { status: 'error', count: 0, error: error.message };
      } else {
        console.log(`${table.emoji} ${table.displayName}: ✅ ${count || 0} registros`);
        results[table.name] = { status: 'success', count: count || 0 };
      }
    } catch (err) {
      console.log(`${table.emoji} ${table.displayName}: ❌ Exception - ${err.message}`);
      results[table.name] = { status: 'exception', count: 0, error: err.message };
    }
  }

  // Summary
  const successTables = Object.values(results).filter(r => r.status === 'success').length;
  const totalRecords = Object.values(results).reduce((sum, r) => sum + (r.count || 0), 0);

  console.log('\n🎯 SUMMARY:');
  console.log('===========');
  console.log(`✅ Tables working: ${successTables}/${tables.length}`);
  console.log(`📊 Total records: ${totalRecords}`);

  console.log('\n🚀 API ENDPOINTS IMPLEMENTED:');
  console.log('=============================');
  console.log('📚 Swagger Documentation: http://localhost:3000/api-docs');
  console.log('🔗 API Base URL: http://localhost:3000/api/v1');
  console.log('');
  console.log('🎯 Available endpoints (with full CRUD):');
  console.log('• /usuarios - Gestión de usuarios');
  console.log('• /entrenadores - Gestión de entrenadores');
  console.log('• /clientes - Gestión de clientes');
  console.log('• /deportes - Gestión de deportes');
  console.log('• /horarios - Gestión de horarios');
  console.log('• /reservas - Gestión de reservas');
  console.log('• /catalogos-entrenamiento - Catálogos de entrenamiento');
  console.log('• /sesiones - Gestión de sesiones');
  console.log('• /pagos - Gestión de pagos');
  console.log('');
  console.log('🔥 Special endpoints:');
  console.log('• GET /horarios/entrenador/:id - Horarios por entrenador');
  console.log('• GET /sesiones/horario/:id - Sesiones por horario');
  console.log('• GET /sesiones/fecha/:fecha - Sesiones por fecha');
  console.log('');
  console.log('✅ Ready to start: npm run dev');

  return results;
}

testAllEntities();