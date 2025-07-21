import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
}, {}> & {
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
}>, {}> & mongoose.FlatRecord<{
    name: string;
    email: string;
    password_hash: string;
    created_at: NativeDate;
    updated_at: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
