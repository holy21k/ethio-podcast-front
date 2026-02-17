import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/onboarding.css';

const onboardingData = [
    {
        title: "Listen to the best",
        description: "Access thousands of Ethiopian podcasts every day with EthioPodcast now!",
        icon: "🎙️"
    },
    {
        title: "Find your favorites",
        description: "Follow your favorite creators and discover new voices recommended just for you.",
        icon: "💡"
    },
    {
        title: "Download & Subscribe",
        description: "Never miss an episode. Download for offline listening and get notified when new episodes drop.",
        icon: "❤️"
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

    const currentData = onboardingData[currentStep];

    return (
        <div className="onboarding-container">
            <div className="onboarding-content">
                <div className="onboarding-orb-container">
                    <div className="onboarding-orb-glow"></div>
                    <div className="onboarding-orb">
                        <div className="onboarding-orb-icon">{currentData.icon}</div>
                    </div>
                </div>

                <h2 className="onboarding-title">{currentData.title}</h2>
                <p className="onboarding-description">{currentData.description}</p>

                <div className="onboarding-dots">
                    {onboardingData.map((_, index) => (
                        <div
                            key={index}
                            className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <button className="onboarding-next-btn" onClick={handleNext}>
                    {currentStep === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
