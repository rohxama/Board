import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-bg-grid" aria-hidden="true" />

      <div className="landing-tags" aria-hidden="true">
        <span className="landing-tag landing-tag--case">Case</span>
        <span className="landing-tag landing-tag--design">Design</span>
        <span className="landing-tag landing-tag--multi">Multi-page website</span>
      </div>

      <div className="landing-stars" aria-hidden="true">
        <span className="star star--1">+</span>
        <span className="star star--2">+</span>
        <span className="star star--3">+</span>
        <span className="star star--4">+</span>
        <span className="star star--5">+</span>
        <span className="star star--6">+</span>
      </div>

      <div className="landing-deco landing-deco--top-right" aria-hidden="true">
        <svg viewBox="0 0 60 60" fill="none"><path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" stroke="#c8e6c9" strokeWidth="2" fill="none"/></svg>
      </div>

      <div className="laptop-frame">
        <div className="laptop-screen">
          <div className="site-header">
            <span className="site-nav-item">Free Lesson</span>
            <span className="site-nav-item">Our services</span>
            <span className="site-nav-item">About us</span>
            <span className="site-nav-item site-nav-item--active">Conversation Clubs</span>
            <span className="site-nav-item">Level test</span>
            <span className="site-nav-item">FAQ</span>
            <span className="site-nav-item">Contact us</span>
          </div>

          <div className="site-hero">
            <span className="hero-flag" aria-hidden="true">
              <svg viewBox="0 0 24 16" fill="none">
                <rect x="0" y="0" width="8" height="16" fill="#002395"/>
                <rect x="8" y="0" width="8" height="16" fill="#ffffff"/>
                <rect x="16" y="0" width="8" height="16" fill="#ED2939"/>
              </svg>
            </span>
            <span className="hero-star hero-star--1" aria-hidden="true">+</span>
            <span className="hero-star hero-star--2" aria-hidden="true">+</span>
            <span className="hero-star hero-star--3" aria-hidden="true">+</span>

            <h1 className="hero-title">
              <span className="hero-line">PRACTICE</span>
              <span className="hero-line hero-line--right">FRENCH</span>
              <span className="hero-line">ONLINE WITH</span>
              <span className="hero-line">A <span className="hero-highlight">NATIVE</span> TEACHER</span>
            </h1>

            <span className="hero-eiffel" aria-hidden="true">
              <svg viewBox="0 0 40 80" fill="none">
                <path d="M20 0 L18 20 L10 60 L5 80 L15 80 L18 60 L20 40 L22 60 L25 80 L35 80 L30 60 L22 20 Z" stroke="#b39ddb" strokeWidth="2" fill="none"/>
              </svg>
            </span>

            <span className="hero-croissant" aria-hidden="true">
              <svg viewBox="0 0 32 20" fill="none">
                <path d="M4 16 Q8 4 16 4 Q24 4 28 16 Q20 12 16 12 Q12 12 4 16Z" stroke="#ffb74d" strokeWidth="2" fill="none"/>
              </svg>
            </span>

            <span className="hero-mustache" aria-hidden="true">
              <svg viewBox="0 0 40 16" fill="none">
                <path d="M2 12 Q8 2 16 6 Q20 8 20 8 Q20 8 24 6 Q32 2 38 12" stroke="#5c6bc0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>

            <span className="hero-seal" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#66bb6a" strokeWidth="2"/>
                <path d="M8 12 L11 15 L16 9" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>

            <div className="hero-cta">
              <button className="join-btn">Join <span className="join-arrow">→</span></button>
            </div>
          </div>

          <div className="site-features">
            <div className="feature-card feature-card--1">
              <span className="feature-icon" aria-hidden="true">👩‍🏫</span>
              <p>Available for all levels<br/>from A1 to C2</p>
            </div>
            <div className="feature-card feature-card--2">
              <span className="feature-icon" aria-hidden="true">💻</span>
              <p>Interactive classes<br/>on a convenient online platform</p>
            </div>
            <div className="feature-card feature-card--3">
              <span className="feature-icon" aria-hidden="true">👨‍🏫</span>
              <p>Certified instructors and<br/>personalized feedback</p>
            </div>
          </div>
        </div>
        <div className="laptop-base" />
      </div>

      <div className="landing-deco landing-deco--bottom-left" aria-hidden="true">
        <svg viewBox="0 0 50 70" fill="none">
          <path d="M25 5 L22 20 L10 55 L5 70 L18 70 L22 55 L25 35 L28 55 L32 70 L45 70 L40 55 L28 20 Z" stroke="#ef9a9a" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="landing-deco landing-deco--rocket" aria-hidden="true">
        <svg viewBox="0 0 24 40" fill="none">
          <path d="M12 0 C12 0 8 10 8 20 L6 28 L12 24 L18 28 L16 20 C16 10 12 0 12 0Z" stroke="#e57373" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="16" r="2" stroke="#e57373" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      <section className="landing-bottom">
        <div className="bottom-header">
          <h2 className="bottom-title">Learn French for academic,<br/>professional and social contexts</h2>
          <div className="hashtag-bubbles">
            <span className="hashtag hashtag--1">#LanguageSkillsBoost</span>
            <span className="hashtag hashtag--2">#LanguageSkillsBoost</span>
            <span className="hashtag hashtag--3">#FrenchWithConfidence</span>
            <span className="hashtag hashtag--4">#SpeakWithConfidence</span>
          </div>
        </div>

        <div className="bottom-cards">
          <div className="bottom-card">
            <span className="bottom-card-icon" aria-hidden="true">🗣️</span>
            <p>Start speaking easily and fluently! Discuss various topics in small groups</p>
          </div>
          <div className="bottom-card">
            <span className="bottom-card-icon" aria-hidden="true">📝</span>
            <p>Improve your vocabulary and grammar as well as writing, reading, listening and speaking skills</p>
          </div>
          <div className="bottom-card">
            <span className="bottom-card-icon" aria-hidden="true">🎯</span>
            <p>Prepare for DELF/DALF and other language exams or academic tests</p>
          </div>
          <div className="bottom-card">
            <span className="bottom-card-icon" aria-hidden="true">🌍</span>
            <p>Connect to our diverse community of language enthusiasts, share your thoughts and experiences with fellow learners</p>
          </div>
        </div>
      </section>
    </div>
  )
}
