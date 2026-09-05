/* eslint-disable no-unused-vars */
import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section with Orb */}
      <section className="hero-section">
        <div className="orb"></div>
        <div className="hero-content">
          <h1>Step Into <span>Custom</span> Style</h1>
          <p>Design your own clogs – handcrafted, unique, and made for you.</p>
          <div className="hero-buttons">
            <a href="/studio" className="btn-primary">Start Designing →</a>
            <a href="/store" className="btn-secondary">Visit Store</a>
          </div>
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span className="scroll-arrow">⌄</span>
            <span className="scroll-text">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Collection Banners */}
      <section className="collection-hero" style={{ backgroundImage: "url('/images/base/black-front.jpg')" }}>
        <div className="collection-overlay">
          <div className="collection-content">
            <span className="collection-tag">Classic</span>
            <h2>Black Collection</h2>
            <p>Timeless elegance – the perfect foundation.</p>
            <a href="/store" className="btn-primary">Shop Now →</a>
          </div>
        </div>
      </section>

      <section className="collection-hero" style={{ backgroundImage: "url('/images/base/beige-front.jpg')" }}>
        <div className="collection-overlay">
          <div className="collection-content">
            <span className="collection-tag">Natural</span>
            <h2>Beige Collection</h2>
            <p>Warm, earthy tones for everyday comfort.</p>
            <a href="/store" className="btn-primary">Shop Now →</a>
          </div>
        </div>
      </section>

      <section className="collection-hero" style={{ backgroundImage: "url('/images/base/brown-front.jpg')" }}>
        <div className="collection-overlay">
          <div className="collection-content">
            <span className="collection-tag">Rich</span>
            <h2>Brown Collection</h2>
            <p>Deep, rich shades that make a statement.</p>
            <a href="/store" className="btn-primary">Shop Now →</a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <h2>Why Clog Crafts?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🧵 Handcrafted</h3>
            <p>Every pair is made with care, attention to detail, and premium materials.</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Custom Made</h3>
            <p>Choose your colour, patches, initials – your design, your way.</p>
          </div>
          <div className="feature-card">
            <h3>♻️ Unique & Personal</h3>
            <p>No two pairs are the same – your style is one of a kind.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to design your dream clogs?</h2>
          <p>Start customising now or visit our store for ready‑made styles.</p>
          <div className="cta-buttons">
            <a href="/studio" className="btn-primary">Design Now</a>
            <a href="/store" className="btn-secondary">Visit Store</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;