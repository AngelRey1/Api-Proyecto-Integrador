import { Router } from 'express';
import { CalendarioDisponibilidadController } from '@/presentation/controllers/CalendarioDisponibilidadController';
import { CalendarioDisponibilidadUseCases } from '@/application/use-cases/CalendarioDisponibilidadUseCases';
import { SupabaseCalendarioDisponibilidadRepository } from '@/infrastructure/repositories/SupabaseCalendarioDisponibilidadRepository';

const router = Router();

// Dependency injection
const calendarioRepository = new SupabaseCalendarioDisponibilidadRepository();
const calendarioUseCases = new CalendarioDisponibilidadUseCases(calendarioRepository);
const calendarioController = new CalendarioDisponibilidadController(calendarioUseCases);

// Routes
router.get('/', (req, res) => calendarioController.getAll(req, res));
router.get('/:id', (req, res) => calendarioController.getById(req, res));
router.get('/entrenador/:entrenadorId', (req, res) => calendarioController.getByEntrenador(req, res));
router.get('/fecha/:fecha', (req, res) => calendarioController.getByFecha(req, res));
router.post('/', (req, res) => calendarioController.create(req, res));
router.put('/:id', (req, res) => calendarioController.update(req, res));
router.delete('/:id', (req, res) => calendarioController.delete(req, res));

export default router;