// src/server.ts
import { buildApp } from './app';

const PORT = parseInt(process.env.PORT || '4000', 10);

(async () => {
  const app = await buildApp();
  app.listen(PORT, () =>
    console.log(`🚀 Local server ready at http://localhost:${PORT}/graphql`)
  );
})();
