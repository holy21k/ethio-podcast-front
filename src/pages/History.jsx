import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/user/history');
                setHistory(response.data.data || []);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="home-container pb-24">
            <h1 className="text-2xl font-bold mb-6">Listening History</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {history.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>You haven't listened to any podcasts yet.</p>
                        </div>
                    ) : (
                        <div className="podcast-grid">
                            {history.map(item => (
                                // History might return podcast object directly or nested
                                <PodcastCard key={item.id} podcast={item.podcast || item} />
                            ))}
                        </div>
                    )}
                </>
            )}
            <Navbar />
        </div>
    );
};
export default History;
