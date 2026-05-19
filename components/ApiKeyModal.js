'use client';

import { useState } from 'react';

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Please enter a valid API key.');
      return;
    }
    onSave(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#030303] border border-white/10 p-8 shadow-2xl animate-fade-in-up">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-2">
          Enter your API Key
        </h2>
        <p className="text-sm text-[#a1a1aa] text-center mb-6">
          Your key is stored locally and never sent to our servers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              if (error) setError('');
            }}
            placeholder="sk-••••••••••••••••"
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#52525b] focus:outline-none focus:border-[#22d3ee]/50 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#22d3ee] hover:bg-[#06b6d4] text-black font-semibold rounded-xl py-3 transition"
          >
            Get Started
          </button>
        </form>

        <p className="text-center text-xs text-[#52525b] mt-4">
          Don&apos;t have a key?{' '}
          <a
            href="https://muapi.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22d3ee] hover:underline"
          >
            Get a free API key
          </a>
        </p>
      </div>
    </div>
  );
}
