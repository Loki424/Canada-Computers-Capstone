import mongoose from 'mongoose';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
interface IOrderItem {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
}
interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}
export interface IOrder extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    items: IOrderItem[];
    total: number;
    status: OrderStatus;
    shipping_address: IShippingAddress;
    order_date: Date;
    created_at: Date;
    updated_at: Date;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
