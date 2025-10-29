import { Router } from 'express';
import { CatalogoActividadesController } from '@/presentation/controllers/CatalogoActividadesController';
import { CatalogoActividadesUseCases } from '@/application/use-cases/CatalogoActividadesUseCases';
import { SupabaseCatalogoActividadesRepository } from '@/infrastructure/repositories/SupabaseCatalogoActividadesRepository';

const router = Router();

const actividadRepository = new SupabaseCatalogoActividadesRepository();
const actividadUseCases = new CatalogoActividadesUseCases(actividadRepository);
const actividadController = new CatalogoActividadesController(actividadUseCases);

router.get('/', (req, res) => actividadController.getActividades(req, res));
router.get('/:id', (req, res) => actividadController.getActividadById(req, res));
router.post('/', (req, res) => actividadController.createActividad(req, res));
router.put('/:id', (req, res) => actividadController.updateActividad(req, res));
router.delete('/:id', (req, res) => actividadController.deleteActividad(req, res));

export { router as catalogoActividadesRoutes };