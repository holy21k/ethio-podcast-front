import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeData } from '../api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import { Bell, User } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ trending: [], today: [], yesterday: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getHomeData();

                setData({
                    trending: response.data.trending || [],
                    today: response.data.recent_today || [],
                    yesterday: response.data.recent_yesterday || []
                });
            } catch (err) {
                console.error("Failed to fetch home data:", err);
                setError("Could not load podcasts.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <div className="home-header">
                <div className="home-header-left">
                    <h1 className="home-greeting">Hello 👋</h1>
                    <p className="home-subtitle">What do you want to listen to today?</p>
                </div>
                <div className="home-header-right">
                    <button className="icon-btn" onClick={() => navigate('/notifications')}>
                        <Bell size={24} />
                    </button>
                    <button className="icon-btn" onClick={() => navigate('/profile')}>
                        <User size={24} />
                    </button>
                </div>
            </div>

            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Trending Now</h2>
                    <button className="see-all-btn" onClick={() => navigate('/discover')}>
                        See all
                    </button>
                </div>
                <div className="podcast-grid">
                    {data.trending.length > 0 ? (
                        data.trending.slice(0, 6).map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="empty-state">No trending podcasts found.</p>
                    )}
                </div>
            </section>

            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Today's Episodes</h2>
                    <button className="see-all-btn" onClick={() => navigate('/discover')}>
                        See all
                    </button>
                </div>
                <div className="podcast-grid">
                    {data.today.length > 0 ? (
                        data.today.slice(0, 6).map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="empty-state">No new episodes today.</p>
                    )}
                </div>
            </section>

            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Recent</h2>
                    <button className="see-all-btn" onClick={() => navigate('/discover')}>
                        See all
                    </button>
                </div>
                <div className="podcast-grid">
                    {data.yesterday.length > 0 ? (
                        data.yesterday.slice(0, 6).map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="empty-state">No recent podcasts.</p>
                    )}
                </div>
            </section>

            <Navbar />
        </div>
    );
};

export default Home;

