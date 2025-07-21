import mongoose from 'mongoose';
export declare const Review: mongoose.Model<{
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
}, {}> & {
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
}>, {}> & mongoose.FlatRecord<{
    comment: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    product_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    rating: number;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
