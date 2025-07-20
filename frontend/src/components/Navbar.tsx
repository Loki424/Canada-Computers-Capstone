"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/lib/queries';
import { CartItem } from '@/types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { data: cartData } = useQuery(GET_CART, {
    skip: !user,
    errorPolicy: 'ignore'
  });

  const cartItemsCount = cartData?.cart?.items?.reduce((total: number, item: CartItem) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/Logo.svg" 
            alt="Canada Computers Logo" 
            width={150} 
            height={40}
            className="h-16 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-blue-600 text-gray-900">Home</Link>
          <Link href="/products" className="hover:text-blue-600 text-gray-900">Products</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search for a product..." 
            className="border rounded px-2 py-1 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                🛒
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <div className="relative group">
                <button className="text-gray-900 hover:text-blue-600 text-sm">
                  Hi, {user.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-900 hover:text-blue-600">
                Login
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/register" className="text-sm text-gray-900 hover:text-blue-600">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
