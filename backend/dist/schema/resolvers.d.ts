import { OrderStatus } from '../models/Order';
import { ICart } from '../models/Cart';
import mongoose from 'mongoose';
export declare const resolvers: {
    Query: {
        me: (_: any, __: any, context: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        product: (_: any, { id }: {
            id: string;
        }) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        }) | null>;
        products: (_: any, { category, search, limit }: {
            category?: string;
            search?: string;
            limit?: number;
        }) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        })[]>;
        categories: () => Promise<(mongoose.Document<unknown, {}, {
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
        })[]>;
        cart: (_: any, __: any, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        order: (_: any, { id }: {
            id: string;
        }, context: any) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        orders: (_: any, __: any, context: any) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[]>;
        productReviews: (_: any, { productId }: {
            productId: string;
        }) => Promise<(mongoose.Document<unknown, {}, {
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
        })[]>;
        userReviews: (_: any, { userId }: {
            userId: string;
        }, context: any) => Promise<(mongoose.Document<unknown, {}, {
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
        })[]>;
        notifications: (_: any, __: any, context: any) => Promise<(mongoose.Document<unknown, {}, {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        }, {}> & {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Mutation: {
        register: (_: any, { name, email, password }: {
            name: string;
            email: string;
            password: string;
        }) => Promise<{
            token: string;
            user: mongoose.Document<unknown, {}, {
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
            };
        }>;
        login: (_: any, { email, password }: {
            email: string;
            password: string;
        }) => Promise<{
            token: string;
            user: mongoose.Document<unknown, {}, {
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
            };
        }>;
        addToCart: (_: any, { productId, quantity }: {
            productId: string;
            quantity: number;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        updateCartItem: (_: any, { productId, quantity }: {
            productId: string;
            quantity: number;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        removeFromCart: (_: any, { productId }: {
            productId: string;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        createOrder: (_: any, { address }: {
            address: any;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        updateOrderStatus: (_: any, { orderId, status }: {
            orderId: string;
            status: OrderStatus;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        createReview: (_: any, { productId, rating, comment }: {
            productId: string;
            rating: number;
            comment: string;
        }, context: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        updateReview: (_: any, { reviewId, rating, comment }: {
            reviewId: string;
            rating: number;
            comment: string;
        }, context: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        deleteReview: (_: any, { reviewId }: {
            reviewId: string;
        }, context: any) => Promise<boolean>;
        markNotificationRead: (_: any, { notificationId }: {
            notificationId: string;
        }, context: any) => Promise<mongoose.Document<unknown, {}, {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        }, {}> & {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }>;
        markAllNotificationsRead: (_: any, __: any, context: any) => Promise<(mongoose.Document<unknown, {}, {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        }, {}> & {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        checkout: (_: any, { input }: {
            input: any;
        }, context: {
            user: {
                id: string;
            };
        }) => Promise<{
            success: boolean;
            message: string | undefined;
            order?: undefined;
        } | {
            success: boolean;
            order: (mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }) | null;
            message: string;
        }>;
        updateProfile: (_: any, { name }: {
            name: string;
        }, context: any) => Promise<mongoose.Document<unknown, {}, {
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
        }>;
        sendContactEmail: (_: any, { name, email, message }: {
            name: string;
            email: string;
            message: string;
        }) => Promise<boolean>;
    };
    User: {
        orders: (parent: any) => Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}> & import("../models/Order").IOrder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[]>;
        cart: (parent: any) => Promise<(mongoose.Document<unknown, {}, ICart, {}> & ICart & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null>;
        reviews: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        })[]>;
        notifications: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        }, {}> & {
            type: "order_status" | "product_restock" | "price_drop" | "general";
            created_at: NativeDate;
            message: string;
            user_id: mongoose.Types.ObjectId;
            is_read: boolean;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Category: {
        products: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        })[]>;
    };
    Product: {
        category: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        reviews: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        })[]>;
        averageRating: (parent: any) => Promise<number | null>;
    };
    Review: {
        user: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        product: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        }) | null>;
    };
    Cart: {
        user: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        items: (parent: any) => Promise<any>;
    };
    CartItem: {
        product: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        }) | null>;
    };
    Notification: {
        user: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
    };
    Order: {
        user: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
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
        }) | null>;
        items: (parent: any) => Promise<any>;
    };
    OrderItem: {
        product: (parent: any) => Promise<(mongoose.Document<unknown, {}, {
            name: string;
            created_at: NativeDate;
            updated_at: NativeDate;
            description: string;
            price: number;
            category_id: mongoose.Types.ObjectId;
            stock: number;
            image_url?: string | null | undefined;
        }, {}> & {
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
        }) | null>;
    };
};
