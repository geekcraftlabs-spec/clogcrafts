/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './WaitlistPage.css';

function WaitlistPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setWhatsapp('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="waitlist-page">
      <div className="waitlist-card">
        <div className="brand">
          <h1>CLOG <span>CRAFTS</span></h1>
          <p className="tagline">Custom clogs, handcrafted for you.</p>
        </div>

        {submitted ? (
          <div className="success">
            <div className="checkmark">✅</div>
            <h2>You're on the list!</h2>
            <p>We'll WhatsApp you when we launch.</p>
          </div>
        ) : (
          <>
            <h2>🚀 Launching Soon</h2>
            <p className="description">
              Be the first to know when we go live.<br />
              Enter your WhatsApp number and get <strong>10% off</strong> your first order.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder="Your WhatsApp number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
              <button type="submit">Notify Me</button>
              {error && <div className="error">{error}</div>}
            </form>
            <p className="footnote">We'll only message you once – no spam.</p>
          </>
        )}
      </div>

      <footer>
        <p>© 2026 Clog Crafts. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default WaitlistPage;