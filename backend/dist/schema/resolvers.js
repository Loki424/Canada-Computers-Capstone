"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const User_1 = require("../models/User");
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const Order_1 = require("../models/Order");
const Cart_1 = require("../models/Cart");
const Review_1 = require("../models/Review");
const Notification_1 = require("../models/Notification");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const graphql_1 = require("graphql");
const mongoose_1 = __importDefault(require("mongoose"));
// Simulate payment processing (replace with real payment gateway integration)
const simulatePaymentProcessing = async (paymentInfo, amount) => {
    // Simulate payment validation
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
        console.log(paymentInfo);
        return { success: true, message: 'Invalid payment information3' };
    }
    // Simulate card number validation (simple check)
    if (paymentInfo.cardNumber.length < 13 || paymentInfo.cardNumber.length > 19) {
        return { success: false, message: 'Invalid card number' };
    }
    // Simulate CVV validation
    if (paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4) {
        return { success: false, message: 'Invalid CVV' };
    }
    // Simulate expiry date validation
    const [month, year] = paymentInfo.expiryDate.split('/');
    const currentDate = new Date();
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiryDate < currentDate) {
        return { success: false, message: 'Card has expired' };
    }
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, transactionId: 'txn_' + Date.now() };
};
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
};
exports.resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            return await User_1.User.findById(context.user.id);
        },
        product: async (_, { id }) => {
            return await Product_1.Product.findById(id).populate('category_id');
        },
        products: async (_, { category, search, limit }) => {
            let query = {};
            if (category)
                query.category_id = category;
            if (search)
                query.name = { $regex: search, $options: 'i' };
            let cursor = Product_1.Product.find(query).populate('category_id');
            if (limit)
                cursor = cursor.limit(limit);
            return await cursor;
        },
        categories: async () => {
            return await Category_1.Category.find();
        }, cart: async (_, __, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
            return cart;
        },
        order: async (_, { id }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            return await Order_1.Order.findOne({ _id: id, user_id: context.user.id });
        },
        orders: async (_, __, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            return await Order_1.Order.find({ user_id: context.user.id });
        },
        productReviews: async (_, { productId }) => {
            return await Review_1.Review.find({ product_id: productId })
                .populate('user_id')
                .populate('product_id')
                .sort({ created_at: -1 });
        },
        userReviews: async (_, { userId }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            // Users can only view their own reviews unless they're an admin
            if (context.user.id !== userId)
                throw new graphql_1.GraphQLError('Not authorized');
            return await Review_1.Review.find({ user_id: userId })
                .populate('product_id')
                .sort({ created_at: -1 });
        },
        notifications: async (_, __, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            return await Notification_1.Notification.find({ user_id: context.user.id })
                .sort({ created_at: -1 });
        }
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                throw new graphql_1.GraphQLError('User already exists');
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await User_1.User.create({
                name,
                email,
                password_hash: hashedPassword
            });
            const token = generateToken(user);
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User_1.User.findOne({ email });
            if (!user) {
                throw new graphql_1.GraphQLError('User not found');
            }
            const valid = await bcryptjs_1.default.compare(password, user.password_hash);
            if (!valid) {
                throw new graphql_1.GraphQLError('Invalid password');
            }
            const token = generateToken(user);
            return { token, user };
        },
        addToCart: async (_, { productId, quantity }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            let cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
            if (!cart) {
                cart = await Cart_1.Cart.create({
                    user_id: context.user.id,
                    items: []
                });
            }
            const existingItem = cart.items.find(item => item.product_id.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                cart.items.push({
                    product_id: new mongoose_1.default.Types.ObjectId(productId),
                    quantity
                });
            }
            await cart.save();
            return await Cart_1.Cart.findById(cart._id);
        },
        updateCartItem: async (_, { productId, quantity }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
            if (!cart)
                throw new graphql_1.GraphQLError('Cart not found');
            const itemIndex = cart.items.findIndex(item => item.product_id.toString() === productId);
            if (itemIndex === -1)
                throw new graphql_1.GraphQLError('Item not found in cart');
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
            else {
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
            return await Cart_1.Cart.findById(cart._id);
        },
        removeFromCart: async (_, { productId }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
            if (!cart)
                throw new graphql_1.GraphQLError('Cart not found');
            cart.items = cart.items.filter(item => item.product_id.toString() !== productId);
            await cart.save();
            return await Cart_1.Cart.findById(cart._id);
        },
        createOrder: async (_, { address }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
            if (!cart || cart.items.length === 0)
                throw new graphql_1.GraphQLError('Cart is empty');
            const productIds = cart.items.map(item => item.product_id);
            const products = await Product_1.Product.find({ _id: { $in: productIds } });
            const orderItems = cart.items.map(item => {
                const product = products.find(p => p._id.toString() === item.product_id.toString());
                if (!product)
                    throw new graphql_1.GraphQLError('Product not found');
                if (product.stock < item.quantity)
                    throw new graphql_1.GraphQLError(`Insufficient stock for ${product.name}`);
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_at_time: product.price
                };
            });
            const total = orderItems.reduce((sum, item) => {
                const product = products.find(p => p._id.toString() === item.product_id.toString());
                return sum + (product ? product.price * item.quantity : 0);
            }, 0);
            const order = await Order_1.Order.create({
                user_id: context.user.id,
                items: orderItems,
                total,
                shipping_address: address,
                status: Order_1.OrderStatus.PENDING
            });
            // Update product stock
            await Promise.all(orderItems.map(item => {
                return Product_1.Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } });
            }));
            // Clear the cart
            cart.items = [];
            await cart.save();
            return await Order_1.Order.findById(order._id);
        },
        updateOrderStatus: async (_, { orderId, status }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const order = await Order_1.Order.findById(orderId);
            if (!order)
                throw new graphql_1.GraphQLError('Order not found');
            if (order.user_id.toString() !== context.user.id) {
                throw new graphql_1.GraphQLError('Not authorized');
            }
            order.status = status;
            await order.save();
            return await Order_1.Order.findById(order._id);
        },
        createReview: async (_, { productId, rating, comment }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            // Check if user has already reviewed this product
            const existingReview = await Review_1.Review.findOne({
                product_id: productId,
                user_id: context.user.id
            });
            if (existingReview) {
                throw new graphql_1.GraphQLError('You have already reviewed this product');
            }
            // Verify that the user has purchased the product
            const orders = await Order_1.Order.find({
                user_id: context.user.id,
                'items.product_id': productId,
                status: 'delivered'
            });
            if (orders.length === 0) {
                throw new graphql_1.GraphQLError('You can only review products you have purchased');
            }
            const review = await Review_1.Review.create({
                product_id: productId,
                user_id: context.user.id,
                rating,
                comment
            });
            return await Review_1.Review.findById(review._id)
                .populate('user_id')
                .populate('product_id');
        },
        updateReview: async (_, { reviewId, rating, comment }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const review = await Review_1.Review.findById(reviewId);
            if (!review)
                throw new graphql_1.GraphQLError('Review not found');
            if (review.user_id.toString() !== context.user.id) {
                throw new graphql_1.GraphQLError('Not authorized');
            }
            review.rating = rating;
            review.comment = comment;
            await review.save();
            return await Review_1.Review.findById(review._id)
                .populate('user_id')
                .populate('product_id');
        },
        deleteReview: async (_, { reviewId }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const review = await Review_1.Review.findById(reviewId);
            if (!review)
                throw new graphql_1.GraphQLError('Review not found');
            if (review.user_id.toString() !== context.user.id) {
                throw new graphql_1.GraphQLError('Not authorized');
            }
            await review.deleteOne();
            return true;
        },
        markNotificationRead: async (_, { notificationId }, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            const notification = await Notification_1.Notification.findOneAndUpdate({ _id: notificationId, user_id: context.user.id }, { is_read: true }, { new: true });
            if (!notification)
                throw new graphql_1.GraphQLError('Notification not found');
            return notification;
        },
        markAllNotificationsRead: async (_, __, context) => {
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            await Notification_1.Notification.updateMany({ user_id: context.user.id, is_read: false }, { is_read: true });
            return await Notification_1.Notification.find({ user_id: context.user.id })
                .sort({ created_at: -1 });
        },
        checkout: async (_, { input }, context) => {
            console.log('Checkout mutation input:', input);
            if (!context.user)
                throw new graphql_1.GraphQLError('Not authenticated');
            try {
                const cart = await Cart_1.Cart.findOne({ user_id: context.user.id });
                if (!cart || cart.items.length === 0) {
                    return {
                        success: false,
                        message: 'Cart is empty'
                    };
                }
                const productIds = cart.items.map(item => item.product_id);
                const products = await Product_1.Product.find({ _id: { $in: productIds } });
                // Validate stock availability
                for (const item of cart.items) {
                    const product = products.find(p => p._id.toString() === item.product_id.toString());
                    if (!product) {
                        return {
                            success: false,
                            message: `Product not found`
                        };
                    }
                    if (product.stock < item.quantity) {
                        return {
                            success: false,
                            message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                        };
                    }
                }
                // Calculate total
                const orderItems = cart.items.map(item => {
                    const product = products.find(p => p._id.toString() === item.product_id.toString());
                    return {
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price_at_time: product.price
                    };
                });
                const total = orderItems.reduce((sum, item) => {
                    const product = products.find(p => p._id.toString() === item.product_id.toString());
                    return sum + (product ? product.price * item.quantity : 0);
                }, 0);
                // Here you would integrate with a real payment processor
                // For now, we'll simulate payment processing
                const paymentResult = await simulatePaymentProcessing(input, total);
                if (!paymentResult.success) {
                    return {
                        success: true,
                        message: 'test paymentResult.message'
                    };
                }
                // Create the order
                const order = await Order_1.Order.create({
                    user_id: context.user.id,
                    items: orderItems,
                    total,
                    shipping_address: input.shippingAddress,
                    status: Order_1.OrderStatus.PENDING
                });
                // Update product stock
                await Promise.all(orderItems.map(item => {
                    return Product_1.Product.findByIdAndUpdate(item.product_id, { $inc: { stock: -item.quantity } });
                }));
                // Clear the cart
                cart.items = [];
                await cart.save();
                // Create notification for the user
                await Notification_1.Notification.create({
                    user_id: context.user.id,
                    message: `Order #${order._id} has been placed successfully!`,
                    type: 'order_status'
                });
                const populatedOrder = await Order_1.Order.findById(order._id);
                return {
                    success: true,
                    order: populatedOrder,
                    message: 'Order placed successfully!'
                };
            }
            catch (error) {
                console.error('Checkout error:', error);
                return {
                    success: false,
                    message: 'An error occurred during checkout. Please try again.'
                };
            }
        }
        // ...existing code...
    },
    User: {
        orders: async (parent) => {
            return await Order_1.Order.find({ user_id: parent._id });
        }, cart: async (parent) => {
            return await Cart_1.Cart.findOne({ user_id: parent._id });
        },
        reviews: async (parent) => {
            return await Review_1.Review.find({ user_id: parent._id })
                .populate('product_id');
        },
        notifications: async (parent) => {
            return await Notification_1.Notification.find({ user_id: parent._id })
                .sort({ created_at: -1 });
        }
    },
    Category: {
        products: async (parent) => {
            return await Product_1.Product.find({ category_id: parent._id });
        }
    },
    Product: {
        category: async (parent) => {
            return await Category_1.Category.findById(parent.category_id);
        },
        reviews: async (parent) => {
            return await Review_1.Review.find({ product_id: parent._id })
                .populate('user_id');
        },
        averageRating: async (parent) => {
            const reviews = await Review_1.Review.find({ product_id: parent._id });
            if (reviews.length === 0)
                return null;
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            return sum / reviews.length;
        }
    },
    Review: {
        user: async (parent) => {
            return await User_1.User.findById(parent.user_id);
        },
        product: async (parent) => {
            return await Product_1.Product.findById(parent.product_id);
        }
    },
    Cart: {
        user: async (parent) => {
            return await User_1.User.findById(parent.user_id);
        },
        items: async (parent) => {
            return parent.items;
        }
    },
    CartItem: {
        product: async (parent) => {
            return await Product_1.Product.findById(parent.product_id);
        }
    },
    Notification: {
        user: async (parent) => {
            return await User_1.User.findById(parent.user_id);
        }
    },
    Order: {
        user: async (parent) => {
            return await User_1.User.findById(parent.user_id);
        },
        items: async (parent) => {
            return parent.items;
        }
    },
    OrderItem: {
        product: async (parent) => {
            return await Product_1.Product.findById(parent.product_id);
        }
    }
};
//# sourceMappingURL=resolvers.js.map