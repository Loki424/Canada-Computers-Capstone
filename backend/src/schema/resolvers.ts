import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order, OrderStatus } from '../models/Order';
import { Cart, ICart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { OrderItem } from '../models/OrderItem';
import { Review } from '../models/Review';
import { Notification } from '../models/Notification';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// Simulate payment processing (replace with real payment gateway integration)
const simulatePaymentProcessing = async (paymentInfo: any, amount: number) => {
  // Simulate payment validation
  if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
    console.log(paymentInfo);
    return { success: false, message: 'Invalid payment information3' };
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

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Email configuration
const createEmailTransporter = () => {
  // For development, use a test account or console logging
  // For production, configure with your actual email service
  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // For development, just return null and we'll log instead
  return null;
};

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await User.findById(context.user.id);
    },
    product: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id).populate('category_id');
    },
    products: async (_: any, { category, search, limit }: { category?: string, search?: string, limit?: number }) => {
      let query: any = {};
      if (category) query.category_id = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      let cursor = Product.find(query).populate('category_id');
      if (limit) cursor = cursor.limit(limit);
      return await cursor;
    },
    categories: async () => {
      return await Category.find();
    },    cart: async (_: any, __: any, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      const cart = await Cart.findOne({ user_id: context.user.id });
      return cart;
    },
    order: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Order.findOne({ _id: id, user_id: context.user.id });
    },
    orders: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Order.find({ user_id: context.user.id });
    },
    productReviews: async (_: any, { productId }: { productId: string }) => {
      return await Review.find({ product_id: productId })
        .populate('user_id')
        .populate('product_id')
        .sort({ created_at: -1 });
    },
    userReviews: async (_: any, { userId }: { userId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      // Users can only view their own reviews unless they're an admin
      if (context.user.id !== userId) throw new GraphQLError('Not authorized');
      return await Review.find({ user_id: userId })
        .populate('product_id')
        .sort({ created_at: -1 });
    },
    notifications: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      return await Notification.find({ user_id: context.user.id })
        .sort({ created_at: -1 });
    }
  },

  Mutation: {
    register: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password_hash: hashedPassword
      });

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('User not found');
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        throw new GraphQLError('Invalid password');
      }

      const token = generateToken(user);
      return { token, user };
    },

    addToCart: async (_: any, { productId, quantity }: { productId: string, quantity: number }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      let cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) {
        cart = await Cart.create({ 
          user_id: context.user.id,
          items: []
        });
      }

      const existingItem = cart.items.find(item => 
        item.product_id.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;      } else {
        cart.items.push({ 
          product_id: new mongoose.Types.ObjectId(productId), 
          quantity 
        });
      }

      await cart.save();
      return await Cart.findById(cart._id);
    },

    updateCartItem: async (_: any, { productId, quantity }: { productId: string, quantity: number }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) throw new GraphQLError('Cart not found');

      const itemIndex = cart.items.findIndex(item => 
        item.product_id.toString() === productId
      );

      if (itemIndex === -1) throw new GraphQLError('Item not found in cart');

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;      }

      await cart.save();
      return await Cart.findById(cart._id);
    },

    removeFromCart: async (_: any, { productId }: { productId: string }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart) throw new GraphQLError('Cart not found');      cart.items = cart.items.filter(item => 
        item.product_id.toString() !== productId
      );

      await cart.save();
      return await Cart.findById(cart._id);
    },

    createOrder: async (_: any, { address }: { address: any }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      const cart = await Cart.findOne({ user_id: context.user.id });
      if (!cart || cart.items.length === 0) throw new GraphQLError('Cart is empty');

      const productIds = cart.items.map(item => item.product_id);
      const products = await Product.find({ _id: { $in: productIds } });

      const orderItems = cart.items.map(item => {
        const product = products.find(p => p._id.toString() === item.product_id.toString());
        if (!product) throw new GraphQLError('Product not found');
        if (product.stock < item.quantity) throw new GraphQLError(`Insufficient stock for ${product.name}`);
        
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: product.price
        };
      });

      const total = orderItems.reduce((sum: number, item) => {
        const product = products.find(p => p._id.toString() === item.product_id.toString());
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      const order = await Order.create({
        user_id: context.user.id,
        items: orderItems,
        total,
        shipping_address: address,
        status: OrderStatus.PENDING
      });

      // Update product stock
      await Promise.all(orderItems.map(item => {
        return Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: -item.quantity } }
        );
      }));

      // Clear the cart
      cart.items = [];
      await cart.save();

      return await Order.findById(order._id);
    },

    updateOrderStatus: async (_: any, { orderId, status }: { orderId: string, status: OrderStatus }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const order = await Order.findById(orderId);
      if (!order) throw new GraphQLError('Order not found');
      
      if (order.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      order.status = status;
      await order.save();
      return await Order.findById(order._id);
    },

    createReview: async (_: any, { productId, rating, comment }: { productId: string, rating: number, comment: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({ 
        product_id: productId, 
        user_id: context.user.id 
      });
      
      if (existingReview) {
        throw new GraphQLError('You have already reviewed this product');
      }

      // Verify that the user has purchased the product
      const orders = await Order.find({ 
        user_id: context.user.id,
        'items.product_id': productId,
        status: 'delivered'
      });

      if (orders.length === 0) {
        throw new GraphQLError('You can only review products you have purchased');
      }

      const review = await Review.create({
        product_id: productId,
        user_id: context.user.id,
        rating,
        comment
      });

      return await Review.findById(review._id)
        .populate('user_id')
        .populate('product_id');
    },

    updateReview: async (_: any, { reviewId, rating, comment }: { reviewId: string, rating: number, comment: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const review = await Review.findById(reviewId);
      if (!review) throw new GraphQLError('Review not found');
      
      if (review.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      review.rating = rating;
      review.comment = comment;
      await review.save();

      return await Review.findById(review._id)
        .populate('user_id')
        .populate('product_id');
    },

    deleteReview: async (_: any, { reviewId }: { reviewId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const review = await Review.findById(reviewId);
      if (!review) throw new GraphQLError('Review not found');
      
      if (review.user_id.toString() !== context.user.id) {
        throw new GraphQLError('Not authorized');
      }

      await review.deleteOne();
      return true;
    },

    markNotificationRead: async (_: any, { notificationId }: { notificationId: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user_id: context.user.id },
        { is_read: true },
        { new: true }
      );

      if (!notification) throw new GraphQLError('Notification not found');
      return notification;
    },

    markAllNotificationsRead: async (_: any, __: any, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      await Notification.updateMany(
        { user_id: context.user.id, is_read: false },
        { is_read: true }
      );

      return await Notification.find({ user_id: context.user.id })
        .sort({ created_at: -1 });
    },

    checkout: async (_: any, { input }: { input: any }, context: { user: { id: string } }) => {
      if (!context.user) throw new GraphQLError('Not authenticated');

      try {
        const cart = await Cart.findOne({ user_id: context.user.id });
        if (!cart || cart.items.length === 0) {
          return {
            success: false,
            message: 'Cart is empty'
          };
        }

        const productIds = cart.items.map(item => item.product_id);
        const products = await Product.find({ _id: { $in: productIds } });

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
            price_at_time: product!.price
          };
        });

        const total = orderItems.reduce((sum: number, item) => {
          const product = products.find(p => p._id.toString() === item.product_id.toString());
          return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        // Here you would integrate with a real payment processor
        // For now, we'll simulate payment processing
        const paymentResult = await simulatePaymentProcessing(input, total);
        
        if (!paymentResult.success) {
          return {
            success: false,
            message: paymentResult.message
          };
        }

        // Create the order
        const order = await Order.create({
          user_id: context.user.id,
          items: orderItems,
          total,
          shipping_address: input.shippingAddress,
          status: OrderStatus.PENDING
        });

        // Update product stock
        await Promise.all(orderItems.map(item => {
          return Product.findByIdAndUpdate(
            item.product_id,
            { $inc: { stock: -item.quantity } }
          );
        }));

        // Clear the cart
        cart.items = [];
        await cart.save();

        // Create notification for the user
        await Notification.create({
          user_id: context.user.id,
          message: `Order #${order._id} has been placed successfully!`,
          type: 'order_status'
        });

        const populatedOrder = await Order.findById(order._id);
        
        return {
          success: true,
          order: populatedOrder,
          message: 'Order placed successfully!'
        };
      } catch (error) {
        console.error('Checkout error:', error);
        return {
          success: false,
          message: 'An error occurred during checkout. Please try again.'
        };
      }
    },

    updateProfile: async (_: any, { name }: { name: string }, context: any) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      const updatedUser = await User.findByIdAndUpdate(
        context.user.id,
        { name },
        { new: true }
      );
      
      if (!updatedUser) {
        throw new GraphQLError('User not found');
      }
      
      return updatedUser;
    },

    sendContactEmail: async (_: any, { name, email, message }: { name: string, email: string, message: string }) => {
      try {
        const transporter = createEmailTransporter();
        const recipientEmail = 'seelamreddy424@gmail.com';
        
        if (transporter) {
          // Send actual email in production
          const mailOptions = {
            from: `"${name}" <${email}>`,
            to: recipientEmail,
            replyTo: email,
            subject: `Contact Form Submission from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <hr>
              <p style="color: #666; font-size: 12px;">
                This email was sent from the Canada Computers contact form at ${new Date().toISOString()}
              </p>
            `,
            text: `
              New Contact Form Submission
              
              Name: ${name}
              Email: ${email}
              
              Message:
              ${message}
              
              ---
              This email was sent from the Canada Computers contact form at ${new Date().toISOString()}
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`Contact email sent successfully to ${recipientEmail} from ${email}`);
        } else {
          // Development mode - just log the email
          console.log('=== CONTACT FORM SUBMISSION (DEV MODE) ===');
          console.log(`To: ${recipientEmail}`);
          console.log(`From: ${name} <${email}>`);
          console.log(`Subject: Contact Form Submission from ${name}`);
          console.log(`Message: ${message}`);
          console.log(`Timestamp: ${new Date().toISOString()}`);
          console.log('==========================================');
        }
        
        return true;
      } catch (error) {
        console.error('Error sending contact email:', error);
        throw new GraphQLError('Failed to send email. Please try again later.');
      }
    }
  },

  User: {
    orders: async (parent: any) => {
      return await Order.find({ user_id: parent._id });
    },    cart: async (parent: any) => {
      return await Cart.findOne({ user_id: parent._id });
    },
    reviews: async (parent: any) => {
      return await Review.find({ user_id: parent._id })
        .populate('product_id');
    },
    notifications: async (parent: any) => {
      return await Notification.find({ user_id: parent._id })
        .sort({ created_at: -1 });
    }
  },

  Category: {
    products: async (parent: any) => {
      return await Product.find({ category_id: parent._id });
    }
  },

  Product: {
    category: async (parent: any) => {
      return await Category.findById(parent.category_id);
    },
    reviews: async (parent: any) => {
      return await Review.find({ product_id: parent._id })
        .populate('user_id');
    },
    averageRating: async (parent: any) => {
      const reviews = await Review.find({ product_id: parent._id });
      if (reviews.length === 0) return null;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    }
  },

  Review: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    },
    product: async (parent: any) => {
      return await Product.findById(parent.product_id);
    }
  },

  Cart: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    },
    items: async (parent: any) => {
      return parent.items;
    }
  },

  CartItem: {
    product: async (parent: any) => {
      return await Product.findById(parent.product_id);
    }
  },

  Notification: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    }
  },

  Order: {
    user: async (parent: any) => {
      return await User.findById(parent.user_id);
    },
    items: async (parent: any) => {
      return parent.items;
    }
  },

  OrderItem: {
    product: async (parent: any) => {
      return await Product.findById(parent.product_id);
    }
  }
};