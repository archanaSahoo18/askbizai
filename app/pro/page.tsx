/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Link from 'next/link';

// Define Razorpay options interface (no 'any' needed)
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: {
    name: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
}

export default function Pro() {
  const [loading, setLoading] = useState(false);

  const handleProPayment = async () => {
    setLoading(true);
    
    try {
      // 1. Create order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 99 }),
      });
      
      if (!res.ok) throw new Error('Order creation failed');
      
      const { orderId } = await res.json();

      // 2. Razorpay options with proper types
      const options: RazorpayOptions = {
        key: 'rzp_live_SboTnqXkROV8Km', // Replace with your Razorpay test key
        amount: 9900, // ₹99 * 100 paise
        currency: 'INR',
        name: 'AskBizAI Pro',
        description: 'Unlimited business plans - 7 day free trial',
        order_id: orderId,
        handler: (response) => {
          alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
          window.location.href = '/'; // Redirect to main
        },
        theme: { color: '#10b981' }, // Green theme
        prefill: {
          name: 'Business Owner',
        },
      };

      // 3. Load Razorpay script dynamically
      const rzpScript = document.createElement('script');
      rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      rzpScript.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      
      document.body.appendChild(rzpScript);
      
    } catch (error) {
      alert('Payment setup failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white py-20">
      <div className="max-w-md mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">AskBizAI Pro</h1>
        <p className="text-xl text-gray-600 mb-12">Unlimited business plans for serious owners</p>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-5xl font-bold text-green-600 mb-4">₹99</div>
          <div className="text-2xl text-gray-600 mb-8">per month</div>
          
          <ul className="text-left space-y-3 mb-8 text-gray-700">
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">✓</span>Unlimited AI business plans</li>
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">✓</span>Save chat history forever</li>
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">✓</span>PDF downloadable plans</li>
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">✓</span>WhatsApp sharing</li>
          </ul>
          
          <button 
            onClick={handleProPayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Start 7-day free trial (₹99/month)'}
          </button>
          
          <p className="text-sm text-gray-500 mt-6">Cancel anytime • No credit card needed</p>
        </div>
        
        <p className="text-sm text-gray-500 mt-12">
          Already Pro? <Link href="/" className="text-blue-600 hover:underline">Go to dashboard</Link>
        </p>
      </div>
    </div>
  );
}