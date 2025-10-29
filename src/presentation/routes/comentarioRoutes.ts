import { Router } from 'express';
import { ComentarioController } from '@/presentation/controllers/ComentarioController';
import { ComentarioUseCases } from '@/application/use-cases/ComentarioUseCases';
import { SupabaseComentarioRepository } from '@/infrastructure/repositories/SupabaseComentarioRepository';

const router = Router();

const comentarioRepository = new SupabaseComentarioRepository();
const comentarioUseCases = new ComentarioUseCases(comentarioRepository);
const comentarioController = new ComentarioController(comentarioUseCases);

router.get('/', (req, res) => comentarioController.getComentarios(req, res));
router.get('/:id', (req, res) => comentarioController.getComentarioById(req, res));
router.post('/', (req, res) => comentarioController.createComentario(req, res));
router.put('/:id', (req, res) => comentarioController.updateComentario(req, res));
router.delete('/:id', (req, res) => comentarioController.deleteComentario(req, res));

export { router as comentarioRoutes };