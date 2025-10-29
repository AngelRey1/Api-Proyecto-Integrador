import { Router } from 'express';
import { EntrenadorDeporteController } from '@/presentation/controllers/EntrenadorDeporteController';
import { EntrenadorDeporteUseCases } from '@/application/use-cases/EntrenadorDeporteUseCases';
import { SupabaseEntrenadorDeporteRepository } from '@/infrastructure/repositories/SupabaseEntrenadorDeporteRepository';

const router = Router();

const entrenadorDeporteRepository = new SupabaseEntrenadorDeporteRepository();
const entrenadorDeporteUseCases = new EntrenadorDeporteUseCases(entrenadorDeporteRepository);
const entrenadorDeporteController = new EntrenadorDeporteController(entrenadorDeporteUseCases);

router.get('/', (req, res) => entrenadorDeporteController.getEntrenadorDeportes(req, res));
router.get('/:id', (req, res) => entrenadorDeporteController.getEntrenadorDeporteById(req, res));
router.post('/', (req, res) => entrenadorDeporteController.createEntrenadorDeporte(req, res));
router.put('/:id', (req, res) => entrenadorDeporteController.updateEntrenadorDeporte(req, res));
router.delete('/:id', (req, res) => entrenadorDeporteController.deleteEntrenadorDeporte(req, res));

// Rutas específicas
router.get('/entrenador/:entrenadorId', (req, res) => entrenadorDeporteController.getDeportesByEntrenador(req, res));
router.get('/deporte/:deporteId', (req, res) => entrenadorDeporteController.getEntrenadoresByDeporte(req, res));

export { router as entrenadorDeporteRoutes };