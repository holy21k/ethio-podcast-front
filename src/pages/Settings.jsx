import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft, Save } from 'lucide-react';
import { getUserSettings, updateUserSettings } from '../api';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        language: 'en',
        theme: 'dark',
        autoplay: true,
        playbackSpeed: 1.0,
        quality: 'auto',
        dataUsage: 'standard'
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await getUserSettings();
            const settingsData =
                response?.data?.settings ||
                response?.data ||
                response;

            setSettings({
                language: settingsData.language || 'en',
                theme: settingsData.theme || 'dark',
                autoplay: settingsData.autoplay !== false,
                playbackSpeed: settingsData.playbackSpeed || 1.0,
                quality: settingsData.quality || 'auto',
                dataUsage: settingsData.dataUsage || 'standard'
            });
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateUserSettings(settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
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
                        App Settings
                    </h1>
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '20px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Language
                    </label>
                    <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <option value="en">English</option>
                        <option value="am">አማርኛ (Amharic)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Theme
                    </label>
                    <select
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '1.5rem', padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px'
                }}>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                            Autoplay Next Episode
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#a8a8b8' }}>
                            Automatically play the next episode
                        </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={settings.autoplay}
                            onChange={(e) => updateSetting('autoplay', e.target.checked)}
                            style={{ display: 'none' }}
                        />
                        <span style={{
                            position: 'absolute', cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: settings.autoplay ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                            transition: '0.3s', borderRadius: '28px'
                        }}>
                            <span style={{
                                position: 'absolute', height: '20px', width: '20px',
                                left: settings.autoplay ? '28px' : '4px', bottom: '4px',
                                background: 'white', transition: '0.3s', borderRadius: '50%'
                            }} />
                        </span>
                    </label>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Playback Speed
                    </label>
                    <select
                        value={settings.playbackSpeed}
                        onChange={(e) => updateSetting('playbackSpeed', parseFloat(e.target.value))}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0">1.0x (Normal)</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2.0">2.0x</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Video Quality
                    </label>
                    <select
                        value={settings.quality}
                        onChange={(e) => updateSetting('quality', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <option value="auto">Auto</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        Data Usage
                    </label>
                    <select
                        value={settings.dataUsage}
                        onChange={(e) => updateSetting('dataUsage', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        <option value="low">Low</option>
                        <option value="standard">Standard</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
                }}
            >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>

            <Navbar />
        </div>
    );
};

export default Settings;