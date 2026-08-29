import { useEffect, useRef } from 'react'
import siteIcon from '../../assets/images/site-logo-removebg-preview.png'

const FADE_DURATION_MS = 500

export default function SplashScreen({ canHide = false, onHidden }) {
  const onHiddenRef = useRef(onHidden)
  onHiddenRef.current = onHidden
  const elRef = useRef(null)
  const leavingRef = useRef(false)

  useEffect(() => {
    const el = elRef.current
    if (!el || !canHide || leavingRef.current) return
    leavingRef.current = true
    el.classList.add('is-leaving')

    const onEnd = event => {
      if (event.propertyName !== 'opacity') return
      el.removeEventListener('transitionend', onEnd)
      onHiddenRef.current?.()
    }
    el.addEventListener('transitionend', onEnd)
    const fallback = window.setTimeout(() => onHiddenRef.current?.(), FADE_DURATION_MS + 100)
    return () => {
      el.removeEventListener('transitionend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [canHide])

  return <div
    ref={elRef}
    className="splash-screen"
    aria-label="Opening Kanvas"
    role="status"
  >
    <div className="splash-content">
      <img className="splash-icon" src={siteIcon} alt="Kanvas logo" />
      <div className="splash-loader" aria-hidden="true"><span /></div>
    </div>
  </div>
}
