import { Router } from 'express';
import { UsuarioCleanController } from '@/presentation/controllers/clean/UsuarioCleanController';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { authenticateToken } from '@/shared/middleware/auth';

const router = Router();

// Dependency injection
const userRepository = new SupabaseUserRepository();
const userUseCases = new UserUseCases(userRepository);
const usuarioController = new UsuarioCleanController(userUseCases);

// Routes
router.get('/', authenticateToken, (req, res) => usuarioController.getAll(req, res));
router.get('/:id', authenticateToken, (req, res) => usuarioController.getById(req, res));
router.post('/', authenticateToken, (req, res) => usuarioController.create(req, res));
router.put('/:id', authenticateToken, (req, res) => usuarioController.update(req, res));
router.delete('/:id', authenticateToken, (req, res) => usuarioController.delete(req, res));

export default router;