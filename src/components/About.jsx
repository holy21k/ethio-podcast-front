export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h2 className="about-title">About Ethiopodcast</h2>
        <div className="about-text-content">
          <p className="about-text">
            Ethiopodcast is a curated platform for discovering Ethiopian podcasts in one place. 
            We bring together podcasts covering culture, religion, politics, society, technology, education, 
            and everyday conversations so listeners don't have to search across multiple platforms to find 
            relevant voices.
          </p>
          <p className="about-text-secondary">
            Ethiopodcast does not produce podcasts. We organize, categorize, and surface existing shows 
            to make discovery simple and transparent.
          </p>
        </div>
        <div className="about-planet-container">
          <div className="planet-glow-outer" />
          <div className="planet-glow-middle" />
          <div className="planet-sphere" />
          <div className="planet-shadow" />
        </div>
      </div>
    </section>
  );
}