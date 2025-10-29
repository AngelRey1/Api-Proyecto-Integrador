const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function createCompleteSampleData() {
  console.log('🌱 Creating complete sample data for ALL entities...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // 1. Create CatalogoEntrenamiento
    console.log('📚 Creating CatalogoEntrenamiento...');
    const catalogos = [
      { nombre: 'Entrenamiento Funcional', descripcion: 'Ejercicios funcionales para el día a día', nivel: 'INTERMEDIO' },
      { nombre: 'Cardio Intensivo', descripcion: 'Entrenamiento cardiovascular de alta intensidad', nivel: 'AVANZADO' },
      { nombre: 'Yoga Básico', descripcion: 'Introducción al yoga y posturas básicas', nivel: 'BASICO' },
      { nombre: 'Fuerza y Resistencia', descripcion: 'Desarrollo de fuerza muscular', nivel: 'INTERMEDIO' },
      { nombre: 'Pilates', descripcion: 'Fortalecimiento del core y flexibilidad', nivel: 'BASICO' }
    ];

    for (const catalogo of catalogos) {
      const { data, error } = await supabase
        .from('catalogoentrenamiento')
        .insert([catalogo])
        .select()
        .single();

      if (error && error.code !== '23505') {
        console.error(`Error creating catalogo ${catalogo.nombre}:`, error.message);
      } else if (data) {
        console.log(`✅ Created catalogo: ${data.nombre} (${data.nivel})`);
      }
    }

    // 2. Get entrenadores to create horarios
    const { data: entrenadores } = await supabase
      .from('entrenador')
      .select('id_entrenador, usuario:id_usuario(nombre, apellido)');

    // 3. Create Horarios
    console.log('\n🕐 Creating Horarios...');
    if (entrenadores && entrenadores.length > 0) {
      const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
      const horarios = [
        { hora_inicio: '08:00', hora_fin: '09:00' },
        { hora_inicio: '10:00', hora_fin: '11:00' },
        { hora_inicio: '16:00', hora_fin: '17:00' },
        { hora_inicio: '18:00', hora_fin: '19:00' }
      ];

      for (const entrenador of entrenadores) {
        // Crear 2-3 horarios por entrenador
        const numHorarios = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numHorarios; i++) {
          const dia = dias[Math.floor(Math.random() * dias.length)];
          const horario = horarios[Math.floor(Math.random() * horarios.length)];
          
          const horarioData = {
            id_entrenador: entrenador.id_entrenador,
            dia: dia,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin
          };

          const { data, error } = await supabase
            .from('horario')
            .insert([horarioData])
            .select()
            .single();

          if (error && error.code !== '23505') {
            console.error(`Error creating horario:`, error.message);
          } else if (data) {
            const usuario = entrenador.usuario || {};
            console.log(`✅ Created horario: ${usuario.nombre || 'N/A'} - ${data.dia} ${data.hora_inicio}-${data.hora_fin}`);
          }
        }
      }
    }

    // 4. Get horarios to create sesiones
    const { data: horariosCreated } = await supabase
      .from('horario')
      .select('id_horario, dia, hora_inicio, hora_fin');

    // 5. Create Sesiones
    console.log('\n📅 Creating Sesiones...');
    if (horariosCreated && horariosCreated.length > 0) {
      const today = new Date();
      
      for (const horario of horariosCreated) {
        // Crear sesiones para los próximos 7 días
        for (let i = 1; i <= 7; i++) {
          const fecha = new Date(today);
          fecha.setDate(today.getDate() + i);
          
          const sesionData = {
            id_horario: horario.id_horario,
            fecha: fecha.toISOString().split('T')[0],
            cupos_disponibles: Math.floor(Math.random() * 10) + 5 // 5-15 cupos
          };

          const { data, error } = await supabase
            .from('sesion')
            .insert([sesionData])
            .select()
            .single();

          if (error && error.code !== '23505') {
            console.error(`Error creating sesion:`, error.message);
          } else if (data) {
            console.log(`✅ Created sesion: ${data.fecha} - ${data.cupos_disponibles} cupos`);
          }
        }
      }
    }

    // 6. Get clientes and sesiones to create reservas
    const { data: clientes } = await supabase
      .from('cliente')
      .select('id_cliente, usuario:id_usuario(nombre, apellido)');

    const { data: sesiones } = await supabase
      .from('sesion')
      .select('id_sesion, fecha, cupos_disponibles')
      .limit(10);

    // 7. Create Reservas
    console.log('\n📝 Creating Reservas...');
    if (clientes && clientes.length > 0 && sesiones && sesiones.length > 0) {
      for (const cliente of clientes) {
        // Crear 1-2 reservas por cliente
        const numReservas = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < numReservas; i++) {
          const sesion = sesiones[Math.floor(Math.random() * sesiones.length)];
          const estados = ['PENDIENTE', 'CONFIRMADA'];
          
          const reservaData = {
            id_cliente: cliente.id_cliente,
            id_sesion: sesion.id_sesion,
            estado: estados[Math.floor(Math.random() * estados.length)]
          };

          const { data, error } = await supabase
            .from('reserva')
            .insert([reservaData])
            .select()
            .single();

          if (error && error.code !== '23505') {
            console.error(`Error creating reserva:`, error.message);
          } else if (data) {
            const usuario = cliente.usuario || {};
            console.log(`✅ Created reserva: ${usuario.nombre || 'N/A'} - ${data.estado}`);
          }
        }
      }
    }

    // 8. Get reservas to create pagos
    const { data: reservas } = await supabase
      .from('reserva')
      .select('id_reserva, estado')
      .eq('estado', 'CONFIRMADA');

    // 9. Create Pagos
    console.log('\n💰 Creating Pagos...');
    if (reservas && reservas.length > 0) {
      for (const reserva of reservas) {
        const metodos = ['TARJETA', 'EFECTIVO'];
        const montos = [15000, 20000, 25000, 30000]; // Precios en pesos chilenos
        
        const pagoData = {
          id_reserva: reserva.id_reserva,
          monto: montos[Math.floor(Math.random() * montos.length)],
          metodo: metodos[Math.floor(Math.random() * metodos.length)],
          estado: 'COMPLETADO'
        };

        const { data, error } = await supabase
          .from('pago')
          .insert([pagoData])
          .select()
          .single();

        if (error && error.code !== '23505') {
          console.error(`Error creating pago:`, error.message);
        } else if (data) {
          console.log(`✅ Created pago: $${data.monto} - ${data.metodo} (${data.estado})`);
        }
      }
    }

    // Summary
    console.log('\n📊 COMPLETE SAMPLE DATA CREATED!');
    console.log('=================================');
    
    const tables = [
      'usuario', 'entrenador', 'cliente', 'deporte', 
      'catalogoentrenamiento', 'horario', 'sesion', 'reserva', 'pago'
    ];
    
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      const emoji = {
        'usuario': '👤',
        'entrenador': '🏃‍♂️',
        'cliente': '👥',
        'deporte': '⚽',
        'catalogoentrenamiento': '📚',
        'horario': '🕐',
        'sesion': '📅',
        'reserva': '📝',
        'pago': '💰'
      };
      
      console.log(`${emoji[table]} ${table}: ${count || 0}`);
    }

    console.log('\n🚀 COMPLETE API READY!');
    console.log('======================');
    console.log('📚 Swagger: http://localhost:3000/api-docs');
    console.log('🔗 API: http://localhost:3000/api/v1');
    console.log('');
    console.log('🎯 Available endpoints:');
    console.log('• /usuarios, /entrenadores, /clientes, /deportes');
    console.log('• /horarios, /reservas');
    console.log('• All with full CRUD operations!');
    console.log('');
    console.log('✅ Run: npm run dev');

  } catch (error) {
    console.error('❌ Error creating complete sample data:', error.message);
  }
}

createCompleteSampleData();