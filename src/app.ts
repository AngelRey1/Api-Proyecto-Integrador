import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from '@/shared/config/environment';
import { swaggerSpec } from '@/infrastructure/web/swagger';
import { apiRoutes } from '@/presentation/routes';
import { errorHandler, notFoundHandler } from '@/presentation/middlewares/errorHandler';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Clean Architecture API Documentation',
}));

// API routes
app.use(`${config.api.prefix}/${config.api.version}`, apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Clean Architecture API',
    version: config.api.version,
    documentation: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middlewares (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export { app };