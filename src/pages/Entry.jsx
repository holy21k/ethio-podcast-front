import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/entry.css';

const Entry = () => {
    const navigate = useNavigate();

    return (
        <div className="entry-container">
            <div className="entry-illustration-placeholder">
                🎧
            </div>

            <h1 className="entry-title">EthioPodcast</h1>

            <p className="entry-description">
                Listen to the best Ethiopian podcasts.
                Discover voices, stories, and ideas that matter to you.
            </p>

            <button
                className="entry-next-btn"
                onClick={() => navigate('/onboarding')}
            >
                Next
            </button>
        </div>
    );
};

export default Entry;
