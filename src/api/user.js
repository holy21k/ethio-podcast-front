import api from './config';

// ============================================
// PROFILE
// ============================================

// Get user profile
export const getUserProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
};

// Update user interests
export const updateUserInterests = async (interests) => {
    const response = await api.post('/user/interests', { interests });
    return response.data;
};

// ============================================
// WATCHLIST
// ============================================

// Get user's watchlist
export const getWatchlist = async () => {
    const response = await api.get('/user/watchlist');
    return response.data;
};

// Add podcast to watchlist
export const addToWatchlist = async (podcastId, podcastData) => {
    const response = await api.post('/user/watchlist', {
        podcastId,
        podcastData
    });
    return response.data;
};

// Remove podcast from watchlist
export const removeFromWatchlist = async (podcastId) => {
    const response = await api.delete(`/user/watchlist/${podcastId}`);
    return response.data;
};

// ============================================
// LISTENING HISTORY
// ============================================

// Get listening history
export const getHistory = async (limit = 50) => {
    const response = await api.get(`/user/history?limit=${limit}`);
    return response.data;
};

// Add to listening history
export const addToHistory = async (podcastId, podcastData, position = 0) => {
    const response = await api.post('/user/history', {
        podcastId,
        podcastData,
        position
    });
    return response.data;
};

// Clear listening history
export const clearHistory = async () => {
    const response = await api.delete('/user/history');
    return response.data;
};

// ============================================
// PLAYBACK POSITION
// ============================================

// Get saved playback position for a podcast
export const getPlaybackPosition = async (podcastId) => {
    const response = await api.get(`/user/position/${podcastId}`);
    return response.data;
};

// Save playback position
export const savePlaybackPosition = async (podcastId, position) => {
    const response = await api.post(`/user/position/${podcastId}`, {
        position
    });
    return response.data;
};
