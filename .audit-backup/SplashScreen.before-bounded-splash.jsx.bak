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