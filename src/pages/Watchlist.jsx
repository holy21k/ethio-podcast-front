import { useEffect, useState } from 'react';
import { Bookmark, Grid, List } from 'lucide-react';
import { getWatchlist } from '../api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setLoading(true);
                const response = await getWatchlist();
                setWatchlist(response.watchlist || response.data?.watchlist || []);
            } catch (err) {
                console.error("Failed to load watchlist", err);
                setError("Could not load your watchlist.");
            } finally {
                setLoading(false);
            }
        };
        fetchWatchlist();
    }, []);

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your library...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bookmark size={28} color="#8b5cf6" />
                    <h1 className="section-title" style={{ fontSize: '1.75rem' }}>Your Library</h1>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('list')}
                        className="icon-btn"
                        style={{
                            background: viewMode === 'list' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: viewMode === 'list' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className="icon-btn"
                        style={{
                            background: viewMode === 'grid' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: viewMode === 'grid' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        <Grid size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {watchlist.length === 0 ? (
                <div className="empty-state" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '1rem'
                }}>
                    <Bookmark size={64} color="#6b7280" style={{ opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', color: '#a8a8b8' }}>Your library is empty</p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Save podcasts to listen to them later</p>
                </div>
            ) : (
                <div className={viewMode === 'list' ? 'podcast-list' : 'podcast-grid'}>
                    {watchlist.map(podcast => (
                        <PodcastCard 
                            key={podcast.id} 
                            podcast={podcast} 
                            variant={viewMode}
                        />
                    ))}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default Watchlist;
