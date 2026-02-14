import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Play, Pause } from 'lucide-react';
import api from '../api/api';
import AudioPlayer from '../components/AudioPlayer';
import '../styles/podcast-detail.css';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playerUrl, setPlayerUrl] = useState(null);

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                setLoading(true);
                // GET /api/podcasts/:id or /api/player/:id per spec
                // Spec says: Player Page API: GET /api/player/:id returns streaming_url
                // Let's try to get details first, then player url or both.

                // Fetch details
                const detailsRes = await api.get(`/podcasts/${id}`).catch(err => {
                    console.warn("Failed to fetch details endpoint, trying player endpoint directly");
                    return null;
                });

                // Fetch player stream info
                const playerRes = await api.get(`/player/${id}`).catch(err => null);

                if (playerRes && playerRes.data.data) {
                    setPlayerUrl(playerRes.data.data.streaming_url);
                    // If details failed, maybe playerRes has title/thumbnail too (user spec said it does)
                    if (!detailsRes) {
                        setPodcast(playerRes.data.data);
                    } else {
                        setPodcast(detailsRes.data.data);
                    }
                } else if (detailsRes) {
                    setPodcast(detailsRes.data.data);
                    // If no specific player endpoint content, fallback to audio_url from details
                    setPlayerUrl(detailsRes.data.data.audio_url || detailsRes.data.data.streaming_url);
                }

            } catch (err) {
                console.error("Failed to fetch podcast details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [id]);

    // Save history when podcast loads/plays
    useEffect(() => {
        if (id && podcast) {
            api.post('/user/history', { podcastId: id }).catch(console.error);
        }
    }, [id, podcast]);

    if (loading) return <div className="loading-state">Loading episode...</div>;
    if (!podcast) return <div className="error-state">Podcast not found</div>;

    return (
        <div className="podcast-detail-container pb-32">
            <div className="detail-content">
                <div className="detail-sidebar">
                    <button className="btn-back-nav" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <img
                        src={podcast.thumbnail || podcast.thumbnail_url}
                        alt={podcast.title}
                        className="detail-thumbnail"
                    />
                </div>

                <div className="detail-main">
                    <h1 className="detail-title">{podcast.title}</h1>

                    <div className="detail-meta">
                        <span className="meta-item"><User size={18} /> {podcast.uploader}</span>
                        <span className="meta-item"><Clock size={18} /> {podcast.duration}</span>
                        <span className="meta-item"><Calendar size={18} /> {podcast.created_at || 'Just now'}</span>
                    </div>

                    <div className="detail-description">
                        <p>{podcast.description || "No description available for this episode."}</p>
                    </div>
                </div>
            </div>

            {playerUrl && (
                <div className="player-sticky-footer">
                    <div className="player-wrapper">
                        <AudioPlayer src={playerUrl} podcastId={id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PodcastDetail;
