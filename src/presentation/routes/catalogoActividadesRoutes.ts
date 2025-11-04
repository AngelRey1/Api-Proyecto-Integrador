import { Router } from 'express';
import { CatalogoActividadesController } from '@/presentation/controllers/CatalogoActividadesController';
import { CatalogoActividadesUseCases } from '@/application/use-cases/CatalogoActividadesUseCases';
import { SupabaseCatalogoActividadesRepository } from '@/infrastructure/repositories/SupabaseCatalogoActividadesRepository';

const router = Router();

// Dependency injection
const actividadesRepository = new SupabaseCatalogoActividadesRepository();
const actividadesUseCases = new CatalogoActividadesUseCases(actividadesRepository);
const actividadesController = new CatalogoActividadesController(actividadesUseCases);

// Routes
router.get('/', (req, res) => actividadesController.getAll(req, res));
router.get('/:id', (req, res) => actividadesController.getById(req, res));
router.get('/entrenador/:entrenadorId', (req, res) => actividadesController.getByEntrenador(req, res));
router.get('/cliente/:clienteId', (req, res) => actividadesController.getByCliente(req, res));
router.get('/estado/:estado', (req, res) => actividadesController.getByEstado(req, res));
router.post('/', (req, res) => actividadesController.create(req, res));
router.put('/:id', (req, res) => actividadesController.update(req, res));
router.delete('/:id', (req, res) => actividadesController.delete(req, res));

export default router;