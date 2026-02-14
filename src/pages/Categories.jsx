import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import '../styles/home.css'; // Reusing common grid styles

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // api.get('/categories')
                const response = await api.get('/categories');
                setCategories(response.data.data || response.data);
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        // Navigate to category detail (needs route update if not handled by Discover logic)
        // User spec says: Click category: GET /api/categories/:name/podcasts
        // So we probably need a page for this. 
        // For now, let's navigate to /discover?category=NAME or a dedicated route
        navigate(`/discover?category=${category}`);
    };

    return (
        <div className="home-container pb-24">
            <h1 className="text-2xl font-bold mb-6">Categories</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-purple-900/40 p-6 rounded-xl border border-purple-500/20 text-center cursor-pointer hover:bg-purple-800/60 transition"
                        >
                            <span className="text-lg font-semibold">{cat}</span>
                        </div>
                    ))}
                </div>
            )}
            <Navbar />
        </div>
    );
};
export default Categories;
