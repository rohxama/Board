const useCases = [
  {
    title: 'Brainstorming',
    desc: 'Capture ideas, cluster thoughts and connect different perspectives.',
    color: '#EBC9E8',
  },
  {
    title: 'Wireframing',
    desc: 'Map flows and design interfaces from rough concepts to clearer structures.',
    color: '#FFF6E6',
  },
  {
    title: 'Teaching',
    desc: 'Explain concepts visually and keep students engaged.',
    color: '#E8F1E8',
  },
  {
    title: 'Planning',
    desc: 'Break down projects, prioritize tasks and stay aligned.',
    color: '#F7DF78',
  },
  {
    title: 'Presentations',
    desc: 'Turn a canvas into a visual story people remember.',
    color: '#F3A9B9',
  },
]

export default function UseCases() {
  return (
    <section className="lp-use-cases lp-bg-white" id="use-cases">
      <div className="lp-section">
        <h2 className="lp-section-title">Built for every way you work</h2>
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
