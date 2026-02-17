import api from './config';

// Get home page data (trending, recent, yesterday's podcasts)
export const getHomeData = async () => {
    const response = await api.get('/home');
    return response.data;
};

// Discover/search podcasts with filters
export const discoverPodcasts = async ({ query, category, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await api.get(`/discover?${params.toString()}`);
    return response.data;
};

// Get all categories
export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

// Get podcasts by category
export const getPodcastsByCategory = async (categoryName) => {
    const response = await api.get(`/categories/${categoryName}/podcasts`);
    return response.data;
};

// Get single podcast details
export const getPodcastById = async (id) => {
    const response = await api.get(`/podcasts/${id}`);
    return response.data;
};

// Get player/streaming data
export const getPlayerData = async (id) => {
    const response = await api.get(`/player/${id}`);
    return response.data;
};

// Search podcasts
export const searchPodcasts = async (query, limit = 50) => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
};

// Get podcasts by channel/uploader
export const getPodcastsByChannel = async (channel, page = 1, limit = 20) => {
    const response = await api.get(`/channels/${channel}?page=${page}&limit=${limit}`);
    return response.data;
};

// Get platform stats
export const getStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

// Get suggested watchlist channels
export const getWatchlistChannels = async () => {
    const response = await api.get('/watchlist');
    return response.data;
};
