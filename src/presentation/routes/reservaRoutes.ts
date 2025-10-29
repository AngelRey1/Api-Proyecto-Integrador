import { Router } from 'express';
import { ReservaController } from '@/presentation/controllers/ReservaController';
import { ReservaUseCases } from '@/application/use-cases/ReservaUseCases';
import { SupabaseReservaRepository } from '@/infrastructure/repositories/SupabaseReservaRepository';

const router = Router();

// Dependency injection
const reservaRepository = new SupabaseReservaRepository();
const reservaUseCases = new ReservaUseCases(reservaRepository);
const reservaController = new ReservaController(reservaUseCases);

// Routes
router.get('/', (req, res) => reservaController.getReservas(req, res));
router.get('/:id', (req, res) => reservaController.getReservaById(req, res));
router.post('/', (req, res) => reservaController.createReserva(req, res));
router.put('/:id', (req, res) => reservaController.updateReserva(req, res));
router.delete('/:id', (req, res) => reservaController.deleteReserva(req, res));

export { router as reservaRoutes };