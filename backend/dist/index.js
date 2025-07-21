"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
File 1: src/server.ts — Local development entrypoint
*/
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeDefs_1 = require("./schema/typeDefs");
const resolvers_1 = require("./schema/resolvers");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
const PORT = parseInt(process.env.PORT || '4000', 10);
async function connectDB(retries = 5) {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        if (retries > 0) {
            console.warn(`MongoDB connection failed, retrying (${retries} left)…`);
            setTimeout(() => connectDB(retries - 1), 5000);
        }
        else {
            console.error('❌ Could not connect to MongoDB. Exiting.');
            process.exit(1);
        }
    }
}
function getUser(token) {
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return { id: decoded.id };
    }
    catch {
        return null;
    }
}
async function buildApp() {
    await connectDB();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const apollo = new server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers });
    await apollo.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(apollo, {
        context: async ({ req }) => {
            const raw = req.headers.authorization || '';
            const token = raw.replace('Bearer ', '');
            return { user: getUser(token) };
        }
    }));
    app.get('/', (_req, res, _next) => {
        res.status(200).send('API is running');
    });
    return app;
}
(async () => {
    const app = await buildApp();
    app.listen(PORT, () => console.log(`🚀 Local server ready at http://localhost:${PORT}/graphql`));
})();
//# sourceMappingURL=index.js.map