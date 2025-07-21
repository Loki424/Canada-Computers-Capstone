import mongoose from 'mongoose';
interface ICartItem {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
}
export interface ICart extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    items: ICartItem[];
    created_at: Date;
    updated_at: Date;
}
export declare const Cart: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
