export default function Why() {
  return (
    <section className="container why-section">
      <div className="why-content">
        <h2 style={{fontSize: '2rem', marginBottom: '30px'}}>Why EthioPodcast Exists</h2>
        <ul style={{listStyle: 'none', padding: 0, color: '#c0b2dd'}}>
          <li style={{marginBottom: '20px'}}><strong>• Podcasts Are Scattered:</strong> Found across many platforms, making discovery hard.</li>
          <li style={{marginBottom: '20px'}}><strong>• Discovery is Broken:</strong> Listeners struggle to find quality content.</li>
          <li><strong>• Clarity Matters:</strong> We organize podcasts clearly and honestly.</li>
        </ul>
      </div>
      <div className="why-image">
        {/* Replace with your collage screenshot */}
        <img src="/path-to-your-collage.png" alt="App Mockup" />
      </div>
    </section>
  )
}