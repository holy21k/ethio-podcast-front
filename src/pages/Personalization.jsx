import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const Personalization = () => {
    const navigate = useNavigate();

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
                    <Sparkles size={28} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                        Personalization
                    </h1>
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
                    <Sparkles size={48} color="#8b5cf6" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        Personalization Coming Soon
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#a8a8b8', maxWidth: '400px' }}>
                        We're building smart recommendations and personalized content just for you. Stay tuned!
                    </p>
                </div>
            </div>

            <Navbar />
        </div>
    );
};

export default Personalization;
