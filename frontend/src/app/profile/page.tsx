"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE_MUTATION } from '@/lib/queries';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, login, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update name when user data loads
  useEffect(() => {
    if (user?.name) {
      setName(user.name);        
    }
  }, [user]);

  // Handle authentication redirect
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/login');
    }
  }, [mounted, authLoading, user, router]);

  // Don't render anything until mounted and auth is resolved
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Debug information
    const token = localStorage.getItem('auth-token');
    console.log('User:', user);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');

    try {
      const { data } = await updateProfile({
        variables: { name }
      });

      if (data?.updateProfile) {
        // Update the user in the auth context
        const token = localStorage.getItem('auth-token');
        if (token) {
          login(token, data.updateProfile);
        }
        setMessage('Profile updated successfully!');
      }
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Your Name" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed" 
                placeholder="you@email.com" 
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading || name === user.name}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">User ID:</span> {user._id}</p>
              <p><span className="font-medium">Member since:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
