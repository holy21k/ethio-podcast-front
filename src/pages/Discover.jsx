import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Mic, Users, Filter } from 'lucide-react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Discover = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    // State
    const [activeTab, setActiveTab] = useState('podcasts'); // 'podcasts' | 'authors'
    const [searchQuery, setSearchQuery] = useState('');
    const [podcasts, setPodcasts] = useState([]);
    const [authors, setAuthors] = useState([]); // Placeholder for authors
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'podcasts') {
                    let url = '/discover?limit=50';
                    if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
                    if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

                    const response = await api.get(url);
                    // Defensive check: ensure data exists and is an array or object with data array
                    const data = response.data;
                    const items = Array.isArray(data) ? data : (data?.data || []);

                    if (Array.isArray(items)) {
                        setPodcasts(items);
                    } else {
                        throw new Error("Invalid API response format");
                    }
                } else {
                    // Fetch Authors/Channels
                    // Using /api/channels or similar if available, else Mock for UI demo
                    try {
                        // Placeholder endpoint, might need adjustment based on actual API
                        const response = await api.get('/channels');
                        const data = response.data;
                        const items = Array.isArray(data) ? data : (data?.data || []);
                        setAuthors(items);
                    } catch (e) {
                        // Fallback/Mock if API endpoint missing
                        setAuthors([
                            { id: 1, name: 'Tech Talk', count: 12 },
                            { id: 2, name: 'Daily News', count: 24 },
                        ]);
                    }
                }
            } catch (err) {
                console.error("Discover load failed", err);
                setError("Failed to load content. Please try again.");
                setPodcasts([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchData, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [activeTab, categoryFilter, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="home-container pb-24 min-h-screen bg-[#0b0215]">
            <div className="sticky top-0 z-10 bg-[#0b0215]/95 backdrop-blur-md pb-4 pt-6 px-4">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search podcasts, authors..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-[#1b0c2d] border border-purple-500/20 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-purple-500 transition placeholder-gray-500"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-900/40 p-1.5 rounded-lg border border-purple-500/30">
                        <Filter size={16} className="text-purple-300" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#1b0c2d] p-1 rounded-xl mb-2">
                    <button
                        onClick={() => setActiveTab('podcasts')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'podcasts'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Mic size={16} className="mr-2" />
                        Podcasts
                    </button>
                    <button
                        onClick={() => setActiveTab('authors')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'authors'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users size={16} className="mr-2" />
                        Authors
                    </button>
                </div>

                {categoryFilter && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
                            Category: {categoryFilter}
                            <button
                                onClick={() => setSearchParams({})}
                                className="ml-2 hover:text-white font-bold"
                            >
                                ×
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="px-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-4">
                        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm">Discovering cosmic sounds...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 text-center mt-4">
                        <p className="text-red-200 mb-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm bg-red-900/40 px-4 py-2 rounded-lg hover:bg-red-900/60 transition text-white"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Podcasts List View */}
                        {activeTab === 'podcasts' && (
                            <div className="space-y-3">
                                {podcasts.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-10">No podcasts found.</div>
                                ) : (
                                    podcasts.map(podcast => (
                                        <PodcastCard
                                            key={podcast.id}
                                            podcast={podcast}
                                            variant="list"
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Authors Grid View (Placeholder logic) */}
                        {activeTab === 'authors' && (
                            <div className="grid grid-cols-2 gap-4">
                                {authors.map((author, index) => (
                                    <div key={index} className="bg-[#1b0c2d] p-4 rounded-xl border border-purple-500/10 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-3 flex items-center justify-center text-xl font-bold">
                                            {author.name?.[0] || 'A'}
                                        </div>
                                        <h3 className="font-semibold text-white truncate w-full">{author.name || author}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{author.count || 0} Podcasts</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
};

export default Discover;
