import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <pre style={{ color: '#ff6b6b' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Starting React app...')

try {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
  console.log('React app rendered successfully')
} catch (error) {
  console.error('Failed to render React app:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: white; background: #1a1a2e; min-height: 100vh;">
      <h1>Failed to load application</h1>
      <p style="color: #ff6b6b;">Error: ${error.message}</p>
    </div>
  `
}
