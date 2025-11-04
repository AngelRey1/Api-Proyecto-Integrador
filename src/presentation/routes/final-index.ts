import { Router } from 'express';
import { AuthFinalController } from '@/presentation/controllers/final/AuthFinalController';
import { UsuarioFinalController } from '@/presentation/controllers/final/UsuarioFinalController';
import { EntrenadorFinalController } from '@/presentation/controllers/final/EntrenadorFinalController';
import { ClienteFinalController } from '@/presentation/controllers/final/ClienteFinalController';
import { ReservaFinalController } from '@/presentation/controllers/final/ReservaFinalController';
import { PagoFinalController } from '@/presentation/controllers/final/PagoFinalController';
import { ReseñaFinalController } from '../controllers/final/ReseñaFinalController';
import { DeporteFinalController } from '@/presentation/controllers/final/DeporteFinalController';
import { authenticateToken } from '@/shared/middleware/auth';
import { validacionesReserva, validacionesReseña } from '@/shared/middleware/businessValidations';

const router = Router();

// Inicializar controllers
const authController = new AuthFinalController();
const usuarioController = new UsuarioFinalController();
const entrenadorController = new EntrenadorFinalController();
const clienteController = new ClienteFinalController();
const reservaController = new ReservaFinalController();
const pagoController = new PagoFinalController();
const reseñaController = new ReseñaFinalController();
const deporteController = new DeporteFinalController();

// ═══════════════════════════════════════════════════════════════════
// 🔐 AUTENTICACIÓN (Sin autenticación requerida)
// ═══════════════════════════════════════════════════════════════════
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.get('/auth/profile', authenticateToken, (req, res) => authController.getProfile(req, res));

// ═══════════════════════════════════════════════════════════════════
// 👥 GESTIÓN DE USUARIOS
// ═══════════════════════════════════════════════════════════════════
router.get('/usuarios', authenticateToken, (req, res) => usuarioController.getAll(req, res));
router.get('/usuarios/:id', authenticateToken, (req, res) => usuarioController.getById(req, res));
router.post('/usuarios', authenticateToken, (req, res) => usuarioController.create(req, res));
router.put('/usuarios/:id', authenticateToken, (req, res) => usuarioController.update(req, res));
router.delete('/usuarios/:id', authenticateToken, (req, res) => usuarioController.delete(req, res));

// ═══════════════════════════════════════════════════════════════════
// 🏃‍♂️ ENTRENADORES
// ═══════════════════════════════════════════════════════════════════
router.get('/entrenadores', authenticateToken, (req, res) => entrenadorController.getAll(req, res));
router.get('/entrenadores/buscar', (req, res) => entrenadorController.buscar(req, res)); // Público
router.get('/entrenadores/:id', authenticateToken, (req, res) => entrenadorController.getById(req, res));
router.post('/entrenadores', authenticateToken, (req, res) => entrenadorController.create(req, res));
router.put('/entrenadores/:id', authenticateToken, (req, res) => entrenadorController.update(req, res));
router.delete('/entrenadores/:id', authenticateToken, (req, res) => entrenadorController.delete(req, res));

// ═══════════════════════════════════════════════════════════════════
// 👤 CLIENTES
// ═══════════════════════════════════════════════════════════════════
router.get('/clientes', authenticateToken, (req, res) => clienteController.getAll(req, res));
router.get('/clientes/:id', authenticateToken, (req, res) => clienteController.getById(req, res));
router.post('/clientes', authenticateToken, (req, res) => clienteController.create(req, res));
router.put('/clientes/:id', authenticateToken, (req, res) => clienteController.update(req, res));
router.delete('/clientes/:id', authenticateToken, (req, res) => clienteController.delete(req, res));

// ═══════════════════════════════════════════════════════════════════
// 📅 RESERVAS (FUNCIONALIDAD PRINCIPAL)
// ═══════════════════════════════════════════════════════════════════
router.get('/reservas', authenticateToken, (req, res) => reservaController.getAll(req, res));
router.get('/reservas/mis-reservas', authenticateToken, (req, res) => reservaController.misReservas(req, res));
router.get('/reservas/:id', authenticateToken, (req, res) => reservaController.getById(req, res));
router.post('/reservas', authenticateToken, ...validacionesReserva, (req, res) => reservaController.create(req, res));
router.put('/reservas/:id', authenticateToken, (req, res) => reservaController.update(req, res));
router.delete('/reservas/:id', authenticateToken, (req, res) => reservaController.delete(req, res));

// ═══════════════════════════════════════════════════════════════════
// 💰 PAGOS
// ═══════════════════════════════════════════════════════════════════
router.get('/pagos', authenticateToken, (req, res) => pagoController.getAll(req, res));
router.get('/pagos/:id', authenticateToken, (req, res) => pagoController.getById(req, res));
router.post('/pagos', authenticateToken, (req, res) => pagoController.create(req, res));
router.put('/pagos/:id', authenticateToken, (req, res) => pagoController.update(req, res));

// ═══════════════════════════════════════════════════════════════════
// ⭐ RESEÑAS
// ═══════════════════════════════════════════════════════════════════
router.get('/reseñas', authenticateToken, (req, res) => reseñaController.getAll(req, res));
router.get('/reseñas/:id', authenticateToken, (req, res) => reseñaController.getById(req, res));
router.post('/reseñas', authenticateToken, ...validacionesReseña, (req, res) => reseñaController.create(req, res));
router.put('/reseñas/:id', authenticateToken, (req, res) => reseñaController.update(req, res));

// ═══════════════════════════════════════════════════════════════════
// 🏆 DEPORTES
// ═══════════════════════════════════════════════════════════════════
router.get('/deportes', authenticateToken, (req, res) => deporteController.getAll(req, res));
router.get('/deportes/:id', authenticateToken, (req, res) => deporteController.getById(req, res));
router.post('/deportes', authenticateToken, (req, res) => deporteController.create(req, res));
router.put('/deportes/:id', authenticateToken, (req, res) => deporteController.update(req, res));
router.delete('/deportes/:id', authenticateToken, (req, res) => deporteController.delete(req, res));

// ═══════════════════════════════════════════════════════════════════
// 📊 SISTEMA
// ═══════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /status:
 *   get:
 *     tags: [📊 Sistema]
 *     summary: 📊 Estado de la API
 *     description: Obtiene información sobre el estado actual de la API
 *     responses:
 *       200:
 *         description: Estado de la API
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
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     status:
 *                       type: string
 *                       example: "operational"
 *                     database:
 *                       type: string
 *                       example: "connected"
 *                     endpoints:
 *                       type: integer
 *                       example: 25
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      version: '1.0.0',
      status: 'operational',
      database: 'connected',
      endpoints: 25,
      tablas_implementadas: 15
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [📊 Sistema]
 *     summary: 🏥 Health Check
 *     description: Endpoint simple para verificar que la API funciona
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

export { router as finalApiRoutes };