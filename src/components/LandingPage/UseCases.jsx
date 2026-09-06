const useCases = [
  {
    title: 'Untangle an idea',
    desc: 'Put rough thoughts on the page, group them, and draw the links between them.',
    color: '#EBC9E8',
  },
  {
    title: 'Map a flow',
    desc: 'Sketch screens, steps, and decision points before committing them to a build.',
    color: '#FFF6E6',
  },
  {
    title: 'Explain a concept',
    desc: 'Use shapes, labels, and arrows to make a complex thought easier to follow.',
    color: '#E8F1E8',
  },
  {
    title: 'Plan on one page',
    desc: 'Lay out a lightweight plan, prioritise the pieces, and keep the whole picture in view.',
    color: '#F7DF78',
  },
  {
    title: 'Collect references',
    desc: 'Drop in images, add annotations, and keep visual references beside your working notes.',
    color: '#F3A9B9',
  },
]

export default function UseCases() {
  return (
    <section className="lp-use-cases lp-bg-white" id="use-cases">
      <div className="lp-section">
        <h2 className="lp-section-title">Useful before the work is polished</h2>
        <div className="lp-use-cases__grid">
          {useCases.map(uc => (
            <div key={uc.title} className="lp-use-cases__card">
              <div className="lp-use-cases__visual" style={{ background: uc.color }}>
                <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
                  <rect x="10" y="10" width="80" height="60" rx="6" stroke="#171717" strokeWidth="1.5" fill="rgba(255,255,255,0.5)"/>
                  <rect x="18" y="18" width="24" height="16" rx="3" stroke="#171717" strokeWidth="1" fill="rgba(255,255,255,0.3)"/>
                  <rect x="46" y="18" width="24" height="16" rx="3" stroke="#171717" strokeWidth="1" fill="rgba(255,255,255,0.3)"/>
                  <rect x="18" y="40" width="36" height="24" rx="3" stroke="#171717" strokeWidth="1" fill="rgba(255,255,255,0.3)"/>
                  <circle cx="72" cy="52" r="10" stroke="#171717" strokeWidth="1" fill="rgba(255,255,255,0.3)"/>
                </svg>
              </div>
              <h3 className="lp-use-cases__title">{uc.title}</h3>
              <p className="lp-use-cases__desc">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
