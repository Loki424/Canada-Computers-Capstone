import mongoose from 'mongoose';
export declare const Category: mongoose.Model<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
}, {}> & {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    name: string;
    created_at: NativeDate;
    updated_at: NativeDate;
    description?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
