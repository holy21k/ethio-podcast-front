import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/onboarding.css';

const onboardingData = [
    {
        title: "Listen to the best",
        description: "Access thousands of Ethiopian podcasts. From daily news to deep cultural stories, we have it all.",
        icon: "🎙️"
    },
    {
        title: "Find your favorites",
        description: "Follow your favorite creators, create playlists, and discover new voices recommended just for you.",
        icon: "🔍"
    },
    {
        title: "Download & Subscribe",
        description: "Never miss an episode. Download for offline listening and get notified when new episodes drop.",
        icon: "💾"
    }
];

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            navigate('/login');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/entry');
        }
    };

    const currentData = onboardingData[currentStep];

    return (
        <div className="onboarding-container">
            <div className="onboarding-content" key={currentStep}>
                <div className="onboarding-illustration">
                    {currentData.icon}
                </div>

                <h2 className="onboarding-title">{currentData.title}</h2>
                <p className="onboarding-description">{currentData.description}</p>

                <div className="onboarding-dots">
                    {onboardingData.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentStep ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <div className="onboarding-actions">
                    <button className="btn-nav btn-back" onClick={handleBack}>
                        {currentStep === 0 ? 'Back' : 'Previous'}
                    </button>
                    <button className="btn-nav btn-next" onClick={handleNext}>
                        {currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
