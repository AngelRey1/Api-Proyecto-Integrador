import { Router } from 'express';
import { ReservaCleanController } from '@/presentation/controllers/clean/ReservaCleanController';
import { ReservaUseCases } from '@/application/use-cases/ReservaUseCases';
import { SupabaseReservaRepository } from '@/infrastructure/repositories/SupabaseReservaRepository';
import { authenticateToken } from '@/shared/middleware/auth';

const router = Router();

// Dependency injection
const reservaRepository = new SupabaseReservaRepository();
const reservaUseCases = new ReservaUseCases(reservaRepository);
const reservaController = new ReservaCleanController(reservaUseCases);

// Routes
router.get('/', authenticateToken, (req, res) => reservaController.getAll(req, res));
router.get('/mis-reservas', authenticateToken, (req, res) => reservaController.misReservas(req, res));
router.get('/:id', authenticateToken, (req, res) => reservaController.getById(req, res));
router.post('/', authenticateToken, (req, res) => reservaController.create(req, res));
router.put('/:id', authenticateToken, (req, res) => reservaController.update(req, res));
router.patch('/:id/cancelar', authenticateToken, (req, res) => reservaController.cancelar(req, res));

export default router;