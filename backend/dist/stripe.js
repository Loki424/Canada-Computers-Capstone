"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-07-30.basil',
});
// POST /api/create-payment-intent
router.post('/create-payment-intent', (async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=stripe.js.map