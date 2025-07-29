"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const typeDefs_1 = require("./schema/typeDefs");
const resolvers_1 = require("./schema/resolvers");
const stripe_1 = __importDefault(require("./stripe"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capstone123:capstone123@cluster0.2y2ujpq.mongodb.net/canadacomputers';
// 1) Connect to Mongo (with retry)
async function connectDB(retries = 5) {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        if (retries > 0) {
            console.warn(`Mongo connect failed, retrying (${retries})…`);
            return setTimeout(() => connectDB(retries - 1), 5000);
        }
        console.error('❌ Could not connect to MongoDB. Exiting.');
        process.exit(1);
    }
}
// 2) JWT → user
function getUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return { id: decoded.id };
    }
    catch {
        return null;
    }
}
// 3) Build & return an Express app with GraphQL mounted
async function buildApp() {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ main fn MongoDB connected');
    const app = (0, express_1.default)();
    // global middleware
    app.use((0, cors_1.default)());
    // Stripe payment intent API
    app.use('/api', express_1.default.json(), stripe_1.default);
    // note we don’t do `app.use(express.json())` globally—
    // we’ll mount it explicitly on /graphql below
    // create + start ApolloServer
    console.log('🔗 Starting ApolloServer...');
    const apollo = new server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers });
    await apollo.start();
    console.log('✅ ApolloServer started');
    // mount JSON parser + GraphQL
    app.use('/graphql', express_1.default.json(), // ensures req.body is populated
    (0, express4_1.expressMiddleware)(apollo, {
        context: async ({ req }) => {
            const raw = req.headers.authorization || '';
            const user = getUser(raw.replace('Bearer ', ''));
            return { user };
        },
    }));
    // health check
    app.get('/', (_req, res, _next) => {
        res.status(200).send('API is running');
    });
    console.log('✅ Express app built and ready');
    return app;
}
//# sourceMappingURL=app.js.map