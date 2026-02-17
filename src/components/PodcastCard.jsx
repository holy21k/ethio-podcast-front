import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import '../styles/podcast.css';

const PodcastCard = ({ podcast, variant = 'card' }) => {
    const navigate = useNavigate();
    const isList = variant === 'list';

    return (
        <div
            className={`podcast-card ${isList ? 'podcast-card-list' : ''}`}
            onClick={() => navigate(`/podcast/${podcast.id}`)}
        >
            <div className={`podcast-thumbnail-wrapper ${isList ? 'w-24 h-24 min-w-[6rem]' : ''}`}>
                <img
                    src={podcast.thumbnail_url || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=500&auto=format&fit=crop&q=60"}
                    alt={podcast.title}
                    className="podcast-thumbnail"
                />
                {!isList && (
                    <div className="play-icon-overlay">
                        <Play fill="white" color="white" size={24} />
                    </div>
                )}
            </div>

            <div className="podcast-info">
                <h3 className="podcast-title line-clamp-2">{podcast.title}</h3>
                <p className="podcast-uploader text-sm text-gray-400">By {podcast.uploader}</p>
                <div className="podcast-footer mt-2 flex items-center justify-between">
                    <span className="podcast-category text-xs bg-purple-900/50 px-2 py-1 rounded">{podcast.category}</span>
                    {isList && (
                        <span className="text-xs text-gray-500">{podcast.duration || '24:00'}</span>
                    )}
                </div>
            </div>

            {isList && (
                <div className="ml-auto pl-4 self-center">
                    <button className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition">
                        <Play fill="white" size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PodcastCard;
