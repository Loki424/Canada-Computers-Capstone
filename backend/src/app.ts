// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb+srv://capstone123:capstone123@cluster0.2y2ujpq.mongodb.net/canadacomputers';

interface MyContext {
  user: { id: string } | null;
}
interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// 1) Connect to Mongo (with retry)
async function connectDB(retries = 5): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    if (retries > 0) {
      console.warn(`Mongo connect failed, retrying (${retries})…`);
      return setTimeout(() => connectDB(retries - 1), 5000) as unknown as Promise<void>;
    }
    console.error('❌ Could not connect to MongoDB. Exiting.');
    process.exit(1);
  }
}

// 2) JWT → user
function getUser(token: string): { id: string } | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;
    return { id: decoded.id };
  } catch {
    return null;
  }
}

// 3) Build & return an Express app with GraphQL mounted
export async function buildApp() {
  await connectDB();

  const app = express();

  // global middleware
  app.use(cors());

  // note we don’t do `app.use(express.json())` globally—
  // we’ll mount it explicitly on /graphql below

  // create + start ApolloServer
  const apollo = new ApolloServer<MyContext>({ typeDefs, resolvers });
  await apollo.start();

  // mount JSON parser + GraphQL
  app.use(
    '/graphql',
    express.json(), // ensures req.body is populated
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const raw = req.headers.authorization || '';
        const user = getUser(raw.replace('Bearer ', ''));
        return { user };
      },
    }) as any
  );

  // health check
  app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).send('API is running');
  });

  return app;
}
