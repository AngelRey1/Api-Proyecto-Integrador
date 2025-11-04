import { Request, Response } from 'express';

export class DocumentacionController {
  
  async getFlujosDeUso(req: Request, res: Response): Promise<void> {
    try {
      const flujos = {
        "🎯 Flujos Principales": {
          "1. Cliente - Agendar Sesión": {
            descripcion: "Flujo completo para que un cliente agende una sesión con un entrenador",
            pasos: [
              {
                paso: 1,
                accion: "Autenticarse",
                endpoint: "POST /api/v1/auth/login",
                descripcion: "Iniciar sesión con email y contraseña"
              },
              {
                paso: 2,
                accion: "Buscar entrenadores",
                endpoint: "GET /api/v1/agendamiento/buscar-sesiones",
                parametros: "?deporte=yoga&fecha=2025-11-05&ubicacion=madrid",
                descripcion: "Buscar entrenadores disponibles por deporte, fecha y ubicación"
              },
              {
                paso: 3,
                accion: "Agendar cita",
                endpoint: "POST /api/v1/agendamiento/agendar",
                body: {
                  id_entrenador: 1,
                  id_deporte: 2,
                  fecha_hora: "2025-11-05T10:00:00Z",
                  duracion_minutos: 60,
                  notas: "Primera sesión de yoga"
                },
                descripcion: "Crear la reserva con el entrenador seleccionado"
              },
              {
                paso: 4,
                accion: "Procesar pago",
                endpoint: "POST /api/v1/pagos",
                body: {
                  id_reserva: 123,
                  monto: 50.00,
                  metodo: "TARJETA"
                },
                descripcion: "Realizar el pago de la sesión"
              },
              {
                paso: 5,
                accion: "Ver confirmación",
                endpoint: "GET /api/v1/agendamiento/mis-reservas",
                descripcion: "Verificar que la cita fue agendada correctamente"
              },
              {
                paso: 6,
                accion: "Después de la sesión - Evaluar",
                endpoint: "POST /api/v1/seguimiento",
                body: {
                  id_reserva: 123,
                  id_entrenador: 1,
                  calificacion: 5,
                  comentario: "Excelente sesión, muy profesional"
                },
                descripcion: "Calificar al entrenador después de la sesión"
              }
            ]
          },
          
          "2. Entrenador - Configurar Perfil": {
            descripcion: "Flujo para que un entrenador configure su perfil completo",
            pasos: [
              {
                paso: 1,
                accion: "Registrarse",
                endpoint: "POST /api/v1/auth/register",
                body: {
                  nombre: "Juan",
                  apellido: "Pérez",
                  email: "juan@example.com",
                  contrasena: "password123",
                  rol: "ENTRENADOR"
                },
                descripcion: "Crear cuenta como entrenador"
              },
              {
                paso: 2,
                accion: "Crear perfil de entrenador",
                endpoint: "POST /api/v1/perfil/entrenadores",
                body: {
                  id_usuario: 1,
                  especialidad: "Yoga y Pilates",
                  experiencia: 5,
                  descripcion: "Entrenador certificado con 5 años de experiencia",
                  foto_url: "https://example.com/foto.jpg"
                },
                descripcion: "Completar información profesional"
              },
              {
                paso: 3,
                accion: "Agregar especialidades deportivas",
                endpoint: "POST /api/v1/especialidades",
                body: {
                  id_entrenador: 1,
                  id_deporte: 2
                },
                descripcion: "Asociar deportes que puede entrenar"
              },
              {
                paso: 4,
                accion: "Configurar disponibilidad",
                endpoint: "POST /api/v1/disponibilidad",
                body: {
                  id_entrenador: 1,
                  fecha: "2025-11-05",
                  hora_inicio: "08:00",
                  hora_fin: "18:00",
                  disponible: true
                },
                descripcion: "Establecer horarios disponibles"
              },
              {
                paso: 5,
                accion: "Ver reservas",
                endpoint: "GET /api/v1/agendamiento/mis-reservas",
                descripcion: "Monitorear citas agendadas por clientes"
              }
            ]
          },

          "3. Admin - Gestionar Catálogos": {
            descripcion: "Flujo para administradores que gestionan los catálogos del sistema",
            pasos: [
              {
                paso: 1,
                accion: "Agregar nuevo deporte",
                endpoint: "POST /api/v1/catalogo/deportes",
                body: {
                  nombre: "CrossFit",
                  descripcion: "Entrenamiento funcional de alta intensidad",
                  nivel: "AVANZADO"
                },
                descripcion: "Añadir deportes al catálogo"
              },
              {
                paso: 2,
                accion: "Crear tipo de entrenamiento",
                endpoint: "POST /api/v1/catalogo/entrenamientos",
                body: {
                  nombre: "HIIT Avanzado",
                  descripcion: "Entrenamiento de intervalos de alta intensidad",
                  nivel: "AVANZADO"
                },
                descripcion: "Definir tipos de entrenamientos disponibles"
              },
              {
                paso: 3,
                accion: "Ver feedback de usuarios",
                endpoint: "GET /api/v1/feedback",
                descripcion: "Revisar sugerencias y reportes de usuarios"
              }
            ]
          }
        },

        "📱 Casos de Uso por Tipo de Usuario": {
          "Cliente": {
            endpoints_principales: [
              "GET /api/v1/agendamiento/buscar-sesiones",
              "POST /api/v1/agendamiento/agendar", 
              "GET /api/v1/agendamiento/mis-reservas",
              "POST /api/v1/pagos",
              "POST /api/v1/seguimiento"
            ],
            flujo_tipico: "Buscar → Agendar → Pagar → Asistir → Evaluar"
          },
          "Entrenador": {
            endpoints_principales: [
              "POST /api/v1/perfil/entrenadores",
              "POST /api/v1/especialidades",
              "POST /api/v1/disponibilidad",
              "GET /api/v1/agendamiento/mis-reservas",
              "GET /api/v1/seguimiento"
            ],
            flujo_tipico: "Registrar → Configurar → Disponibilidad → Recibir reservas → Ver evaluaciones"
          },
          "Administrador": {
            endpoints_principales: [
              "POST /api/v1/catalogo/deportes",
              "POST /api/v1/catalogo/entrenamientos", 
              "GET /api/v1/feedback",
              "GET /api/v1/seguimiento"
            ],
            flujo_tipico: "Gestionar catálogos → Monitorear feedback → Analizar métricas"
          }
        },

        "🔗 Enlaces Útiles": {
          swagger_ui: "/api-docs",
          documentacion_completa: "/MAPA-DE-USO-API.md",
          postman_collection: "Disponible en Swagger UI",
          base_url_desarrollo: "http://localhost:3000/api/v1"
        },

        "⚡ Endpoints Más Utilizados": [
          {
            endpoint: "POST /api/v1/auth/login",
            descripcion: "Autenticación de usuarios",
            frecuencia: "Muy Alta"
          },
          {
            endpoint: "GET /api/v1/agendamiento/buscar-sesiones", 
            descripcion: "Búsqueda de entrenadores",
            frecuencia: "Alta"
          },
          {
            endpoint: "POST /api/v1/agendamiento/agendar",
            descripcion: "Agendar nueva cita",
            frecuencia: "Alta"
          },
          {
            endpoint: "GET /api/v1/agendamiento/mis-reservas",
            descripcion: "Ver reservas del usuario",
            frecuencia: "Media"
          },
          {
            endpoint: "POST /api/v1/pagos",
            descripcion: "Procesar pagos",
            frecuencia: "Alta"
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: flujos,
        message: "Documentación de flujos de uso de la API",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo documentación',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getEstadisticasAPI(req: Request, res: Response): Promise<void> {
    try {
      const estadisticas = {
        "📊 Resumen de la API": {
          total_endpoints: 45,
          endpoints_principales: 6,
          endpoints_gestion: 12,
          endpoints_catalogos: 9,
          endpoints_tecnicos: 6
        },
        "🎯 Cobertura Funcional": {
          autenticacion: "✅ Completo",
          agendamiento: "✅ Completo", 
          pagos: "✅ Completo",
          seguimiento: "✅ Completo",
          notificaciones: "✅ Completo",
          perfiles: "✅ Completo",
          catalogos: "✅ Completo"
        },
        "🔐 Seguridad": {
          autenticacion_jwt: "✅ Implementado",
          roles_usuarios: "✅ Cliente/Entrenador",
          endpoints_protegidos: "✅ Middleware aplicado",
          validacion_datos: "✅ Esquemas definidos"
        },
        "📱 Estado de Implementación": {
          backend_api: "✅ 100% Completo",
          documentacion: "✅ Swagger + Mapa de uso",
          base_datos: "✅ 15 tablas implementadas",
          testing: "⚠️ Pendiente implementar tests"
        }
      };

      res.status(200).json({
        success: true,
        data: estadisticas,
        message: "Estadísticas de la API",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo estadísticas',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}