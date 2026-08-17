$ErrorActionPreference = 'Stop'

function Replace-Required {
  param(
    [string]$Path,
    [string]$Old,
    [string]$New,
    [string]$Label
  )

  $content = [IO.File]::ReadAllText($Path)
  if (-not $content.Contains($Old)) {
    throw "Expected $Label was not found in $Path"
  }
  [IO.File]::WriteAllText($Path, $content.Replace($Old, $New))
}

$appPath = 'D:\Board\src\App.jsx'
$appContent = [IO.File]::ReadAllText($appPath)

$readyPattern = '  useEffect\(\(\) => \{\r?\n    const frame = requestAnimationFrame\(onReady\)\r?\n    return \(\) => cancelAnimationFrame\(frame\)\r?\n  \}, \[onReady\]\)'
$readyReplacement = @'
  useEffect(() => {
    let completed = false
    const finish = () => {
      if (completed) return
      completed = true
      onReady()
    }
    const frame = requestAnimationFrame(finish)
    const fallbackId = window.setTimeout(finish, 600)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(fallbackId)
    }
  }, [onReady])
'@
$updatedApp = [regex]::Replace($appContent, $readyPattern, $readyReplacement, 1)
if ($updatedApp -eq $appContent) {
  throw 'The canvas-ready effect was not updated.'
}

$splashPattern = '  const \[splash, setSplash\] = useState\(''visible''\)\r?\n  const startedAt = useRef\(performance\.now\(\)\)\r?\n  const dismiss = useCallback\(\(\) => \{\r?\n    const wait = Math\.max\(0, 6500 - \(performance\.now\(\) - startedAt\.current\)\)\r?\n    window\.setTimeout\(\(\) => setSplash\(''leaving''\), wait\)\r?\n  \}, \[\]\)\r?\n  useEffect\(\(\) => \{\r?\n    if \(splash !== ''leaving''\) return\r?\n    const id = window\.setTimeout\(\(\) => setSplash\(''done''\), 800\)\r?\n    return \(\) => window\.clearTimeout\(id\)\r?\n  \}, \[splash\]\)'
$splashReplacement = @'
  const [splash, setSplash] = useState('visible')
  const dismiss = useCallback(() => {
    setSplash(current => current === 'visible' ? 'leaving' : current)
  }, [])
  useEffect(() => {
    if (splash !== 'leaving') return
    const id = window.setTimeout(() => setSplash('done'), 600)
    return () => window.clearTimeout(id)
  }, [splash])
'@
$updatedApp = [regex]::Replace($updatedApp, $splashPattern, $splashReplacement, 1)
if ($updatedApp -eq $appContent -or $updatedApp -notmatch "setSplash\(current => current === 'visible' \? 'leaving' : current\)") {
  throw 'The splash controller was not updated.'
}
[IO.File]::WriteAllText($appPath, $updatedApp)

$imageAssetPath = 'D:\Board\src\hooks\useImageAsset.js'
Replace-Required -Path $imageAssetPath -Label 'image-load settlement guard' -Old '    const finish = failed => {' -New @'
    let settled = false
    const finish = failed => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      record.image.onload = null
      record.image.onerror = null
'@
Replace-Required -Path $imageAssetPath -Label 'image-load failure cleanup' -Old '      record.loaded = !failed' -New @'
      record.loaded = !failed
      if (failed) record.image.removeAttribute('src')
'@
Replace-Required -Path $imageAssetPath -Label 'image-load timeout' -Old '    record.image.onload = () => finish(false)' -New @'
    const timeout = window.setTimeout(() => finish(true), LOAD_TIMEOUT_MS)
    record.image.onload = () => finish(false)
'@

$splashPath = 'D:\Board\src\components\SplashScreen\SplashScreen.jsx'
$splashSource = @'
import { useEffect } from 'react'
import siteIcon from '../../assets/images/site_icon.png'

const EXIT_FALLBACK_MS = 600

export default function SplashScreen({ leaving, onHidden }) {
  useEffect(() => {
    if (!leaving) return
    const timeoutId = window.setTimeout(onHidden, EXIT_FALLBACK_MS)
    return () => window.clearTimeout(timeoutId)
  }, [leaving, onHidden])

  return <div
    className={`splash-screen${leaving ? ' is-leaving' : ''}`}
    aria-label="Opening diagram board"
    role="status"
    onTransitionEnd={event => {
      if (leaving && event.propertyName === 'opacity') onHidden()
    }}
  >
    <div className="splash-content">
      <img className="splash-icon" src={siteIcon} alt="" />
      <div className="splash-loader" aria-hidden="true"><span /></div>
    </div>
  </div>
}
'@
[IO.File]::WriteAllText($splashPath, $splashSource)

$errorBoundaryPath = 'D:\Board\src\components\ErrorBoundary\ErrorBoundary.jsx'
$errorBoundarySource = @'
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
            {retryUsed && <p style={{ margin: '18px 0 0', fontSize: 14, lineHeight: 1.45, color: '#64748b' }}>The reopen attempt did not succeed, so another automatic retry will not run. Starting a fresh board clears this device’s saved board.</p>}
          </section>
        </main>
      )
    }
    return cloneElement(this.props.children, { key: resetKey })
  }
}
'@
[IO.File]::WriteAllText($errorBoundaryPath, $errorBoundarySource)

Write-Output 'Loading-state hardening patch applied.'
