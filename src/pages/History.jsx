import { useEffect, useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';

import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('history') || '[]');
        setHistory(saved);
        setLoading(false);
    }, []);

    const handleClearHistory = () => {
        if (!window.confirm('Are you sure you want to clear your listening history?')) return;
        localStorage.removeItem('history');
        setHistory([]);
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading history...</p>
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
                    <Clock size={28} color="#8b5cf6" />
                    <h1 className="section-title" style={{ fontSize: '1.75rem' }}>Listening History</h1>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            padding: '0.5rem 1rem',
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                    >
                        <Trash2 size={16} />
                        <span>Clear</span>
                    </button>
                )}
            </div>

            {/* Content */}
            {history.length === 0 ? (
                <div className="empty-state" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '1rem'
                }}>
                    <Clock size={64} color="#6b7280" style={{ opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', color: '#a8a8b8' }}>No listening history</p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Start listening to podcasts to see them here</p>
                </div>
            ) : (
                <div className="podcast-list">
                    {history.map(item => {
                        // History might return podcast object directly or nested
                        const podcast = item.podcast || item;
                        return (
                            <PodcastCard 
                                key={podcast.id || item.id} 
                                podcast={podcast} 
                                variant="list"
                            />
                        );
                    })}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default History;
