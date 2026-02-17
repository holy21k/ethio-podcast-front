import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import '../styles/podcast.css';

const PodcastCard = ({ podcast, variant = 'card' }) => {
    const navigate = useNavigate();
    const isList = variant === 'list';

    // Use the correct thumbnail property from API
    const thumbnailUrl = podcast.thumbnail || podcast.thumbnail_url || `https://img.youtube.com/vi/${podcast.id}/mqdefault.jpg`;

    return (
        <div
            className={`podcast-card ${isList ? 'podcast-card-list' : ''}`}
            onClick={() => navigate(`/podcast/${podcast.id}`)}
        >
            <div className={`podcast-thumbnail-wrapper ${isList ? 'list-thumbnail' : ''}`}>
                <img
                    src={thumbnailUrl}
                    alt={podcast.title || podcast.display_title}
                    className="podcast-thumbnail"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Podcast';
                    }}
                />
                {!isList && (
                    <div className="play-icon-overlay">
                        <Play fill="white" color="white" size={24} />
                    </div>
                )}
            </div>

            <div className="podcast-info">
                <h3 className="podcast-title">{podcast.title || podcast.display_title}</h3>
                <p className="podcast-uploader">By {podcast.uploader || 'Unknown'}</p>
                <div className="podcast-footer">
                    <span className="podcast-category">{podcast.category || 'General'}</span>
                    {isList && podcast.duration && (
                        <span className="podcast-duration">{podcast.duration}</span>
                    )}
                </div>
            </div>

            {isList && (
                <button className="podcast-play-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/podcast/${podcast.id}`);
                }}>
                    <Play fill="white" size={16} />
                </button>
            )}
        </div>
    );
};

export default PodcastCard;
