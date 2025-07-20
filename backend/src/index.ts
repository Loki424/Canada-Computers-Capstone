import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import express from 'express';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Define context type
interface MyContext {
  user: { id: string } | null;
}

// Define JWT payload type
interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Connect to MongoDB with retries
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    if (retries > 0) {
      console.log(`❌ MongoDB connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Could not connect to MongoDB. Please ensure MongoDB is installed and running.');
      process.exit(1);
    }
  }
};

// Context function to handle authentication
const getUser = (token: string): { id: string } | null => {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;
    return { id: decoded.id };
  } catch (error) {
    return null;
  }
};

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://your-frontend.vercel.app'
];

const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// ApolloServer setup
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  try {
    await connectDB();
    await server.start();
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }: { req: any }) => {
          const token = req.headers.authorization || '';
          const user = getUser(token.replace('Bearer ', ''));
          return { user };
        }
      }) as any // Type assertion to fix TS error
    );
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();