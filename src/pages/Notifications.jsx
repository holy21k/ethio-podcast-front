import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Notifications = () => {
    const navigate = useNavigate();

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
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Bell size={28} color="#8b5cf6" />
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                            Notifications
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/settings/notifications')}
                        className="icon-btn"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Coming Soon State */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '1.5rem',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Bell size={48} color="#8b5cf6" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        Notifications Coming Soon
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#a8a8b8', maxWidth: '400px' }}>
                        Stay tuned! We're working on bringing you real-time notifications for new episodes, updates, and more.
                    </p>
                </div>
            </div>

            <Navbar />
        </div>
    );
};

export default Notifications;
