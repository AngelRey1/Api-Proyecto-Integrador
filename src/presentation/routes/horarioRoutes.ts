import { Router } from 'express';
import { HorarioController } from '@/presentation/controllers/HorarioController';
import { HorarioUseCases } from '@/application/use-cases/HorarioUseCases';
import { SupabaseHorarioRepository } from '@/infrastructure/repositories/SupabaseHorarioRepository';

const router = Router();

// Dependency injection
const horarioRepository = new SupabaseHorarioRepository();
const horarioUseCases = new HorarioUseCases(horarioRepository);
const horarioController = new HorarioController(horarioUseCases);

// Routes
router.get('/', (req, res) => horarioController.getHorarios(req, res));
router.get('/:id', (req, res) => horarioController.getHorarioById(req, res));
router.get('/entrenador/:entrenadorId', (req, res) => horarioController.getHorariosByEntrenador(req, res));
router.post('/', (req, res) => horarioController.createHorario(req, res));
router.put('/:id', (req, res) => horarioController.updateHorario(req, res));
router.delete('/:id', (req, res) => horarioController.deleteHorario(req, res));

export { router as horarioRoutes };