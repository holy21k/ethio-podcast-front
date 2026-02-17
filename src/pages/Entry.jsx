import { useNavigate } from 'react-router-dom';
import '../styles/entry.css';

const Entry = () => {
    const navigate = useNavigate();

    return (
        <div className="entry-container">
            <div className="entry-header">
                <span className="entry-logo">EthioPodcast</span>
                <button className="entry-skip" onClick={() => navigate('/login')}>
                    Skip
                </button>
            </div>

            <div className="entry-content">
                <div className="entry-orb-container">
                    <div className="entry-orb-glow"></div>
                    <div className="entry-orb">
                        <div className="entry-orb-icon">🎙️</div>
                    </div>
                </div>

                <h1 className="entry-title">
                    Listen to the best<br />
                    Ethiopian podcasts every day with<br />
                    EthioPodcast now!
                </h1>

                <button className="entry-next-btn" onClick={() => navigate('/onboarding')}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Entry;
