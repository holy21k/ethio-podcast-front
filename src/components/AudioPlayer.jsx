import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';
import { getPodcastById } from '../api/podcasts';
import '../styles/audioplayer.css';

const AudioPlayer = ({ podcastId }) => {
    const playerRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const playerContainerRef = useRef(null);
    const wakeLockRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [podcast, setPodcast] = useState(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(100);
    const [showSettings, setShowSettings] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [currentSource, setCurrentSource] = useState(null); // 'audio' or 'youtube'

    // Setup MediaSession API for lock screen controls and screen-off playback
    useEffect(() => {
        if (!('mediaSession' in navigator) || !podcast) return;

        const handlePlay = () => {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
            }
        };

        const handlePause = () => {
            if (playerRef.current && playerRef.current.pauseVideo) {
                playerRef.current.pauseVideo();
            }
        };

        const handleSeekBackward = () => {
            if (playerRef.current && playerRef.current.seekTo && playerRef.current.getCurrentTime) {
                const newTime = Math.max(0, playerRef.current.getCurrentTime() - 10);
                playerRef.current.seekTo(newTime, true);
            }
        };

        const handleSeekForward = () => {
            if (playerRef.current && playerRef.current.seekTo && playerRef.current.getCurrentTime) {
                const newTime = playerRef.current.getCurrentTime() + 10;
                playerRef.current.seekTo(newTime, true);
            }
        };

        const handleSeekTo = (details) => {
            if (details.seekTime !== undefined && playerRef.current && playerRef.current.seekTo) {
                playerRef.current.seekTo(details.seekTime, true);
            }
        };

        // Set metadata for lock screen
        navigator.mediaSession.metadata = new MediaMetadata({
            title: podcast.title || podcast.display_title || 'Unknown',
            artist: podcast.uploader || podcast.channel || 'Unknown',
            album: 'EthioPodcast',
            artwork: [
                { 
                    src: podcast.thumbnail || `https://img.youtube.com/vi/${podcast.youtube_id || podcast.id}/maxresdefault.jpg`,
                    sizes: '512x512',
                    type: 'image/jpeg'
                }
            ]
        });

        // Set up action handlers for lock screen controls
        navigator.mediaSession.setActionHandler('play', handlePlay);
        navigator.mediaSession.setActionHandler('pause', handlePause);
        navigator.mediaSession.setActionHandler('seekbackward', handleSeekBackward);
        navigator.mediaSession.setActionHandler('seekforward', handleSeekForward);
        navigator.mediaSession.setActionHandler('seekto', handleSeekTo);

        return () => {
            // Clean up media session
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = null;
                navigator.mediaSession.setActionHandler('play', null);
                navigator.mediaSession.setActionHandler('pause', null);
                navigator.mediaSession.setActionHandler('seekbackward', null);
                navigator.mediaSession.setActionHandler('seekforward', null);
                navigator.mediaSession.setActionHandler('seekto', null);
            }
        };
    }, [podcast]);

    // Update MediaSession position state
    const updateMediaSessionPosition = () => {
        if ('mediaSession' in navigator && duration > 0) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: duration,
                    playbackRate: playbackRate,
                    position: currentTime
                });
            } catch {
                // Silently ignore - not critical
            }
        }
    };

    // Update position state when time changes
    useEffect(() => {
        updateMediaSessionPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, duration, playbackRate]);

    // Wake Lock API - Keep screen on during playback
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator && !wakeLockRef.current) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake lock acquired');
                
                wakeLockRef.current.addEventListener('release', () => {
                    console.log('Wake lock released');
                    wakeLockRef.current = null;
                });
            }
        } catch (err) {
            console.log('Wake lock error:', err);
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
            } catch (err) {
                console.log('Wake lock release error:', err);
            }
        }
    };

    // Request wake lock when playing starts
    useEffect(() => {
        if (isPlaying) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        return () => {
            releaseWakeLock();
        };
    }, [isPlaying]);

    // Load YouTube IFrame API
    useEffect(() => {
        // Check if API is already loaded
        if (window.YT && window.YT.Player) {
            console.log('YouTube API already loaded');
            return;
        }

        // Check if script is already added
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            console.log('YouTube API script already added, waiting for load...');
            return;
        }

        console.log('Loading YouTube API...');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube API loaded and ready');
        };
    }, []);

    // Load podcast data
    useEffect(() => {
        if (!podcastId) return;
        
        getPodcastById(podcastId)
            .then(response => {
                let data = response;
                if (response.data) data = response.data;
                if (response.status === 'success' && response.data) data = response.data;
                console.log('Loaded podcast:', data);
                setPodcast(data);
            })
            .catch(err => console.error('Failed to load podcast:', err));
    }, [podcastId]);

    // Progress tracking functions
    const startProgressTracking = () => {
        stopProgressTracking();
        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                try {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                    
                    // Update MediaSession position
                    if ('mediaSession' in navigator && duration > 0) {
                        try {
                            navigator.mediaSession.setPositionState({
                                duration: duration,
                                playbackRate: playbackRate,
                                position: time
                            });
                        } catch {
                            // Silently ignore
                        }
                    }
                } catch (err) {
                    console.error('Error getting current time:', err);
                }
            }
        }, 100);
    };

    const stopProgressTracking = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    // Initialize YouTube player when podcast is loaded
    useEffect(() => {
        if (!podcast) {
            return;
        }

        const videoId = podcast.youtube_id || podcast.id;
        if (!videoId) {
            console.error('No video ID found');
            return;
        }

        // Wait for YouTube API to be ready
        const initPlayer = () => {
            if (playerRef.current) {
                console.log('Player already exists');
                return;
            }

            if (!window.YT || !window.YT.Player) {
                console.log('YouTube API not ready yet, waiting...');
                setTimeout(initPlayer, 100);
                return;
            }

            console.log('Initializing player with video ID:', videoId);

            // Create unique container ID
            const containerId = 'youtube-audio-player-' + Date.now();
            if (playerContainerRef.current) {
                playerContainerRef.current.id = containerId;
            }

            try {
                new window.YT.Player(containerId, {
                    height: '1',
                    width: '1',
                    videoId: videoId,
                    playerVars: {
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        modestbranding: 1,
                        rel: 0,
                        autoplay: 0,
                        playsinline: 1,
                        enablejsapi: 1
                    },
                    events: {
                        onReady: (event) => {
                            console.log('Player ready');
                            playerRef.current = event.target;
                            setPlayerReady(true);
                            const dur = event.target.getDuration();
                            setDuration(dur);
                            console.log('Duration:', dur);
                            
                            // Set initial volume
                            event.target.setVolume(volume);
                        },
                        onStateChange: (event) => {
                            console.log('Player state:', event.data);
                            if (event.data === 1) { // Playing
                                setIsPlaying(true);
                                startProgressTracking();
                                
                                // Update MediaSession
                                if ('mediaSession' in navigator) {
                                    navigator.mediaSession.playbackState = 'playing';
                                }
                            } else if (event.data === 2) { // Paused
                                setIsPlaying(false);
                                stopProgressTracking();
                                
                                // Update MediaSession
                                if ('mediaSession' in navigator) {
                                    navigator.mediaSession.playbackState = 'paused';
                                }
                            } else if (event.data === 0) { // Ended
                                setIsPlaying(false);
                                stopProgressTracking();
                                setCurrentTime(0);
                                
                                // Update MediaSession
                                if ('mediaSession' in navigator) {
                                    navigator.mediaSession.playbackState = 'paused';
                                }
                            }
                        },
                        onError: (event) => {
                            console.error('Player error:', event.data);
                        }
                    }
                });
            } catch (err) {
                console.error('Failed to create player:', err);
            }
        };

        // Start initialization
        initPlayer();

        return () => {
            stopProgressTracking();
            if (playerRef.current && playerRef.current.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (err) {
                    console.log('Error destroying player:', err);
                }
                playerRef.current = null;
            }
            setPlayerReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [podcast]);

    const togglePlay = () => {
        if (!playerRef.current || !playerReady) {
            console.log('Player not ready');
            return;
        }
        
        try {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        } catch (err) {
            console.error('Error toggling play:', err);
        }
    };

    const skip = (seconds) => {
        if (!playerRef.current || !playerReady) return;
        
        try {
            const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
        } catch (err) {
            console.error('Error skipping:', err);
        }
    };

    const handleSeek = (e) => {
        if (!playerRef.current || !playerReady || !duration) return;
        
        try {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
        } catch (err) {
            console.error('Error seeking:', err);
        }
    };

    const changeSpeed = (speed) => {
        if (!playerRef.current || !playerReady) return;
        
        try {
            playerRef.current.setPlaybackRate(speed);
            setPlaybackRate(speed);
        } catch (err) {
            console.error('Error changing speed:', err);
        }
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
        if (playerRef.current && playerReady) {
            try {
                playerRef.current.setVolume(newVolume);
            } catch (err) {
                console.error('Error changing volume:', err);
            }
        }
    };

    const toggleMute = () => {
        if (volume > 0) {
            changeVolume(0);
        } else {
            changeVolume(100);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!podcast) {
        return null;
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="audio-player-wrapper">
            {/* Hidden YouTube Player */}
            <div className="hidden-youtube-player">
                <div ref={playerContainerRef}></div>
            </div>
            
            {/* Audio Player UI */}
            <div className="audio-player-container">
                <div className="player-main">
                    {/* Top Row: Album Art + Info + Controls */}
                    <div className="player-top-row">
                        {/* Album Art */}
                        <div className="player-album-art">
                            <img 
                                src={podcast.thumbnail || `https://img.youtube.com/vi/${podcast.youtube_id || podcast.id}/mqdefault.jpg`} 
                                alt={podcast.title}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60/8b5cf6/ffffff?text=Audio';
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div className="player-info">
                            <h3 className="player-title">{podcast.title || podcast.display_title || 'Untitled'}</h3>
                            <p className="player-channel">{podcast.uploader || podcast.channel || 'Unknown Channel'}</p>
                        </div>

                        {/* Controls */}
                        <div className="player-controls">
                            <button 
                                className="control-btn" 
                                onClick={() => skip(-10)} 
                                title="Rewind 10 seconds"
                                disabled={!playerReady}
                            >
                                <SkipBack size={20} />
                            </button>
                            
                            <button 
                                className="control-btn play-btn" 
                                onClick={togglePlay} 
                                title={isPlaying ? "Pause" : "Play"}
                                disabled={!playerReady}
                            >
                                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                            </button>
                            
                            <button 
                                className="control-btn" 
                                onClick={() => skip(10)} 
                                title="Forward 10 seconds"
                                disabled={!playerReady}
                            >
                                <SkipForward size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar Row */}
                    <div className="player-progress-section">
                        <span className="time-label">{formatTime(currentTime)}</span>
                        <div 
                            className="progress-bar" 
                            onClick={handleSeek}
                            style={{ cursor: playerReady ? 'pointer' : 'not-allowed' }}
                        >
                            <div className="waveform-background">
                                {/* Generate waveform bars */}
                                {Array.from({ length: 100 }).map((_, i) => {
                                    const height = Math.random() * 60 + 20; // Random height between 20-80%
                                    const isPassed = (i / 100) * 100 <= progress;
                                    return (
                                        <div 
                                            key={i} 
                                            className={`waveform-bar ${isPassed ? 'passed' : ''}`}
                                            style={{ height: `${height}%` }}
                                        />
                                    );
                                })}
                            </div>
                            <div className="progress-fill" style={{ width: `${progress}%` }}>
                                <div className="progress-handle"></div>
                            </div>
                        </div>
                        <span className="time-label">{formatTime(duration)}</span>
                    </div>

                    {/* Bottom Row: Volume & Settings */}
                    <div className="player-bottom-row">
                        <div className="player-extras">
                            <div className="volume-control">
                                <button 
                                    className="control-btn" 
                                    onClick={toggleMute}
                                    title={volume > 0 ? "Mute" : "Unmute"}
                                >
                                    {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => changeVolume(parseInt(e.target.value))}
                                    className="volume-slider"
                                    title="Volume"
                                />
                            </div>

                            {/* Speed Settings */}
                            <div className="settings-control">
                                <button 
                                    className="control-btn" 
                                    onClick={() => setShowSettings(!showSettings)}
                                    title="Playback speed"
                                >
                                    <Settings size={20} />
                                </button>
                                {showSettings && (
                                    <div className="settings-menu">
                                        <div className="settings-label">Playback Speed</div>
                                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                                            <button
                                                key={speed}
                                                className={`settings-option ${playbackRate === speed ? 'active' : ''}`}
                                                onClick={() => {
                                                    changeSpeed(speed);
                                                    setShowSettings(false);
                                                }}
                                            >
                                                {speed}x {speed === 1 ? '(Normal)' : ''}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
