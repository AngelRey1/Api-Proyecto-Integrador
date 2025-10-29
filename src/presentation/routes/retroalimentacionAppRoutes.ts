import { Router } from 'express';
import { RetroalimentacionAppController } from '@/presentation/controllers/RetroalimentacionAppController';
import { RetroalimentacionAppUseCases } from '@/application/use-cases/RetroalimentacionAppUseCases';
import { SupabaseRetroalimentacionAppRepository } from '@/infrastructure/repositories/SupabaseRetroalimentacionAppRepository';

const router = Router();

const retroalimentacionRepository = new SupabaseRetroalimentacionAppRepository();
const retroalimentacionUseCases = new RetroalimentacionAppUseCases(retroalimentacionRepository);
const retroalimentacionController = new RetroalimentacionAppController(retroalimentacionUseCases);

router.get('/', (req, res) => retroalimentacionController.getRetroalimentaciones(req, res));
router.get('/:id', (req, res) => retroalimentacionController.getRetroalimentacionById(req, res));
router.post('/', (req, res) => retroalimentacionController.createRetroalimentacion(req, res));
router.put('/:id', (req, res) => retroalimentacionController.updateRetroalimentacion(req, res));
router.delete('/:id', (req, res) => retroalimentacionController.deleteRetroalimentacion(req, res));

export { router as retroalimentacionAppRoutes };