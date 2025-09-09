import MetricCard from './MetricCard'
import './MetricsGrid.css'

const MetricsGrid = ({ metrics, loading, activeSection }) => {
  const formatCpuData = (cpuData) => {
    if (!cpuData || cpuData.length === 0) return null
    const latest = cpuData[0]
    const avgUsage = latest.averageUsage || latest.currentLoad || 0
    return {
      title: 'CPU Performance',
      subtitle: `${latest.cores || 'N/A'} Core System`,
      icon: '⚡',
      value: `${avgUsage.toFixed(1)}%`,
      trend: avgUsage > 70 ? 'high' : avgUsage > 40 ? 'medium' : 'low',
      details: [
        { label: 'Current Load', value: `${avgUsage.toFixed(1)}%` },
        { label: 'User Load', value: `${(latest.userLoad || 0).toFixed(1)}%` },
        { label: 'System Load', value: `${(latest.systemLoad || 0).toFixed(1)}%` },
        { label: 'Core Count', value: latest.cores || latest.coreCount || 'N/A' },
        { label: 'Last Update', value: new Date(latest.timestamp).toLocaleTimeString() }
      ],
      gradient: 'var(--primary-gradient)'
    }
  }

  const formatMemoryData = (memoryData) => {
    if (!memoryData || memoryData.length === 0) return null
    const latest = memoryData[0]
    const usagePercent = ((latest.used / latest.total) * 100)
    const usedGB = (latest.used / 1024 / 1024 / 1024)
    const totalGB = (latest.total / 1024 / 1024 / 1024)
    const freeGB = (latest.free / 1024 / 1024 / 1024)
    
    return {
      title: 'Memory Usage',
      subtitle: `${totalGB.toFixed(1)} GB Total Available`,
      icon: '💾',
      value: `${usagePercent.toFixed(1)}%`,
      trend: usagePercent > 80 ? 'high' : usagePercent > 60 ? 'medium' : 'low',
      details: [
        { label: 'Used Memory', value: `${usedGB.toFixed(2)} GB` },
        { label: 'Free Memory', value: `${freeGB.toFixed(2)} GB` },
        { label: 'Total Memory', value: `${totalGB.toFixed(2)} GB` },
        { label: 'Usage Ratio', value: `${usagePercent.toFixed(1)}%` },
        { label: 'Last Update', value: new Date(latest.timestamp).toLocaleTimeString() }
      ],
      gradient: 'var(--secondary-gradient)'
    }
  }

  const formatDiskData = (diskData) => {
    if (!diskData || diskData.length === 0) return null
    const latest = diskData[0]
    const totalReads = latest.disks.reduce((sum, disk) => sum + (disk.rIO || 0), 0)
    const totalWrites = latest.disks.reduce((sum, disk) => sum + (disk.wIO || 0), 0)
    const totalOperations = totalReads + totalWrites
    const activeDiskCount = latest.disks.length
    
    return {
      title: 'Disk I/O Activity',
      subtitle: `${activeDiskCount} Active Drive${activeDiskCount !== 1 ? 's' : ''}`,
      icon: '💿',
      value: totalOperations > 1000 ? `${(totalOperations / 1000).toFixed(1)}K` : totalOperations.toString(),
      trend: totalOperations > 1000 ? 'high' : totalOperations > 100 ? 'medium' : 'low',
      details: [
        { label: 'Read Operations', value: totalReads > 1000 ? `${(totalReads / 1000).toFixed(1)}K` : totalReads.toLocaleString() },
        { label: 'Write Operations', value: totalWrites > 1000 ? `${(totalWrites / 1000).toFixed(1)}K` : totalWrites.toLocaleString() },
        { label: 'Total I/O Ops', value: totalOperations.toLocaleString() },
        { label: 'Active Disks', value: activeDiskCount },
        { label: 'Last Update', value: new Date(latest.timestamp).toLocaleTimeString() }
      ],
      gradient: 'var(--success-gradient)'
    }
  }

  const formatNetworkData = (networkData) => {
    if (!networkData || networkData.length === 0) return null
    const latest = networkData[0]
    const totalInterfaces = latest.interfaces.length
    const activeInterfaces = latest.interfaces.filter(iface => 
      (iface.rx_bytes > 0 || iface.tx_bytes > 0) && !iface.iface.includes('lo')
    ).length
    
    const totalRxBytes = latest.interfaces.reduce((sum, iface) => sum + (iface.rx_bytes || 0), 0)
    const totalTxBytes = latest.interfaces.reduce((sum, iface) => sum + (iface.tx_bytes || 0), 0)
    const totalBytes = totalRxBytes + totalTxBytes
    
    const formatBytes = (bytes) => {
      if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
      if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`
      return `${bytes} B`
    }
    
    return {
      title: 'Network Activity',
      subtitle: `${totalInterfaces} Network Interface${totalInterfaces !== 1 ? 's' : ''}`,
      icon: '🌐',
      value: `${activeInterfaces}/${totalInterfaces}`,
      trend: activeInterfaces > totalInterfaces / 2 ? 'medium' : activeInterfaces > 0 ? 'low' : 'low',
      details: [
        { label: 'Active Interfaces', value: activeInterfaces },
        { label: 'Total Interfaces', value: totalInterfaces },
        { label: 'Bytes Received', value: formatBytes(totalRxBytes) },
        { label: 'Bytes Transmitted', value: formatBytes(totalTxBytes) },
        { label: 'Last Update', value: new Date(latest.timestamp).toLocaleTimeString() }
      ],
      gradient: 'var(--warning-gradient)'
    }
  }

  const getDisplayMetrics = () => {
    const allMetrics = []
    
    if (metrics.cpu) allMetrics.push(formatCpuData(metrics.cpu))
    if (metrics.memory) allMetrics.push(formatMemoryData(metrics.memory))
    if (metrics.disk) allMetrics.push(formatDiskData(metrics.disk))
    if (metrics.network) allMetrics.push(formatNetworkData(metrics.network))

    // Filter based on active section
    if (activeSection === 'overview') return allMetrics.filter(Boolean)
    if (activeSection === 'cpu') return [formatCpuData(metrics.cpu)].filter(Boolean)
    if (activeSection === 'memory') return [formatMemoryData(metrics.memory)].filter(Boolean)
    if (activeSection === 'disk') return [formatDiskData(metrics.disk)].filter(Boolean)
    if (activeSection === 'network') return [formatNetworkData(metrics.network)].filter(Boolean)
    
    return allMetrics.filter(Boolean)
  }

  const displayMetrics = getDisplayMetrics()

  if (loading && displayMetrics.length === 0) {
    return (
      <div className="metrics-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="metric-card loading">
            <div className="loading-placeholder">Loading...</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="metrics-grid">
      {displayMetrics.map((metric, index) => (
        <MetricCard 
          key={index}
          title={metric.title}
          subtitle={metric.subtitle}
          icon={metric.icon}
          value={metric.value}
          trend={metric.trend}
          details={metric.details}
          gradient={metric.gradient}
          loading={loading}
        />
      ))}
    </div>
  )
}

export default MetricsGrid
