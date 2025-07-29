"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vercelHandler;
const serverless_http_1 = __importDefault(require("serverless-http"));
const app_1 = require("../app");
async function vercelHandler(req, res) {
    const app = await (0, app_1.buildApp)();
    const handler = (0, serverless_http_1.default)(app);
    return handler(req, res);
}
//# sourceMappingURL=graphql.js.map