import { Link } from 'react-router-dom';

export default function LandingNavbar() {
  return (
    <nav className="landing-navbar">
      <div className="landing-nav-container">
        <Link to="/" className="landing-logo">
          EthioPodcast
        </Link>
        
        <div className="landing-nav-links">
          <a href="#explore" className="landing-nav-link">Podcast</a>
          <a href="#about" className="landing-nav-link">About</a>
        </div>
        
        <Link to="/entry" className="landing-nav-btn">
          Get Started ▶
        </Link>
      </div>
    </nav>
  );
}
