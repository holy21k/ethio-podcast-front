import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Edit2 } from 'lucide-react';
import { getUserProfile } from '../api';
import { auth } from '../services/firebase';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Get Firebase user first
                const currentUser = auth.currentUser;
                if (currentUser) {
                    setProfile({
                        name: currentUser.displayName || 'User',
                        email: currentUser.email,
                        avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=8b5cf6&color=fff&size=256`
                    });
                }

                // Try to get additional profile data from backend
                const response = await getUserProfile();
                if (response) {
                    setProfile(prev => ({
                        ...prev,
                        ...response
                    }));
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
            // Force logout anyway
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Profile Header */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem 0',
                marginBottom: '2rem',
                position: 'relative'
            }}>
                <div style={{
                    position: 'relative',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #8b5cf6',
                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
                        background: 'rgba(139, 92, 246, 0.1)'
                    }}>
                        <img 
                            src={profile?.avatar} 
                            alt={profile?.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <button
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#8b5cf6',
                            border: '3px solid #0a0a1f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#7c3aed'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#8b5cf6'}
                    >
                        <Edit2 size={16} color="white" />
                    </button>
                </div>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '0.25rem'
                }}>
                    {profile?.name || 'User'}
                </h1>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#a8a8b8'
                }}>
                    {profile?.email}
                </p>
            </div>

            {/* Menu Items */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '1.5rem'
            }}>
                <MenuItem
                    icon={<User size={20} />}
                    label="Edit Profile"
                    onClick={() => navigate('/profile/edit')}
                />
                <Divider />
                <MenuItem
                    icon={<Bell size={20} />}
                    label="Notifications"
                    onClick={() => navigate('/notifications')}
                />
                <Divider />
                <MenuItem
                    icon={<Settings size={20} />}
                    label="Settings"
                    onClick={() => navigate('/settings')}
                />
                <Divider />
                <MenuItem
                    icon={<Shield size={20} />}
                    label="Privacy & Security"
                    onClick={() => navigate('/privacy')}
                />
                <Divider />
                <MenuItem
                    icon={<HelpCircle size={20} />}
                    label="Help & Support"
                    onClick={() => navigate('/help')}
                />
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                style={{
                    width: '100%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    color: '#ef4444',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
            >
                <LogOut size={20} />
                <span>Log Out</span>
            </button>

            <Navbar />
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
    >
        <span style={{ color: '#8b5cf6', marginRight: '1rem' }}>{icon}</span>
        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        <ChevronRight size={18} color="#6b7280" />
    </button>
);

const Divider = () => (
    <div style={{
        height: '1px',
        background: 'rgba(139, 92, 246, 0.1)',
        margin: '0 1rem'
    }} />
);

export default Profile;
