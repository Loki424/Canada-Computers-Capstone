// api/graphql.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { buildApp } from '../src/app';

const appPromise = buildApp();
let handler: ReturnType<typeof serverless> | null = null;

// this function is invoked on every Vercel request
export default async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!handler) {
    const app = await appPromise;
    handler = serverless(app);
  }
  return handler(req, res);
}
