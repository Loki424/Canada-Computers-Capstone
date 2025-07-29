"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const PORT = parseInt(process.env.PORT || '4000', 10);
(async () => {
    const app = await (0, app_1.buildApp)();
    app.listen(PORT, () => console.log(`🚀 Local server ready at http://localhost:${PORT}/graphql`));
})();
//# sourceMappingURL=server.js.map