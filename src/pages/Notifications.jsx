import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';
import { getNotificationPreferences, updateNotificationPreferences } from '../api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const data = await getNotificationPreferences();
            console.log('Notification preferences:', data);
            
            // Handle different response structures
            let prefs = data;
            if (data.data) prefs = data.data;
            if (data.data && data.data.notifications) prefs = data.data.notifications;
            
            setPreferences(prefs);
        } catch (error) {
            console.error('Error loading notification preferences:', error);
            // Set default preferences if backend not available
            setPreferences({
                newPodcasts: true,
                channelUpdates: true,
                recommendations: true,
                email: true,
                push: true
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = async (key) => {
        try {
            const updated = { ...preferences, [key]: !preferences[key] };
            const response = await updateNotificationPreferences(updated);
            setPreferences(updated);
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            alert('Failed to update preferences. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate(-1)}
                    className="btn-back-nav"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#a8a8b8',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        padding: 0,
                        fontSize: '0.95rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Bell size={28} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                        Notifications
                    </h1>
                </div>
            </div>

            {/* Notification Preferences */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '1.5rem'
            }}>
                <NotificationToggle
                    label="New Podcasts"
                    description="Get notified when new episodes are available"
                    checked={preferences.newPodcasts}
                    onChange={() => togglePreference('newPodcasts')}
                />
                <Divider />
                <NotificationToggle
                    label="Channel Updates"
                    description="Updates from channels you follow"
                    checked={preferences.channelUpdates}
                    onChange={() => togglePreference('channelUpdates')}
                />
                <Divider />
                <NotificationToggle
                    label="Recommendations"
                    description="Personalized podcast recommendations"
                    checked={preferences.recommendations}
                    onChange={() => togglePreference('recommendations')}
                />
                <Divider />
                <NotificationToggle
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={preferences.email}
                    onChange={() => togglePreference('email')}
                />
                <Divider />
                <NotificationToggle
                    label="Push Notifications"
                    description="Receive push notifications on this device"
                    checked={preferences.push}
                    onChange={() => togglePreference('push')}
                />
            </div>

            <Navbar />
        </div>
    );
};

const NotificationToggle = ({ label, description, checked, onChange }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem'
    }}>
        <div style={{ flex: 1 }}>
            <div style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '0.25rem'
            }}>
                {label}
            </div>
            <div style={{
                fontSize: '0.85rem',
                color: '#a8a8b8'
            }}>
                {description}
            </div>
        </div>
        <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '52px',
            height: '28px',
            cursor: 'pointer'
        }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{ display: 'none' }}
            />
            <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: checked ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                transition: '0.3s',
                borderRadius: '28px'
            }}>
                <span style={{
                    position: 'absolute',
                    content: '',
                    height: '20px',
                    width: '20px',
                    left: checked ? '28px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                }} />
            </span>
        </label>
    </div>
);

const Divider = () => (
    <div style={{
        height: '1px',
        background: 'rgba(139, 92, 246, 0.1)',
        margin: '0 1rem'
    }} />
);

export default Notifications;
