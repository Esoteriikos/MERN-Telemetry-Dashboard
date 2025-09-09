import './MetricCard.css'

const MetricCard = ({ title, value, trend, details, gradient, loading, subtitle, icon }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'high': return '#ff6b6b'
      case 'medium': return '#ffd93d'
      case 'low': return '#6bcf7f'
      default: return '#6bcf7f'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'high': return '⚠️'
      case 'medium': return '📊'
      case 'low': return '✅'
      default: return '📊'
    }
  }

  const getTrendLabel = (trend) => {
    switch (trend) {
      case 'high': return 'High Usage'
      case 'medium': return 'Moderate'
      case 'low': return 'Normal'
      default: return 'Normal'
    }
  }

  return (
    <div className={`metric-card ${loading ? 'loading' : ''}`}>
      <div className="metric-header">
        <div className="metric-title-section">
          {icon && <span className="metric-icon">{icon}</span>}
          <div>
            <h3 className="metric-title">{title}</h3>
            {subtitle && <p className="metric-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div 
          className="trend-indicator"
          style={{ color: getTrendColor(trend) }}
          title={getTrendLabel(trend)}
        >
          {getTrendIcon(trend)}
        </div>
      </div>
      
      <div className="metric-value-container">
        <div 
          className="metric-value"
          style={{ background: gradient }}
        >
          {value}
        </div>
        <div className="trend-label" style={{ color: getTrendColor(trend) }}>
          {getTrendLabel(trend)}
        </div>
      </div>
      
      {details && details.length > 0 && (
        <div className="metric-details">
          {details.map((detail, index) => (
            <div key={index} className="detail-row">
              <span className="detail-label">{detail.label}</span>
              <span className="detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  )
}

export default MetricCard
