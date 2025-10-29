import { app } from './app';
import { config } from '@/shared/config/environment';
import { supabaseConnection } from '@/infrastructure/database/supabase';

async function startServer() {
  try {
    // Test database connection
    console.log('Testing Supabase connection...');
    const isConnected = await supabaseConnection.testConnection();
    
    if (!isConnected) {
      console.warn('Warning: Could not verify Supabase connection');
    } else {
      console.log('✅ Supabase connection successful');
    }

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
      console.log(`🔗 API Base URL: http://localhost:${config.port}${config.api.prefix}/${config.api.version}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();