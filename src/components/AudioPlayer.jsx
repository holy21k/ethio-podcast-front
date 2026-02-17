import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import api from '../api/api';
import '../styles/audioplayer.css';

const AudioPlayer = ({ src, podcastId }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const isYouTube = src && (src.includes('youtube.com/embed') || src.includes('youtu.be'));

    useEffect(() => {
        if (src && !isYouTube) {
            setIsPlaying(true);
            audioRef.current?.play().catch(e => console.error("Autoplay failed:", e));
        }
    }, [src, isYouTube]);

    const togglePlay = () => {
        if (isYouTube) return; // YouTube iframe handles its own play/pause via UI for now (or need API)

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;

        const time = audioRef.current.currentTime;
        setCurrentTime(time);

        // Save position every 15 seconds (throttled)
        // Spec says: POST /api/user/history, body: { podcastId, position }
        if (podcastId && Math.floor(time) % 15 === 0 && time > 0) {
            api.post('/user/history', {
                podcastId,
                position: Math.floor(time)
            }).catch(() => { });
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        if (isYouTube || !audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = percent * duration;
    };

    const handleVolumeChange = (e) => {
        if (isYouTube) return;
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isYouTube) return;
        if (isMuted) {
            if (audioRef.current) audioRef.current.volume = volume || 1;
            setIsMuted(false);
        } else {
            if (audioRef.current) audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!src) return null;

    if (isYouTube) {
        return (
            <div className="audio-player-container youtube-player">
                <iframe
                    width="100%"
                    height="200"
                    src={`${src}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <div className="audio-player-container">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="audio-controls">
                <button className="control-btn"><SkipBack size={20} /></button>
                <button className="control-btn play-pause-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                </button>
                <button className="control-btn"><SkipForward size={20} /></button>
            </div>

            <div className="progress-container">
                <span className="time-display">{formatTime(currentTime)}</span>
                <div className="progress-bar-wrapper" onClick={handleSeek}>
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>
                <span className="time-display">{formatTime(duration || 0)}</span>
            </div>

            <div className="volume-container">
                <button className="control-btn" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
