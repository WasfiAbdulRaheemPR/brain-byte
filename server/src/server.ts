import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/db';

const app = createApp();

const startServer = async () => {
  const isPostgresReady = await checkDatabaseConnection();
  console.log(`[Database] PostgreSQL status: ${isPostgresReady ? 'ONLINE' : 'OFFLINE (Running resilient local store)'}`);

  app.listen(env.PORT, () => {
    console.log(`🚀 CivicConnect REST API running on http://localhost:${env.PORT}`);
    console.log(`📡 Client URL allowed: ${env.CLIENT_URL}`);
    console.log(`🛡️  Role-Based Access Control and Security Headers Active`);
  });
};

startServer();
