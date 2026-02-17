import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserInterests } from '../api/user';
import '../styles/security.css';

const INTERESTS = [
    { name: "History", icon: "📚" },
    { name: "Technology", icon: "💻" },
    { name: "Culture", icon: "🎭" },
    { name: "News", icon: "📰" },
    { name: "Business", icon: "💼" },
    { name: "Comedy", icon: "😂" },
    { name: "Music", icon: "🎵" },
    { name: "Sports", icon: "⚽" },
    { name: "Education", icon: "🎓" },
    { name: "Politics", icon: "🏛️" },
    { name: "Religion", icon: "🕌" },
    { name: "Society", icon: "👥" }
];

const SecuritySetup = () => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleInterest = (interestName) => {
        if (selectedInterests.includes(interestName)) {
            setSelectedInterests(prev => prev.filter(i => i !== interestName));
        } else {
            setSelectedInterests(prev => [...prev, interestName]);
        }
    };

    const handleFinish = async () => {
        try {
            setLoading(true);
            // Save interests to backend
            await updateUserInterests(selectedInterests);
            navigate('/home');
        } catch (error) {
            console.error('Failed to save interests:', error);
            // Still navigate even if save fails
            navigate('/home');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/home');
    };

    return (
        <div className="security-container">
            <div className="security-content">
                <div className="security-header">
                    <h2 className="security-title">Choose your interests</h2>
                    <p className="security-subtitle">
                        Select topics you're interested in to personalize your experience
                    </p>
                </div>

                <div className="interest-grid">
                    {INTERESTS.map(interest => (
                        <div
                            key={interest.name}
                            className={`interest-card ${selectedInterests.includes(interest.name) ? 'selected' : ''}`}
                            onClick={() => toggleInterest(interest.name)}
                        >
                            <div className="interest-icon">{interest.icon}</div>
                            <div className="interest-name">{interest.name}</div>
                        </div>
                    ))}
                </div>

                <div className="security-actions">
                    <button 
                        className="btn-skip" 
                        onClick={handleSkip}
                        disabled={loading}
                    >
                        Skip
                    </button>
                    <button 
                        className="btn-finish" 
                        onClick={handleFinish}
                        disabled={loading || selectedInterests.length === 0}
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecuritySetup;
