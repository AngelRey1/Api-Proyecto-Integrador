import { Router } from 'express';
import { CalendarioDisponibilidadController } from '@/presentation/controllers/CalendarioDisponibilidadController';
import { CalendarioDisponibilidadUseCases } from '@/application/use-cases/CalendarioDisponibilidadUseCases';
import { SupabaseCalendarioDisponibilidadRepository } from '@/infrastructure/repositories/SupabaseCalendarioDisponibilidadRepository';

const router = Router();

const disponibilidadRepository = new SupabaseCalendarioDisponibilidadRepository();
const disponibilidadUseCases = new CalendarioDisponibilidadUseCases(disponibilidadRepository);
const disponibilidadController = new CalendarioDisponibilidadController(disponibilidadUseCases);

router.get('/', (req, res) => disponibilidadController.getDisponibilidades(req, res));
router.get('/:id', (req, res) => disponibilidadController.getDisponibilidadById(req, res));
router.post('/', (req, res) => disponibilidadController.createDisponibilidad(req, res));
router.put('/:id', (req, res) => disponibilidadController.updateDisponibilidad(req, res));
router.delete('/:id', (req, res) => disponibilidadController.deleteDisponibilidad(req, res));

export { router as calendarioDisponibilidadRoutes };