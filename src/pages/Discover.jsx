import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Mic, Users, Filter } from 'lucide-react';
import { discoverPodcasts, getWatchlistChannels } from '../api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/discover.css';

const Discover = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const [activeTab, setActiveTab] = useState('podcasts');
    const [searchQuery, setSearchQuery] = useState('');
    const [podcasts, setPodcasts] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === 'podcasts') {
                    const response = await discoverPodcasts({
                        query: searchQuery,
                        category: categoryFilter,
                        limit: 50
                    });
                    setPodcasts(response.data.podcasts || []);
                } else {
                    const response = await getWatchlistChannels();
                    setAuthors(response.data.channels || []);
                }
            } catch (err) {
                console.error("Discover load failed", err);
                setError("Failed to load content. Please try again.");
                setPodcasts([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchData, 300);
        return () => clearTimeout(timeout);
    }, [activeTab, categoryFilter, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="discover-container">
            <div className="discover-header">
                {/* Search Bar */}
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search podcasts, authors..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <button className="filter-btn">
                        <Filter size={16} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="discover-tabs">
                    <button
                        onClick={() => setActiveTab('podcasts')}
                        className={`tab-btn ${activeTab === 'podcasts' ? 'active' : ''}`}
                    >
                        <Mic size={16} />
                        <span>Podcasts</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('authors')}
                        className={`tab-btn ${activeTab === 'authors' ? 'active' : ''}`}
                    >
                        <Users size={16} />
                        <span>Authors</span>
                    </button>
                </div>

                {categoryFilter && (
                    <div className="category-filter">
                        <span className="category-tag">
                            Category: {categoryFilter}
                            <button onClick={() => setSearchParams({})} className="remove-btn">
                                ×
                            </button>
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="discover-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Discovering podcasts...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                ) : (
                    <>
                        {activeTab === 'podcasts' && (
                            <div className="podcasts-list">
                                {podcasts.length === 0 ? (
                                    <div className="empty-state">No podcasts found.</div>
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

                        {activeTab === 'authors' && (
                            <div className="authors-grid">
                                {authors.map((author, index) => (
                                    <div key={index} className="author-card-discover">
                                        <div className="author-avatar-discover">
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${author}&background=8b5cf6&color=fff&size=128`} 
                                                alt={author} 
                                            />
                                        </div>
                                        <h3 className="author-name-discover">{author.replace('@', '')}</h3>
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
