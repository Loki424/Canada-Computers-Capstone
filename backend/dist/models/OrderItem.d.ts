import mongoose from 'mongoose';
export declare const OrderItem: mongoose.Model<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
}, {}, mongoose.DefaultSchemaOptions> & {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price_at_time: number;
    order_id: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
