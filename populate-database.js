const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Datos de ejemplo realistas para llenar las tablas
const sampleData = {
  // Catálogo de actividades
  catalogoActividades: [
    {
      nombre: 'Cardio Intensivo',
      descripcion: 'Entrenamiento cardiovascular de alta intensidad para quemar grasa',
      duracion: 45,
      nivel: 'INTERMEDIO'
    },
    {
      nombre: 'Yoga Relajante',
      descripcion: 'Sesión de yoga para relajación y flexibilidad',
      duracion: 60,
      nivel: 'PRINCIPIANTE'
    },
    {
      nombre: 'CrossFit Avanzado',
      descripcion: 'Entrenamiento funcional de alta intensidad',
      duracion: 50,
      nivel: 'AVANZADO'
    },
    {
      nombre: 'Pilates Core',
      descripcion: 'Fortalecimiento del core y mejora de postura',
      duracion: 55,
      nivel: 'INTERMEDIO'
    }
  ],

  // Calendario de disponibilidad (para entrenadores)
  calendarioDisponibilidad: [
    {
      id_entrenador: 1, // Asumiendo que existe un entrenador con ID 1
      fecha: '2025-10-30',
      hora_inicio: '08:00',
      hora_fin: '12:00',
      disponible: true
    },
    {
      id_entrenador: 1,
      fecha: '2025-10-30',
      hora_inicio: '14:00',
      hora_fin: '18:00',
      disponible: true
    },
    {
      id_entrenador: 1,
      fecha: '2025-10-31',
      hora_inicio: '09:00',
      hora_fin: '13:00',
      disponible: true
    },
    {
      id_entrenador: 2, // Otro entrenador
      fecha: '2025-10-30',
      hora_inicio: '07:00',
      hora_fin: '11:00',
      disponible: true
    }
  ],

  // Comentarios
  comentarios: [
    {
      id_cliente: 1, // Asumiendo que existe un cliente con ID 1
      id_entrenador: 1,
      comentario: 'Excelente entrenador, muy profesional y motivador. Las rutinas son desafiantes pero efectivas.'
    },
    {
      id_cliente: 2,
      id_entrenador: 1,
      comentario: 'Me ayudó mucho a mejorar mi técnica. Recomiendo sus sesiones de fuerza.'
    },
    {
      id_cliente: 1,
      id_entrenador: 2,
      comentario: 'Muy buena experiencia con las clases de cardio. El entrenador es muy atento.'
    }
  ],

  // Reseñas
  reseñas: [
    {
      id_cliente: 1,
      id_entrenador: 1,
      calificacion: 5,
      comentario: 'Increíble entrenador! He visto resultados en pocas semanas. Muy recomendado.'
    },
    {
      id_cliente: 2,
      id_entrenador: 1,
      calificacion: 4,
      comentario: 'Buen entrenador, aunque a veces las rutinas son muy intensas para principiantes.'
    },
    {
      id_cliente: 1,
      id_entrenador: 2,
      calificacion: 5,
      comentario: 'Excelente para cardio y pérdida de peso. Muy profesional y puntual.'
    }
  ],

  // Notificaciones
  notificaciones: [
    {
      id_usuario: 1, // Para un cliente
      titulo: 'Sesión Confirmada',
      mensaje: 'Tu sesión de entrenamiento para mañana a las 10:00 AM ha sido confirmada.',
      leida: false
    },
    {
      id_usuario: 1,
      titulo: 'Recordatorio de Pago',
      mensaje: 'Tienes un pago pendiente por tu última sesión de entrenamiento.',
      leida: false
    },
    {
      id_usuario: 2, // Para un entrenador
      titulo: 'Nueva Reserva',
      mensaje: 'Tienes una nueva reserva para el viernes a las 3:00 PM.',
      leida: false
    },
    {
      id_usuario: 1,
      titulo: 'Bienvenido',
      mensaje: '¡Bienvenido a App Deporte! Esperamos que tengas una excelente experiencia.',
      leida: true
    }
  ],

  // Retroalimentación de la app
  retroalimentacionApp: [
    {
      id_usuario: 1,
      calificacion: 5,
      comentario: 'Excelente app! Muy fácil de usar y las funciones son muy útiles para gestionar mis entrenamientos.'
    },
    {
      id_usuario: 2,
      calificacion: 4,
      comentario: 'Buena aplicación en general. Me gustaría que tuviera más opciones de personalización.'
    },
    {
      id_usuario: 3,
      calificacion: 5,
      comentario: 'Perfecta para encontrar entrenadores y gestionar horarios. La recomiendo totalmente.'
    },
    {
      id_usuario: 4,
      calificacion: 3,
      comentario: 'Funciona bien pero a veces es un poco lenta. Podrían mejorar el rendimiento.'
    }
  ]
};

let token = '';

