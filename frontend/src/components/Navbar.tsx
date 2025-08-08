"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/lib/queries';
import { CartItem } from '@/types';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { data: cartData } = useQuery(GET_CART, {
    skip: !user,
    errorPolicy: 'ignore'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cartData?.cart?.items?.reduce((total: number, item: CartItem) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/Logo.png" 
            alt="Canada Computers Logo" 
            width={150} 
            height={40}
            className="h-16 w-auto"
          />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          {user?.role === 'admin' ? (
            // Admin navigation
            <>
              <Link href="/admin" className="hover:text-blue-600 text-gray-900">Dashboard</Link>
              <Link href="/admin/products" className="hover:text-blue-600 text-gray-900">Products</Link>
              <Link href="/admin/categories" className="hover:text-blue-600 text-gray-900">Categories</Link>
              <Link href="/admin/orders" className="hover:text-blue-600 text-gray-900">Orders</Link>
            </>
          ) : (
            // Regular user navigation
            <>
              <Link href="/" className="hover:text-blue-600 text-gray-900">Home</Link>
              <Link href="/products" className="hover:text-blue-600 text-gray-900">Products</Link>
              <Link href="/about" className="hover:text-blue-600 text-gray-900">About Us</Link>
              <Link href="/faq" className="hover:text-blue-600 text-gray-900">FAQ</Link>
              <Link href="/contact" className="hover:text-blue-600 text-gray-900">Contact Us</Link>
            </>
          )}
        </nav>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        {/* Cart & User */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== 'admin' && (
                <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                  🛒
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              
              <div className="relative group">
                <button className="text-gray-900 hover:text-blue-600 text-sm">
                  Hi, {user.name} {user.role === 'admin' && '(Admin)'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {user.role === 'admin' ? (
                    // Admin dropdown menu
                    <>
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Products
                      </Link>
                      <Link href="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Categories
                      </Link>
                      <Link href="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Orders
                      </Link>
                    </>
                  ) : (
                    // Regular user dropdown menu
                    <>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Orders
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
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
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-blue-100 shadow-lg px-4 py-6 space-y-4 animate-fade-in-down">
          {user?.role === 'admin' ? (
            // Admin mobile navigation
            <>
              <Link href="/admin" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link href="/admin/products" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link href="/admin/categories" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/admin/orders" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
            </>
          ) : (
            // Regular user mobile navigation
            <>
              <Link href="/" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link href="/about" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/faq" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/contact" className="block text-lg font-medium text-blue-700 hover:text-blue-900" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </>
          )}
          <div className="pt-4 border-t border-blue-100">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin mobile user menu
                  <>
                    <Link href="/admin" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <Link href="/admin/products" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Manage Products</Link>
                    <Link href="/admin/categories" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Manage Categories</Link>
                    <Link href="/admin/orders" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Manage Orders</Link>
                  </>
                ) : (
                  // Regular user mobile menu
                  <>
                    <Link href="/profile" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    <Link href="/orders" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                  </>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left text-blue-700 hover:text-blue-900 py-2 border-t border-blue-100 mt-2 pt-2">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="block text-blue-700 hover:text-blue-900 py-2" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
