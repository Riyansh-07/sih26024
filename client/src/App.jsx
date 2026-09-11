import React, { useState, useEffect } from 'react';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsNote, setItemsNote] = useState('');

  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Fetch backend health status
  const checkHealth = async () => {
    setServerLoading(true);
    setServerError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      setServerError(err.message);
      setHealthData(null);
    } finally {
      setServerLoading(false);
    }
  };

  // Fetch items
  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
        if (data.note) setItemsNote(data.note);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setActionMessage('');

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ title: '', description: '', status: 'pending' });
        setActionMessage('✅ Item created successfully!');
        fetchItems();
      } else {
        setActionMessage(`⚠️ ${data.message || 'Failed to create item'}`);
      }
    } catch (err) {
      setActionMessage(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchItems();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
    }
  };

  const isDbConnected = healthData?.database?.connected;

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="badge">
          <span className="badge-dot"></span>
          SIH 2026 • MERN Skeleton
        </div>
        <h1 className="title">
          Express + React <span className="title-highlight">(Vite)</span> + Atlas
        </h1>
        <p className="subtitle">
          Clean, minimal full-stack starter with MongoDB Atlas Mongoose integration and Vite proxy.
        </p>
      </header>

      {/* Status Grid */}
      <div className="grid-2">
        {/* Backend & MongoDB Status */}
        <div className="card">
          <div className="card-title">
            <span>⚡ System Status</span>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.3rem 0.7rem', fontSize: '0.75rem' }} onClick={() => { checkHealth(); fetchItems(); }}>
              Refresh
            </button>
          </div>

          <div className="info-row">
            <span className="info-label">Express Backend (Port 5000)</span>
            {serverLoading ? (
              <span className="status-pill status-warning">Checking...</span>
            ) : serverError ? (
              <span className="status-pill status-offline">Offline</span>
            ) : (
              <span className="status-pill status-online">Running</span>
            )}
          </div>

          <div className="info-row">
            <span className="info-label">Frontend (Vite)</span>
            <span className="status-pill status-online">Active</span>
          </div>

          <div className="info-row">
            <span className="info-label">MongoDB Atlas</span>
            {serverLoading ? (
              <span className="status-pill status-warning">Checking...</span>
            ) : isDbConnected ? (
              <span className="status-pill status-online">Connected</span>
            ) : (
              <span className="status-pill status-warning">Config Required</span>
            )}
          </div>

          {healthData && (
            <>
              <div className="info-row">
                <span className="info-label">Server Uptime</span>
                <span className="info-value">{healthData.uptime}</span>
              </div>
              <div className="info-row">
                <span className="info-label">DB ReadyState</span>
                <span className="info-value">{healthData.database?.status} ({healthData.database?.readyState})</span>
              </div>
            </>
          )}

          {!isDbConnected && (
            <div className="callout">
              <strong>MongoDB Atlas Setup:</strong>
              <p style={{ marginTop: '0.4rem' }}>
                Open <code>server/.env</code> and replace <code>MONGO_URI</code> with your MongoDB Atlas connection string to enable database persistence.
              </p>
            </div>
          )}
        </div>

        {/* Create Item Sample Form */}
        <div className="card">
          <div className="card-title">
            <span>📝 Sample CRUD Tester</span>
          </div>

          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label className="form-label">Item Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement authentication"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Add JWT and bcrypt for user login"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !formData.title.trim()}
              >
                {submitting ? 'Saving...' : '+ Add Item'}
              </button>
            </div>
          </form>

          {actionMessage && (
            <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              {actionMessage}
            </div>
          )}
        </div>
      </div>

      {/* Items List Section */}
      <div className="card">
        <div className="card-title">
          <span>📦 Sample Items Database</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {itemsLoading ? (
          <div className="empty-state">Loading items from backend...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            {itemsNote || 'No items added yet. Use the form above to add an item.'}
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item._id} className="item-card">
                <div>
                  <div className="item-title">{item.title}</div>
                  {item.description && <div className="item-desc">{item.description}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`status-pill ${item.status === 'completed' ? 'status-online' : item.status === 'in-progress' ? 'status-warning' : 'status-offline'}`}>
                    {item.status}
                  </span>
                  <button
                    className="btn-danger-sm"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Reference Footer */}
      <footer style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>
          Repository Structure: <code>/server</code> (Express API) &bull; <code>/client</code> (React Vite) &bull; MongoDB Atlas
        </p>
      </footer>
    </div>
  );
}
