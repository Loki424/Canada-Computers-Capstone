"use client";

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import Link from 'next/link';
import { GET_CART, CHECKOUT_MUTATION } from '@/lib/queries';
import { useAuth } from '@/lib/auth';
import { CartItem } from '@/types';
import StripeProvider from '@/components/StripeProvider';
const StripeCheckoutForm = dynamic(() => import('@/components/StripeCheckoutForm'), { ssr: false });

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}



export default function CheckoutPage() {
  const { user } = useAuth();
  const apolloClient = useApolloClient();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [orderId, setOrderId] = useState<string | null>(null);

  const [checkout, { }] = useMutation(CHECKOUT_MUTATION, {
    onCompleted: async (data) => {
      if (data.checkout.success) {
        setOrderId(data.checkout.order._id);
        setStep(4);
        // Refetch cart so Navbar updates
        await apolloClient.refetchQueries({ include: [GET_CART] });
      } else {
        alert(data.checkout.message || 'Checkout failed');
      }
    },
    onError: (error) => {
      alert('Error during checkout: ' + error.message);
    }
  });


  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Canada'
  });



  const { data: cartData, loading: cartLoading } = useQuery(GET_CART, {
    skip: !user,
    errorPolicy: 'ignore'
  });



  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to checkout.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const cart = cartData?.cart;
  if ((!cart || cart.items.length === 0) && step < 4) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = cart.items.reduce((sum: number, item: CartItem) => 
    sum + (item.product.price * item.quantity), 0
  );
  const taxAmount = totalAmount * 0.13;
  const finalTotal = totalAmount + taxAmount;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(shippingAddress).every(field => field.trim() !== '')) {
      setStep(2);
    } else {
      alert('Please fill in all shipping address fields');
    }
  };







  return (
    <StripeProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className={`text-sm ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Shipping</span>
              
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Payment</span>
              
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className={`text-sm ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Review</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province/State
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({...shippingAddress, postal_code: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information (Stripe Elements) */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                <StripeCheckoutForm
                  amount={finalTotal}
                  onSuccess={async () => {
                    // After Stripe payment, call checkout mutation with dummy card values
                    await checkout({
                      variables: {
                        input: {
                          shippingAddress,
                          paymentMethod: 'card',
                          cardNumber: '4242 4242 4242 4242',
                          expiryDate: '12/34',
                          cvv: '123',
                          nameOnCard: user?.name || 'Test User',
                        },
                      },
                    });
                  }}
                />
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order (loading) */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Placing your order...</h2>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              </div>
            )}

            {/* Step 4: Order Confirmation */}
            {step === 4 && orderId && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Placed!</h2>
                <p className="mb-4">Thank you for your payment. Your order has been placed.</p>
                <Link href={`/order-confirmation/${orderId}`} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">View Order Details</Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                {cart.items.map((item: CartItem) => (
                  <div key={item._id} className="flex justify-between">
                    <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                    <span className="text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (13%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </StripeProvider>
  );
}
