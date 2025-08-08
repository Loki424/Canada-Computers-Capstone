import { gql } from '@apollo/client';

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(limit: 3) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($category: ID, $search: String) {
    products(category: $category, search: $search) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
      description
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      _id
      name
      description
      price
      image_url
      stock
      averageRating
      category {
        _id
        name
        description
      }
      reviews {
        _id
        rating
        comment
        created_at
        user {
          _id
          name
        }
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      name
      email
      role
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      _id
      items {
        _id
        quantity
        product {
          _id
          name
          price
          image_url
          stock
        }
      }
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      success
      message
      order {
        _id
        order_date
        total
        status
        shipping_address {
          street
          city
          state
          postal_code
          country
        }
        items {
          _id
          quantity
          price_at_time
          product {
            _id
            name
            image_url
          }
        }
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      _id
      order_date
      total
      status
      shipping_address {
        street
        city
        state
        postal_code
        country
      }
      items {
        _id
        quantity
        price_at_time
        product {
          _id
          name
          image_url
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      _id
      order_date
      total
      status
      shipping_address {
        street
        city
        state
        postal_code
        country
      }
      items {
        _id
        quantity
        price_at_time
        product {
          _id
          name
          description
          image_url
        }
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String!) {
    updateProfile(name: $name) {
      _id
      name
      email
      role
    }
  }
`;

export const SEND_CONTACT_EMAIL_MUTATION = gql`
  mutation SendContactEmail($name: String!, $email: String!, $message: String!) {
    sendContactEmail(name: $name, email: $email, message: $message)
  }
`;

// Admin Queries
export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      _id
      user {
        _id
        name
        email
      }
      order_date
      total
      status
      items {
        _id
        quantity
        price_at_time
        product {
          _id
          name
          image_url
        }
      }
      shipping_address {
        street
        city
        state
        postal_code
        country
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      _id
      name
      email
      role
      created_at
    }
  }
`;

// Admin Mutations
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      _id
      name
      description
      price
      category {
        _id
        name
      }
      image_url
      stock
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      _id
      name
      description
      price
      category {
        _id
        name
      }
      image_url
      stock
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const ADMIN_UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation AdminUpdateOrderStatus($orderId: ID!, $status: String!) {
    adminUpdateOrderStatus(orderId: $orderId, status: $status) {
      _id
      status
    }
  }
`;

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($imageBase64: String!) {
    uploadImage(imageBase64: $imageBase64)
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      _id
      name
      description
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $name: String!, $description: String) {
    updateCategory(id: $id, name: $name, description: $description) {
      _id
      name
      description
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;