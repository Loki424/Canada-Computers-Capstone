// src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
const PORT = parseInt(process.env.PORT || '4000', 10);

interface MyContext { user: { id: string } | null }
interface JWTPayload { id: string; iat?: number; exp?: number }

// Connect with retry logic
async function connectDB(retries = 5) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    if (retries > 0) {
      console.warn(`Retrying MongoDB connection (${retries} left)...`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Could not connect to MongoDB. Exiting.');
      process.exit(1);
    }
  }
}

// Extract user from JWT
const getUser = (token: string): { id: string } | null => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;
    return { id: decoded.id };
  } catch {
    return null;
  }
};

// Build the Express + Apollo app
async function buildApp() {
  await connectDB();

  const app = express();

  // CORS
  app.use(cors());

  // ApolloServer
  const apollo = new ApolloServer<MyContext>({ typeDefs, resolvers });
  await apollo.start();

  // **Mount JSON parser & Apollo** on /graphql**
  app.use(
    '/graphql',
    express.json(), // ← ensures req.body is set
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const raw = req.headers.authorization || '';
        const user = getUser(raw.replace('Bearer ', ''));
        return { user };
      },
    }) as any
  );

  // Simple health‑check
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('API is running');
  });

  return app;
}

// Start local server + prepare serverless handler
const appPromise = buildApp();
let serverlessHandler: any;

// After buildApp resolves:
appPromise.then((app) => {
  // 1) Local dev: listen on PORT
  if (!process.env.VERCEL) {
    app.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    );
  }
  // 2) Wrap for Vercel
  serverlessHandler = serverless(app);
});

// Vercel entrypoint
export default async function handler(req: any, res: any) {
  const handlerFn = serverlessHandler || serverless(await appPromise);
  return handlerFn(req, res);
}
