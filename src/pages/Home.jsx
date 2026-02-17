import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeData, getWatchlistChannels } from '../api';
import { auth } from '../services/firebase';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import { Bell, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ trending: [], today: [], yesterday: [] });
    const [channels, setChannels] = useState([]);
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get current user from Firebase
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser({
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=8b5cf6&color=fff&size=128`
            });
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [homeResponse, channelsResponse] = await Promise.all([
                    getHomeData(),
                    getWatchlistChannels()
                ]);

                setData({
                    trending: homeResponse.data.trending || [],
                    today: homeResponse.data.recent_today || [],
                    yesterday: homeResponse.data.recent_yesterday || []
                });
                
                setChannels(channelsResponse.data.channels || []);
            } catch (err) {
                console.error("Failed to fetch home data:", err);
                setError("Could not load podcasts.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const featuredPodcasts = data.trending.slice(0, 5);
    const currentFeatured = featuredPodcasts[featuredIndex];

    const nextFeatured = () => {
        setFeaturedIndex((prev) => (prev + 1) % featuredPodcasts.length);
    };

    const prevFeatured = () => {
        setFeaturedIndex((prev) => (prev - 1 + featuredPodcasts.length) % featuredPodcasts.length);
    };

    const handlePlayPodcast = (podcast) => {
        // Store current playing podcast in localStorage or context
        localStorage.setItem('currentPodcast', JSON.stringify(podcast));
        // Trigger audio player (we'll create this component)
        window.dispatchEvent(new CustomEvent('playPodcast', { detail: podcast }));
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading podcasts...</p>
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
            <div className="home-header">
                <div className="home-header-left">
                    {user && (
                        <div className="user-profile">
                            <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                            <div>
                                <p className="home-greeting">Good Morning !</p>
                                <h1 className="home-username">{user.displayName}</h1>
                            </div>
                        </div>
                    )}
                </div>
                <div className="home-header-right">
                    <button className="icon-btn" onClick={() => navigate('/notifications')}>
                        <Bell size={22} />
                    </button>
                </div>
            </div>

            {/* Featured Hero Section */}
            {currentFeatured && (
                <div className="hero-section">
                    <div className="hero-background">
                        <img src={currentFeatured.thumbnail} alt="" />
                    </div>
                    <div className="hero-content">
                        <div className="hero-thumbnails">
                            {featuredPodcasts.slice(0, 5).map((podcast, idx) => (
                                <div
                                    key={podcast.id}
                                    className={`hero-thumb ${idx === featuredIndex ? 'active' : ''} ${idx === featuredIndex - 1 || (featuredIndex === 0 && idx === featuredPodcasts.length - 1) ? 'prev' : ''} ${idx === featuredIndex + 1 || (featuredIndex === featuredPodcasts.length - 1 && idx === 0) ? 'next' : ''}`}
                                    onClick={() => setFeaturedIndex(idx)}
                                >
                                    <img src={podcast.thumbnail} alt={podcast.title} />
                                </div>
                            ))}
                        </div>
                        <button 
                            className="hero-play-btn" 
                            onClick={() => handlePlayPodcast(currentFeatured)}
                        >
                            <div className="hero-play-icon">
                                <Play fill="white" size={32} />
                            </div>
                            <span>Deep Dive</span>
                        </button>
                    </div>
                    <button className="hero-nav-btn prev" onClick={prevFeatured}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="hero-nav-btn next" onClick={nextFeatured}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            {/* Popular Authors */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Popular and Trending authors</h2>
                    <button className="see-all-btn" onClick={() => navigate('/categories')}>
                        See All
                    </button>
                </div>
                <div className="authors-grid">
                    {channels.slice(0, 5).map((channel, idx) => (
                        <div key={idx} className="author-card" onClick={() => navigate(`/channels/${channel}`)}>
                            <div className="author-avatar">
                                <img src={`https://ui-avatars.com/api/?name=${channel}&background=8b5cf6&color=fff&size=128`} alt={channel} />
                            </div>
                            <p className="author-name">{channel.replace('@', '')}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Most Listened Podcasts */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Most Listened Podcasts</h2>
                    <button className="see-all-btn" onClick={() => navigate('/discover')}>
                        See All
                    </button>
                </div>
                <div className="podcast-list">
                    {data.trending.slice(0, 6).map(podcast => (
                        <PodcastCard 
                            key={podcast.id} 
                            podcast={podcast} 
                            variant="list"
                            onPlay={() => handlePlayPodcast(podcast)}
                        />
                    ))}
                </div>
            </section>

            <Navbar />
        </div>
    );
};

export default Home;

