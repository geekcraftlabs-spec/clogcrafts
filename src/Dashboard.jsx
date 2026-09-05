/* eslint-disable no-undef */
import { useState } from 'react'; // removed useEffect
import './Dashboard.css';

// ---- Helper to format WhatsApp numbers ----
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

  // ---- Login ----
  const handleLogin = (e) => {
    e.preventDefault();
    // In Vite, use import.meta.env; fallback to process.env for Node
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

  // ---- Send WhatsApp (opens wa.me) ----
  const sendWhatsApp = (order) => {
    const baseUrl = window.location.origin;
    const designUrl = `${baseUrl}/design/${order.short_code}`;
    const number = formatWhatsAppNumber(order.whatsapp);
    const payShapNumber = '0682852438@FNB'; // Update to yours
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

  // ---- Render login if not authenticated ----
  if (!authenticated) {
    return (
      <div className="dashboard-login">
        <div className="login-card">
          <h2>🔐 Admin Login</h2>
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
        <button className="logout-btn" onClick={() => setAuthenticated(false)}>Logout</button>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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

          <section className="dashboard-section">
            <h2>📱 Waitlist ({waitlist.length})</h2>
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
    </div>
  );
}

export default Dashboard;