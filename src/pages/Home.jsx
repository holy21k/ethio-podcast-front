import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import '../styles/home.css';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Using Promise.all to fetch both endpoints
                // If backend /home exists as per spec, use that, otherwise fetch individually
                // Spec says: GET /home → trending + recent podcasts

                try {
                    const response = await api.get('/home');
                    if (response.data.status === 'success') {
                        setTrending(response.data.data.trending || []);
                        setRecent(response.data.data.recent || []);
                    } else {
                        // Fallback if structure is different
                        setTrending(response.data.trending || []);
                        setRecent(response.data.recent || []);
                    }
                } catch (err) {
                    console.warn("Home endpoint failed, trying individual endpoints", err);
                    // Fallback to individual endpoints if /home not implemented yet
                    const [trendingRes, recentRes] = await Promise.all([
                        api.get('/podcasts/trending').catch(() => ({ data: { data: [] } })),
                        api.get('/podcasts/recent').catch(() => ({ data: { data: [] } }))
                    ]);
                    setTrending(trendingRes.data.data || []);
                    setRecent(recentRes.data.data || []);
                }

            } catch (err) {
                console.error("Failed to fetch podcasts:", err);
                setError("Could not load podcasts. Please verify the backend is running.");

                // MOCK DATA FOR DEMONSTRATION if API fails
                const mockData = Array(4).fill(null).map((_, i) => ({
                    id: `mock-${i}`,
                    title: `Podcast Episode ${i + 1}`,
                    uploader: "EthioHost",
                    category: "Culture",
                    duration: "45:00",
                    thumbnail_url: ""
                }));
                setTrending(mockData);
                setRecent(mockData);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading-state">Loading podcasts...</div>;
    if (error && trending.length === 0) return <div className="error-state">{error}</div>;

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">Discover</h1>
                <p className="home-subtitle">Explore the best Ethiopian podcasts</p>
            </div>

            <section>
                <h2 className="section-title">Trending Now</h2>
                <div className="podcast-grid">
                    {trending.map(podcast => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">New Releases</h2>
                <div className="podcast-grid">
                    {recent.map(podcast => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
