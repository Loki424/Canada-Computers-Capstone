"use client";

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS, ADD_TO_CART, GET_CART } from '@/lib/queries';
import { ProductsData, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql } from '@apollo/client';
import { useAuth } from '@/lib/auth';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
    }
  }
`;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { data: productsData, loading: productsLoading } = useQuery<ProductsData>(GET_ALL_PRODUCTS, {
    variables: { 
      category: searchParams.get('category'), 
      search: searchParams.get('search') 
    }
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: () => {
      setAddingToCart(null);
      alert('Product added to cart!');
    },
    onError: (error) => {
      setAddingToCart(null);
      alert('Error adding to cart: ' + error.message);
    }
  });

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToCart(productId);    try {
      await addToCart({
        variables: {
          productId: productId,
          quantity: 1
        }
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Filters and Search */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start">
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-4 text-gray-900">Categories</h2>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-gray-800 hover:text-blue-600"
              >
                All Products
              </Link>
              {categories.map((cat: Category) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat._id}`}
                  className="block text-sm text-gray-800 hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <form className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  className="flex-1 border rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-500"
                  defaultValue={searchParams.get('search') || ''}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-48 cursor-pointer">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.category.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-blue-600 cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-green-600 text-sm">
                            In Stock: {product.stock}
                          </span>
                        ) : (
                          <span className="text-red-600 text-sm">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-center text-sm hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.stock === 0 || addingToCart === product._id}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart === product._id ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-700">
          © 2025 Canada Computers. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}