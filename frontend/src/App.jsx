import { useState, useEffect } from 'react'
import './App.css'

// Simple fallback component to debug blank screen issue
function SimpleDashboard() {
  const [data, setData] = useState({
    cpu: null,
    memory: null,
    disk: null,
    network: null
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchAllMetrics = async () => {
      console.log('Fetching all metrics...')
      setLoading(true)
      
      const endpoints = ['cpu', 'memory', 'disk', 'network']
      const results = {}
      const errorResults = {}

      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching ${endpoint} data...`)
          const response = await fetch(`http://localhost:5001/api/${endpoint}`)
          console.log(`${endpoint} response:`, response.status)
          
          if (response.ok) {
            const jsonData = await response.json()
            console.log(`${endpoint} data:`, jsonData)
            results[endpoint] = Array.isArray(jsonData) ? jsonData[0] : jsonData
          } else {
            errorResults[endpoint] = `HTTP ${response.status}`
          }
        } catch (err) {
          console.error(`${endpoint} fetch error:`, err)
          errorResults[endpoint] = err.message
        }
      }

      setData(results)
      setErrors(errorResults)
      setLoading(false)
    }

    fetchAllMetrics()
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchAllMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getMetricCards = () => {
    const cards = []

    // CPU Card
    if (data.cpu) {
      const cpu = data.cpu
      const usage = cpu.averageUsage || cpu.currentLoad || 0
      cards.push(
        <div key="cpu" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '20px', 
          borderRadius: '12px',
          margin: '10px',
          minWidth: '300px'
        }}>
          <h3>⚡ CPU Performance</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{usage.toFixed(1)}%</div>
          <div>
            <p>User Load: {(cpu.userLoad || 0).toFixed(1)}%</p>
            <p>System Load: {(cpu.systemLoad || 0).toFixed(1)}%</p>
            <p>Cores: {cpu.cores || cpu.coreCount || 'N/A'}</p>
            <p>Updated: {new Date(cpu.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      )
    }

    // Memory Card
    if (data.memory) {
      const memory = data.memory
      const usagePercent = ((memory.used / memory.total) * 100)
      cards.push(
        <div key="memory" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          padding: '20px', 
          borderRadius: '12px',
          margin: '10px',
          minWidth: '300px'
        }}>
          <h3>💾 Memory Usage</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{usagePercent.toFixed(1)}%</div>
          <div>
            <p>Used: {formatBytes(memory.used)}</p>
            <p>Free: {formatBytes(memory.free)}</p>
            <p>Total: {formatBytes(memory.total)}</p>
            <p>Updated: {new Date(memory.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      )
    }

    // Disk Card
    if (data.disk) {
      const disk = data.disk
      const totalReads = disk.disks?.reduce((sum, d) => sum + (d.rIO || 0), 0) || 0
      const totalWrites = disk.disks?.reduce((sum, d) => sum + (d.wIO || 0), 0) || 0
      cards.push(
        <div key="disk" style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          padding: '20px', 
          borderRadius: '12px',
          margin: '10px',
          minWidth: '300px'
        }}>
          <h3>💿 Disk I/O</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{totalReads + totalWrites}</div>
          <div>
            <p>Read Ops: {totalReads.toLocaleString()}</p>
            <p>Write Ops: {totalWrites.toLocaleString()}</p>
            <p>Active Disks: {disk.disks?.length || 0}</p>
            <p>Updated: {new Date(disk.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      )
    }

    // Network Card
    if (data.network) {
      const network = data.network
      const totalInterfaces = network.interfaces?.length || 0
      const activeInterfaces = network.interfaces?.filter(iface => 
        (iface.rx_bytes > 0 || iface.tx_bytes > 0) && !iface.iface?.includes('lo')
      ).length || 0
      const totalRx = network.interfaces?.reduce((sum, iface) => sum + (iface.rx_bytes || 0), 0) || 0
      const totalTx = network.interfaces?.reduce((sum, iface) => sum + (iface.tx_bytes || 0), 0) || 0
      
      cards.push(
        <div key="network" style={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
          padding: '20px', 
          borderRadius: '12px',
          margin: '10px',
          minWidth: '300px'
        }}>
          <h3>🌐 Network Activity</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{activeInterfaces}/{totalInterfaces}</div>
          <div>
            <p>Active Interfaces: {activeInterfaces}</p>
            <p>RX: {formatBytes(totalRx)}</p>
            <p>TX: {formatBytes(totalTx)}</p>
            <p>Updated: {new Date(network.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      )
    }

    return cards
  }

  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      background: '#1a1a2e',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>
        🚀 MERN Telemetry Dashboard - All Metrics
      </h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2>📊 System Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p><strong>Status:</strong> {loading ? '🔄 Loading...' : '✅ Ready'}</p>
            <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
          <div>
            <p><strong>CPU API:</strong> {data.cpu ? '✅' : errors.cpu ? '❌' : '⏳'}</p>
            <p><strong>Memory API:</strong> {data.memory ? '✅' : errors.memory ? '❌' : '⏳'}</p>
          </div>
          <div>
            <p><strong>Disk API:</strong> {data.disk ? '✅' : errors.disk ? '❌' : '⏳'}</p>
            <p><strong>Network API:</strong> {data.network ? '✅' : errors.network ? '❌' : '⏳'}</p>
          </div>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div style={{ 
          background: '#ff6b6b', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>❌ API Errors:</h3>
          {Object.entries(errors).map(([endpoint, error]) => (
            <p key={endpoint}><strong>{endpoint}:</strong> {error}</p>
          ))}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {getMetricCards()}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          🔄 Refresh Page
        </button>
        
        <button 
          onClick={() => {
            setLoading(true)
            window.location.reload()
          }}
          style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          � Refresh Data
        </button>
      </div>
    </div>
  )
}

function App() {
  console.log('App component rendering...')
  
  // Use simple dashboard for now to debug the blank screen issue
  return <SimpleDashboard />
}

export default App
