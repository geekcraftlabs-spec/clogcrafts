/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import './Dashboard.css';

// ---- Helper to format WhatsApp numbers (0 -> 27) ----
const formatWhatsAppNumber = (number) => {
  let cleaned = number.replace(/[\s\-()+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('27') && cleaned.length <= 10) {
    cleaned = '27' + cleaned;
  }
  return cleaned;
};

function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Broadcast state
  const [liveLink, setLiveLink] = useState(window.location.origin);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "🎉 We're live! 🎉\n\nYour custom clogs are now available at Clog Crafts.\n\nClick the link below to start designing your own pair:\n\n"
  );
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState([]);

  // Check localStorage for broadcast status
  useEffect(() => {
    const sent = localStorage.getItem('broadcastSent') === 'true';
    setBroadcastSent(sent);
  }, []);

  // ---- Login ----
  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
    if (password === adminPass) {
      setAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError('Incorrect password');
    }
  };

  // ---- Fetch data ----
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, waitlistRes] = await Promise.all([
        fetch('/api/get-orders'),
        fetch('/api/get-waitlist'),
      ]);
      const ordersData = await ordersRes.json();
      const waitlistData = await waitlistRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setWaitlist(Array.isArray(waitlistData) ? waitlistData : []);
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Update order ----
  const updateOrder = async (id, owner_price, status) => {
    try {
      const res = await fetch('/api/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, owner_price, status }),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Network error');
    }
  };

  // ---- Send WhatsApp (individual order) ----
  const sendWhatsApp = (order) => {
    const baseUrl = window.location.origin;
    const designUrl = `${baseUrl}/design/${order.short_code}`;
    const number = formatWhatsAppNumber(order.whatsapp);
    const payShapNumber = '0682852438@FNB';
    const message = `👋 Hi! Your custom clog design is ready.

🔗 View your design: ${designUrl}

📋 Order details:
• Colour: ${order.color}
• Patches: ${order.main_patches?.join(', ') || 'None'}
• Add-ons: ${order.addons?.join(', ') || 'None'}
• Letters: ${order.letter_patches?.join(', ') || 'None'}
• Initials: ${order.initials || 'None'}

💰 Price: R${order.owner_price || 'To be confirmed'}

💳 Payment:
Please PayShap to ${payShapNumber}
Reference: ${order.short_code}
Send POP to this number when done.

We'll start crafting once payment is confirmed. 🧵👟

Thank you for choosing Clog Crafts!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${encoded}`, '_blank');
  };

  // ---- Broadcast to waitlist ----
  const handleBroadcast = () => {
    if (waitlist.length === 0) {
      alert('No waitlist entries to broadcast to.');
      return;
    }
    if (!liveLink) {
      alert('Please enter the live link.');
      return;
    }
    // Generate wa.me links for each entry
    const links = waitlist.map((entry) => {
      const number = formatWhatsAppNumber(entry.whatsapp);
      const fullMessage = welcomeMessage + liveLink;
      const encoded = encodeURIComponent(fullMessage);
      return {
        whatsapp: entry.whatsapp,
        number: number,
        link: `https://wa.me/${number}?text=${encoded}`,
      };
    });
    setGeneratedLinks(links);
    setShowBroadcastModal(true);
  };

  const confirmBroadcast = () => {
    // Mark as sent
    localStorage.setItem('broadcastSent', 'true');
    setBroadcastSent(true);
    setShowBroadcastModal(false);
    alert(`✅ Broadcast sent to ${generatedLinks.length} numbers.`);
    // Optionally open all links (but browser may block pop-ups) – we'll just show them.
  };

  const resetBroadcast = () => {
    localStorage.removeItem('broadcastSent');
    setBroadcastSent(false);
    setGeneratedLinks([]);
  };

  // ---- Render login if not authenticated ----
  if (!authenticated) {
    return (
      <div className="dashboard-login">
        <div className="login-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🔐 Admin Login</h2>
            <a href="/" className="home-btn-login">🏠 Home</a>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {authError && <p className="error">{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ---- Dashboard content ----
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🧑‍💼 Clog Crafts – Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" className="home-btn">🏠 Home</a>
          <button className="logout-btn" onClick={() => setAuthenticated(false)}>Logout</button>
        </div>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ---- Orders Section ---- */}
          <section className="dashboard-section">
            <h2>📦 Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-image">
                      {order.screenshot_url ? (
                        <img src={order.screenshot_url} alt={order.short_code} />
                      ) : (
                        <div className="no-image">No image</div>
                      )}
                    </div>
                    <div className="order-details">
                      <div className="order-code"><strong>{order.short_code}</strong></div>
                      <div>Colour: {order.color}</div>
                      <div>Patches: {order.main_patches?.join(', ') || 'None'}</div>
                      <div>Add-ons: {order.addons?.join(', ') || 'None'}</div>
                      <div>Letters: {order.letter_patches?.join(', ') || 'None'}</div>
                      <div>Initials: {order.initials || 'None'}</div>
                      <div>WhatsApp: <a href={`https://wa.me/${formatWhatsAppNumber(order.whatsapp)}`} target="_blank" rel="noopener noreferrer">{order.whatsapp}</a></div>
                      <div>Status: <span className={`status-badge ${order.status}`}>{order.status}</span></div>
                      <div className="order-controls">
                        <input
                          type="number"
                          placeholder="Price (R)"
                          defaultValue={order.owner_price || ''}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                              updateOrder(order.id, val, order.status);
                            }
                          }}
                        />
                        <select
                          defaultValue={order.status || 'pending'}
                          onChange={(e) => updateOrder(order.id, order.owner_price, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="priced">Priced</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button className="whatsapp-btn" onClick={() => sendWhatsApp(order)}>
                          💬 Send WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---- Waitlist Section ---- */}
          <section className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <h2>📱 Waitlist ({waitlist.length})</h2>
              {!broadcastSent ? (
                <button className="broadcast-btn" onClick={handleBroadcast}>
                  🌐 Ready to Go Live
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ Broadcast sent!</span>
                  <button className="reset-btn" onClick={resetBroadcast}>🔄 Reset</button>
                </div>
              )}
            </div>

            {waitlist.length === 0 ? (
              <p>No waitlist entries yet.</p>
            ) : (
              <table className="waitlist-table">
                <thead>
                  <tr>
                    <th>WhatsApp</th>
                    <th>Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry) => (
                    <tr key={entry.id}>
                      <td><a href={`https://wa.me/${formatWhatsAppNumber(entry.whatsapp)}`} target="_blank" rel="noopener noreferrer">{entry.whatsapp}</a></td>
                      <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {/* ---- Broadcast Modal ---- */}
      {showBroadcastModal && (
        <div className="modal-overlay" onClick={() => setShowBroadcastModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBroadcastModal(false)}>✕</button>
            <h3>🌐 Broadcast to Waitlist</h3>
            <p style={{ marginBottom: '12px', color: '#666' }}>
              These are the WhatsApp links for each number. Click "Open All" to send them, or copy the links.
            </p>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
              {generatedLinks.map((item, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.whatsapp} → <a href={item.link} target="_blank" rel="noopener noreferrer">Open</a></span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => {
                // Copy all links to clipboard
                const allLinks = generatedLinks.map(item => item.link).join('\n');
                navigator.clipboard.writeText(allLinks).then(() => {
                  alert('All links copied to clipboard!');
                }).catch(() => {
                  // Fallback
                  const textarea = document.createElement('textarea');
                  textarea.value = allLinks;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textarea);
                  alert('All links copied to clipboard!');
                });
              }}>📋 Copy All Links</button>
              <button className="btn-primary" onClick={confirmBroadcast}>✅ Confirm Send</button>
              <button className="btn-secondary" onClick={() => setShowBroadcastModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;