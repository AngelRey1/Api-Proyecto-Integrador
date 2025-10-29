import { Router } from 'express';
import { ReseñaController } from '@/presentation/controllers/ReseñaController';
import { ReseñaUseCases } from '@/application/use-cases/ReseñaUseCases';
import { SupabaseReseñaRepository } from '@/infrastructure/repositories/SupabaseReseñaRepository';

const router = Router();

const reseñaRepository = new SupabaseReseñaRepository();
const reseñaUseCases = new ReseñaUseCases(reseñaRepository);
const reseñaController = new ReseñaController(reseñaUseCases);

router.get('/', (req, res) => reseñaController.getReseñas(req, res));
router.get('/:id', (req, res) => reseñaController.getReseñaById(req, res));
router.post('/', (req, res) => reseñaController.createReseña(req, res));
router.put('/:id', (req, res) => reseñaController.updateReseña(req, res));
router.delete('/:id', (req, res) => reseñaController.deleteReseña(req, res));

export { router as reseñaRoutes };