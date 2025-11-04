import { Router } from 'express';
import { AgendamientoController } from '../controllers/AgendamientoController';
import { AgendamientoUseCases } from '../../application/use-cases/AgendamientoUseCases';
import { authenticateToken } from '../../shared/middleware/auth';

const router = Router();

// Inicializar casos de uso
const agendamientoUseCases = new AgendamientoUseCases();

// Inicializar controlador
const agendamientoController = new AgendamientoController(agendamientoUseCases);

// 🔍 BUSCAR SESIONES DISPONIBLES (público - no requiere autenticación)
router.get('/buscar-sesiones', agendamientoController.buscarSesiones.bind(agendamientoController));

// 🎯 AGENDAR RESERVA (requiere autenticación) ⭐ ENDPOINT PRINCIPAL
router.post('/agendar', authenticateToken, agendamientoController.agendarReserva.bind(agendamientoController));

// 📋 MIS RESERVAS (requiere autenticación)
router.get('/mis-reservas', authenticateToken, agendamientoController.misReservas.bind(agendamientoController));

// ❌ CANCELAR RESERVA (requiere autenticación)
router.patch('/reserva/:reservaId/cancelar', authenticateToken, agendamientoController.cancelarReserva.bind(agendamientoController));

export { router as agendamientoRoutes };