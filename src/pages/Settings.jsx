import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft, Bell, Lock, Palette, Globe, HelpCircle, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Settings = () => {
    const navigate = useNavigate();

    const settingsSections = [
        {
            title: 'Notifications',
            icon: <Bell size={20} />,
            description: 'Manage notification preferences',
            path: '/settings/notifications'
        },
        {
            title: 'Privacy & Security',
            icon: <Lock size={20} />,
            description: 'Control your privacy settings',
            path: '/privacy'
        },
        {
            title: 'Appearance',
            icon: <Palette size={20} />,
            description: 'Customize app theme',
            path: '/settings/appearance'
        },
        {
            title: 'Language',
            icon: <Globe size={20} />,
            description: 'Change app language',
            path: '/settings/language'
        },
        {
            title: 'Help & Support',
            icon: <HelpCircle size={20} />,
            description: 'Get help and contact support',
            path: '/help'
        }
    ];

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
                    <SettingsIcon size={28} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                        Settings
                    </h1>
                </div>
            </div>

            {/* Settings List */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden'
            }}>
                {settingsSections.map((section, index) => (
                    <div key={index}>
                        <button
                            onClick={() => navigate(section.path)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.25rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ color: '#8b5cf6', marginRight: '1rem' }}>
                                {section.icon}
                            </span>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                                    {section.title}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#a8a8b8' }}>
                                    {section.description}
                                </div>
                            </div>
                            <ChevronRight size={18} color="#6b7280" />
                        </button>
                        {index < settingsSections.length - 1 && (
                            <div style={{
                                height: '1px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                margin: '0 1rem'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <Navbar />
        </div>
    );
};

export default Settings;
