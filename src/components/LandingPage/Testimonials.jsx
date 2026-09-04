const testimonials = [
  {
    quote: 'Kanvas changed how our team brainstorms. It feels simple, fast and actually fun to use.',
    name: 'Alex',
    role: 'Product Designer',
    color: '#EBC9E8',
  },
  {
    quote: 'I use Kanvas for planning lessons and explaining ideas. My students stay much more engaged.',
    name: 'Maya',
    role: 'Teacher',
    color: '#E8F1E8',
  },
  {
    quote: 'From sketches to presentations, Kanvas keeps my whole process in one place.',
    name: 'Jordan',
    role: 'Founder',
    color: '#FFF6E6',
  },
]

export default function Testimonials() {
  return (
    <section className="lp-testimonials lp-bg-white">
      <div className="lp-section">
        <h2 className="lp-section-title">Creators love Kanvas</h2>
        <div className="lp-testimonials__grid">
          {testimonials.map(t => (
            <div key={t.name} className="lp-testimonials__card">
              <div className="lp-testimonials__quote-icon">"</div>
              <p className="lp-testimonials__quote">{t.quote}</p>
              <div className="lp-testimonials__author">
                <div className="lp-testimonials__avatar" style={{ background: t.color }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="lp-testimonials__name">{t.name}</div>
                  <div className="lp-testimonials__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
