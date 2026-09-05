/* eslint-disable no-undef */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import './Dashboard.css';

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
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [liveLink, setLiveLink] = useState(window.location.origin);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hey! We're live at Clog Crafts.\nStart designing your custom clogs now:\n"
  );
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastItems, setBroadcastItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const sent = localStorage.getItem('broadcastSent') === 'true';
    setBroadcastSent(sent);
  }, []);

  // ---- Auto‑refresh every 15 seconds ----
  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
    if (password === adminPass) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

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

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Network error');
    }
  };

  const sendWhatsApp = (order) => {
    const baseUrl = window.location.origin;
    let viewUrl;
    if (order.mode === 'store' && order.product_id) {
      viewUrl = `${baseUrl}/product/${order.product_id}`;
    } else {
      viewUrl = `${baseUrl}/design/${order.short_code}`;
    }
    const number = formatWhatsAppNumber(order.whatsapp);
    const payShapNumber = '0682852438@FNB';
    const message = `👋 Hi${order.customer_name ? ` ${order.customer_name}` : ''}! Your order is ready.

🔗 View your order: ${viewUrl}

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

  // ---- Broadcast functions (unchanged) ----
  const handleBroadcast = () => {
    if (waitlist.length === 0) {
      alert('No waitlist entries to broadcast to.');
      return;
    }
    if (!liveLink) {
      alert('Please enter the live link.');
      return;
    }
    const items = waitlist.map((entry) => {
      const number = formatWhatsAppNumber(entry.whatsapp);
      const fullMessage = welcomeMessage + liveLink;
      const encoded = encodeURIComponent(fullMessage);
      return {
        whatsapp: entry.whatsapp,
        number: number,
        link: `https://wa.me/${number}?text=${encoded}`,
        status: 'pending',
      };
    });
    setBroadcastItems(items);
    setCurrentIndex(0);
    setShowBroadcastModal(true);
  };

  const openNext = () => {
    const nextIndex = broadcastItems.findIndex(item => item.status === 'pending');
    if (nextIndex === -1) {
      alert('All links have been opened or sent!');
      return;
    }
    const item = broadcastItems[nextIndex];
    window.open(item.link, '_blank');
    const updated = [...broadcastItems];
    updated[nextIndex].status = 'opened';
    setBroadcastItems(updated);
    setCurrentIndex(nextIndex);
  };

  const markAsSent = () => {
    if (currentIndex === -1 || currentIndex >= broadcastItems.length) {
      alert('No item selected.');
      return;
    }
    const item = broadcastItems[currentIndex];
    if (item.status === 'sent') {
      alert('Already marked as sent.');
      return;
    }
    const updated = [...broadcastItems];
    updated[currentIndex].status = 'sent';
    setBroadcastItems(updated);
    const nextPending = updated.findIndex(i => i.status === 'pending');
    if (nextPending !== -1) {
      setCurrentIndex(nextPending);
    } else {
      localStorage.setItem('broadcastSent', 'true');
      setBroadcastSent(true);
      setShowBroadcastModal(false);
      alert('✅ All numbers processed! Broadcast marked as sent.');
    }
  };

  const copyAllLinks = () => {
    const allLinks = broadcastItems.map(item => item.link).join('\n');
    navigator.clipboard.writeText(allLinks).then(() => {
      alert('All links copied to clipboard!');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = allLinks;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('All links copied to clipboard!');
    });
  };

  const confirmSend = () => {
    localStorage.setItem('broadcastSent', 'true');
    setBroadcastSent(true);
    setShowBroadcastModal(false);
    alert('✅ Broadcast marked as sent!');
  };

  const resetBroadcast = () => {
    localStorage.removeItem('broadcastSent');
    setBroadcastSent(false);
    setBroadcastItems([]);
    setCurrentIndex(0);
  };

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

  // ---- Filtering ----
  const filteredByMode = modeFilter === 'all' ? orders : orders.filter(o => o.mode === modeFilter);
  const filteredOrders = statusFilter === 'all' ? filteredByMode : filteredByMode.filter(o => o.status === statusFilter);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

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
          <section className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <h2>
                📦 Orders ({filteredOrders.length})
                {pendingCount > 0 && <span className="pending-badge">🔴 {pendingCount} pending</span>}
              </h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div className="filter-bar">
                  <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
                  <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>
                    Pending {pendingCount > 0 && <span className="count-badge">{pendingCount}</span>}
                  </button>
                  <button className={statusFilter === 'paid' ? 'active' : ''} onClick={() => setStatusFilter('paid')}>Paid</button>
                  <button className={statusFilter === 'completed' ? 'active' : ''} onClick={() => setStatusFilter('completed')}>Completed</button>
                </div>
                <div className="filter-bar">
                  <button className={modeFilter === 'all' ? 'active' : ''} onClick={() => setModeFilter('all')}>All</button>
                  <button className={modeFilter === 'custom' ? 'active' : ''} onClick={() => setModeFilter('custom')}>Custom</button>
                  <button className={modeFilter === 'store' ? 'active' : ''} onClick={() => setModeFilter('store')}>Store</button>
                  <button className={modeFilter === 'uploaded' ? 'active' : ''} onClick={() => setModeFilter('uploaded')}>Uploaded</button>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p>No orders in this category.</p>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order) => (
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
                      <div>Mode: <span className="mode-badge">{order.mode || 'custom'}</span></div>
                      {order.customer_name && <div>Name: {order.customer_name}</div>}
                      <div>Colour: {order.color || 'N/A'}</div>
                      <div>Patches: {order.main_patches?.join(', ') || 'None'}</div>
                      <div>Add-ons: {order.addons?.join(', ') || 'None'}</div>
                      <div>Letters: {order.letter_patches?.join(', ') || 'None'}</div>
                      <div>Initials: {order.initials || 'None'}</div>
                      <div>WhatsApp: <a href={`https://wa.me/${formatWhatsAppNumber(order.whatsapp)}`} target="_blank" rel="noopener noreferrer">{order.whatsapp}</a></div>
                      <div>
                        Status: 
                        <button 
                          className={`status-btn ${order.status || 'pending'}`}
                          onClick={() => {
                            const next = order.status === 'pending' ? 'paid' : order.status === 'paid' ? 'completed' : 'pending';
                            updateOrderStatus(order.id, next);
                          }}
                        >
                          {order.status || 'pending'}
                        </button>
                      </div>
                      <div className="order-controls">
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

      {/* Broadcast Modal – unchanged */}
      {showBroadcastModal && (
        <div className="modal-overlay" onClick={() => setShowBroadcastModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBroadcastModal(false)}>✕</button>
            <h3>🌐 Broadcast to Waitlist</h3>
            <div style={{ marginBottom: '12px', background: '#f9f9f9', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
              <strong>Preview message:</strong>
              <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap', color: '#444' }}>
                {welcomeMessage + liveLink}
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>Pending: <strong>{broadcastItems.filter(i => i.status === 'pending').length}</strong></span>
              <span>Opened: <strong>{broadcastItems.filter(i => i.status === 'opened').length}</strong></span>
              <span>Sent: <strong>{broadcastItems.filter(i => i.status === 'sent').length}</strong></span>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', background: '#f9f9f9', padding: '8px', borderRadius: '8px' }}>
              {broadcastItems.map((item, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #eee', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.whatsapp}</span>
                  <span>
                    {item.status === 'pending' && <span style={{ color: '#f1c40f' }}>⏳ Pending</span>}
                    {item.status === 'opened' && <span style={{ color: '#3498db' }}>📤 Opened</span>}
                    {item.status === 'sent' && <span style={{ color: '#2ecc71' }}>✅ Sent</span>}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={openNext}>📤 Open Next</button>
              <button className="btn-secondary" onClick={markAsSent} disabled={currentIndex === -1 || broadcastItems[currentIndex]?.status === 'sent'}>
                ✅ Mark as Sent
              </button>
              <button className="btn-secondary" onClick={copyAllLinks}>📋 Copy All Links</button>
              <button className="btn-secondary" onClick={confirmSend}>✅ Mark All as Sent</button>
              <button className="btn-secondary" onClick={() => setShowBroadcastModal(false)}>Close</button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#999' }}>
              💡 Click "Open Next" to open the next pending link. After sending in WhatsApp, click "Mark as Sent".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;