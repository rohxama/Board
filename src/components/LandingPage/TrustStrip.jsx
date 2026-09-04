const tools = [
  { name: 'Notion', icon: 'N' },
  { name: 'Loom', icon: '▶' },
  { name: 'HYPEBEAST', icon: 'H' },
  { name: 'Miro', icon: 'M' },
  { name: 'Stripe', icon: 'S' },
  { name: 'Zapier', icon: 'Z' },
]

export default function TrustStrip() {
  return (
    <section className="lp-trust-strip lp-bg-mint">
      <div className="lp-container">
        <p className="lp-trust-strip__heading">Built for ideas,<br />teams & creators</p>
        <div className="lp-trust-strip__logos">
          {tools.map(tool => (
            <div key={tool.name} className="lp-trust-strip__logo">
              <span className="lp-trust-strip__icon">{tool.icon}</span>
              <span className="lp-trust-strip__name">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
