import app from './app.js';
import connectDB from './config/db.js';
import { initQdrant } from './config/qdrant.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('[App Startup] Initializing services...');
  
  // 1. Connect MongoDB
  await connectDB();

  // 2. Initialize Qdrant Vector DB collections
  await initQdrant();

  // 3. Fire up express server listener
  app.listen(PORT, () => {
    console.log(`[API Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('[App Startup] Severe initialization crash:', err);
  process.exit(1);
});
