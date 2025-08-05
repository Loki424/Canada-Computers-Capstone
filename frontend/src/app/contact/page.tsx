"use client";

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT_EMAIL_MUTATION } from '@/lib/queries';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [sendContactEmail] = useMutation(SEND_CONTACT_EMAIL_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { data } = await sendContactEmail({
        variables: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      });

      if (data?.sendContactEmail) {
        setSuccessMessage('Your message has been sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Your Name" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="you@email.com" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                rows={5} 
                placeholder="How can we help you?" 
                required
              ></textarea>
            </div>

            {successMessage && (
              <div className="p-4 rounded-lg bg-green-100 text-green-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-100 text-red-700">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="text-center text-gray-600">
          <p>Or email us directly at <a href="mailto:seelamreddy424@gmail.com" className="text-blue-600 hover:underline">mseelamreddy424@gmail.com</a></p>
          <p className="mt-2">123 Tech Avenue, Toronto, ON, Canada</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
