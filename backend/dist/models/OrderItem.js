"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    order_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price_at_time: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
orderItemSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
exports.OrderItem = mongoose_1.default.model('OrderItem', orderItemSchema);
//# sourceMappingURL=OrderItem.js.map