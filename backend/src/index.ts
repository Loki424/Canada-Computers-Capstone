// src/index.ts

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import serverless from 'serverless-http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
const PORT = parseInt(process.env.PORT || '4000', 10);

// --- Types ---
interface MyContext {
  user: { id: string } | null;
}
interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// --- DB Connection with retry ---
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed, retrying (${retries} left)…`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Could not connect to MongoDB. Exiting.');
      process.exit(1);
    }
  }
};

// --- JWT → user extractor ---
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

// --- Build the Express + Apollo app ---
async function buildApp() {
  await connectDB();

  const app = express();

  // 1) Global middleware
  app.use(cors());
  app.use(express.json());

  // 2) ApolloServer setup
  const apollo = new ApolloServer<MyContext>({ typeDefs, resolvers });
  await apollo.start();

  app.use(
    '/graphql',
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const raw = req.headers.authorization || '';
        const token = raw.replace('Bearer ', '');
        return { user: getUser(token) };
      },
    }) as any
  );

  // 3) Health‑check
  app.get(
    '/',
    (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).send('API is running');
    }
  );

  return app;
}

// --- Local dev server start ---
;(async () => {
  if (!process.env.VERCEL) {
    const app = await buildApp();
    app.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    );
  }
})();

// --- Vercel handler export ---
let vercelHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!vercelHandler) {
    const app = await buildApp();
    vercelHandler = serverless(app);
  }
  return vercelHandler(req, res);
}
