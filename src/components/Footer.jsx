import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-copyright">© 2024 Ethiopodcast. All rights reserved</p>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
