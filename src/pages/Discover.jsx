import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import PodcastCard from '../components/PodcastCard';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Discover = () => {
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Reset when category changes
        setPodcasts([]);
        setPage(1);
        setHasMore(true);
        loadPodcasts(1, categoryFilter);
    }, [categoryFilter]);

    const loadPodcasts = async (pageNum, category) => {
        setLoading(true);
        try {
            let url = `/discover?page=${pageNum}&limit=20`;
            if (category) {
                url += `&category=${encodeURIComponent(category)}`;
            }

            const response = await api.get(url);
            const newPodcasts = response.data.data || [];

            if (newPodcasts.length < 20) {
                setHasMore(false);
            }

            if (pageNum === 1) {
                setPodcasts(newPodcasts);
            } else {
                setPodcasts(prev => [...prev, ...newPodcasts]);
            }
        } catch (err) {
            console.error("Failed to discover podcasts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadPodcasts(nextPage, categoryFilter);
    };

    return (
        <div className="home-container pb-24">
            <div className="home-header">
                <h1 className="home-title">{categoryFilter ? `${categoryFilter} Podcasts` : 'Discover'}</h1>
                <p className="home-subtitle">Find something new to listen to</p>
            </div>

            <div className="podcast-grid">
                {podcasts.map(podcast => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
            </div>

            {loading && <div className="text-center py-4 text-gray-400">Loading...</div>}

            {!loading && hasMore && podcasts.length > 0 && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 px-6 py-2 rounded-full border border-purple-500/30 transition"
                    >
                        Load More
                    </button>
                </div>
            )}

            {!loading && podcasts.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No podcasts found in this category.
                </div>
            )}

            <Navbar />
        </div>
    );
};
export default Discover;
