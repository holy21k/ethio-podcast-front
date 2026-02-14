export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-row">
        <div className="nav-left">EthioPodcast</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#explore">Explore</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <button className="cta-btn">Start Listening →</button>
      </div>
    </nav>
  )
}