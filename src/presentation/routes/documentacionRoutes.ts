import { Router } from 'express';
import { DocumentacionController } from '@/presentation/controllers/DocumentacionController';

const router = Router();
const documentacionController = new DocumentacionController();

/**
 * @swagger
 * /docs/flujos:
 *   get:
 *     tags: [📚 Documentación Interactiva]
 *     summary: 🎯 Obtener flujos de uso de la API
 *     description: |
 *       Devuelve una guía completa de cómo usar la API con ejemplos prácticos.
 *       Incluye flujos paso a paso para cada tipo de usuario.
 *     responses:
 *       200:
 *         description: Flujos de uso obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Flujos organizados por casos de uso
 *                 message:
 *                   type: string
 *                   example: "Documentación de flujos de uso de la API"
 */
router.get('/flujos', (req, res) => documentacionController.getFlujosDeUso(req, res));

/**
 * @swagger
 * /docs/estadisticas:
 *   get:
 *     tags: [📚 Documentación Interactiva]
 *     summary: 📊 Obtener estadísticas de la API
 *     description: |
 *       Devuelve estadísticas sobre la cobertura funcional, 
 *       seguridad y estado de implementación de la API.
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Estadísticas de la API
 *                 message:
 *                   type: string
 *                   example: "Estadísticas de la API"
 */
router.get('/estadisticas', (req, res) => documentacionController.getEstadisticasAPI(req, res));

export default router;