import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getSecurityInfo, sendEmailVerification, getPrivacySettings, updatePrivacySettings } from '../api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Privacy = () => {
    const navigate = useNavigate();
    const [security, setSecurity] = useState(null);
    const [privacy, setPrivacy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sendingVerification, setSendingVerification] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [securityData, privacyData] = await Promise.all([
                getSecurityInfo().catch(() => ({
                    emailVerified: false,
                    lastSignIn: new Date().toISOString(),
                    twoFactorEnabled: false,
                    lastPasswordChange: null
                })),
                getPrivacySettings().catch(() => ({
                    profileVisibility: 'public',
                    showHistory: false,
                    showWatchlist: false,
                    allowRecommendations: true
                }))
            ]);

            // Handle different response structures
            let sec = securityData;
            if (securityData.data) sec = securityData.data;
            if (securityData.data && securityData.data.security) sec = securityData.data.security;

            let priv = privacyData;
            if (privacyData.data) priv = privacyData.data;
            if (privacyData.data && privacyData.data.privacy) priv = privacyData.data.privacy;

            setSecurity(sec);
            setPrivacy(priv);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async () => {
        try {
            setSendingVerification(true);
            await sendEmailVerification();
            alert('Verification email sent! Please check your inbox.');
        } catch (error) {
            console.error('Error sending verification:', error);
            alert('Failed to send verification email. Please try again.');
        } finally {
            setSendingVerification(false);
        }
    };

    const togglePrivacySetting = async (key) => {
        try {
            const updated = { ...privacy, [key]: !privacy[key] };
            const response = await updatePrivacySettings(updated);
            setPrivacy(updated);
        } catch (error) {
            console.error('Error updating privacy settings:', error);
            alert('Failed to update privacy settings. Please try again.');
        }
    };

    const updateProfileVisibility = async (visibility) => {
        try {
            const updated = { ...privacy, profileVisibility: visibility };
            const response = await updatePrivacySettings(updated);
            setPrivacy(updated);
        } catch (error) {
            console.error('Error updating profile visibility:', error);
            alert('Failed to update profile visibility. Please try again.');
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield size={28} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                        Privacy & Security
                    </h1>
                </div>
            </div>

            {/* Security Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                    Security
                </h2>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}>
                    {/* Email Verification */}
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={20} color="#8b5cf6" />
                                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white' }}>
                                    Email Verification
                                </span>
                            </div>
                            {security.emailVerified ? (
                                <CheckCircle size={20} color="#4ade80" />
                            ) : (
                                <AlertCircle size={20} color="#fbbf24" />
                            )}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#a8a8b8', marginBottom: '0.75rem' }}>
                            {security.emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                        </p>
                        {!security.emailVerified && (
                            <button
                                onClick={handleSendVerification}
                                disabled={sendingVerification}
                                style={{
                                    background: '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: sendingVerification ? 'not-allowed' : 'pointer',
                                    opacity: sendingVerification ? 0.6 : 1
                                }}
                            >
                                {sendingVerification ? 'Sending...' : 'Send Verification Email'}
                            </button>
                        )}
                    </div>

                    <Divider />

                    {/* Last Sign In */}
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Lock size={20} color="#8b5cf6" />
                            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white' }}>
                                Last Sign In
                            </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#a8a8b8' }}>
                            {new Date(security.lastSignIn).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                    Privacy Settings
                </h2>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}>
                    {/* Profile Visibility */}
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                                Profile Visibility
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#a8a8b8' }}>
                                Control who can see your profile
                            </div>
                        </div>
                        <select
                            value={privacy.profileVisibility}
                            onChange={(e) => updateProfileVisibility(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                color: 'white',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <Divider />

                    {/* Show History */}
                    <PrivacyToggle
                        label="Show Listening History"
                        description="Allow others to see what you've listened to"
                        checked={privacy.showHistory}
                        onChange={() => togglePrivacySetting('showHistory')}
                    />

                    <Divider />

                    {/* Show Watchlist */}
                    <PrivacyToggle
                        label="Show Watchlist"
                        description="Allow others to see your saved podcasts"
                        checked={privacy.showWatchlist}
                        onChange={() => togglePrivacySetting('showWatchlist')}
                    />

                    <Divider />

                    {/* Allow Recommendations */}
                    <PrivacyToggle
                        label="Personalized Recommendations"
                        description="Use your activity to suggest podcasts"
                        checked={privacy.allowRecommendations}
                        onChange={() => togglePrivacySetting('allowRecommendations')}
                    />
                </div>
            </div>

            <Navbar />
        </div>
    );
};

const PrivacyToggle = ({ label, description, checked, onChange }) => (
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

export default Privacy;
