import { Router } from 'express';
import { RetroalimentacionAppController } from '@/presentation/controllers/RetroalimentacionAppController';
import { RetroalimentacionAppUseCases } from '@/application/use-cases/RetroalimentacionAppUseCases';
import { SupabaseRetroalimentacionAppRepository } from '@/infrastructure/repositories/SupabaseRetroalimentacionAppRepository';

const router = Router();

// Dependency injection
const retroalimentacionRepository = new SupabaseRetroalimentacionAppRepository();
const retroalimentacionUseCases = new RetroalimentacionAppUseCases(retroalimentacionRepository);
const retroalimentacionController = new RetroalimentacionAppController(retroalimentacionUseCases);

// Routes
router.get('/', (req, res) => retroalimentacionController.getAll(req, res));
router.get('/:id', (req, res) => retroalimentacionController.getById(req, res));
router.get('/usuario/:usuarioId', (req, res) => retroalimentacionController.getByUsuario(req, res));
router.get('/tipo/:tipo', (req, res) => retroalimentacionController.getByTipo(req, res));
router.post('/', (req, res) => retroalimentacionController.create(req, res));
router.put('/:id', (req, res) => retroalimentacionController.update(req, res));
router.delete('/:id', (req, res) => retroalimentacionController.delete(req, res));

export default router;