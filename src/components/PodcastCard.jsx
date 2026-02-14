import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import '../styles/podcast.css';

const PodcastCard = ({ podcast }) => {
    const navigate = useNavigate();

    return (
        <div
            className="podcast-card"
            onClick={() => navigate(`/podcast/${podcast.id}`)}
        >
            <div className="podcast-thumbnail-wrapper">
                <img
                    src={podcast.thumbnail_url || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=500&auto=format&fit=crop&q=60"}
                    alt={podcast.title}
                    className="podcast-thumbnail"
                />
                <div className="play-icon-overlay">
                    <Play fill="white" color="white" size={24} />
                </div>
                <div className="podcast-duration">{podcast.duration || '24:00'}</div>
            </div>

            <div className="podcast-info">
                <h3 className="podcast-title">{podcast.title}</h3>
                <p className="podcast-uploader">By {podcast.uploader}</p>
                <div className="podcast-footer">
                    <span className="podcast-category">{podcast.category}</span>
                </div>
            </div>
        </div>
    );
};

export default PodcastCard;
