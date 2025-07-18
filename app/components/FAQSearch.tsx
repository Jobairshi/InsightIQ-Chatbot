'use client';

import React, { useState, useEffect } from 'react';
import { searchFAQ, isAPIError } from '../../lib/api';
import { FAQResult, SearchHistoryItem } from '../../lib/types';
import { addSearchToHistory, loadSearchHistory, formatTimestamp } from '../../lib/utils';

export default function FAQSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FAQResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxResults, setMaxResults] = useState(5);
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        setSearchHistory(loadSearchHistory());
    }, []);

    const handleSearch = async (searchQuery?: string) => {
        const queryToSearch = searchQuery || query;
        if (!queryToSearch.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await searchFAQ(queryToSearch, maxResults);

            if (isAPIError(response)) {
                setError(response.error);
                setResults([]);
            } else {
                setResults(response.results);
                addSearchToHistory(queryToSearch, response.count);
                setSearchHistory(loadSearchHistory());
            }
        } catch {
            setError('Failed to search FAQ');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredResults = selectedCategory === 'all'
        ? results
        : results.filter(result => result.metadata.category === selectedCategory);

    const categories = ['all', ...Array.from(new Set(results.map(r => r.metadata.category)))];

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ Search</h2>
                <p className="text-gray-600 mb-6">
                    Search through our comprehensive FAQ database using intelligent similarity matching.
                </p>

                {/* Search Input */}
                <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your question or search term..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select
                            value={maxResults}
                            onChange={(e) => setMaxResults(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5 results</option>
                            <option value={10}>10 results</option>
                            <option value={20}>20 results</option>
                        </select>
                        <button
                            onClick={() => handleSearch()}
                            disabled={isLoading || !query.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                {results.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 text-sm rounded-full ${selectedCategory === category
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category === 'all' ? 'All Categories' : category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-red-400">❌</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Results */}
            {filteredResults.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Search Results ({filteredResults.length})
                    </h3>
                    {filteredResults.map((result) => (
                        <div key={result.metadata.id} className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {result.metadata.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        Similarity: {(result.similarity_score * 100).toFixed(1)}%
                                    </span>
                                    <div className={`w-3 h-3 rounded-full ${result.similarity_score > 0.8 ? 'bg-green-500' :
                                            result.similarity_score > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                </div>
                            </div>

                            <div className="flex space-x-4 mb-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {result.metadata.category}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {result.metadata.sub_category}
                                </span>
                            </div>

                            <div className="text-gray-700 whitespace-pre-wrap">
                                {result.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
                    <div className="space-y-2">
                        {searchHistory.slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => {
                                    setQuery(item.query);
                                    handleSearch(item.query);
                                }}
                            >
                                <div>
                                    <p className="text-gray-900">{item.query}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.resultCount} results • {formatTimestamp(item.timestamp)}
                                    </p>
                                </div>
                                <span className="text-gray-400">🔍</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && results.length === 0 && query && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search terms or check for typos.
                    </p>
                </div>
            )}
        </div>
    );
}
