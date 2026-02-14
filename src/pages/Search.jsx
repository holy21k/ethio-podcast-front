import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
            setResults(response.data.data || []);
        } catch (err) {
            console.error("Search failed", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container pb-24">
            <div className="mb-6 sticky top-0 bg-[#0b0215] z-10 py-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search podcasts, hosts..."
                        className="w-full bg-[#1b0c2d] border border-purple-500/30 rounded-full py-3 px-12 text-white focus:outline-none focus:border-purple-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center text-gray-400 mt-10">Searching...</div>
            ) : (
                <>
                    {searched && results.length === 0 && (
                        <div className="text-center text-gray-400 mt-10">No results found for "{query}"</div>
                    )}

                    <div className="podcast-grid">
                        {results.map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))}
                    </div>
                </>
            )}

            {!searched && (
                <div className="text-center text-gray-500 mt-20">
                    <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Search for your favorite podcasts</p>
                </div>
            )}

            <Navbar />
        </div>
    );
};
export default Search;
