import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await api.get('/user/watchlist');
                setWatchlist(response.data.data || []);
            } catch (err) {
                console.error("Failed to load watchlist", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchlist();
    }, []);

    return (
        <div className="home-container pb-24">
            <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {watchlist.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>You haven't saved any podcasts yet.</p>
                        </div>
                    ) : (
                        <div className="podcast-grid">
                            {watchlist.map(podcast => (
                                <PodcastCard key={podcast.id} podcast={podcast} />
                            ))}
                        </div>
                    )}
                </>
            )}
            <Navbar />
        </div>
    );
};
export default Watchlist;
