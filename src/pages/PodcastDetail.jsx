import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import api from '../api/api';
import AudioPlayer from '../components/AudioPlayer';
import '../styles/podcast-detail.css';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/podcasts/${id}`);
                setPodcast(response.data.data);
            } catch (err) {
                console.error("Failed to fetch podcast details", err);
                // Fallback mock data if API fails or for demo
                setPodcast({
                    id: id,
                    title: "The Future of Tech in Africa",
                    uploader: "TechTalk Ethiopia",
                    description: "In this episode, we explore how emerging technologies are reshaping the African continent. From fintech to agritech, join us as we discuss the innovations driving change.",
                    thumbnail_url: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=500&auto=format&fit=crop&q=60",
                    duration: "45:20",
                    created_at: "2024-03-15",
                    category: "Technology"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [id]);

    if (loading) return <div className="loading-state">Loading episode...</div>;
    if (!podcast) return <div className="error-state">Podcast not found</div>;

    return (
        <div className="podcast-detail-container">
            <div className="detail-content">
                <div className="detail-sidebar">
                    <button className="btn-back-nav" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <img
                        src={podcast.thumbnail_url}
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

            <div className="player-sticky-footer">
                <div className="player-wrapper">
                    <AudioPlayer src={podcast.audio_url || `/api/audio/stream/${id}`} />
                </div>
            </div>
        </div>
    );
};

export default PodcastDetail;
