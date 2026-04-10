"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [originalQuestion, setOriginalQuestion] = useState("");


// Add this BEFORE handleSubmit function
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

// THEN in handleSubmit, wrap localStorage:
// if (isClient) {
//   const count = parseInt(localStorage.getItem('askbizai_usage') || '0');
//   if (count >= 3) {
//     setAnswer('Free tier: 3 asks/day. Upgrade to Pro for unlimited!');
//     setLoading(false);
//     return;
//   }
//   localStorage.setItem('askbizai_usage', (count + 1).toString());
// }

// Re-enable after 10 users (currently commented out)
if (isClient) {
  const count = parseInt(localStorage.getItem('askbizai_usage') || '0');
  if (count >= 3) {
    setAnswer('🔒 Free: 3 asks/day. Pro: Unlimited + saved history for ₹99/month!\n\nText "PRO" to upgrade.');
    return;
  }
}

  if (!originalQuestion && !question.startsWith('Follow up')) {
    setOriginalQuestion(question);
  }
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, email: email || null }),
      });
      const data = await res.json();
      setAnswer(data?.answer || "Something went wrong.");
    } catch (err) {
      setAnswer("Failed to reach AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // One-click templates (India-focused)
  const templates = [
    "Get more customers using WhatsApp Business",
    "Grow my tuition center with local marketing",
    "Market my shop for ₹0 budget", 
    "Double sales using Google My Business",
    "Get more orders on Instagram Reels",
    "Handle late payments from customers",
    "Create viral Facebook posts for business"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AskBizAI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a 3‑step, low‑cost business plan—instantly. For shops, tuition centers, clinics worldwide.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* One-click templates */}
              <label className="block text-sm font-medium text-gray-700 mb-3">
                💡 Click a template or type your question:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {templates.map((template, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuestion(template)}
                    className="px-3 py-2 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 font-medium rounded-lg transition-all hover:shadow-sm border border-blue-200"
                  >
                    {template.length > 25 ? `${template.substring(0, 22)}...` : template}
                  </button>
                ))}
              </div>

            {/* Question textarea */}
            <div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Or type your own business question..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-1 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your email (optional—we will save your answer)
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-1"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed"
            >
              {loading ? "🤔 AI is thinking..." : `Get my 3‑step plan`}
            </button>
          </form>

          {/* Answer + Follow-up buttons */}
          {/* {answer && (
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Your 3‑step business plan:
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">{answer}</p>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setQuestion(`Follow up on "${question}": `)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  ➕ Ask follow-up
                </button>
                <button 
                  onClick={() => {
                    const text = `My 3-step business plan:\n\n${answer}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  📋 Copy plan
                </button>
              </div>
            </div>
          )} */}

{answer && (
  <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <h2 className="text-xl font-semibold text-gray-800">Your 3‑step plan:</h2>
    </div>
    <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">{answer}</p>
    
    {/* Buttons - always show when answer exists */}
<div className="flex flex-wrap gap-3">
  <button 
    onClick={() => {
      if (!question.startsWith('Follow up') && originalQuestion) {
        setQuestion(`More details on "${originalQuestion}": `);
      } else {
        setQuestion(`Tell me more about: `);
      }
      setAnswer(""); 
    }}
    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
  >
    ➕ Ask follow-up
  </button>
  <button 
    onClick={() => {
      const text = `My 3-step business plan:\n\n${answer}`;
      navigator.clipboard.writeText(text);
    }}
    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
  >
    📋 Copy plan
  </button>
</div>
  </div>
)}

        </div>

        {/* Footer */}
<footer className="text-center mt-12 text-sm text-gray-500">
  <p>
    AskBizAI – Free AI business advisor.{' '}
    <Link href="/pro" className="text-blue-600 hover:underline font-medium">
      🚀 Upgrade to Pro
    </Link>
  </p>
</footer>
      </div>
    </div>
  );
}