import { Router } from 'express';
import { NotificacionController } from '@/presentation/controllers/NotificacionController';
import { NotificacionUseCases } from '@/application/use-cases/NotificacionUseCases';
import { SupabaseNotificacionRepository } from '@/infrastructure/repositories/SupabaseNotificacionRepository';

const router = Router();

const notificacionRepository = new SupabaseNotificacionRepository();
const notificacionUseCases = new NotificacionUseCases(notificacionRepository);
const notificacionController = new NotificacionController(notificacionUseCases);

router.get('/', (req, res) => notificacionController.getNotificaciones(req, res));
router.get('/:id', (req, res) => notificacionController.getNotificacionById(req, res));
router.get('/usuario/:usuarioId/no-leidas', (req, res) => notificacionController.getNotificacionesNoLeidas(req, res));
router.put('/:id/marcar-leida', (req, res) => notificacionController.marcarComoLeida(req, res));
router.post('/', (req, res) => notificacionController.createNotificacion(req, res));
router.put('/:id', (req, res) => notificacionController.updateNotificacion(req, res));
router.delete('/:id', (req, res) => notificacionController.deleteNotificacion(req, res));

export { router as notificacionRoutes };