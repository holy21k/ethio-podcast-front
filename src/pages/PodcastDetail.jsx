import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Play, Pause } from 'lucide-react';
import api from '../api/api';
import AudioPlayer from '../components/AudioPlayer';
import '../styles/podcast-detail.css';

const PodcastDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playerUrl, setPlayerUrl] = useState(null);

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                setLoading(true);
                // GET /api/podcasts/:id or /api/player/:id per spec
                // Spec says: Player Page API: GET /api/player/:id returns streaming_url
                // Let's try to get details first, then player url or both.

                // Fetch details
                const detailsRes = await api.get(`/podcasts/${id}`).catch(err => {
                    console.warn("Failed to fetch details endpoint, trying player endpoint directly");
                    return null;
                });

                // Fetch player stream info
                const playerRes = await api.get(`/player/${id}`).catch(err => null);

                if (playerRes && playerRes.data.data) {
                    setPlayerUrl(playerRes.data.data.streaming_url);
                    // If details failed, maybe playerRes has title/thumbnail too (user spec said it does)
                    if (!detailsRes) {
                        setPodcast(playerRes.data.data);
                    } else {
                        setPodcast(detailsRes.data.data);
                    }
                } else if (detailsRes) {
                    setPodcast(detailsRes.data.data);
                    // If no specific player endpoint content, fallback to audio_url from details
                    setPlayerUrl(detailsRes.data.data.audio_url || detailsRes.data.data.streaming_url);
                }

            } catch (err) {
                console.error("Failed to fetch podcast details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [id]);

    // Save history when podcast loads/plays
    useEffect(() => {
        if (id && podcast) {
            api.post('/user/history', { podcastId: id }).catch(console.error);
        }
    }, [id, podcast]);

    if (loading) return <div className="loading-state">Loading episode...</div>;
    if (!podcast) return <div className="error-state">Podcast not found</div>;

    return (
        <div className="podcast-detail-container pb-32">
            <Navbar />
            <div className="detail-content pt-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
                <div className="detail-sidebar flex flex-col items-center md:items-start">
                    <button className="mb-6 text-purple-300 hover:text-white flex items-center transition-colors" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </button>
                    <div className="relative group">
                        <img
                            src={podcast.thumbnail || podcast.thumbnail_url}
                            alt={podcast.title}
                            className="w-full max-w-[300px] aspect-square object-cover rounded-2xl shadow-2xl shadow-purple-900/50 border-2 border-purple-500/20"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <button
                                onClick={() => setPlayerUrl(podcast.audio_url || podcast.streaming_url)}
                                className="bg-purple-600 rounded-full p-4 transform hover:scale-110 transition-transform shadow-lg shadow-purple-500/40"
                            >
                                <Play fill="white" size={32} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="detail-main mt-8 md:mt-12 md:pl-10 flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400 mb-4 leading-tight">
                        {podcast.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                        <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-500/10">
                            <User size={18} className="text-purple-400" />
                            <span className="font-medium text-purple-200">{podcast.uploader}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} /> {podcast.duration}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} /> {podcast.created_at || 'Just now'}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={() => setPlayerUrl(podcast.audio_url || podcast.streaming_url)}
                            className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-purple-900/40 transition-all transform hover:-translate-y-1"
                        >
                            <Play fill="white" size={20} />
                            Play Episode
                        </button>
                        <button className="flex items-center gap-2 bg-[#1b0c2d] hover:bg-purple-900/30 text-white px-6 py-3.5 rounded-full border border-purple-500/30 transition-colors">
                            <span className="text-2xl leading-none pb-1">+</span> Subscribe
                        </button>
                    </div>

                    <div className="detail-description text-gray-300 leading-relaxed text-lg border-t border-purple-500/10 pt-8">
                        <h3 className="text-xl font-bold text-white mb-4">About this Episode</h3>
                        <p>{podcast.description || "No description available for this episode."}</p>
                    </div>
                </div>
            </div>

            {playerUrl && (
                <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
                    <div className="max-w-6xl mx-auto shadow-2xl shadow-purple-900/80 rounded-2xl overflow-hidden">
                        <AudioPlayer src={playerUrl} podcastId={id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PodcastDetail;
