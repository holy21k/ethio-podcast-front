import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Play, Bookmark, Share2 } from 'lucide-react';
import { getPodcastById } from '../api';
import AudioPlayer from '../components/AudioPlayer';
import Navbar from '../components/Navbar';
import '../styles/podcast-detail.css';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(() => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        return watchlist.some(w => w.id === id);
    });

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                setLoading(true);
                const detailsResponse = await getPodcastById(id).catch(() => null);
                if (detailsResponse) {
                    const details = detailsResponse.data || detailsResponse;
                    setPodcast(details);
                }
            } catch (err) {
                console.error("Failed to fetch podcast details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPodcast();
    }, [id]);

    useEffect(() => {
        if (id && podcast) {
            const history = JSON.parse(localStorage.getItem('history') || '[]');
            const exists = history.find(h => (h.id || h) === id);
            if (!exists) {
                history.unshift({ ...podcast, id });
                localStorage.setItem('history', JSON.stringify(history.slice(0, 50)));
            }
        }
    }, [id, podcast]);

    const handleAddToWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const exists = watchlist.find(w => (w.id || w) === id);
        if (!exists) {
            watchlist.unshift({ ...podcast, id });
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            setIsInWatchlist(true);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: podcast.title,
                text: `Check out this podcast: ${podcast.title}`,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="podcast-detail-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading episode...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    if (!podcast) {
        return (
            <div className="podcast-detail-container">
                <div className="error-state">
                    <p>Podcast not found</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="podcast-detail-container">
            <div className="detail-content">
                {/* Back Button */}
                <button className="btn-back-nav" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="detail-layout">
                    {/* Thumbnail */}
                    <div className="detail-sidebar">
                        <div className="detail-thumbnail-wrapper">
                            <img
                                src={podcast.thumbnail || podcast.thumbnail_url}
                                alt={podcast.title}
                                className="detail-thumbnail"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Podcast';
                                }}
                            />
                            <div className="thumbnail-overlay">
                                <div className="thumbnail-play-btn">
                                    <Play fill="white" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="detail-main">
                        <h1 className="detail-title">{podcast.title}</h1>

                        <div className="detail-meta">
                            <div className="meta-item">
                                <User size={18} color="#8b5cf6" />
                                <span>{podcast.uploader || 'Unknown'}</span>
                            </div>
                            {podcast.duration && (
                                <div className="meta-item">
                                    <Clock size={18} color="#8b5cf6" />
                                    <span>{podcast.duration}</span>
                                </div>
                            )}
                            {podcast.created_at && (
                                <div className="meta-item">
                                    <Calendar size={18} color="#8b5cf6" />
                                    <span>{podcast.created_at}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="detail-actions">
                            <button
                                className="action-btn action-btn-primary"
                                onClick={() => {
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                }}
                            >
                                <Play fill="white" size={20} />
                                <span>Play Episode</span>
                            </button>

                            <button
                                className={`action-btn action-btn-secondary ${isInWatchlist ? 'saved' : ''}`}
                                onClick={handleAddToWatchlist}
                                disabled={isInWatchlist}
                            >
                                <Bookmark size={20} fill={isInWatchlist ? '#8b5cf6' : 'none'} />
                                <span>{isInWatchlist ? 'Saved' : 'Save'}</span>
                            </button>

                            <button
                                className="action-btn action-btn-secondary"
                                onClick={handleShare}
                            >
                                <Share2 size={20} />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="detail-description">
                            <h3>About this Episode</h3>
                            <p>{podcast.description || "No description available for this episode."}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio Player */}
            {podcast && (
                <div className="player-sticky-footer">
                    <div className="player-wrapper">
                        <AudioPlayer podcastId={id} />
                    </div>
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default PodcastDetail;