import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from '@/shared/config/environment';
import { swaggerSpecFinal } from '@/infrastructure/web/swagger-final';
import { finalApiRoutes } from '@/presentation/routes/final-index';
import { errorHandler, notFoundHandler } from '@/presentation/middlewares/errorHandler';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecFinal, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FitConnect API - Documentación Completa',
}));

// API routes
app.use(`${config.api.prefix}/${config.api.version}`, finalApiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FitConnect API - Plataforma de Entrenamiento Personal',
    version: config.api.version,
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/v1/auth',
      entrenadores: '/api/v1/entrenadores',
      reservas: '/api/v1/reservas',
      usuarios: '/api/v1/usuarios'
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middlewares (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export { app };