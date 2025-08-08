import mongoose from 'mongoose';
export declare const Notification: mongoose.Model<{
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
}, {}, mongoose.DefaultSchemaOptions> & {
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    type: "order_status" | "product_restock" | "price_drop" | "general";
    created_at: NativeDate;
    message: string;
    user_id: mongoose.Types.ObjectId;
    is_read: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
