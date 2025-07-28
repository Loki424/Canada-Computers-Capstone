"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@email.com" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={5} placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">Send Message</button>
          </form>
        </div>
        <div className="text-center text-gray-600">
          <p>Or email us at <a href="mailto:support@canadacomputers.com" className="text-blue-600 hover:underline">support@canadacomputers.com</a></p>
          <p className="mt-2">123 Tech Avenue, Toronto, ON, Canada</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
