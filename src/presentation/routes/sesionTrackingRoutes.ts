import { Router } from 'express';
import { SesionTrackingController } from '../controllers/SesionTrackingController';
import { SesionTrackingUseCases } from '../../application/use-cases/SesionTrackingUseCases';
import { authenticateToken } from '../../shared/middleware/auth';

const router = Router();

// Inicializar casos de uso y controlador
const sesionTrackingUseCases = new SesionTrackingUseCases();
const sesionTrackingController = new SesionTrackingController(sesionTrackingUseCases);

// ▶️ INICIAR SESIÓN
router.post('/iniciar', 
  authenticateToken, 
  sesionTrackingController.iniciarSesion.bind(sesionTrackingController)
);

// ⏹️ FINALIZAR SESIÓN
router.post('/finalizar', 
  authenticateToken, 
  sesionTrackingController.finalizarSesion.bind(sesionTrackingController)
);

// ⭐ EVALUAR SESIÓN
router.post('/evaluar', 
  authenticateToken, 
  sesionTrackingController.evaluarSesion.bind(sesionTrackingController)
);

// 📋 HISTORIAL DE SESIONES
router.get('/historial/:clienteId', 
  authenticateToken, 
  sesionTrackingController.obtenerHistorialSesiones.bind(sesionTrackingController)
);

// 🔄 SESIÓN EN PROGRESO
router.get('/en-progreso/:entrenadorId', 
  authenticateToken, 
  sesionTrackingController.obtenerSesionEnProgreso.bind(sesionTrackingController)
);

export { router as sesionTrackingRoutes };