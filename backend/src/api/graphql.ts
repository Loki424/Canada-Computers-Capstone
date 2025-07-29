import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { buildApp } from '../app';

export default async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  const app = await buildApp();
  const handler = serverless(app);
  return handler(req, res);
}