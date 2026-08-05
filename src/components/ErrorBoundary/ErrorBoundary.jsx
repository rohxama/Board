import { cloneElement, Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: 0 }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('Canvas error:', error, info) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: 16 }}>The board hit an unexpected error. Your drawing was not saved.</p>
            <button style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }} onClick={() => this.setState(prev => ({ error: null, resetKey: prev.resetKey + 1 }))}>Try again</button>
          </div>
        </div>
      )
    }
    return cloneElement(this.props.children, { key: this.state.resetKey })
  }
}
