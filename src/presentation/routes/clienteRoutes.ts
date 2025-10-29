import { Router } from 'express';
import { ClienteController } from '@/presentation/controllers/ClienteController';
import { ClienteUseCases } from '@/application/use-cases/ClienteUseCases';
import { SupabaseClienteRepository } from '@/infrastructure/repositories/SupabaseClienteRepository';

const router = Router();

// Dependency injection
const clienteRepository = new SupabaseClienteRepository();
const clienteUseCases = new ClienteUseCases(clienteRepository);
const clienteController = new ClienteController(clienteUseCases);

// Routes
router.get('/', (req, res) => clienteController.getClientes(req, res));
router.get('/:id', (req, res) => clienteController.getClienteById(req, res));
router.post('/', (req, res) => clienteController.createCliente(req, res));
router.put('/:id', (req, res) => clienteController.updateCliente(req, res));
router.delete('/:id', (req, res) => clienteController.deleteCliente(req, res));

export { router as clienteRoutes };