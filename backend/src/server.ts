// src/server.ts
import dotenv from 'dotenv';
dotenv.config();
import { buildApp } from './app';

const PORT = parseInt(process.env.PORT || '4000', 10);

(async () => {
  const app = await buildApp();
  app.listen(PORT, () =>
    console.log(`🚀 Local server ready at http://localhost:${PORT}/graphql`)
  );
})();
