"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemSchema = new mongoose_1.default.Schema({
    cart_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Cart', required: true },
    product_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
cartItemSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
exports.CartItem = mongoose_1.default.model('CartItem', cartItemSchema);
//# sourceMappingURL=CartItem.js.map