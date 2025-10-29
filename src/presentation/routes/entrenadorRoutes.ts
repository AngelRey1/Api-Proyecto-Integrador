import { Router } from 'express';
import { EntrenadorController } from '@/presentation/controllers/EntrenadorController';
import { EntrenadorUseCases } from '@/application/use-cases/EntrenadorUseCases';
import { SupabaseEntrenadorRepository } from '@/infrastructure/repositories/SupabaseEntrenadorRepository';

const router = Router();

// Dependency injection
const entrenadorRepository = new SupabaseEntrenadorRepository();
const entrenadorUseCases = new EntrenadorUseCases(entrenadorRepository);
const entrenadorController = new EntrenadorController(entrenadorUseCases);

// Routes
router.get('/', (req, res) => entrenadorController.getEntrenadores(req, res));
router.get('/:id', (req, res) => entrenadorController.getEntrenadorById(req, res));
router.post('/', (req, res) => entrenadorController.createEntrenador(req, res));
router.put('/:id', (req, res) => entrenadorController.updateEntrenador(req, res));
router.delete('/:id', (req, res) => entrenadorController.deleteEntrenador(req, res));

export { router as entrenadorRoutes };