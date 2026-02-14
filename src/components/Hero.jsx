import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-rings" />
      <div className="container">
        <h1>STORIES, DEBATES 🎙️ AND IDEAS FROM REAL VOICES.</h1>
        <p>Listen to the best podcasts every day with EthioPodcast now!</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => navigate('/entry')}>Start Listening →</button>
          <button className="secondary-btn">Explore Podcasts ▶</button>
        </div>
      </div>
    </section>
  )
}