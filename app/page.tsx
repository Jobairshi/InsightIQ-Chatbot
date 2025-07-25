'use client';

import React, { useState, useEffect } from 'react';
import FAQSearch from './components/FAQSearch';

import { checkHealth, isAPIError } from '../lib/api';
import { HealthResponse } from '../lib/types';
import AIChat from './components/AIChat';
import Statistics from './components/Statistics';

type ActiveTab = 'search' | 'chat' | 'stats';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkBackendHealth = async () => {
      const response = await checkHealth();
      console.log("🚀 ~ checkBackendHealth ~ response:", response)
      if (!isAPIError(response)) {
        setHealthStatus(response);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    checkBackendHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'search' as const, label: 'FAQ Search', icon: '🔍' },
    { id: 'chat' as const, label: 'AI Chat', icon: '💬' },
    { id: 'stats' as const, label: 'Statistics', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">FAQ Assistant</h1>
              <div className="ml-4 flex items-center">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="ml-2 text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                className="ml-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => window.location.href = '/creator-studio'}
              >
                Creator Studio
              </button>
            </div>

            {healthStatus && (
              <div className="text-sm text-gray-600">
                {healthStatus.faq_records} FAQ records | {healthStatus.model}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Backend Connection Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Unable to connect to the backend API. Please ensure the backend server is running on http://localhost:8001</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && <FAQSearch />}
        {activeTab === 'chat' && <AIChat />}
        {activeTab === 'stats' && <Statistics healthStatus={healthStatus} />}
      </main>
    </div>
  );
}
