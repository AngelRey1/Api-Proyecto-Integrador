import { Router } from 'express';
import { DeporteController } from '@/presentation/controllers/DeporteController';
import { DeporteUseCases } from '@/application/use-cases/DeporteUseCases';
import { SupabaseDeporteRepository } from '@/infrastructure/repositories/SupabaseDeporteRepository';

const router = Router();

// Dependency injection
const deporteRepository = new SupabaseDeporteRepository();
const deporteUseCases = new DeporteUseCases(deporteRepository);
const deporteController = new DeporteController(deporteUseCases);

// Routes
router.get('/', (req, res) => deporteController.getDeportes(req, res));
router.get('/:id', (req, res) => deporteController.getDeporteById(req, res));
router.post('/', (req, res) => deporteController.createDeporte(req, res));
router.put('/:id', (req, res) => deporteController.updateDeporte(req, res));
router.delete('/:id', (req, res) => deporteController.deleteDeporte(req, res));

export { router as deporteRoutes };