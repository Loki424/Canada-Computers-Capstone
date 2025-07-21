import mongoose from 'mongoose';
export declare const CartItem: mongoose.Model<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
}, {}> & {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
}>, {}> & mongoose.FlatRecord<{
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    cart_id: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
