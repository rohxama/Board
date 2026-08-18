import { cloneElement, Component } from 'react'

const BOARD_STORAGE_KEY = 'diagram-board-v1'
const VISITOR_STORAGE_KEY = 'whiteboard_has_visited'

export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: 0, retryUsed: false }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Canvas error:', error, info)
  }

  reopenBoard = () => {
    this.setState(previous => ({
      error: null,
      resetKey: previous.resetKey + 1,
      retryUsed: true,
    }))
  }

  startFresh = () => {
    try {
      window.localStorage.removeItem(BOARD_STORAGE_KEY)
      window.localStorage.removeItem(VISITOR_STORAGE_KEY)
    } catch (_error) {
      // Storage may be unavailable; the in-memory remount is still useful.
    }
    this.setState(previous => ({
      error: null,
      resetKey: previous.resetKey + 1,
      retryUsed: false,
    }))
  }

  render() {
    const { error, resetKey, retryUsed } = this.state
    if (error) {
      return (
        <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24, background: '#f8fafc', color: '#0f172a' }}>
          <section style={{ width: 'min(100%, 440px)', padding: 28, borderRadius: 16, background: '#fff', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)' }}>
            <h1 style={{ margin: '0 0 10px', fontSize: 24 }}>The board could not open</h1>
            <p style={{ margin: '0 0 20px', lineHeight: 1.5, color: '#475569' }}>
              Your workspace has been paused rather than retried automatically. You can reopen it once or start with a clean board.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {!retryUsed && <button type="button" onClick={this.reopenBoard} style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 8, padding: '10px 14px', fontWeight: 600 }}>Reopen board</button>}
              <button type="button" onClick={this.startFresh} style={{ background: '#e2e8f0', color: '#0f172a', border: 0, borderRadius: 8, padding: '10px 14px', fontWeight: 600 }}>Start a fresh board</button>
            </div>
            {retryUsed && <p style={{ margin: '18px 0 0', fontSize: 14, lineHeight: 1.45, color: '#64748b' }}>The reopen attempt did not succeed, so another automatic retry will not run. Starting a fresh board clears this deviceâ€™s saved board.</p>}
          </section>
        </main>
      )
    }
    return cloneElement(this.props.children, { key: resetKey })
  }
}