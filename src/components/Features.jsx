export default function Features() {
  return (
    <section className="features" id="explore">
      <div className="container">
        <h2 style={{fontSize: '2rem', marginBottom: '40px'}}>Explore</h2>
        <div className="explore-grid">
          <div className="card">
            <h3>All Podcasts</h3>
            <p>Browse the complete collection of podcasts available on EthioPodcast.</p>
            {/* You can add a Globe SVG here */}
          </div>
          <div className="card">
            <h3>Categories</h3>
            <p>Explore podcasts organized by topic — culture, religion, and more.</p>
          </div>
          <div className="card">
            <h3>New Episodes</h3>
            <p>Catch the latest releases from podcasts you follow.</p>
          </div>
          <div className="card">
            <h3>Most Played</h3>
            <p>The podcasts and episodes listeners are playing most right now.</p>
          </div>
        </div>
      </div>
    </section>
  )
}