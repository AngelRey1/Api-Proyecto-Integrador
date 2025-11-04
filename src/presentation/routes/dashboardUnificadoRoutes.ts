import { Router } from 'express';
import { DashboardUnificadoController } from '../controllers/DashboardUnificadoController';
import { DashboardUnificadoUseCases } from '../../application/use-cases/DashboardUnificadoUseCases';
import { authenticateToken } from '../../shared/middleware/auth';

const router = Router();

const dashboardUnificadoUseCases = new DashboardUnificadoUseCases();
const dashboardUnificadoController = new DashboardUnificadoController(dashboardUnificadoUseCases);

// 👤 DASHBOARD CLIENTE
router.get('/cliente/:clienteId', authenticateToken, dashboardUnificadoController.obtenerDashboardCliente.bind(dashboardUnificadoController));

// 👨‍💼 DASHBOARD ENTRENADOR
router.get('/entrenador/:entrenadorId', authenticateToken, dashboardUnificadoController.obtenerDashboardEntrenador.bind(dashboardUnificadoController));

// 👑 DASHBOARD ADMIN
router.get('/admin', authenticateToken, dashboardUnificadoController.obtenerDashboardAdmin.bind(dashboardUnificadoController));

// 📊 MÉTRICAS COMPARATIVAS
router.get('/comparativas/:usuarioId', authenticateToken, dashboardUnificadoController.obtenerMetricasComparativas.bind(dashboardUnificadoController));

// 📄 GENERAR REPORTE
router.get('/reporte/:usuarioId', authenticateToken, dashboardUnificadoController.generarReporteDashboard.bind(dashboardUnificadoController));

// 🔔 NOTIFICACIONES DASHBOARD
router.get('/notificaciones/:usuarioId', authenticateToken, dashboardUnificadoController.obtenerNotificacionesDashboard.bind(dashboardUnificadoController));

export { router as dashboardUnificadoRoutes };