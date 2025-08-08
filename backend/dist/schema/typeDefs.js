"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    created_at: String
    orders: [Order]
    cart: Cart
    reviews: [Review]
    notifications: [Notification]
  }

  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    category: Category!
    image_url: String
    stock: Int!
    reviews: [Review]
    averageRating: Float
  }

  type Category {
    _id: ID!
    name: String!
    description: String
    products: [Product]
  }

  type Order {
    _id: ID!
    user: User!
    order_date: String!
    total: Float!
    status: String!
    items: [OrderItem]!
    shipping_address: Address
  }

  type OrderItem {
    _id: ID!
    product: Product!
    quantity: Int!
    price_at_time: Float!
  }

  type Cart {
    _id: ID!
    user: User!
    items: [CartItem]!
  }

  type CartItem {
    _id: ID!
    product: Product!
    quantity: Int!
  }

  type Address {
    street: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type Review {
    _id: ID!
    product: Product!
    user: User!
    rating: Int!
    comment: String!
    created_at: String!
  }

  type Notification {
    _id: ID!
    user: User!
    message: String!
    type: NotificationType!
    is_read: Boolean!
    created_at: String!
  }

  enum NotificationType {
    order_status
    product_restock
    price_drop
    general
  }

  type Query {
    me: User
    product(id: ID!): Product
    products(category: ID, search: String, limit: Int): [Product]
    categories: [Category]
    cart: Cart
    order(id: ID!): Order
    orders: [Order]
    productReviews(productId: ID!): [Review]
    userReviews(userId: ID!): [Review]
    notifications: [Notification]
    
    # Admin queries
    allOrders: [Order]
    allUsers: [User]
    orderById(id: ID!): Order
  }

  input CheckoutInput {
    shippingAddress: AddressInput!
    paymentMethod: String!
    cardNumber: String
    expiryDate: String
    cvv: String
    nameOnCard: String
  }

  type CheckoutResult {
    success: Boolean!
    order: Order
    message: String
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(name: String!): User
    addToCart(productId: ID!, quantity: Int!): Cart
    updateCartItem(productId: ID!, quantity: Int!): Cart
    removeFromCart(productId: ID!): Cart
    createOrder(address: AddressInput!): Order
    checkout(input: CheckoutInput!): CheckoutResult
    updateOrderStatus(orderId: ID!, status: String!): Order
    createReview(productId: ID!, rating: Int!, comment: String!): Review
    updateReview(reviewId: ID!, rating: Int!, comment: String!): Review
    deleteReview(reviewId: ID!): Boolean
    markNotificationRead(notificationId: ID!): Notification
    markAllNotificationsRead: [Notification]
    sendContactEmail(name: String!, email: String!, message: String!): Boolean
    
    # Admin mutations
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
    adminUpdateOrderStatus(orderId: ID!, status: String!): Order
    createCategory(name: String!, description: String): Category
    updateCategory(id: ID!, name: String!, description: String): Category
    deleteCategory(id: ID!): Boolean
    uploadImage(imageBase64: String!): String
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    category_id: ID!
    image_url: String
    stock: Int!
  }
`;
//# sourceMappingURL=typeDefs.js.map