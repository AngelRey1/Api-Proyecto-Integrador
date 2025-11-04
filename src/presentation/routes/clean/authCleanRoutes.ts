import { Router } from 'express';
import { AuthCleanController } from '@/presentation/controllers/clean/AuthCleanController';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { authenticateToken } from '@/shared/middleware/auth';

const router = Router();

// Dependency injection
const userRepository = new SupabaseUserRepository();
const userUseCases = new UserUseCases(userRepository);
const authController = new AuthCleanController(userUseCases);

// Routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/profile', authenticateToken, (req, res) => authController.getProfile(req, res));
router.post('/logout', authenticateToken, (req, res) => authController.logout(req, res));

export default router;