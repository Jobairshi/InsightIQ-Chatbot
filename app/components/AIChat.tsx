'use client';

import React, { useState, useEffect, useRef } from 'react';
import { chatWithAI, isAPIError } from '../../lib/api';
import { ChatMessage } from '../../lib/types';
import { saveChatHistory, loadChatHistory, formatTimestamp, generateId } from '../../lib/utils';

export default function AIChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful FAQ assistant.');
    const [showSystemPrompt, setShowSystemPrompt] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const history = loadChatHistory();
        setMessages(history);
    }, []);

    useEffect(() => {
        saveChatHistory(messages);
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            type: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatWithAI(input, systemPrompt);

            if (isAPIError(response)) {
                const errorMessage: ChatMessage = {
                    id: generateId(),
                    type: 'assistant',
                    content: `Error: ${response.error}`,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
            } else {
                const assistantMessage: ChatMessage = {
                    id: generateId(),
                    type: 'assistant',
                    content: response.response,
                    timestamp: new Date(),
                    faq_context: response.faq_context,
                    usage: response.usage,
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch {
            const errorMessage: ChatMessage = {
                id: generateId(),
                type: 'assistant',
                content: 'Sorry, I encountered an error while processing your message. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearHistory = () => {
        setMessages([]);
    };

    const predefinedPrompts = [
        "How can I search for specific information?",
        "What features are available in this system?",
        "How do I troubleshoot common issues?",
        "Can you explain the translation feature?",
        "What are the system requirements?",
    ];

    return (
        <div className="space-y-6">
            {/* Chat Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h2>
                        <p className="text-gray-600">
                            Chat with our AI assistant powered by FAQ context and Azure OpenAI
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                            ⚙️ Settings
                        </button>
                        <button
                            onClick={clearHistory}
                            className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                </div>

                {/* System Prompt Configuration */}
                {showSystemPrompt && (
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            System Prompt
                        </label>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter system prompt to customize AI behavior..."
                        />
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                            <p className="text-gray-600 mb-4">
                                Ask any question and I&apos;ll help you using our FAQ database.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Try asking:</p>
                                {predefinedPrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(prompt)}
                                        className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        &quot;{prompt}&quot;
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3xl px-4 py-3 rounded-lg ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{message.content}</div>

                                {/* FAQ Context */}
                                {message.faq_context && (
                                    <div className="mt-2 pt-2 border-t border-gray-300">
                                        <p className="text-xs text-gray-600 mb-1">📚 FAQ Context:</p>
                                        <p className="text-xs text-gray-700">{message.faq_context}</p>
                                    </div>
                                )}

                                {/* Usage Stats */}
                                {message.usage && (
                                    <div className="mt-2 pt-2 border-t border-gray-300">
                                        <p className="text-xs text-gray-600">
                                            🔢 Tokens: {message.usage.total_tokens} ({message.usage.prompt_tokens} prompt + {message.usage.completion_tokens} completion)
                                        </p>
                                    </div>
                                )}

                                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                    }`}>
                                    {formatTimestamp(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-900 max-w-3xl px-4 py-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-600">AI is typing...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                    <div className="flex space-x-4">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                            rows={2}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Statistics */}
            {messages.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                            <div className="text-sm text-gray-600">Total Messages</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {messages.filter(m => m.type === 'user').length}
                            </div>
                            <div className="text-sm text-gray-600">Your Messages</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {messages.filter(m => m.faq_context).length}
                            </div>
                            <div className="text-sm text-gray-600">FAQ Enhanced</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {messages.reduce((sum, m) => sum + (m.usage?.total_tokens || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Tokens</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
