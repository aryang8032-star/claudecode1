'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ApiKeyModal from './ApiKeyModal';

const TABS = [
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'lipsync', label: 'Lip Sync', icon: '🎙️' },
  { id: 'cinema', label: 'Cinema', icon: '🎥' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'workflows', label: 'Workflows', icon: '⚙️' },
  { id: 'agents', label: 'Agents', icon: '🤖' },
  { id: 'design', label: 'Design Agent', icon: '🎨' },
  { id: 'apps', label: 'Apps', icon: '📦' },
];

export default function StandaloneShell() {
  const router = useRouter();
  const pathname = usePathname();

  const [apiKey, setApiKey] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [balance, setBalance] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('image');

  // Determine active tab from route
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'studio' && segments[1]) {
      setActiveTab(segments[1]);
    }
  }, [pathname]);

  // Load API key from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('api_key');
    if (stored) {
      setApiKey(stored);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  // Fetch balance periodically
  const fetchBalance = useCallback(async () => {
    if (!apiKey) return;
    try {
      const res = await fetch('/api/balance', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch {
      // silently ignore balance fetch errors
    }
  }, [apiKey]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  function handleSaveKey(key) {
    localStorage.setItem('api_key', key);
    setApiKey(key);
    setShowKeyModal(false);
  }

  function handleTabClick(tabId) {
    setActiveTab(tabId);
    router.push(`/studio/${tabId}`);
  }

  // Drag-and-drop handlers
  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  }

  return (
    <div
      className="min-h-screen bg-[#050505] text-white flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {showKeyModal && <ApiKeyModal onSave={handleSaveKey} />}

      {isDragging && (
        <div className="fixed inset-0 z-40 bg-[#22d3ee]/10 border-2 border-dashed border-[#22d3ee]/50 pointer-events-none flex items-center justify-center">
          <p className="text-[#22d3ee] text-xl font-semibold">Drop media here</p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#22d3ee] flex items-center justify-center">
            <span className="text-black text-sm font-bold">G</span>
          </div>
          <span className="font-semibold text-sm tracking-wide">Open Generative AI</span>
        </div>

        <div className="flex items-center gap-3">
          {balance !== null && (
            <span className="text-xs text-[#a1a1aa] bg-[#141414] px-3 py-1 rounded-full border border-white/5">
              Balance: ${typeof balance === 'number' ? balance.toFixed(2) : balance}
            </span>
          )}
          <button
            onClick={() => setShowKeyModal(true)}
            className="text-xs text-[#a1a1aa] hover:text-white bg-[#141414] px-3 py-1 rounded-full border border-white/5 transition"
          >
            API Key
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="flex items-center gap-1 px-4 py-2 border-b border-white/5 bg-[#080808] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20'
                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-fade-in-up">
          <p className="text-4xl mb-4">
            {TABS.find((t) => t.id === activeTab)?.icon}
          </p>
          <h1 className="text-2xl font-semibold mb-2">
            {TABS.find((t) => t.id === activeTab)?.label} Studio
          </h1>
          <p className="text-[#52525b] text-sm">
            Connect your API key and start generating
          </p>
        </div>
      </main>
    </div>
  );
}
