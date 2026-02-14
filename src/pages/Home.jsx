
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Home = () => {
    const [data, setData] = useState({ trending: [], today: [], yesterday: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // api.get('/home') should return { trending, recent_today, recent_yesterday } per spec
                const response = await api.get('/home');

                if (response.data.data) {
                    // Map backend response structure to our state
                    setData({
                        trending: response.data.data.trending || [],
                        today: response.data.data.recent_today || [],
                        yesterday: response.data.data.recent_yesterday || []
                    });
                } else {
                    // Fallback or direct structure
                    setData({
                        trending: response.data.trending || [],
                        today: response.data.recent_today || [],
                        yesterday: response.data.recent_yesterday || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch home data:", err);
                setError("Could not load podcasts.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading-state">Loading podcasts...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="home-container pb-24">
            <div className="home-header">
                <h1 className="home-title">Discover</h1>
                <p className="home-subtitle">Explore the best Ethiopian podcasts</p>
            </div>

            <section>
                <h2 className="section-title">Trending Now</h2>
                <div className="podcast-grid">
                    {data.trending.length > 0 ? (
                        data.trending.map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="text-gray-500">No trending podcasts found.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="section-title">Today's Podcasts</h2>
                <div className="podcast-grid">
                    {data.today.length > 0 ? (
                        data.today.map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="text-gray-500">No podcasts released today yet.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="section-title">Yesterday</h2>
                <div className="podcast-grid">
                    {data.yesterday.length > 0 ? (
                        data.yesterday.map(podcast => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))
                    ) : (
                        <p className="text-gray-500">No podcasts from yesterday.</p>
                    )}
                </div>
            </section>

            {/* Navbar is rendered by App.jsx layout wrapper if we changed it, 
          but previously I kept it in App.jsx route. 
          The ProtectedRoute layout in App.jsx renders <Home /><Navbar /> so we don't need it here.
          Wait, I put <Navbar /> in App.jsx for Home route only?
          Let's check App.jsx: <Route path="/home" element={<><Home /><Navbar /></>} />
          But for other pages I didn't add it in App.jsx (e.g. Discover).
          I should be consistent.
          Discover placeholder has <Navbar />.
          To be safe, I will NOT include Navbar here since App.jsx has it for /home.
       */}
        </div>
    );
};

export default Home;

