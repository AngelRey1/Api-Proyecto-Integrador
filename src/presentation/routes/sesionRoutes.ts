import { Router } from 'express';
import { SesionController } from '@/presentation/controllers/SesionController';
import { SesionUseCases } from '@/application/use-cases/SesionUseCases';
import { SupabaseSesionRepository } from '@/infrastructure/repositories/SupabaseSesionRepository';

const router = Router();

// Dependency injection
const sesionRepository = new SupabaseSesionRepository();
const sesionUseCases = new SesionUseCases(sesionRepository);
const sesionController = new SesionController(sesionUseCases);

// Routes
router.get('/', (req, res) => sesionController.getSesiones(req, res));
router.get('/:id', (req, res) => sesionController.getSesionById(req, res));
router.get('/horario/:horarioId', (req, res) => sesionController.getSesionesByHorario(req, res));
router.get('/fecha/:fecha', (req, res) => sesionController.getSesionesByFecha(req, res));
router.post('/', (req, res) => sesionController.createSesion(req, res));
router.put('/:id', (req, res) => sesionController.updateSesion(req, res));
router.delete('/:id', (req, res) => sesionController.deleteSesion(req, res));

export { router as sesionRoutes };