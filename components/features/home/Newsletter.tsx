"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thanks for subscribing!');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-16 px-4 bg-kenya-green text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-display font-bold mb-4">
          Stay Updated
        </h2>
        <p className="text-lg mb-8 text-green-100">
          Subscribe to get special offers, free giveaways, and deals.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-kenya-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
