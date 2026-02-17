export default function Features() {
  return (
    <section className="explore-section" id="explore">
      <div className="explore-container">
        <h2 className="explore-title">Explore</h2>
        <div className="explore-grid">
          
          {/* All Podcasts Card */}
          <div className="explore-card">
            <div className="explore-card-header">
              <h3 className="explore-card-title">All Podcasts</h3>
              <p className="explore-card-description">
                Browse the complete collection of podcasts available on EthioPodcast.
              </p>
            </div>
            <div className="explore-card-visual">
              <div className="globe-wireframe">
                <div className="globe-ring globe-ring-1"></div>
                <div className="globe-ring globe-ring-2"></div>
                <div className="globe-ring globe-ring-3"></div>
                <div className="globe-core"></div>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="explore-card">
            <div className="explore-card-header">
              <h3 className="explore-card-title">Categories</h3>
              <p className="explore-card-description">
                Explore podcasts organized by topic — culture, religion, politics, tech, and more.
              </p>
            </div>
            <div className="explore-card-visual">
              <div className="compass-icon">
                <div className="compass-circle">
                  <div className="compass-needle"></div>
                  <div className="compass-center"></div>
                </div>
              </div>
            </div>
          </div>

          {/* New Episodes Card */}
          <div className="explore-card">
            <div className="explore-card-header">
              <h3 className="explore-card-title">New Episodes</h3>
              <p className="explore-card-description">
                Catch the latest releases from podcasts you follow and new content you haven't heard yet.
              </p>
            </div>
            <div className="explore-card-visual">
              <div className="episodes-grid">
                <div className="episode-tile"></div>
                <div className="episode-tile episode-tile-play">
                  <div className="play-icon-small">▶</div>
                </div>
                <div className="episode-tile"></div>
                <div className="episode-tile episode-tile-play">
                  <div className="play-icon-small">▶</div>
                </div>
                <div className="episode-tile"></div>
                <div className="episode-tile"></div>
                <div className="episode-tile episode-tile-play">
                  <div className="play-icon-small">▶</div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Played Card */}
          <div className="explore-card">
            <div className="explore-card-header">
              <h3 className="explore-card-title">Most Played</h3>
              <p className="explore-card-description">
                The podcasts and episodes listeners are playing most right now.
              </p>
            </div>
            <div className="explore-card-visual">
              <div className="most-played-visual">
                <div className="play-button-large">
                  <div className="play-icon-large">▶</div>
                </div>
                <div className="sound-wave">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}