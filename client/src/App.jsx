import React, { useState, useEffect } from 'react';

// ==========================================
// SKELETON LOADER COMPONENTS
// ==========================================
function TableSkeleton({ rows = 4, cols = 6 }) {
  return (
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
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td>
                <div className="skeleton skeleton-line" style={{ width: '65%', height: '16px' }} />
                <div className="skeleton skeleton-line" style={{ width: '40%', height: '11px', marginBottom: 0 }} />
              </td>
              <td><div className="skeleton skeleton-line" style={{ width: '70%' }} /></td>
              <td><div className="skeleton skeleton-line" style={{ width: '60%' }} /></td>
              <td><div className="skeleton skeleton-line" style={{ width: '75px', height: '22px', borderRadius: 'var(--radius-full)' }} /></td>
              <td><div className="skeleton skeleton-line" style={{ width: '50%' }} /></td>
              <td style={{ textAlign: 'center' }}>
                <div className="skeleton skeleton-line" style={{ width: '60px', height: '22px', margin: '0 auto', borderRadius: 'var(--radius-full)' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gap: '0.85rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div className="skeleton skeleton-line" style={{ width: '130px', height: '16px', marginBottom: 0 }} />
            <div className="skeleton skeleton-line" style={{ width: '70px', height: '18px', borderRadius: 'var(--radius-sm)', marginBottom: 0 }} />
            <div className="skeleton skeleton-line" style={{ width: '100px', height: '14px', marginBottom: 0 }} />
          </div>
          <div className="skeleton skeleton-line" style={{ width: '92%', height: '13px' }} />
          <div className="skeleton skeleton-line" style={{ width: '65%', height: '13px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
            <div className="skeleton skeleton-line" style={{ width: '140px', height: '12px', marginBottom: 0 }} />
            <div className="skeleton skeleton-line" style={{ width: '75px', height: '22px', borderRadius: 'var(--radius-full)', marginBottom: 0 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function InspectionListSkeleton({ count = 2 }) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton skeleton-line" style={{ width: '110px', height: '15px', marginBottom: 0 }} />
              <div className="skeleton skeleton-line" style={{ width: '60px', height: '15px', marginBottom: 0 }} />
            </div>
            <div className="skeleton skeleton-line" style={{ width: '65px', height: '20px', borderRadius: 'var(--radius-full)', marginBottom: 0 }} />
          </div>
          <div className="skeleton skeleton-line" style={{ width: '85%', height: '12px' }} />
          <div className="skeleton skeleton-line" style={{ width: '90px', height: '11px', marginBottom: 0 }} />
        </div>
      ))}
    </div>
  );
}

// Base API URL: uses VITE_API_URL if set in production (e.g. Render), else falls back to relative path for Vite dev proxy
const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Role State (Admin / Inspector / Viewer) - frontend state only
  const [userRole, setUserRole] = useState('Admin');

  const [healthData, setHealthData] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  const [mines, setMines] = useState([]);
  const [minesLoading, setMinesLoading] = useState(false);
  const [minesNote, setMinesNote] = useState('');

  const [inspections, setInspections] = useState([]);
  const [inspectionsLoading, setInspectionsLoading] = useState(false);

  const [grievances, setGrievances] = useState([]);
  const [grievancesLoading, setGrievancesLoading] = useState(false);

  const [expandedMineId, setExpandedMineId] = useState(null);
  const [grievanceFilterCategory, setGrievanceFilterCategory] = useState('all');
  const [grievanceFilterStatus, setGrievanceFilterStatus] = useState('all');

  // Form states
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceForm, setGrievanceForm] = useState({
    mineId: '',
    submittedBy: '',
    description: '',
  });
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceActionMsg, setGrievanceActionMsg] = useState('');

  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [inspectionForm, setInspectionForm] = useState({
    mineId: '',
    inspectorName: '',
    type: 'safety',
    status: 'passed',
    severity: 'minor',
    findings: '',
  });
  const [submittingInspection, setSubmittingInspection] = useState(false);
  const [inspectionActionMsg, setInspectionActionMsg] = useState('');

  // Role permissions
  const isAdmin = userRole === 'Admin';
  const isInspector = userRole === 'Inspector';
  const isViewer = userRole === 'Viewer';
  const canAdd = isAdmin || isInspector;
  const canDelete = isAdmin;
  const canModifyStatus = isAdmin || isInspector;

  // Fetch backend health status
  const checkHealth = async () => {
    setServerLoading(true);
    setServerError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
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
      const res = await fetch(`${API_BASE_URL}/api/mines`);
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
      const res = await fetch(`${API_BASE_URL}/api/inspections`);
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

  // Fetch all grievances
  const fetchGrievances = async () => {
    setGrievancesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances`);
      const data = await res.json();
      if (data.success) {
        setGrievances(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
    } finally {
      setGrievancesLoading(false);
    }
  };

  const refreshAll = () => {
    checkHealth();
    fetchMines();
    fetchInspections();
    fetchGrievances();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const toggleExpandMine = (mineId) => {
    setExpandedMineId((prevId) => (prevId === mineId ? null : mineId));
  };

  const handleCreateGrievance = async (e) => {
    e.preventDefault();
    if (!grievanceForm.mineId || !grievanceForm.submittedBy || !grievanceForm.description) {
      setGrievanceActionMsg('⚠️ Please fill in all required fields.');
      return;
    }

    setSubmittingGrievance(true);
    setGrievanceActionMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievanceForm),
      });

      const data = await res.json();
      if (data.success) {
        setGrievanceActionMsg('✅ Grievance filed & auto-categorized!');
        setGrievanceForm({ mineId: '', submittedBy: '', description: '' });
        setShowGrievanceForm(false);
        fetchGrievances();
      } else {
        setGrievanceActionMsg(`⚠️ ${data.message || 'Failed to file grievance'}`);
      }
    } catch (err) {
      setGrievanceActionMsg(`❌ Error: ${err.message}`);
    } finally {
      setSubmittingGrievance(false);
      setTimeout(() => setGrievanceActionMsg(''), 4000);
    }
  };

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    if (!inspectionForm.mineId || !inspectionForm.inspectorName) {
      setInspectionActionMsg('⚠️ Please select a mine and provide the inspector name.');
      return;
    }

    setSubmittingInspection(true);
    setInspectionActionMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inspectionForm),
      });

      const data = await res.json();
      if (data.success) {
        setInspectionActionMsg('✅ Inspection audit logged successfully!');
        setInspectionForm({
          mineId: '',
          inspectorName: '',
          type: 'safety',
          status: 'passed',
          severity: 'minor',
          findings: '',
        });
        setShowInspectionForm(false);
        fetchInspections();
      } else {
        setInspectionActionMsg(`⚠️ ${data.message || 'Failed to log inspection'}`);
      }
    } catch (err) {
      setInspectionActionMsg(`❌ Error: ${err.message}`);
    } finally {
      setSubmittingInspection(false);
      setTimeout(() => setInspectionActionMsg(''), 4000);
    }
  };

  const handleUpdateGrievanceStatus = async (id, newStatus) => {
    try {
      const updatePayload = {
        status: newStatus,
        dateResolved: newStatus === 'resolved' ? new Date() : undefined,
      };

      const res = await fetch(`${API_BASE_URL}/api/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();
      if (data.success) {
        fetchGrievances();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      alert(`Error updating grievance: ${err.message}`);
    }
  };

  const handleDeleteGrievance = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/grievances/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchGrievances();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(`Error deleting grievance: ${err.message}`);
    }
  };

  const handleDeleteInspection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inspection audit?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inspections/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchInspections();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(`Error deleting inspection: ${err.message}`);
    }
  };

  const handleDeleteMine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coal mine record?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/mines/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMines();
        fetchInspections();
        fetchGrievances();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(`Error deleting mine: ${err.message}`);
    }
  };

  const isDbConnected = healthData?.database?.connected;

  // Clean Color Mapping for Status Pills
  // Active/Passed/Resolved -> Green (.status-online)
  // Warning/Pending/In-Review/Major -> Amber (.status-warning)
  // Closed/Failed/Rejected/Critical -> Red (.status-offline)
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

  const getGrievanceStatusClass = (status) => {
    switch (status) {
      case 'resolved':
        return 'status-online';
      case 'in-review':
      case 'submitted':
        return 'status-warning';
      case 'rejected':
        return 'status-offline';
      default:
        return 'status-warning';
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchesCategory =
      grievanceFilterCategory === 'all' ||
      (g.category && g.category.toLowerCase() === grievanceFilterCategory.toLowerCase());
    const matchesStatus = grievanceFilterStatus === 'all' || g.status === grievanceFilterStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="container">
      {/* Top Role Selector Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(18, 24, 38, 0.92)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Active Portal Role:
          </span>
          <select
            className="form-select"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              width: 'auto',
              cursor: 'pointer',
            }}
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="Admin">🛡️ Admin (Full Access)</option>
            <option value="Inspector">🔍 Inspector (View & Create)</option>
            <option value="Viewer">👁️ Viewer (Read-Only)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            className={`status-pill ${
              isAdmin ? 'status-online' : isInspector ? 'status-warning' : 'status-offline'
            }`}
          >
            {userRole} Mode
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isAdmin && 'All add, edit, and delete permissions enabled.'}
            {isInspector && 'Can log audits and file grievances; delete disabled.'}
            {isViewer && 'Read-only view; all action buttons hidden.'}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="badge">
          <span className="badge-dot"></span>
          SIH 2026 • Coal Mine Safety & Management
        </div>
        <h1 className="title">
          Mine Operations & <span className="title-highlight">Compliance Portal</span>
        </h1>
        <p className="subtitle">
          Real-time tracking of coal mine sites, regulatory safety audits, and worker grievance resolution.
        </p>
      </header>

      {/* Top Grid: System Status & Metrics */}
      <div className="grid-2">
        {/* System Status Card */}
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
              <span className="skeleton skeleton-line" style={{ width: '80px', height: '22px', borderRadius: 'var(--radius-full)', marginBottom: 0 }} />
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
              <span className="skeleton skeleton-line" style={{ width: '80px', height: '22px', borderRadius: 'var(--radius-full)', marginBottom: 0 }} />
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

        {/* Quick Portal Summary Metrics */}
        <div className="card">
          <div className="card-title">
            <span>📊 Portal Overview</span>
          </div>

          <div className="info-row">
            <span className="info-label">Total Coal Mines</span>
            <span className="info-value">
              {minesLoading ? (
                <span className="skeleton skeleton-line" style={{ width: '35px', height: '18px', display: 'inline-block', marginBottom: 0 }} />
              ) : (
                mines.length
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Active Mines</span>
            <span className="info-value" style={{ color: '#34d399' }}>
              {minesLoading ? (
                <span className="skeleton skeleton-line" style={{ width: '35px', height: '18px', display: 'inline-block', marginBottom: 0 }} />
              ) : (
                mines.filter((m) => m.operationalStatus === 'active').length
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Logged Inspections</span>
            <span className="info-value">
              {inspectionsLoading ? (
                <span className="skeleton skeleton-line" style={{ width: '35px', height: '18px', display: 'inline-block', marginBottom: 0 }} />
              ) : (
                inspections.length
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Worker Grievances</span>
            <span className="info-value" style={{ color: '#fbbf24' }}>
              {grievancesLoading ? (
                <span className="skeleton skeleton-line" style={{ width: '55px', height: '18px', display: 'inline-block', marginBottom: 0 }} />
              ) : (
                `${grievances.length} (${grievances.filter((g) => g.status === 'submitted' || g.status === 'in-review').length} pending)`
              )}
            </span>
          </div>

          {/* Action buttons visible only if role has creation privileges */}
          {canAdd && (
            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '0.55rem' }}
                onClick={() => {
                  setShowGrievanceForm(!showGrievanceForm);
                  setShowInspectionForm(false);
                }}
              >
                {showGrievanceForm ? 'Close Form' : '+ File Grievance'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '0.55rem' }}
                onClick={() => {
                  setShowInspectionForm(!showInspectionForm);
                  setShowGrievanceForm(false);
                }}
              >
                {showInspectionForm ? 'Close Form' : '+ Log Inspection'}
              </button>
            </div>
          )}

          {isViewer && (
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔒 Action buttons hidden in Read-Only Viewer mode.
            </div>
          )}
        </div>
      </div>

      {/* File Grievance Drawer (Admin & Inspector) */}
      {canAdd && showGrievanceForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <div className="card-title">
            <span>📝 Submit Worker Grievance</span>
          </div>

          <form onSubmit={handleCreateGrievance}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Mine *</label>
                <select
                  className="form-select"
                  value={grievanceForm.mineId}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, mineId: e.target.value })}
                  required
                >
                  <option value="">-- Choose a Coal Mine --</option>
                  {mines.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.subsidiary})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Submitter Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar (Operator)"
                  value={grievanceForm.submittedBy}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, submittedBy: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category Assignment</label>
                <div
                  style={{
                    padding: '0.65rem 0.8rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>🤖 Auto-categorized</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    (Wages / Safety / Environmental / General)
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Description *</label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Keywords like wage/salary → Wages, injury/unsafe → Safety, dust/pollution → Environmental
                </span>
              </div>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe the grievance in detail (e.g. 'Delay in overtime payment' or 'Defective PPE masks at bench 3')..."
                value={grievanceForm.description}
                onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', alignItems: 'center' }}>
              {grievanceActionMsg && (
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{grievanceActionMsg}</span>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowGrievanceForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingGrievance}
              >
                {submittingGrievance ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Inspection Drawer (Admin & Inspector) */}
      {canAdd && showInspectionForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
          <div className="card-title">
            <span>📋 Log New Inspection Audit</span>
          </div>

          <form onSubmit={handleCreateInspection}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Mine *</label>
                <select
                  className="form-select"
                  value={inspectionForm.mineId}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, mineId: e.target.value })}
                  required
                >
                  <option value="">-- Choose a Coal Mine --</option>
                  {mines.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.subsidiary})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Inspector Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Er. Sunil Verma"
                  value={inspectionForm.inspectorName}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, inspectorName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Inspection Type *</label>
                <select
                  className="form-select"
                  value={inspectionForm.type}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, type: e.target.value })}
                >
                  <option value="safety">Safety Audit</option>
                  <option value="environmental">Environmental Audit</option>
                  <option value="statutory">Statutory DGMS Compliance</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Audit Outcome Status *</label>
                <select
                  className="form-select"
                  value={inspectionForm.status}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, status: e.target.value })}
                >
                  <option value="passed">Passed</option>
                  <option value="pending">Pending</option>
                  <option value="follow-up-required">Follow-Up Required</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Severity Rating</label>
                <select
                  className="form-select"
                  value={inspectionForm.severity}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, severity: e.target.value })}
                >
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Findings & Observations</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Key audit findings, DGMS compliance notes, slope monitoring data..."
                value={inspectionForm.findings}
                onChange={(e) => setInspectionForm({ ...inspectionForm, findings: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', alignItems: 'center' }}>
              {inspectionActionMsg && (
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{inspectionActionMsg}</span>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowInspectionForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingInspection}
              >
                {submittingInspection ? 'Saving...' : 'Save Inspection'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 1: Mines Directory & Inspections */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-title">
          <span>⛏️ Coal Mines Directory</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {mines.length} {mines.length === 1 ? 'mine' : 'mines'} registered
          </span>
        </div>

        {minesLoading ? (
          <TableSkeleton rows={4} />
        ) : mines.length === 0 ? (
          <div className="empty-state">
            {minesNote || 'No mines found. Ensure MongoDB is connected and run npm run seed.'}
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
                  {canDelete && <th style={{ textAlign: 'center' }}>Actions</th>}
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
                            className="status-pill status-info"
                            style={{
                              background: isExpanded ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                              color: isExpanded ? '#818cf8' : 'var(--text-secondary)',
                              borderColor: isExpanded ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)',
                            }}
                          >
                            {mineInspections.length} {mineInspections.length === 1 ? 'audit' : 'audits'} {isExpanded ? '▲' : '▼'}
                          </span>
                        </td>
                        {canDelete && (
                          <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn-danger-sm"
                              onClick={() => handleDeleteMine(mine._id)}
                              title="Delete mine (Admin only)"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>

                      {/* Expanded Inspections Subpanel */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={canDelete ? 7 : 6} style={{ padding: 0 }}>
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
                                <InspectionListSkeleton count={2} />
                              ) : mineInspections.length === 0 ? (
                                <div
                                  className="empty-state"
                                  style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}
                                >
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
                                        {canDelete && (
                                          <button
                                            className="btn-danger-sm"
                                            onClick={() => handleDeleteInspection(insp._id)}
                                            title="Delete inspection audit (Admin only)"
                                          >
                                            Delete
                                          </button>
                                        )}
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

      {/* SECTION 2: Grievances Management Module */}
      <div className="card">
        <div className="card-title">
          <span>📢 Worker Grievances & Redressal</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filteredGrievances.length} of {grievances.length} grievances
          </span>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category:</span>
            <select
              className="form-select"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', width: 'auto' }}
              value={grievanceFilterCategory}
              onChange={(e) => setGrievanceFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="wages">Wages & Compensation</option>
              <option value="safety">Safety & Hazards</option>
              <option value="environmental">Environmental</option>
              <option value="general">General</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
            <select
              className="form-select"
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', width: 'auto' }}
              value={grievanceFilterStatus}
              onChange={(e) => setGrievanceFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in-review">In-Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {grievancesLoading ? (
          <ListSkeleton count={3} />
        ) : filteredGrievances.length === 0 ? (
          <div className="empty-state">
            No grievances matching the selected filters.
            {canAdd ? ' Use "+ File Grievance" above to submit one.' : ''}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {filteredGrievances.map((g) => {
              const mineName = g.mineId?.name || (typeof g.mineId === 'string' ? g.mineId : 'Unknown Mine');
              const subsidiary = g.mineId?.subsidiary ? ` • ${g.mineId.subsidiary}` : '';

              return (
                <div key={g._id} className="item-card" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                        {g.submittedBy}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#818cf8',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {g.category?.replace('-', ' ')}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        📍 {mineName}{subsidiary}
                      </span>
                    </div>

                    <div className="item-desc" style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                      {g.description}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Submitted: {g.dateSubmitted ? new Date(g.dateSubmitted).toLocaleDateString() : '-'}</span>
                      {g.dateResolved && <span>Resolved: {new Date(g.dateResolved).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span className={`status-pill ${getGrievanceStatusClass(g.status)}`}>
                      {g.status}
                    </span>

                    {/* Action buttons based on Role */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {canModifyStatus && g.status !== 'resolved' && (
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)' }}
                          onClick={() => handleUpdateGrievanceStatus(g._id, 'resolved')}
                          title="Mark as Resolved"
                        >
                          Resolve
                        </button>
                      )}
                      {canModifyStatus && g.status === 'submitted' && (
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)' }}
                          onClick={() => handleUpdateGrievanceStatus(g._id, 'in-review')}
                          title="Mark as In-Review"
                        >
                          Review
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleDeleteGrievance(g._id)}
                          title="Delete grievance (Admin only)"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
