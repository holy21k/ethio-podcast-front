import { useState, useEffect } from 'react';
import { Search as SearchIcon, TrendingUp, Clock, X } from 'lucide-react';
import { searchPodcasts } from '../api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [trendingSearches] = useState([
        'Technology', 'Business', 'Education', 'Entertainment', 'Health'
    ]);

    useEffect(() => {
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const handleSearch = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        
        try {
            const response = await searchPodcasts(searchQuery);
            setResults(response.podcasts || response.data?.podcasts || response.data || []);
            
            // Save to recent searches
            const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
        } catch (err) {
            console.error("Search failed", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const handleQuickSearch = (searchTerm) => {
        setQuery(searchTerm);
        handleSearch(searchTerm);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setSearched(false);
    };

    const removeRecentSearch = (searchTerm) => {
        const updated = recentSearches.filter(s => s !== searchTerm);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    return (
        <div className="home-container">
            {/* Search Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'rgba(10, 10, 31, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '1rem 0',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
                <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                    <SearchIcon 
                        style={{
                            position: 'absolute',
                            left: '1.25rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#a8a8b8',
                            pointerEvents: 'none'
                        }} 
                        size={20} 
                    />
                    <input
                        type="text"
                        placeholder="Search podcasts, authors, topics..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            color: 'white',
                            padding: '1rem 3.5rem 1rem 3.5rem',
                            borderRadius: '16px',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(139, 92, 246, 0.2)',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                color: '#a78bfa'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </form>
            </div>

            {/* Search Suggestions - Show when not searched */}
            {!searched && (
                <div>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                            }}>
                                <Clock size={20} color="#8b5cf6" />
                                <h2 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    Recent Searches
                                </h2>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                            }}>
                                {recentSearches.map((search, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(139, 92, 246, 0.2)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleQuickSearch(search)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                                        }}
                                    >
                                        <span style={{ color: 'white', fontSize: '0.9rem' }}>{search}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(search);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#6b7280',
                                                cursor: 'pointer',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trending Searches */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <TrendingUp size={20} color="#8b5cf6" />
                            <h2 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: 'white'
                            }}>
                                Trending Topics
                            </h2>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                        }}>
                            {trendingSearches.map((trend, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleQuickSearch(trend)}
                                    style={{
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        border: '1px solid rgba(139, 92, 246, 0.3)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        color: '#a78bfa',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {trend}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '40vh',
                        gap: '1rem',
                        marginTop: '3rem'
                    }}>
                        <SearchIcon size={64} color="#6b7280" style={{ opacity: 0.5 }} />
                        <p style={{ fontSize: '1.1rem', color: '#a8a8b8' }}>
                            Search for your favorite podcasts
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            Try searching by title, author, or topic
                        </p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Searching...</p>
                </div>
            )}

            {/* Search Results */}
            {searched && !loading && (
                <>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: 'white',
                            marginBottom: '0.5rem'
                        }}>
                            Search Results
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#a8a8b8' }}>
                            {results.length} {results.length === 1 ? 'result' : 'results'} found for "{query}"
                        </p>
                    </div>

                    {results.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '40vh',
                            gap: '1rem'
                        }}>
                            <SearchIcon size={64} color="#6b7280" style={{ opacity: 0.5 }} />
                            <p style={{ fontSize: '1.1rem', color: '#a8a8b8' }}>
                                No results found for "{query}"
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                Try different keywords or check your spelling
                            </p>
                        </div>
                    ) : (
                        <div className="podcast-list">
                            {results.map(podcast => (
                                <PodcastCard 
                                    key={podcast.id} 
                                    podcast={podcast} 
                                    variant="list"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <Navbar />
        </div>
    );
};

export default Search;
