import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-gradient-circle" />
      <div className="hero-container">
        <h1 className="hero-title">
          STORIES, DEBATES <span className="hero-mic">🎙️</span> AND<br />
          IDEAS FROM REAL VOICES.
        </h1>
        <p className="hero-subtitle">
          Listen to the best podcasts every day with<br />
          EthioPodcast now!
        </p>
        <div className="hero-actions">
          <button className="hero-btn-primary" onClick={() => navigate('/entry')}>
            Start Listening Now
          </button>
          <button className="hero-btn-secondary" onClick={() => navigate('/home')}>
            Explore Podcasts ▶
          </button>
        </div>
      </div>
    </section>
  );
}