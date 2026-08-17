$ErrorActionPreference = 'Stop'
Set-Location 'D:\Board'
$backupDir = '.audit-backup'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item 'src\App.jsx' "$backupDir\App.before-bounded-splash.jsx.bak" -Force
Copy-Item 'src\components\SplashScreen\SplashScreen.jsx' "$backupDir\SplashScreen.before-bounded-splash.jsx.bak" -Force
Copy-Item 'package.json' "$backupDir\package.before-bounded-splash.json.bak" -Force

$splashState = @'
export const SPLASH_MAX_VISIBLE_MS = 1500
export const SPLASH_EXIT_DELAY_MS = 600

const terminalStates = new Set(['done'])

export function advanceSplashState(current, event) {
  if (terminalStates.has(current)) return current

  switch (event) {
    case 'ready':
    case 'timeout':
      return current === 'visible' ? 'leaving' : current
    case 'hidden':
      return current === 'leaving' ? 'done' : current
    default:
      return current
  }
}
'@
Set-Content -Path 'src\lib\splashState.js' -Value $splashState -NoNewline

$splashTest = @'
import assert from 'node:assert/strict'
import test from 'node:test'
import { advanceSplashState } from './splashState.js'

test('splash exits after either readiness or its visible-state watchdog', () => {
  assert.equal(advanceSplashState('visible', 'ready'), 'leaving')
  assert.equal(advanceSplashState('visible', 'timeout'), 'leaving')
  assert.equal(advanceSplashState('leaving', 'hidden'), 'done')
})

test('splash state is idempotent and cannot reopen or loop after completion', () => {
  assert.equal(advanceSplashState('leaving', 'ready'), 'leaving')
  assert.equal(advanceSplashState('done', 'ready'), 'done')
  assert.equal(advanceSplashState('done', 'timeout'), 'done')
  assert.equal(advanceSplashState('done', 'hidden'), 'done')
})
'@
Set-Content -Path 'src\lib\splashState.test.js' -Value $splashTest -NoNewline

$splashPath = 'src\components\SplashScreen\SplashScreen.jsx'
$splash = Get-Content -Raw $splashPath
$oldSplash = @'
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
'@
$newSplash = @'
import { useCallback, useEffect, useRef } from 'react'
import siteIcon from '../../assets/images/site_icon.png'
import { SPLASH_EXIT_DELAY_MS } from '../../lib/splashState'

export default function SplashScreen({ leaving, onHidden }) {
  const didHide = useRef(false)
  const finish = useCallback(() => {
    if (didHide.current) return
    didHide.current = true
    onHidden()
  }, [onHidden])

  useEffect(() => {
    if (!leaving) {
      didHide.current = false
      return
    }
    const timeoutId = window.setTimeout(finish, SPLASH_EXIT_DELAY_MS)
    return () => window.clearTimeout(timeoutId)
  }, [leaving, finish])

  return <div
    className={`splash-screen${leaving ? ' is-leaving' : ''}`}
    aria-label="Opening diagram board"
    role="status"
    onTransitionEnd={event => {
      if (leaving && event.propertyName === 'opacity') finish()
    }}
  >
'@
if (-not $splash.Contains($oldSplash)) { throw 'SplashScreen source did not match the expected audited implementation.' }
Set-Content -Path $splashPath -Value $splash.Replace($oldSplash, $newSplash) -NoNewline

$appPath = 'src\App.jsx'
$app = Get-Content -Raw $appPath
$oldImport = "import { sanitizeShape } from './lib/geometry'"
$newImport = "import { sanitizeShape } from './lib/geometry'`nimport { advanceSplashState, SPLASH_EXIT_DELAY_MS, SPLASH_MAX_VISIBLE_MS } from './lib/splashState'"
if (-not $app.Contains($oldImport)) { throw 'App import insertion point was not found.' }
$app = $app.Replace($oldImport, $newImport)
$oldAppState = @'
export default function App() {
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
$newAppState = @'
export default function App() {
  const [splash, setSplash] = useState('visible')
  const advanceSplash = useCallback(event => {
    setSplash(current => advanceSplashState(current, event))
  }, [])
  const dismiss = useCallback(() => advanceSplash('ready'), [advanceSplash])
  const finishSplash = useCallback(() => advanceSplash('hidden'), [advanceSplash])

  // The workspace signals readiness on its first frame. This independent guard
  // keeps the opening overlay from becoming a permanent screen if that signal is
  // missed by a browser extension, a stalled animation frame, or a future change.
  useEffect(() => {
    const id = window.setTimeout(() => advanceSplash('timeout'), SPLASH_MAX_VISIBLE_MS)
    return () => window.clearTimeout(id)
  }, [advanceSplash])

  useEffect(() => {
    if (splash !== 'leaving') return
    const id = window.setTimeout(finishSplash, SPLASH_EXIT_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [splash, finishSplash])
'@
if (-not $app.Contains($oldAppState)) { throw 'App splash lifecycle did not match the expected audited implementation.' }
$app = $app.Replace($oldAppState, $newAppState)
$oldHidden = "{splash !== 'done' && <SplashScreen leaving={splash === 'leaving'} onHidden={() => setSplash('done')} />}"
$newHidden = "{splash !== 'done' && <SplashScreen leaving={splash === 'leaving'} onHidden={finishSplash} />}"
if (-not $app.Contains($oldHidden)) { throw 'App splash render hook was not found.' }
Set-Content -Path $appPath -Value $app.Replace($oldHidden, $newHidden) -NoNewline

$packagePath = 'package.json'
$package = Get-Content -Raw $packagePath
$oldTest = '"test": "node --test src/context/historyState.test.js"'
$newTest = '"test": "node --test src/context/historyState.test.js src/lib/splashState.test.js"'
if (-not $package.Contains($oldTest)) { throw 'Test script did not match the expected implementation.' }
Set-Content -Path $packagePath -Value $package.Replace($oldTest, $newTest) -NoNewline

Write-Output 'Bounded splash state changes applied.'
