import { Router } from 'express';
import authCleanRoutes from './clean/authCleanRoutes';
import usuarioCleanRoutes from './clean/usuarioCleanRoutes';
import reservaCleanRoutes from './clean/reservaCleanRoutes';

const router = Router();

// ═══════════════════════════════════════════════════════════════════
// 🎯 API LIMPIA - ENDPOINTS PRINCIPALES
// ═══════════════════════════════════════════════════════════════════

// 🔐 AUTENTICACIÓN (Sin autenticación requerida)
router.use('/auth', authCleanRoutes);

// 👥 USUARIOS (Con autenticación)
router.use('/usuarios', usuarioCleanRoutes);

// 📅 RESERVAS (Con autenticación) - ENDPOINT PRINCIPAL
router.use('/reservas', reservaCleanRoutes);

// ═══════════════════════════════════════════════════════════════════
// 📊 ENDPOINT DE ESTADO DE LA API
// ═══════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /status:
 *   get:
 *     tags: [📊 Estadísticas]
 *     summary: 📊 Estado de la API
 *     description: |
 *       Obtiene información sobre el estado actual de la API.
 *       Incluye estadísticas básicas y estado de servicios.
 *     responses:
 *       200:
 *         description: Estado de la API obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     api_version:
 *                       type: string
 *                       example: "2.0.0"
 *                     status:
 *                       type: string
 *                       example: "operational"
 *                     database:
 *                       type: string
 *                       example: "connected"
 *                     endpoints_disponibles:
 *                       type: integer
 *                       example: 15
 *                     ultima_actualizacion:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "API funcionando correctamente"
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api_version: '2.0.0',
      status: 'operational',
      database: 'connected',
      endpoints_disponibles: 15,
      tablas_implementadas: 15,
      funcionalidades: [
        'Autenticación JWT',
        'Gestión de usuarios',
        'Sistema de reservas',
        'Procesamiento de pagos',
        'Sistema de reseñas',
        'Notificaciones'
      ],
      ultima_actualizacion: new Date().toISOString()
    },
    message: 'API funcionando correctamente'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [📊 Estadísticas]
 *     summary: 🏥 Health Check
 *     description: Endpoint simple para verificar que la API está funcionando
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export { router as cleanApiRoutes };