import mongoose from 'mongoose';
export declare const Product: mongoose.Model<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
}, {}, mongoose.DefaultSchemaOptions> & {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description: string;
    price: number;
    category_id: mongoose.Types.ObjectId;
    stock: number;
    image_url?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
