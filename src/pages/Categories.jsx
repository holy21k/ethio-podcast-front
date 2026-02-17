import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3x3, TrendingUp } from 'lucide-react';
import { getCategories } from '../api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const categoryIcons = {
    'Technology': '💻',
    'Business': '💼',
    'Education': '📚',
    'Entertainment': '🎬',
    'News': '📰',
    'Sports': '⚽',
    'Music': '🎵',
    'Comedy': '😂',
    'Health': '🏥',
    'Science': '🔬',
    'History': '📜',
    'Politics': '🏛️',
    'Culture': '🎭',
    'Arts': '🎨',
    'Food': '🍽️',
    'Travel': '✈️',
    'Gaming': '🎮',
    'Fashion': '👗',
    'Lifestyle': '🌟',
    'Religion': '🕌'
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategories();
                setCategories(response.categories || response.data?.categories || response.data || []);
            } catch (err) {
                console.error("Failed to load categories", err);
                setError("Could not load categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/discover?category=${encodeURIComponent(category)}`);
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading categories...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Grid3x3 size={28} color="#8b5cf6" />
                    <h1 className="section-title" style={{ fontSize: '1.75rem' }}>Categories</h1>
                </div>
                <p style={{ color: '#a8a8b8', fontSize: '0.95rem' }}>
                    Explore podcasts by topic
                </p>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="empty-state" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '1rem'
                }}>
                    <Grid3x3 size={64} color="#6b7280" style={{ opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', color: '#a8a8b8' }}>No categories available</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '1rem'
                }}>
                    {categories.map((category, index) => {
                        const icon = categoryIcons[category] || '🎙️';
                        return (
                            <div
                                key={index}
                                onClick={() => handleCategoryClick(category)}
                                style={{
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    borderRadius: '16px',
                                    padding: '2rem 1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ fontSize: '3rem' }}>{icon}</span>
                                <span style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    {category}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default Categories;
