import React, { useState, useEffect } from 'react';

export default function App() {
  const [healthData, setHealthData] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  const [mines, setMines] = useState([]);
  const [minesLoading, setMinesLoading] = useState(false);
  const [minesNote, setMinesNote] = useState('');

  const [inspections, setInspections] = useState([]);
  const [inspectionsLoading, setInspectionsLoading] = useState(false);

  const [expandedMineId, setExpandedMineId] = useState(null);

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

  // Fetch all mines
  const fetchMines = async () => {
    setMinesLoading(true);
    try {
      const res = await fetch('/api/mines');
      const data = await res.json();
      if (data.success) {
        setMines(data.data || []);
        if (data.note) setMinesNote(data.note);
      }
    } catch (err) {
      console.error('Error fetching mines:', err);
    } finally {
      setMinesLoading(false);
    }
  };

  // Fetch all inspections
  const fetchInspections = async () => {
    setInspectionsLoading(true);
    try {
      const res = await fetch('/api/inspections');
      const data = await res.json();
      if (data.success) {
        setInspections(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching inspections:', err);
    } finally {
      setInspectionsLoading(false);
    }
  };

  const refreshAll = () => {
    checkHealth();
    fetchMines();
    fetchInspections();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const toggleExpandMine = (mineId) => {
    setExpandedMineId((prevId) => (prevId === mineId ? null : mineId));
  };

  const isDbConnected = healthData?.database?.connected;

  const getMineStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-online';
      case 'under-maintenance':
        return 'status-warning';
      case 'closed':
        return 'status-offline';
      default:
        return 'status-warning';
    }
  };

  const getInspectionStatusClass = (status) => {
    switch (status) {
      case 'passed':
        return 'status-online';
      case 'pending':
      case 'follow-up-required':
        return 'status-warning';
      case 'failed':
        return 'status-offline';
      default:
        return 'status-warning';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'minor':
        return 'status-online';
      case 'major':
        return 'status-warning';
      case 'critical':
        return 'status-offline';
      default:
        return 'status-warning';
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="badge">
          <span className="badge-dot"></span>
          SIH 2026 • Coal Mine Safety & Management
        </div>
        <h1 className="title">
          Mine Inspection & <span className="title-highlight">Operations Dashboard</span>
        </h1>
        <p className="subtitle">
          Real-time tracking of coal mine sites, regulatory compliance, and safety inspections.
        </p>
      </header>

      {/* Top Grid: System Status */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">
            <span>⚡ System Status</span>
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
              onClick={refreshAll}
            >
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
                <span className="info-value">
                  {healthData.database?.status} ({healthData.database?.readyState})
                </span>
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
      </div>

      {/* Mines Directory & Inspections Section */}
      <div className="card">
        <div className="card-title">
          <span>⛏️ Coal Mines Directory</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {mines.length} {mines.length === 1 ? 'mine' : 'mines'} registered
          </span>
        </div>

        {minesLoading ? (
          <div className="empty-state">Loading mines from backend...</div>
        ) : mines.length === 0 ? (
          <div className="empty-state">
            {minesNote || 'No mines found. Ensure MongoDB is connected and sample mine records are loaded.'}
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mine Name</th>
                  <th>State</th>
                  <th>Type</th>
                  <th>Operational Status</th>
                  <th>Subsidiary</th>
                  <th style={{ textAlign: 'center' }}>Inspections</th>
                </tr>
              </thead>
              <tbody>
                {mines.map((mine) => {
                  const isExpanded = expandedMineId === mine._id;
                  const mineInspections = inspections.filter(
                    (insp) =>
                      insp.mineId === mine._id ||
                      (insp.mineId && typeof insp.mineId === 'object' && insp.mineId._id === mine._id)
                  );

                  return (
                    <React.Fragment key={mine._id}>
                      <tr
                        className={`clickable-row ${isExpanded ? 'row-expanded' : ''}`}
                        onClick={() => toggleExpandMine(mine._id)}
                        title="Click to view/hide inspections"
                      >
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {mine.name}
                          </div>
                          {mine.coalGrade && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Grade: {mine.coalGrade}
                            </div>
                          )}
                        </td>
                        <td>{mine.location?.state || '-'}</td>
                        <td style={{ textTransform: 'capitalize' }}>{mine.type || '-'}</td>
                        <td>
                          <span className={`status-pill ${getMineStatusClass(mine.operationalStatus)}`}>
                            {mine.operationalStatus}
                          </span>
                        </td>
                        <td>{mine.subsidiary || '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            className="status-pill status-warning"
                            style={{
                              background: isExpanded ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                              color: isExpanded ? '#818cf8' : 'var(--text-secondary)',
                              borderColor: isExpanded ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)',
                            }}
                          >
                            {mineInspections.length} {mineInspections.length === 1 ? 'audit' : 'audits'} {isExpanded ? '▲' : '▼'}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Inspections Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div className="inspection-subpanel">
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '1rem',
                                }}
                              >
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                  📋 Inspection History for {mine.name}
                                </strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  {mineInspections.length} record(s)
                                </span>
                              </div>

                              {inspectionsLoading ? (
                                <div className="empty-state" style={{ padding: '1rem' }}>
                                  Loading inspection data...
                                </div>
                              ) : mineInspections.length === 0 ? (
                                <div className="empty-state" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                                  No inspection records logged for this mine yet.
                                </div>
                              ) : (
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                  {mineInspections.map((insp) => (
                                    <div key={insp._id} className="item-card" style={{ marginBottom: 0 }}>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {insp.inspectorName}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: '0.72rem',
                                              padding: '0.15rem 0.5rem',
                                              borderRadius: 'var(--radius-sm)',
                                              background: 'rgba(255, 255, 255, 0.08)',
                                              color: 'var(--text-secondary)',
                                              textTransform: 'capitalize',
                                            }}
                                          >
                                            {insp.type}
                                          </span>
                                          {insp.severity && (
                                            <span className={`status-pill ${getSeverityClass(insp.severity)}`}>
                                              {insp.severity}
                                            </span>
                                          )}
                                        </div>
                                        {insp.findings && (
                                          <div className="item-desc" style={{ marginTop: '0.2rem' }}>
                                            {insp.findings}
                                          </div>
                                        )}
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                                          Date: {insp.date ? new Date(insp.date).toLocaleDateString() : '-'}
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className={`status-pill ${getInspectionStatusClass(insp.status)}`}>
                                          {insp.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
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
