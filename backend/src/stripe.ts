import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';

const router: Router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

// POST /api/create-payment-intent
router.post('/create-payment-intent', (async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing amount or currency' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as express.RequestHandler);

export default router;
