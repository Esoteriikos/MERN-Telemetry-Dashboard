import './Sidebar.css'

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'cpu', label: 'CPU Metrics', icon: '⚡' },
    { id: 'memory', label: 'Memory', icon: '💾' },
    { id: 'disk', label: 'Disk I/O', icon: '💿' },
    { id: 'network', label: 'Network', icon: '🌐' },
    { id: 'logs', label: 'Logs', icon: '📝' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📈</span>
          <span className="logo-text">Telemetry</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
