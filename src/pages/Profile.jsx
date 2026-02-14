import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                setProfile(response.data.data || response.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                // Fallback to local storage user if API fails
                const localUser = localStorage.getItem('user');
                if (localUser) {
                    setProfile(JSON.parse(localUser));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div className="home-container">Loading...</div>;

    return (
        <div className="home-container pb-24">
            <div className="flex flex-col items-center mt-8 mb-12">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-4 text-4xl border-4 border-purple-400/30">
                    {profile?.avatar ? <img src={profile.avatar} className="w-full h-full rounded-full object-cover" /> : '👤'}
                </div>
                <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
                <p className="text-gray-400">{profile?.email}</p>
            </div>

            <div className="bg-[#1b0c2d] rounded-2xl p-4 space-y-2">
                <button className="w-full flex items-center p-4 rounded-xl hover:bg-white/5 transition">
                    <User className="mr-4 text-purple-400" />
                    <span className="flex-1 text-left">Edit Profile</span>
                    <span className="text-gray-500">→</span>
                </button>
                <button className="w-full flex items-center p-4 rounded-xl hover:bg-white/5 transition">
                    <Settings className="mr-4 text-purple-400" />
                    <span className="flex-1 text-left">Settings</span>
                    <span className="text-gray-500">→</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-4 rounded-xl hover:bg-red-500/10 text-red-400 transition mt-4"
                >
                    <LogOut className="mr-4" />
                    <span className="flex-1 text-left">Log Out</span>
                </button>
            </div>

            <Navbar />
        </div>
    );
};
export default Profile;
