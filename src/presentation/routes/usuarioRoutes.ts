import { Router } from 'express';
import { UsuarioController } from '@/presentation/controllers/UsuarioController';
import { UserUseCases } from '@/application/use-cases/UserUseCases';
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository';
import { authenticateToken } from '@/shared/middleware/auth';

const router = Router();

// Inicializar dependencias
const userRepository = new SupabaseUserRepository();
const userUseCases = new UserUseCases(userRepository);
const usuarioController = new UsuarioController(userUseCases);

// Rutas públicas (sin autenticación)
router.post('/register', (req, res) => usuarioController.registerUsuario(req, res));
router.post('/login', (req, res) => usuarioController.loginUsuario(req, res));

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, (req, res) => usuarioController.getUsuarios(req, res));
router.post('/', authenticateToken, (req, res) => usuarioController.createUsuario(req, res));
router.get('/:id', authenticateToken, (req, res) => usuarioController.getUsuarioById(req, res));
router.put('/:id', authenticateToken, (req, res) => usuarioController.updateUsuario(req, res));
router.delete('/:id', authenticateToken, (req, res) => usuarioController.deleteUsuario(req, res));

export { router as usuarioRoutes };