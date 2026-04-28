import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, Send, MessageSquare } from 'lucide-react';

import Navbar from '../components/Navbar';
import '../styles/home.css';

const Help = () => {
    const navigate = useNavigate();
    const [faq, setFaq] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [appInfo, setAppInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'general'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setFaq([
            { id: 1, question: 'How do I search for podcasts?', answer: 'Use the Search tab at the bottom to find podcasts by title or author.' },
            { id: 2, question: 'How do I save a podcast?', answer: 'Tap the bookmark icon on any podcast to save it to your Library.' },
            { id: 3, question: 'How do I change playback speed?', answer: 'Go to Settings and adjust the Playback Speed option.' },
            { id: 4, question: 'Where can I find my listening history?', answer: 'Your listening history is available in the History section from the navigation bar.' },
        ]);
        setAppInfo({ appName: 'EthioPodcast', version: '2.0.0' });
        setLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Support request submitted successfully!');
        setFormData({ subject: '', message: '', category: 'general' });
        setShowContactForm(false);
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
                    <HelpCircle size={28} color="#8b5cf6" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                        Help & Support
                    </h1>
                </div>
            </div>

            {/* FAQ Section */}
            {faq.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}>
                        {faq.map((item, index) => (
                            <div key={item.id || index}>
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: 'white'
                                    }}
                                >
                                    <span style={{ fontSize: '0.95rem', fontWeight: '600', flex: 1 }}>
                                        {item.question}
                                    </span>
                                    {expandedFaq === index ? (
                                        <ChevronUp size={20} color="#8b5cf6" />
                                    ) : (
                                        <ChevronDown size={20} color="#8b5cf6" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div style={{
                                        padding: '0 1.5rem 1.25rem 1.5rem',
                                        fontSize: '0.9rem',
                                        color: '#a8a8b8',
                                        lineHeight: '1.6'
                                    }}>
                                        {item.answer}
                                    </div>
                                )}
                                {index < faq.length - 1 && (
                                    <div style={{
                                        height: '1px',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        margin: '0 1rem'
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Your Tickets */}
            {tickets.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                        Your Support Tickets
                    </h2>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '20px',
                        padding: '1rem'
                    }}>
                        {tickets.map((ticket, index) => (
                            <div key={ticket.id || index} style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '12px',
                                marginBottom: index < tickets.length - 1 ? '0.75rem' : 0
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '0.5rem'
                                }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'white', margin: 0 }}>
                                        {ticket.subject}
                                    </h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        background: ticket.status === 'open' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                                        color: ticket.status === 'open' ? '#fbbf24' : '#4ade80'
                                    }}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#a8a8b8', margin: 0 }}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Form */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setShowContactForm(!showContactForm)}
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
                        cursor: 'pointer',
                        marginBottom: showContactForm ? '1rem' : 0
                    }}
                >
                    <MessageSquare size={20} />
                    <span>{showContactForm ? 'Cancel' : 'Contact Support'}</span>
                </button>

                {showContactForm && (
                    <form onSubmit={handleSubmit} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(139, 92, 246, 0.15)',
                        borderRadius: '20px',
                        padding: '1.5rem'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="Brief description of your issue"
                                required
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1rem',
                                    color: 'white',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1rem',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="general">General</option>
                                <option value="technical">Technical Issue</option>
                                <option value="account">Account</option>
                                <option value="billing">Billing</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                Message
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue in detail..."
                                rows={5}
                                required
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '12px',
                                    padding: '0.75rem 1rem',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                background: '#8b5cf6',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1
                            }}
                        >
                            <Send size={18} />
                            <span>{submitting ? 'Sending...' : 'Submit Request'}</span>
                        </button>
                    </form>
                )}
            </div>

            {/* App Info */}
            {appInfo && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                        {appInfo.appName || 'Ethiopodcasts'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#a8a8b8', marginBottom: '0.5rem' }}>
                        Version {appInfo.version || '2.0.0'}
                    </p>
                    {appInfo.contact && (
                        <p style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>
                            {appInfo.contact.email}
                        </p>
                    )}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default Help;