async function populateDatabase() {
  console.log('🗃️ LLENANDO BASE DE DATOS CON DATOS DE EJEMPLO');
  console.log('='.repeat(60));

  try {
    // 1. Obtener token de autenticación
    console.log('1️⃣ Obteniendo token de autenticación...');
    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'Angel@gmail.com',
      contrasena: '123456'
    });
    
    token = loginResponse.data.data.token;
    console.log('✅ Token obtenido:', token.substring(0, 20) + '...');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Llenar Catálogo de Actividades
    console.log('\n2️⃣ Llenando Catálogo de Actividades...');
    for (const actividad of sampleData.catalogoActividades) {
      try {
        const response = await axios.post(`${BASE_URL}/catalogo-actividades`, actividad, { headers });
        console.log(`   ✅ Actividad creada: ${actividad.nombre}`);
      } catch (error) {
        if (error.response?.data?.error?.includes('ya existe')) {
          console.log(`   ⚠️ Actividad ya existe: ${actividad.nombre}`);
        } else {
          console.log(`   ❌ Error creando ${actividad.nombre}:`, error.response?.data?.error);
        }
      }
    }

    // 3. Llenar Calendario de Disponibilidad
    console.log('\n3️⃣ Llenando Calendario de Disponibilidad...');
    for (const disponibilidad of sampleData.calendarioDisponibilidad) {
      try {
        const response = await axios.post(`${BASE_URL}/calendario-disponibilidad`, disponibilidad, { headers });
        console.log(`   ✅ Disponibilidad creada: ${disponibilidad.fecha} ${disponibilidad.hora_inicio}-${disponibilidad.hora_fin}`);
      } catch (error) {
        console.log(`   ❌ Error creando disponibilidad:`, error.response?.data?.error);
      }
    }

    // 4. Llenar Comentarios
    console.log('\n4️⃣ Llenando Comentarios...');
    for (const comentario of sampleData.comentarios) {
      try {
        const response = await axios.post(`${BASE_URL}/comentarios`, comentario, { headers });
        console.log(`   ✅ Comentario creado: ${comentario.comentario.substring(0, 50)}...`);
      } catch (error) {
        console.log(`   ❌ Error creando comentario:`, error.response?.data?.error);
      }
    }

    // 5. Llenar Reseñas
    console.log('\n5️⃣ Llenando Reseñas...');
    for (const reseña of sampleData.reseñas) {
      try {
        const response = await axios.post(`${BASE_URL}/reseñas`, reseña, { headers });
        console.log(`   ✅ Reseña creada: ${reseña.calificacion} estrellas - ${reseña.comentario.substring(0, 30)}...`);
      } catch (error) {
        console.log(`   ❌ Error creando reseña:`, error.response?.data?.error);
      }
    }

    // 6. Llenar Notificaciones
    console.log('\n6️⃣ Llenando Notificaciones...');
    for (const notificacion of sampleData.notificaciones) {
      try {
        const response = await axios.post(`${BASE_URL}/notificaciones`, notificacion, { headers });
        console.log(`   ✅ Notificación creada: ${notificacion.titulo}`);
      } catch (error) {
        console.log(`   ❌ Error creando notificación:`, error.response?.data?.error);
      }
    }

    // 7. Llenar Retroalimentación de la App
    console.log('\n7️⃣ Llenando Retroalimentación de la App...');
    for (const feedback of sampleData.retroalimentacionApp) {
      try {
        const response = await axios.post(`${BASE_URL}/retroalimentacion-app`, feedback, { headers });
        console.log(`   ✅ Retroalimentación creada: ${feedback.calificacion} estrellas`);
      } catch (error) {
        console.log(`   ❌ Error creando retroalimentación:`, error.response?.data?.error);
      }
    }

    // 8. Verificar que las tablas ya no están vacías
    console.log('\n8️⃣ Verificando que las tablas tienen datos...');
    
    const tablesToCheck = [
      { endpoint: '/catalogo-actividades', name: 'Catálogo Actividades' },
      { endpoint: '/calendario-disponibilidad', name: 'Calendario Disponibilidad' },
      { endpoint: '/comentarios', name: 'Comentarios' },
      { endpoint: '/reseñas', name: 'Reseñas' },
      { endpoint: '/notificaciones', name: 'Notificaciones' },
      { endpoint: '/retroalimentacion-app', name: 'Retroalimentación App' }
    ];

    for (const table of tablesToCheck) {
      try {
        const response = await axios.get(`${BASE_URL}${table.endpoint}?page=1&limit=5`, { headers });
        const count = response.data.data?.length || 0;
        console.log(`   📊 ${table.name}: ${count} registros`);
      } catch (error) {
        console.log(`   ❌ Error verificando ${table.name}:`, error.response?.data?.error);
      }
    }

    console.log('\n🎉 ¡BASE DE DATOS POBLADA EXITOSAMENTE!');
    console.log('\n📋 Resumen de datos creados:');
    console.log(`   • ${sampleData.catalogoActividades.length} actividades del catálogo`);
    console.log(`   • ${sampleData.calendarioDisponibilidad.length} disponibilidades de calendario`);
    console.log(`   • ${sampleData.comentarios.length} comentarios`);
    console.log(`   • ${sampleData.reseñas.length} reseñas`);
    console.log(`   • ${sampleData.notificaciones.length} notificaciones`);
    console.log(`   • ${sampleData.retroalimentacionApp.length} retroalimentaciones`);

    console.log('\n🔗 Ahora puedes probar todos los endpoints en Swagger:');
    console.log('   http://localhost:3000/api-docs');

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

// Ejecutar el script
populateDatabase();