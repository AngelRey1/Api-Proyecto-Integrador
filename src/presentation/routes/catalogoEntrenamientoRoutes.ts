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
router.get('/', (req, res) => catalogoController.getCatalogos(req, res));
router.get('/:id', (req, res) => catalogoController.getCatalogoById(req, res));
router.post('/', (req, res) => catalogoController.createCatalogo(req, res));
router.put('/:id', (req, res) => catalogoController.updateCatalogo(req, res));
router.delete('/:id', (req, res) => catalogoController.deleteCatalogo(req, res));

export { router as catalogoEntrenamientoRoutes };