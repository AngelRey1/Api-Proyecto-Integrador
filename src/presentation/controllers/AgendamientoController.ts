import { Request, Response } from 'express';
import { ResponseUtil } from '@/shared/utils/response';
import { AgendamientoUseCases } from '../../application/use-cases/AgendamientoUseCases';

export class AgendamientoController {
  constructor(private agendamientoUseCases: AgendamientoUseCases) {}

  /**
   * @swagger
   * /agendamiento/buscar-sesiones:
   *   get:
   *     summary: 🔍 PASO 1 - Buscar sesiones disponibles
   *     tags: [🎯 4. Agendamiento (CORE)]
   *     description: |
   *       **PRIMER PASO DEL FLUJO DE AGENDAMIENTO**
   *       
   *       Busca sesiones de entrenamiento disponibles según criterios específicos.
   *       Este endpoint **NO requiere autenticación** para que los usuarios puedan explorar opciones antes de registrarse.
   *       
   *       ### 📋 Flujo de Uso:
   *       1. El cliente busca sesiones disponibles (este endpoint)
   *       2. Revisa la información del entrenador y horarios
   *       3. Selecciona una sesión y usa su `id_sesion` para agendar
   *       
   *       ### 🎯 Casos de Uso:
   *       - Ver todas las sesiones disponibles próximas
   *       - Filtrar por especialidad específica (yoga, crossfit, etc.)
   *       - Buscar por fecha deseada
   *       - Encontrar un entrenador específico por su ID
   *       
   *       ### 💡 Ejemplo de Flujo:
   *       ```
   *       GET /agendamiento/buscar-sesiones?fecha=2025-11-05&especialidad=yoga
   *       → Obtener lista de sesiones
   *       → Seleccionar id_sesion: 1
   *       → Usar ese ID para agendar en POST /agendamiento/agendar
   *       ```
   *     parameters:
   *       - in: query
   *         name: fecha
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: Fecha deseada para la sesión (formato YYYY-MM-DD)
   *         example: "2025-11-05"
   *       - in: query
   *         name: especialidad
   *         schema:
   *           type: string
   *         required: false
   *         description: Especialidad del entrenador (ej. yoga, fitness, crossfit, pilates)
   *         example: "yoga"
   *       - in: query
   *         name: entrenador_id
   *         schema:
   *           type: integer
   *         required: false
   *         description: ID específico del entrenador (si ya conoces a quién quieres)
   *         example: 1
   *     responses:
   *       200:
   *         description: ✅ Sesiones encontradas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Sesiones encontradas"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SesionDisponible'
   *             examples:
   *               ejemplo_exitoso:
   *                 summary: Ejemplo de respuesta exitosa
   *                 value:
   *                   success: true
   *                   message: "Sesiones encontradas"
   *                   data:
   *                     - id_sesion: 1
   *                       fecha: "2025-11-05T10:00:00Z"
   *                       cupos_disponibles: 5
   *                       cupos_ocupados: 3
   *                       entrenador:
   *                         id_entrenador: 1
   *                         especialidad: "Entrenamiento funcional"
   *                         experiencia: 5
   *                         descripcion: "Entrenador certificado con 5 años de experiencia"
   *                         usuario:
   *                           nombre: "Juan"
   *                           apellido: "Pérez"
   *                     - id_sesion: 2
   *                       fecha: "2025-11-05T15:00:00Z"
   *                       cupos_disponibles: 8
   *                       cupos_ocupados: 2
   *                       entrenador:
   *                         id_entrenador: 2
   *                         especialidad: "Yoga y meditación"
   *                         experiencia: 8
   *                         descripcion: "Instructora certificada en Hatha y Vinyasa Yoga"
   *                         usuario:
   *                           nombre: "María"
   *                           apellido: "González"
   *       404:
   *         description: ❌ No se encontraron sesiones con los criterios especificados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "No se encontraron sesiones disponibles"
   *       500:
   *         description: ❌ Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async buscarSesiones(req: Request, res: Response): Promise<Response> {
    try {
      const filtros = {
        fecha: req.query.fecha as string,
        especialidad: req.query.especialidad as string,
        entrenador_id: req.query.entrenador_id ? parseInt(req.query.entrenador_id as string) : undefined,
      };

      const sesionesDisponibles = await this.agendamientoUseCases.buscarSesionesDisponibles(filtros);
      
      return ResponseUtil.success(res, sesionesDisponibles, 'Sesiones encontradas');
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /agendamiento/agendar:
   *   post:
   *     summary: ⭐ PASO 2 - Agendar nueva cita (ENDPOINT PRINCIPAL)
   *     tags: [🎯 4. Agendamiento (CORE)]
   *     description: |
   *       **🎯 ENDPOINT PRINCIPAL DE LA APLICACIÓN**
   *       
   *       Este es el endpoint más importante de la API. Permite a un cliente agendar una sesión con un entrenador.
   *       
   *       ### 📋 Requisitos Previos:
   *       1. ✅ Usuario registrado (POST /usuarios/register)
   *       2. ✅ Login realizado (POST /usuarios/login) → Obtener token JWT
   *       3. ✅ Perfil de cliente creado (POST /clientes)
   *       4. ✅ Sesión disponible encontrada (GET /agendamiento/buscar-sesiones)
   *       
   *       ### 🔐 Autenticación Requerida:
   *       - Este endpoint **REQUIERE** token JWT en el header Authorization
   *       - Formato: `Authorization: Bearer <tu_token_jwt>`
   *       - El token se obtiene al hacer login
   *       
   *       ### 📝 Flujo Completo de Agendamiento:
   *       ```
   *       1. Buscar sesiones disponibles
   *          GET /agendamiento/buscar-sesiones?fecha=2025-11-05
   *          
   *       2. Seleccionar una sesión (tomar el id_sesion)
   *          Ejemplo: id_sesion = 1
   *          
   *       3. Agendar la cita (ESTE ENDPOINT)
   *          POST /agendamiento/agendar
   *          Body: {
   *            "sesion_id": 1,
   *            "fecha_hora": "2025-11-05T10:00:00Z",
   *            "notas": "Primera sesión"
   *          }
   *          Headers: {
   *            "Authorization": "Bearer <token>"
   *          }
   *          
   *       4. Procesar pago de la reserva
   *          POST /pagos
   *          Body: {
   *            "id_reserva": 15,
   *            "monto": 350.00,
   *            "metodo_pago": "tarjeta"
   *          }
   *          
   *       5. Confirmar asistencia y dejar reseña (después de la sesión)
   *          POST /resenas
   *       ```
   *       
   *       ### ⚠️ Validaciones Automáticas:
   *       - Verifica que la sesión exista
   *       - Verifica que haya cupos disponibles
   *       - Verifica que el cliente esté autenticado
   *       - Verifica que no haya conflictos de horario
   *       - Registra la reserva en la base de datos
   *       - Actualiza los cupos disponibles
   *       
   *       ### 💾 Datos que se Guardan en la Base de Datos:
   *       - ID de la reserva (generado automáticamente)
   *       - ID del cliente (obtenido del token JWT)
   *       - ID de la sesión seleccionada
   *       - Estado inicial: PENDIENTE
   *       - Fecha de creación de la reserva
   *       - Notas del cliente
   *       - Código de confirmación único
   *       
   *       ### 📊 Estados de Reserva:
   *       - **PENDIENTE**: Reserva creada, esperando pago
   *       - **CONFIRMADA**: Pago procesado, sesión confirmada
   *       - **CANCELADA**: Reserva cancelada por el cliente o entrenador
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       description: |
   *         Datos necesarios para agendar la cita.
   *         
   *         **Campos Requeridos:**
   *         - `sesion_id`: ID de la sesión (obtenido de /buscar-sesiones)
   *         - `fecha_hora`: Fecha y hora exacta de la cita
   *         
   *         **Campos Opcionales:**
   *         - `notas`: Información adicional para el entrenador
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AgendarCitaRequest'
   *           examples:
   *             ejemplo_basico:
   *               summary: Agendamiento básico
   *               value:
   *                 sesion_id: 1
   *                 fecha_hora: "2025-11-05T10:00:00Z"
   *             ejemplo_con_notas:
   *               summary: Agendamiento con notas
   *               value:
   *                 sesion_id: 1
   *                 fecha_hora: "2025-11-05T10:00:00Z"
   *                 notas: "Primera sesión. Tengo experiencia previa en gimnasio. Objetivo: mejorar condición física general."
   *     responses:
   *       201:
   *         description: |
   *           ✅ Cita agendada exitosamente
   *           
   *           La reserva se ha creado correctamente en la base de datos.
   *           El siguiente paso es procesar el pago usando el `id_reserva` retornado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AgendarCitaResponse'
   *             examples:
   *               reserva_exitosa:
   *                 summary: Ejemplo de reserva exitosa
   *                 value:
   *                   success: true
   *                   message: "Reserva agendada exitosamente"
   *                   data:
   *                     id_reserva: 15
   *                     cliente:
   *                       id_cliente: 5
   *                       nombre: "María"
   *                       apellido: "González"
   *                       telefono: "+52 555 1234567"
   *                     sesion:
   *                       id_sesion: 1
   *                       fecha: "2025-11-05T10:00:00Z"
   *                       cupos_disponibles: 4
   *                       entrenador:
   *                         id_entrenador: 1
   *                         especialidad: "Entrenamiento funcional"
   *                         nombre: "Juan"
   *                         apellido: "Pérez"
   *                     estado: "PENDIENTE"
   *                     fecha_reserva: "2025-11-03T14:30:00Z"
   *                     notas: "Primera sesión. Tengo experiencia previa en gimnasio."
   *                     codigo_confirmacion: "RES-2025110315"
   *                     instrucciones: "Por favor llegar 10 minutos antes. El pago se procesa en el siguiente paso. Recuerda traer ropa cómoda y una botella de agua."
   *       400:
   *         description: ❌ Datos inválidos o sesión sin cupos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *             examples:
   *               sin_cupos:
   *                 summary: Sesión sin cupos disponibles
   *                 value:
   *                   success: false
   *                   error: "La sesión no tiene cupos disponibles"
   *               datos_invalidos:
   *                 summary: Datos faltantes o inválidos
   *                 value:
   *                   success: false
   *                   error: "sesion_id y fecha_hora son requeridos"
   *       401:
   *         description: ❌ No autenticado - Token faltante o inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Token de acceso requerido"
   *       404:
   *         description: ❌ Cliente o sesión no encontrados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *             examples:
   *               cliente_no_encontrado:
   *                 summary: Cliente no tiene perfil creado
   *                 value:
   *                   success: false
   *                   error: "Cliente no encontrado. Por favor crea tu perfil primero en POST /clientes"
   *               sesion_no_existe:
   *                 summary: Sesión no existe
   *                 value:
   *                   success: false
   *                   error: "La sesión especificada no existe"
   *       500:
   *         description: ❌ Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async agendarReserva(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = (req as any).user?.cliente_id;
      if (!clienteId) {
        return ResponseUtil.error(res, 'Cliente no encontrado', 404);
      }

      const datosReserva = {
        ...req.body,
        cliente_id: clienteId,
      };

      const reservaAgendada = await this.agendamientoUseCases.agendarReserva(datosReserva);
      
      return ResponseUtil.success(res, reservaAgendada, 'Reserva agendada exitosamente', 201);
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /agendamiento/mis-reservas:
   *   get:
   *     summary: 📋 PASO 3 - Ver mis citas agendadas
   *     tags: [🎯 4. Agendamiento (CORE)]
   *     description: |
   *       Obtiene todas las reservas del cliente autenticado.
   *       
   *       ### 📋 Funcionalidad:
   *       - Lista todas las citas del cliente
   *       - Muestra información completa de cada reserva
   *       - Incluye datos del entrenador y la sesión
   *       - Permite filtrar por estado de reserva
   *       
   *       ### 🔍 Filtros Disponibles:
   *       - Sin filtro: Muestra todas las reservas
   *       - `estado=PENDIENTE`: Solo reservas pendientes de pago
   *       - `estado=CONFIRMADA`: Solo reservas confirmadas
   *       - `estado=CANCELADA`: Solo reservas canceladas
   *       
   *       ### 🔐 Autenticación:
   *       Requiere token JWT. Solo verás tus propias reservas.
   *       
   *       ### 💡 Casos de Uso:
   *       - Ver próximas sesiones agendadas
   *       - Revisar historial de entrenamientos
   *       - Verificar estado de pago de reservas
   *       - Obtener información de contacto del entrenador
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *           enum: [PENDIENTE, CONFIRMADA, CANCELADA]
   *         required: false
   *         description: Filtrar reservas por estado
   *         example: "CONFIRMADA"
   *     responses:
   *       200:
   *         description: ✅ Reservas obtenidas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MisReservasResponse'
   *             examples:
   *               con_reservas:
   *                 summary: Cliente con reservas
   *                 value:
   *                   success: true
   *                   message: "Reservas obtenidas"
   *                   data:
   *                     - id_reserva: 15
   *                       estado: "CONFIRMADA"
   *                       fecha_reserva: "2025-11-03T14:30:00Z"
   *                       sesion:
   *                         id_sesion: 1
   *                         fecha: "2025-11-05T10:00:00Z"
   *                         entrenador:
   *                           nombre: "Juan"
   *                           apellido: "Pérez"
   *                           especialidad: "Entrenamiento funcional"
   *                           experiencia: 5
   *                       puede_cancelar: true
   *                       tiempo_restante: "1 día, 19 horas"
   *                     - id_reserva: 14
   *                       estado: "PENDIENTE"
   *                       fecha_reserva: "2025-11-02T10:00:00Z"
   *                       sesion:
   *                         id_sesion: 3
   *                         fecha: "2025-11-08T15:00:00Z"
   *                         entrenador:
   *                           nombre: "María"
   *                           apellido: "González"
   *                           especialidad: "Yoga"
   *                           experiencia: 8
   *                       puede_cancelar: true
   *                       tiempo_restante: "5 días, 0 horas"
   *                   total: 2
   *               sin_reservas:
   *                 summary: Cliente sin reservas
   *                 value:
   *                   success: true
   *                   message: "No tienes reservas aún"
   *                   data: []
   *                   total: 0
   *       401:
   *         description: ❌ No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Token de acceso requerido"
   *       404:
   *         description: ❌ Cliente no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Cliente no encontrado"
   *       500:
   *         description: ❌ Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async misReservas(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = (req as any).user?.cliente_id;
      if (!clienteId) {
        return ResponseUtil.error(res, 'Cliente no encontrado', 404);
      }

      const estado = req.query.estado as string;
      const reservas = await this.agendamientoUseCases.obtenerReservasCliente(clienteId, estado);
      
      return ResponseUtil.success(res, reservas, 'Reservas obtenidas');
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }

  /**
   * @swagger
   * /agendamiento/reserva/{reservaId}/cancelar:
   *   patch:
   *     summary: ❌ PASO 4 - Cancelar una cita agendada
   *     tags: [🎯 4. Agendamiento (CORE)]
   *     description: |
   *       Cancela una reserva existente del cliente autenticado.
   *       
   *       ### ⚠️ Política de Cancelación:
   *       - Solo puedes cancelar tus propias reservas
   *       - Se recomienda cancelar con al menos 24 horas de anticipación
   *       - Al cancelar, se libera el cupo en la sesión
   *       - El estado de la reserva cambia a CANCELADA
   *       
   *       ### 📋 Proceso de Cancelación:
   *       1. El sistema verifica que la reserva pertenezca al cliente
   *       2. Cambia el estado de PENDIENTE/CONFIRMADA a CANCELADA
   *       3. Incrementa los cupos disponibles en la sesión
   *       4. Se guarda el registro de cancelación
   *       5. (Opcional) Se puede notificar al entrenador
   *       
   *       ### 💰 Reembolsos:
   *       - Reservas PENDIENTES: Cancelación sin cargo
   *       - Reservas CONFIRMADAS: Según política de reembolso
   *       
   *       ### 🔐 Autenticación:
   *       Requiere token JWT. Solo puedes cancelar tus propias reservas.
   *       
   *       ### 💡 Casos de Uso:
   *       - Cambio de planes del cliente
   *       - Problemas de agenda personal
   *       - Problemas de salud
   *       - Encontrar otro horario más conveniente
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: reservaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la reserva a cancelar (obtenido de /mis-reservas)
   *         example: 15
   *     responses:
   *       200:
   *         description: ✅ Reserva cancelada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Reserva cancelada exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id_reserva:
   *                       type: integer
   *                       example: 15
   *                     estado_anterior:
   *                       type: string
   *                       example: "CONFIRMADA"
   *                     estado_actual:
   *                       type: string
   *                       example: "CANCELADA"
   *                     fecha_cancelacion:
   *                       type: string
   *                       format: 'date-time'
   *                       example: "2025-11-03T16:00:00Z"
   *                     reembolso:
   *                       type: object
   *                       properties:
   *                         aplica:
   *                           type: boolean
   *                           example: true
   *                         monto:
   *                           type: number
   *                           example: 350.00
   *                         tiempo_procesamiento:
   *                           type: string
   *                           example: "5-7 días hábiles"
   *             examples:
   *               cancelacion_exitosa:
   *                 summary: Cancelación exitosa con reembolso
   *                 value:
   *                   success: true
   *                   message: "Reserva cancelada exitosamente. El cupo ha sido liberado."
   *                   data:
   *                     id_reserva: 15
   *                     estado_anterior: "CONFIRMADA"
   *                     estado_actual: "CANCELADA"
   *                     fecha_cancelacion: "2025-11-03T16:00:00Z"
   *                     reembolso:
   *                       aplica: true
   *                       monto: 350.00
   *                       tiempo_procesamiento: "5-7 días hábiles"
   *                       instrucciones: "El reembolso se procesará al método de pago original"
   *       400:
   *         description: ❌ No se puede cancelar la reserva
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *             examples:
   *               ya_cancelada:
   *                 summary: Reserva ya cancelada
   *                 value:
   *                   success: false
   *                   error: "Esta reserva ya fue cancelada previamente"
   *               muy_proxima:
   *                 summary: Sesión muy próxima
   *                 value:
   *                   success: false
   *                   error: "No se puede cancelar. La sesión es en menos de 2 horas. Contacta al entrenador directamente."
   *       401:
   *         description: ❌ No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Token de acceso requerido"
   *       403:
   *         description: ❌ No autorizado - La reserva no te pertenece
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "No tienes permiso para cancelar esta reserva"
   *       404:
   *         description: ❌ Reserva no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: "Reserva no encontrada"
   *       500:
   *         description: ❌ Error del servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async cancelarReserva(req: Request, res: Response): Promise<Response> {
    try {
      const reservaId = parseInt(req.params.reservaId);
      const clienteId = (req as any).user?.cliente_id;
      if (!clienteId) {
        return ResponseUtil.error(res, 'Cliente no encontrado', 404);
      }

      await this.agendamientoUseCases.cancelarReserva(reservaId, clienteId);
      
      return ResponseUtil.success(res, null, 'Reserva cancelada exitosamente');
    } catch (error) {
      return ResponseUtil.error(res, (error as Error).message, 500);
    }
  }
}