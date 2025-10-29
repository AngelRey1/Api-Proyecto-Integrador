import { Router } from 'express';
import { PagoController } from '@/presentation/controllers/PagoController';
import { PagoUseCases } from '@/application/use-cases/PagoUseCases';
import { SupabasePagoRepository } from '@/infrastructure/repositories/SupabasePagoRepository';

const router = Router();

// Dependency injection
const pagoRepository = new SupabasePagoRepository();
const pagoUseCases = new PagoUseCases(pagoRepository);
const pagoController = new PagoController(pagoUseCases);

// Routes
router.get('/', (req, res) => pagoController.getPagos(req, res));
router.get('/:id', (req, res) => pagoController.getPagoById(req, res));
router.post('/', (req, res) => pagoController.createPago(req, res));
router.put('/:id', (req, res) => pagoController.updatePago(req, res));
router.delete('/:id', (req, res) => pagoController.deletePago(req, res));

export { router as pagoRoutes };