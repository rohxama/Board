const features = [
  {
    title: 'Infinite Canvas',
    desc: 'Create without running out of space.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4L20 4L20 20"/>
        <path d="M20 20L4 20L4 4"/>
        <path d="M8 12H16M12 8V16"/>
      </svg>
    ),
    color: '#EBC9E8',
  },
  {
    title: 'Shapes & Freehand',
    desc: 'Draw, sketch and design with flexible visual tools.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1"/>
        <circle cx="17" cy="7" r="4"/>
        <path d="M7 15L3 21H21L15 15"/>
      </svg>
    ),
    color: '#FFF6E6',
  },
  {
    title: 'Smart Arrows',
    desc: 'Connect ideas with clean arrows and visual relationships.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19L19 5"/>
        <path d="M14 5H19V10"/>
      </svg>
    ),
    color: '#E8F1E8',
  },
  {
    title: 'Images & Text',
    desc: 'Bring visual references, labels and explanations together.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="M3 16L8 11L13 16"/>
        <path d="M14 14L17 11L21 15"/>
      </svg>
    ),
    color: '#F7DF78',
  },
  {
    title: 'Undo & Redo',
    desc: 'Experiment freely and recover your previous work.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10H13C16 10 18 12 18 15C18 18 16 20 13 20H8"/>
        <path d="M7 6L3 10L7 14"/>
      </svg>
    ),
    color: '#F3A9B9',
  },
  {
    title: 'Zoom & Pan',
    desc: 'Move from the big picture to tiny details.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <path d="M16 16L21 21"/>
        <path d="M11 8V14M8 11H14"/>
      </svg>
    ),
    color: '#CDB6E8',
  },
  {
    title: 'Export Anywhere',
    desc: 'Export your work for sharing, presenting or continuing elsewhere.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3V15M12 3L8 7M12 3L16 7"/>
        <path d="M4 14V19C4 20 5 21 6 21H18C19 21 20 20 20 19V14"/>
      </svg>
    ),
    color: '#BBDDBF',
  },
  {
    title: 'Ready to Share',
    desc: 'Designed for team workflows and sharing with others.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5 21C5 17 8 14 12 14C16 14 19 17 19 21"/>
        <circle cx="19" cy="8" r="3"/>
        <path d="M20 17C21 16 22 15.5 23 15.5"/>
      </svg>
    ),
    color: '#F5C7A8',
  },
]

export default function FeatureGrid() {
  return (
    <section className="lp-features lp-bg-white" id="features">
      <div className="lp-section">
        <h2 className="lp-section-title">Everything you need to think visually</h2>
        <div className="lp-features__grid">
          {features.map(f => (
            <div key={f.title} className="lp-features__card">
              <div className="lp-features__icon" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3 className="lp-features__title">{f.title}</h3>
              <p className="lp-features__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
