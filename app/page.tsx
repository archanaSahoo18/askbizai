// app/page.tsx

"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AskBizAI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a 3‑step, low‑cost business plan for your small business—for free. Works for shops, tuition centers, clinics, and home‑based services anywhere.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Question input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What’s your business question?
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How can I get more students for my tuition center?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-1 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your email (optional, we’ll save your answer)
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Thinking…" : "Get your 3‑step plan"}
            </button>
          </form>

          {/* Answer box */}
          {answer && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Here’s your 3‑step plan:
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{answer}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-10 text-sm text-gray-500">
          <p>AskBizAI – Free AI business advisor for small businesses worldwide.</p>
        </footer>
      </div>
    </div>
  );
}