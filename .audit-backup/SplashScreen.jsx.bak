import siteIcon from '../../assets/images/site_icon.png'

export default function SplashScreen({ leaving, onHidden }) {
  return <div className={`splash-screen${leaving ? ' is-leaving' : ''}`} aria-label="Loading diagram board" role="status" onTransitionEnd={event => { if (leaving && event.propertyName === 'opacity') onHidden() }}>
    <div className="splash-content">
      <img className="splash-icon" src={siteIcon} alt="" />
      <div className="splash-loader" aria-hidden="true"><span/></div>
    </div>
  </div>
}
