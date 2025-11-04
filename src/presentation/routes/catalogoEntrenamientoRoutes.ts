import { Router } from 'express';
import { CatalogoEntrenamientoController } from '@/presentation/controllers/CatalogoEntrenamientoController';
import { CatalogoEntrenamientoUseCases } from '@/application/use-cases/CatalogoEntrenamientoUseCases';
import { SupabaseCatalogoEntrenamientoRepository } from '@/infrastructure/repositories/SupabaseCatalogoEntrenamientoRepository';

const router = Router();

// Dependency injection
const catalogoRepository = new SupabaseCatalogoEntrenamientoRepository();
const catalogoUseCases = new CatalogoEntrenamientoUseCases(catalogoRepository);
const catalogoController = new CatalogoEntrenamientoController(catalogoUseCases);

// Routes
router.get('/', (req, res) => catalogoController.getAll(req, res));
router.get('/:id', (req, res) => catalogoController.getById(req, res));
router.get('/nivel/:nivel', (req, res) => catalogoController.getByNivel(req, res));
router.post('/', (req, res) => catalogoController.create(req, res));
router.put('/:id', (req, res) => catalogoController.update(req, res));
router.delete('/:id', (req, res) => catalogoController.delete(req, res));

export default router;