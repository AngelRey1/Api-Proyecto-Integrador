const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Datos corregidos según los esquemas reales
const sampleData = {
  // Catálogo de actividades (requiere rol ENTRENADOR)
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
    }
  ],

  // Calendario de disponibilidad (requiere rol ENTRENADOR)
  calendarioDisponibilidad: [
    {
      id_entrenador: 1,
      fecha: '2025-10-30',
      hora_inicio: '08:00',
      hora_fin: '12:00',
      disponible: true
    },
    {
      id_entrenador: 1,
      fecha: '2025-10-31',
      hora_inicio: '14:00',
      hora_fin: '18:00',
      disponible: true
    }
  ],

  // Comentarios (corregir esquema)
  comentarios: [
    {
      id_reseña: 1, // Debe existir una reseña
      contenido: 'Excelente entrenador, muy profesional y motivador.',
      fecha_comentario: new Date().toISOString()
    }
  ],

  // Reseñas
  reseñas: [
    {
      id_cliente: 1,
      id_entrenador: 1,
      calificacion: 5,
      comentario: 'Increíble entrenador! He visto resultados en pocas semanas.'
    },
    {
      id_cliente: 2,
      id_entrenador: 1,
      calificacion: 4,
      comentario: 'Buen entrenador, aunque a veces las rutinas son muy intensas.'
    }
  ],

  // Notificaciones (agregar tipo requerido)
  notificaciones: [
    {
      id_usuario: 1,
      titulo: 'Sesión Confirmada',
      mensaje: 'Tu sesión de entrenamiento para mañana a las 10:00 AM ha sido confirmada.',
      tipo: 'RESERVA',
      leida: false
    },
    {
      id_usuario: 1,
      titulo: 'Recordatorio de Pago',
      mensaje: 'Tienes un pago pendiente por tu última sesión de entrenamiento.',
      tipo: 'PAGO',
      leida: false
    },
    {
      id_usuario: 2,
      titulo: 'Bienvenido',
      mensaje: '¡Bienvenido a App Deporte! Esperamos que tengas una excelente experiencia.',
      tipo: 'GENERAL',
      leida: true
    }
  ],

  // Retroalimentación de la app (corregir esquema)
  retroalimentacionApp: [
    {
      id_usuario: 1,
      calificacion: 5,
      mensaje: 'Excelente app! Muy fácil de usar y las funciones son muy útiles.',
      tipo: 'SUGERENCIA'
    },
    {
      id_usuario: 2,
      calificacion: 4,
      mensaje: 'Buena aplicación en general. Me gustaría más opciones de personalización.',
      tipo: 'SUGERENCIA'
    },
    {
      id_usuario: 3,
      calificacion: 3,
      mensaje: 'La app se cierra inesperadamente al cargar los horarios.',
      tipo: 'REPORTE_ERROR'
    }
  ]
};

let clienteToken = '';
let entrenadorToken = '';

