import { Check } from 'lucide-react';

export default function Why() {
  const reasons = [
    {
      title: 'Podcasts Are Scattered',
      description: 'Ethiopian podcasts are spread across many platforms, making discovery hard for listeners.'
    },
    {
      title: 'Discovery is Broken',
      description: 'Listeners struggle to find quality content and relevant voices in a single place.'
    },
    {
      title: 'Clarity Matters',
      description: 'We organize and categorize podcasts clearly and honestly, without producing our own content.'
    }
  ];

  return (
    <section className="why-section">
      <div className="why-container">
        <h2 className="why-title">Why Ethiopodcast Exists</h2>
        <p className="why-subtitle">
          Ethiopodcast brings scattered Ethiopian podcasts into one clear, searchable platform so 
          listeners can find quality content and creators can reach the right audience.
        </p>
        
        <div className="why-content">
          <div className="why-reasons">
            {reasons.map((reason, index) => (
              <div key={index} className="why-reason-item">
                <div className="why-reason-icon">
                  <Check size={20} />
                </div>
                <div className="why-reason-text">
                  <h3 className="why-reason-title">{reason.title}</h3>
                  <p className="why-reason-description">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="why-mockup">
            <div className="mockup-placeholder">
              {/* Placeholder for app mockup images */}
              <div className="mockup-grid">
                <div className="mockup-card" />
                <div className="mockup-card" />
                <div className="mockup-card" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}