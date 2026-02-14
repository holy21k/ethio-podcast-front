import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/security.css';

const INTERESTS = [
    "History", "Tech", "Culture", "News", "Business",
    "Comedy", "Music", "Sports", "Education"
];

const SecuritySetup = () => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(prev => prev.filter(i => i !== interest));
        } else {
            setSelectedInterests(prev => [...prev, interest]);
        }
    };

    const handleFinish = () => {
        // Navigate to Home after setup
        navigate('/home');
    };

    return (
        <div className="security-container">
            <div className="security-content">
                <div className="security-icon">🛡️</div>

                <h2 className="security-title">Personalize Experience</h2>
                <p className="security-subtitle">Select topics you are interested in</p>

                <div className="interest-grid">
                    {INTERESTS.map(interest => (
                        <div
                            key={interest}
                            className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
                        </div>
                    ))}
                </div>

                <button className="btn-finish" onClick={handleFinish}>
                    Finish Setup
                </button>
            </div>
        </div>
    );
};

export default SecuritySetup;