async function populateDatabaseFixed() {
  console.log('🗃️ LLENANDO BASE DE DATOS - VERSIÓN CORREGIDA');
  console.log('='.repeat(60));

  try {
    // 1. Obtener token de CLIENTE
    console.log('1️⃣ Obteniendo token de CLIENTE...');
    try {
      const clienteLogin = await axios.post(`${BASE_URL}/usuarios/login`, {
        email: 'Angel@gmail.com',
        contrasena: '123456'
      });
      clienteToken = clienteLogin.data.data.token;
      console.log('✅ Token de cliente obtenido');
    } catch (error) {
      console.log('❌ Error obteniendo token de cliente:', error.response?.data?.error);
    }

    // 2. Obtener token de ENTRENADOR
    console.log('2️⃣ Obteniendo token de ENTRENADOR...');
    try {
      const entrenadorLogin = await axios.post(`${BASE_URL}/usuarios/login`, {
        email: 'ana.garcia@ejemplo.com',
        contrasena: 'password123'
      });
      entrenadorToken = entrenadorLogin.data.data.token;
      console.log('✅ Token de entrenador obtenido');
    } catch (error) {
      console.log('❌ Error obteniendo token de entrenador:', error.response?.data?.error);
    }

    const clienteHeaders = {
      'Authorization': `Bearer ${clienteToken}`,
      'Content-Type': 'application/json'
    };

    const entrenadorHeaders = {
      'Authorization': `Bearer ${entrenadorToken}`,
      'Content-Type': 'application/json'
    };

    // 3. Llenar Catálogo de Actividades (requiere ENTRENADOR)
    console.log('\n3️⃣ Llenando Catálogo de Actividades (con token de entrenador)...');
    for (const actividad of sampleData.catalogoActividades) {
      try {
        const response = await axios.post(`${BASE_URL}/catalogo-actividades`, actividad, { headers: entrenadorHeaders });
        console.log(`   ✅ Actividad creada: ${actividad.nombre}`);
      } catch (error) {
        console.log(`   ❌ Error creando ${actividad.nombre}:`, error.response?.data?.error);
      }
    }

    // 4. Llenar Calendario de Disponibilidad (requiere ENTRENADOR)
    console.log('\n4️⃣ Llenando Calendario de Disponibilidad (con token de entrenador)...');
    for (const disponibilidad of sampleData.calendarioDisponibilidad) {
      try {
        const response = await axios.post(`${BASE_URL}/calendario-disponibilidad`, disponibilidad, { headers: entrenadorHeaders });
        console.log(`   ✅ Disponibilidad creada: ${disponibilidad.fecha}`);
      } catch (error) {
        console.log(`   ❌ Error creando disponibilidad:`, error.response?.data?.error);
      }
    }

    // 5. Llenar Reseñas primero (para poder crear comentarios)
    console.log('\n5️⃣ Llenando Reseñas...');
    for (const reseña of sampleData.reseñas) {
      try {
        const response = await axios.post(`${BASE_URL}/resenas`, reseña, { headers: clienteHeaders });
        console.log(`   ✅ Reseña creada: ${reseña.calificacion} estrellas`);
      } catch (error) {
        console.log(`   ❌ Error creando reseña:`, error.response?.data?.error);
      }
    }

    // 6. Llenar Comentarios (después de las reseñas)
    console.log('\n6️⃣ Llenando Comentarios...');
    for (const comentario of sampleData.comentarios) {
      try {
        const response = await axios.post(`${BASE_URL}/comentarios`, comentario, { headers: clienteHeaders });
        console.log(`   ✅ Comentario creado`);
      } catch (error) {
        console.log(`   ❌ Error creando comentario:`, error.response?.data?.error);
      }
    }

    // 7. Llenar Notificaciones
    console.log('\n7️⃣ Llenando Notificaciones...');
    for (const notificacion of sampleData.notificaciones) {
      try {
        const response = await axios.post(`${BASE_URL}/notificaciones`, notificacion, { headers: clienteHeaders });
        console.log(`   ✅ Notificación creada: ${notificacion.titulo}`);
      } catch (error) {
        console.log(`   ❌ Error creando notificación:`, error.response?.data?.error);
      }
    }

    // 8. Llenar Retroalimentación de la App
    console.log('\n8️⃣ Llenando Retroalimentación de la App...');
    for (const feedback of sampleData.retroalimentacionApp) {
      try {
        const response = await axios.post(`${BASE_URL}/retroalimentacion-app`, feedback, { headers: clienteHeaders });
        console.log(`   ✅ Retroalimentación creada: ${feedback.calificacion} estrellas`);
      } catch (error) {
        console.log(`   ❌ Error creando retroalimentación:`, error.response?.data?.error);
      }
    }

    // 9. Verificar resultados
    console.log('\n9️⃣ Verificando resultados...');
    
    const verificaciones = [
      { endpoint: '/catalogo-actividades', name: 'Catálogo Actividades', headers: entrenadorHeaders },
      { endpoint: '/calendario-disponibilidad', name: 'Calendario Disponibilidad', headers: entrenadorHeaders },
      { endpoint: '/comentarios', name: 'Comentarios', headers: clienteHeaders },
      { endpoint: '/resenas', name: 'Reseñas', headers: clienteHeaders },
      { endpoint: '/notificaciones', name: 'Notificaciones', headers: clienteHeaders },
      { endpoint: '/retroalimentacion-app', name: 'Retroalimentación App', headers: clienteHeaders }
    ];

    for (const verificacion of verificaciones) {
      try {
        const response = await axios.get(`${BASE_URL}${verificacion.endpoint}?page=1&limit=5`, { headers: verificacion.headers });
        const count = response.data.data?.length || 0;
        console.log(`   📊 ${verificacion.name}: ${count} registros`);
      } catch (error) {
        console.log(`   ❌ Error verificando ${verificacion.name}:`, error.response?.data?.error);
      }
    }

    console.log('\n🎉 ¡PROCESO COMPLETADO!');
    console.log('\n📋 Datos que se intentaron crear:');
    console.log(`   • ${sampleData.catalogoActividades.length} actividades del catálogo`);
    console.log(`   • ${sampleData.calendarioDisponibilidad.length} disponibilidades de calendario`);
    console.log(`   • ${sampleData.reseñas.length} reseñas`);
    console.log(`   • ${sampleData.comentarios.length} comentarios`);
    console.log(`   • ${sampleData.notificaciones.length} notificaciones`);
    console.log(`   • ${sampleData.retroalimentacionApp.length} retroalimentaciones`);

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

// Ejecutar el script
populateDatabaseFixed();