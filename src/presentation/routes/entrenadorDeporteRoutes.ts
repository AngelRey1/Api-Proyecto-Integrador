import { Router } from 'express';
import { EntrenadorDeporteController } from '@/presentation/controllers/EntrenadorDeporteController';
import { EntrenadorDeporteUseCases } from '@/application/use-cases/EntrenadorDeporteUseCases';
import { SupabaseEntrenadorDeporteRepository } from '@/infrastructure/repositories/SupabaseEntrenadorDeporteRepository';

const router = Router();

// Dependency injection
const entrenadorDeporteRepository = new SupabaseEntrenadorDeporteRepository();
const entrenadorDeporteUseCases = new EntrenadorDeporteUseCases(entrenadorDeporteRepository);
const entrenadorDeporteController = new EntrenadorDeporteController(entrenadorDeporteUseCases);

// Routes
router.get('/', (req, res) => entrenadorDeporteController.getAll(req, res));
router.get('/entrenador/:entrenadorId', (req, res) => entrenadorDeporteController.getDeportesByEntrenador(req, res));
router.get('/deporte/:deporteId', (req, res) => entrenadorDeporteController.getEntrenadoresByDeporte(req, res));
router.post('/', (req, res) => entrenadorDeporteController.create(req, res));
router.delete('/:entrenadorId/:deporteId', (req, res) => entrenadorDeporteController.delete(req, res));

export default router;