"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order_status', 'product_restock', 'price_drop', 'general'],
        required: true
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});
// Add index for better query performance
notificationSchema.index({ user_id: 1, created_at: -1 });
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
//# sourceMappingURL=Notification.js.map