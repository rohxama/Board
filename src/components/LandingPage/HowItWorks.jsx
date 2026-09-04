const steps = [
  {
    num: '1',
    title: 'Start with a blank canvas',
    desc: 'Open a flexible infinite canvas and choose the tools you need.',
    color: '#EBC9E8',
  },
  {
    num: '2',
    title: 'Build your idea',
    desc: 'Add shapes, text, drawings, images, arrows and connections.',
    color: '#FFF6E6',
  },
  {
    num: '3',
    title: 'Share or export',
    desc: 'Save, export, or share your finished visual work.',
    color: '#E8F1E8',
  },
]

export default function HowItWorks() {
  return (
    <section className="lp-how-it-works lp-bg-white" id="how-it-works">
      <div className="lp-section">
        <h2 className="lp-section-title">Get started in seconds</h2>
        <div className="lp-how-it-works__grid">
          {steps.map((step, i) => (
            <div key={step.num} className="lp-how-it-works__card-wrap">
              <div className="lp-how-it-works__card" style={{ background: step.color }}>
                <div className="lp-how-it-works__num">{step.num}</div>
                <h3 className="lp-how-it-works__title">{step.title}</h3>
                <p className="lp-how-it-works__desc">{step.desc}</p>
                <div className="lp-how-it-works__visual">
                  <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                    {i === 0 && (
                      <>
                        <rect x="10" y="10" width="100" height="60" rx="8" stroke="#171717" strokeWidth="1.5" fill="rgba(255,255,255,0.6)"/>
                        <circle cx="30" cy="30" r="8" stroke="#171717" strokeWidth="1.5" fill="rgba(255,255,255,0.4)"/>
                        <rect x="50" y="20" width="40" height="20" rx="4" stroke="#171717" strokeWidth="1.5" fill="rgba(255,255,255,0.4)"/>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <rect x="10" y="20" width="30" height="30" rx="4" stroke="#171717" strokeWidth="1.5" fill="rgba(247,223,120,0.5)"/>
                        <circle cx="80" cy="35" r="15" stroke="#171717" strokeWidth="1.5" fill="rgba(187,221,191,0.5)"/>
                        <path d="M45 35 L65 35" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M60 30 L65 35 L60 40" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <rect x="20" y="15" width="80" height="50" rx="8" stroke="#171717" strokeWidth="1.5" fill="rgba(255,255,255,0.6)"/>
                        <path d="M45 40 L55 30 L65 40" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M55 30 V55" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                      </>
                    )}
                  </svg>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="lp-how-it-works__arrow">
                  <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                    <path d="M2 10 H32" stroke="#171717" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round"/>
                    <path d="M28 5 L35 10 L28 15" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
