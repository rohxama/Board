import { Component, cloneElement } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: 0, retryCount: 0 }
  retryTimer = 0

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Keep diagnostics in the developer console, never in the normal user UI.
    console.error('Whiteboard operation recovered:', error, info)
    if (this.state.retryCount >= 2) return
    this.retryTimer = window.setTimeout(() => {
      this.setState(previous => ({
        error: null,
        resetKey: previous.resetKey + 1,
        retryCount: previous.retryCount + 1,
      }))
    }, 0)
  }

  componentWillUnmount() {
    if (this.retryTimer) window.clearTimeout(this.retryTimer)
  }

  render() {
    const { error, resetKey, retryCount } = this.state
    if (error) {
      return <div className="workspace-recovery-toast" role="status" aria-live="polite">
        {retryCount < 2 ? 'That action encountered a problem. Your current board is still safe; retrying this area.' : 'That action could not be completed. Your current board is still safe; please try again.'}
      </div>
    }
    return cloneElement(this.props.children, { key: resetKey })
  }
}
