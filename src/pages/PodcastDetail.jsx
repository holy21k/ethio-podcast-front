import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Play, Bookmark, Share2 } from 'lucide-react';
import { getPodcastById, getPlayerData } from '../api';
import { addToWatchlist, addToHistory } from '../api';
import AudioPlayer from '../components/AudioPlayer';
import Navbar from '../components/Navbar';
import '../styles/podcast-detail.css';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playerUrl, setPlayerUrl] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                setLoading(true);
                
                // Fetch podcast details
                const detailsResponse = await getPodcastById(id).catch(() => null);
                
                // Fetch player stream info
                const playerResponse = await getPlayerData(id).catch(() => null);

                if (playerResponse) {
                    const playerData = playerResponse.data || playerResponse;
                    setPlayerUrl(playerData.streaming_url);
                    
                    if (!detailsResponse) {
                        setPodcast(playerData);
                    } else {
                        const details = detailsResponse.data || detailsResponse;
                        setPodcast(details);
                    }
                } else if (detailsResponse) {
                    const details = detailsResponse.data || detailsResponse;
                    setPodcast(details);
                    setPlayerUrl(details.audio_url || details.streaming_url);
                }

            } catch (err) {
                console.error("Failed to fetch podcast details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [id]);

    // Save to history when podcast loads
    useEffect(() => {
        if (id && podcast) {
            addToHistory(id, podcast).catch(console.error);
        }
    }, [id, podcast]);

    const handleAddToWatchlist = async () => {
        try {
            await addToWatchlist(id, podcast);
            setIsInWatchlist(true);
        } catch (err) {
            console.error("Failed to add to watchlist", err);
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

                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                    {/* Thumbnail */}
                    <div className="detail-sidebar">
                        <div style={{ position: 'relative', width: '300px' }}>
                            <img
                                src={podcast.thumbnail || podcast.thumbnail_url}
                                alt={podcast.title}
                                className="detail-thumbnail"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Podcast';
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.4)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                            onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                            onClick={() => setPlayerUrl(podcast.audio_url || podcast.streaming_url || playerUrl)}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: '#8b5cf6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5)'
                                }}>
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
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setPlayerUrl(podcast.audio_url || podcast.streaming_url || playerUrl)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#7c3aed';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#8b5cf6';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Play fill="white" size={20} />
                                <span>Play Episode</span>
                            </button>

                            <button
                                onClick={handleAddToWatchlist}
                                disabled={isInWatchlist}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: isInWatchlist ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    padding: '1rem 2rem',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: isInWatchlist ? 'default' : 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (!isInWatchlist) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isInWatchlist) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                            >
                                <Bookmark size={20} fill={isInWatchlist ? '#8b5cf6' : 'none'} />
                                <span>{isInWatchlist ? 'Saved' : 'Save'}</span>
                            </button>

                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    padding: '1rem 2rem',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                }}
                            >
                                <Share2 size={20} />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="detail-description">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
                                About this Episode
                            </h3>
                            <p>{podcast.description || "No description available for this episode."}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio Player */}
            {playerUrl && (
                <div className="player-sticky-footer">
                    <div className="player-wrapper">
                        <AudioPlayer src={playerUrl} podcastId={id} />
                    </div>
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default PodcastDetail;
