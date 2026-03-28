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

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

// Delete user account
export const deleteUserAccount = async () => {
    const response = await api.delete('/user/profile');
    return response.data;
};

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

// Get notification preferences
export const getNotificationPreferences = async () => {
    const response = await api.get('/user/notifications');
    return response.data;
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences) => {
    const response = await api.put('/user/notifications', preferences);
    return response.data;
};

// ============================================
// APP SETTINGS
// ============================================

// Get user settings
export const getUserSettings = async () => {
    const response = await api.get('/user/settings');
    return response.data;
};

// Update user settings
export const updateUserSettings = async (settings) => {
    const response = await api.put('/user/settings', settings);
    return response.data;
};

// ============================================
// PRIVACY & SECURITY
// ============================================

// Get privacy settings
export const getPrivacySettings = async () => {
    const response = await api.get('/user/privacy');
    return response.data;
};

// Update privacy settings
export const updatePrivacySettings = async (privacy) => {
    const response = await api.put('/user/privacy', privacy);
    return response.data;
};

// Get security information
export const getSecurityInfo = async () => {
    const response = await api.get('/user/security');
    return response.data;
};

// Send email verification
export const sendEmailVerification = async () => {
    const response = await api.post('/user/security/verify-email');
    return response.data;
};

// ============================================
// SEARCH HISTORY
// ============================================

// Get search history
export const getSearchHistory = async (limit = 10) => {
    const response = await api.get(`/user/search-history?limit=${limit}`);
    return response.data;
};

// Add to search history
export const addToSearchHistory = async (query, results = 0) => {
    const response = await api.post('/user/search-history', {
        query,
        results
    });
    return response.data;
};

// Clear search history
export const clearSearchHistory = async () => {
    const response = await api.delete('/user/search-history');
    return response.data;
};

// ============================================
// HELP & SUPPORT
// ============================================

// Get FAQ (no auth required)
export const getFAQ = async () => {
    const response = await api.get('/support/faq');
    return response.data;
};

// Submit support request
export const submitSupportRequest = async (ticketData) => {
    const response = await api.post('/support/contact', ticketData);
    return response.data;
};

// Get user's support tickets
export const getSupportTickets = async () => {
    const response = await api.get('/support/tickets');
    return response.data;
};

// Get app information (no auth required)
export const getAppInfo = async () => {
    const response = await api.get('/support/about');
    return response.data;
};
