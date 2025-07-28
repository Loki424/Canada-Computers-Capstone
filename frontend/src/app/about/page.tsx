"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">About Us</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Canada Computers is your trusted source for the latest technology, electronics, and computer hardware. Our mission is to provide Canadians with the best selection, prices, and service—online and in-store.
        </p>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2001, Canada Computers has grown from a single store to a nationwide retailer with a passion for technology and customer satisfaction. We believe in empowering our customers with knowledge, choice, and value.
          </p>
          <p className="text-gray-700">
            Whether you are a gamer, a professional, or a student, our team is here to help you find the perfect tech solution. Thank you for making us a part of your journey!
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <Link href="/faq" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition">FAQ</Link>
          <Link href="/contact" className="bg-gray-100 text-blue-700 px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-100 transition">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
