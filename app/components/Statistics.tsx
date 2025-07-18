'use client';

import React, { useState, useEffect } from 'react';
import { HealthResponse, ChatMessage, SearchHistoryItem } from '../../lib/types';
import { loadChatHistory, loadSearchHistory, formatTimestamp } from '../../lib/utils';

interface StatisticsProps {
    healthStatus: HealthResponse | null;
}

interface ActivityItem {
    type: string;
    content: string;
    timestamp: Date;
    icon: string;
    extra?: string;
}

export default function Statistics({ healthStatus }: StatisticsProps) {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setChatHistory(loadChatHistory());
        setSearchHistory(loadSearchHistory());
    }, [refreshKey]);

    const refresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const totalTokens = chatHistory.reduce((sum, msg) => sum + (msg.usage?.total_tokens || 0), 0);
    const faqEnhancedChats = chatHistory.filter(msg => msg.faq_context).length;
    const uniqueSearchQueries = new Set(searchHistory.map(s => s.query)).size;
    const averageSearchResults = searchHistory.length > 0
        ? searchHistory.reduce((sum, s) => sum + s.resultCount, 0) / searchHistory.length
        : 0;

    const recentActivity: ActivityItem[] = [
        ...chatHistory.map(msg => ({
            type: 'chat',
            content: msg.content,
            timestamp: msg.timestamp,
            icon: msg.type === 'user' ? '👤' : '🤖',
        })),
        ...searchHistory.map(search => ({
            type: 'search',
            content: search.query,
            timestamp: search.timestamp,
            icon: '🔍',
            extra: `${search.resultCount} results`,
        }))
    ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

    return (
        <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Statistics</h2>

                {healthStatus ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{healthStatus.faq_records}</div>
                            <div className="text-sm text-gray-600">FAQ Records</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">{healthStatus.model}</div>
                            <div className="text-sm text-gray-600">AI Model</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">{healthStatus.provider}</div>
                            <div className="text-sm text-gray-600">Provider</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <p className="text-gray-600">Unable to connect to backend system</p>
                    </div>
                )}
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chat Statistics */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Chat Statistics</h3>
                        <button
                            onClick={refresh}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Messages</span>
                            <span className="font-semibold">{chatHistory.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">User Messages</span>
                            <span className="font-semibold">
                                {chatHistory.filter(msg => msg.type === 'user').length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">AI Responses</span>
                            <span className="font-semibold">
                                {chatHistory.filter(msg => msg.type === 'assistant').length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">FAQ Enhanced</span>
                            <span className="font-semibold">{faqEnhancedChats}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Tokens Used</span>
                            <span className="font-semibold">{totalTokens.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Search Statistics */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Statistics</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Searches</span>
                            <span className="font-semibold">{searchHistory.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Unique Queries</span>
                            <span className="font-semibold">{uniqueSearchQueries}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Avg Results/Search</span>
                            <span className="font-semibold">{averageSearchResults.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Results Found</span>
                            <span className="font-semibold">
                                {searchHistory.reduce((sum, s) => sum + s.resultCount, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

                {recentActivity.length > 0 ? (
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                                <span className="text-xl">{activity.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                            {activity.type}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatTimestamp(new Date(activity.timestamp))}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {activity.content}
                                    </p>
                                    {activity.extra && (
                                        <p className="text-xs text-gray-500 mt-1">{activity.extra}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-2">📊</div>
                        <p className="text-gray-600">No activity yet</p>
                        <p className="text-sm text-gray-500">Start chatting or searching to see activity here</p>
                    </div>
                )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {chatHistory.length > 0 ? ((faqEnhancedChats / chatHistory.filter(m => m.type === 'assistant').length) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">FAQ Enhancement Rate</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {searchHistory.length > 0 ? (searchHistory.filter(s => s.resultCount > 0).length / searchHistory.length * 100).toFixed(1) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">Successful Search Rate</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {chatHistory.filter(m => m.type === 'assistant').length > 0
                                ? (totalTokens / chatHistory.filter(m => m.type === 'assistant').length).toFixed(0)
                                : 0}
                        </div>
                        <div className="text-sm text-gray-600">Avg Tokens/Response</div>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('faq_chat_history');
                            refresh();
                        }}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                    >
                        🗑️ Clear Chat History
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem('faq_search_history');
                            refresh();
                        }}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                    >
                        🗑️ Clear Search History
                    </button>

                    <button
                        onClick={() => {
                            const data = {
                                chatHistory: loadChatHistory(),
                                searchHistory: loadSearchHistory(),
                                exportDate: new Date().toISOString(),
                            };
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `faq-assistant-data-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                    >
                        💾 Export Data
                    </button>
                </div>
            </div>
        </div>
    );
}
