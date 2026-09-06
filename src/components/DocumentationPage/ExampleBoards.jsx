const A = { bg: '#fff', text: '#111827', muted: '#6b7280', border: '#e5e7eb', accent: '#3b82f6', green: '#22c55e', blue: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', orange: '#f59e0b', red: '#ef4444', surface: '#f9fafb', dot: '#d1d5db' }

/* 1. Mind Map — Product Launch Planning */
export function MindMapExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      {/* Center */}
      <rect x="260" y="150" width="160" height="56" rx="28" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth="2" />
      <text x="340" y="175" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Product Launch</text>
      <text x="340" y="192" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill="#6b7280">Q4 2026</text>
      {/* Branch: Marketing */}
      <path d="M290 150 C260 130, 200 110, 140 90" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="60" y="60" width="140" height="48" rx="6" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="1.2" />
      <text x="130" y="80" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#166534">Marketing</text>
      <text x="130" y="94" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#6b7280">Social, email, ads</text>
      <path d="M80 108 C72 124, 56 136, 44 148" stroke="#86efac" strokeWidth="1" strokeLinecap="round" fill="none" />
      <rect x="12" y="144" width="68" height="22" rx="3" fill="#fef3c7" stroke="#eab308" strokeWidth="0.7" />
      <text x="46" y="159" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#854d0e">Blog posts</text>
      <path d="M120 108 C128 124, 140 136, 148 148" stroke="#86efac" strokeWidth="1" strokeLinecap="round" fill="none" />
      <rect x="112" y="144" width="72" height="22" rx="3" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.7" />
      <text x="148" y="159" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#7c3aed">Email series</text>
      {/* Branch: Engineering */}
      <path d="M390 150 C420 130, 480 110, 540 90" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="470" y="60" width="140" height="48" rx="6" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="1.2" />
      <text x="540" y="80" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Engineering</text>
      <text x="540" y="94" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#6b7280">API, frontend, infra</text>
      <path d="M500 108 C492 124, 480 136, 472 148" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" fill="none" />
      <rect x="440" y="144" width="68" height="22" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.7" />
      <text x="474" y="159" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#166534">API v2</text>
      <path d="M580 108 C588 124, 600 136, 608 148" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" fill="none" />
      <rect x="576" y="144" width="68" height="22" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.7" />
      <text x="610" y="159" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#92400e">Auth flow</text>
      {/* Branch: Design */}
      <path d="M290 206 C260 230, 200 256, 140 272" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="56" y="256" width="140" height="48" rx="6" fill="rgba(139,92,246,0.04)" stroke="#8b5cf6" strokeWidth="1.2" />
      <text x="126" y="276" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#7c3aed">Design</text>
      <text x="126" y="290" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#6b7280">UI kit, brand, motion</text>
      <path d="M80 304 C72 320, 56 332, 44 340" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round" fill="none" />
      <rect x="12" y="336" width="68" height="22" rx="3" fill="rgba(236,72,153,0.06)" stroke="#ec4899" strokeWidth="0.7" />
      <text x="46" y="351" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#be185d">UI kit</text>
      {/* Branch: Launch */}
      <path d="M390 206 C420 230, 480 256, 540 272" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="470" y="256" width="140" height="48" rx="6" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="540" y="276" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#92400e">Launch Day</text>
      <text x="540" y="290" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#6b7280">Event, press, demo</text>
      {/* Sticky notes */}
      <rect x="220" y="56" width="52" height="32" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.7" transform="rotate(-4 246 72)" />
      <text x="246" y="72" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#854d0e" transform="rotate(-4 246 72)">Timeline?</text>
      <rect x="420" y="316" width="52" height="32" rx="2" fill="#fce7f3" stroke="#ec4899" strokeWidth="0.7" transform="rotate(3 446 332)" />
      <text x="446" y="332" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#be185d" transform="rotate(3 446 332)">Budget?</text>
      {/* Priority */}
      <circle cx="640" cy="72" r="12" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1" />
      <text x="640" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#ef4444">P0</text>
      <path d="M620 196 L620 208 L625 204 L630 212 L632 211 L627 203 L632 199Z" fill="var(--text)" />
    </svg>
  )
}

/* 2. Wireframe — Mobile Learning App */
export function WireframeExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      {/* Phone 1 — Browse */}
      <rect x="30" y="24" width="150" height="280" rx="14" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="30" y="24" width="150" height="28" rx="14" fill="#f9fafb" />
      <rect x="30" y="38" width="150" height="14" fill="#f9fafb" />
      <rect x="75" y="26" width="30" height="7" rx="3.5" fill="#e5e7eb" />
      <text x="105" y="44" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#374151">9:41</text>
      <text x="48" y="66" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#111827">Discover</text>
      <rect x="44" y="76" width="122" height="20" rx="10" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="105" y="90" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">Search courses...</text>
      {/* Card 1 */}
      <rect x="44" y="102" width="122" height="56" rx="5" fill="rgba(59,130,246,0.04)" stroke="#e5e7eb" strokeWidth="0.6" />
      <rect x="44" y="102" width="122" height="24" rx="5" fill="rgba(59,130,246,0.08)" />
      <text x="105" y="118" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#1e40af">React Patterns</text>
      <text x="54" y="140" fontSize="6" fontFamily="system-ui" fill="#6b7280">Advanced hooks, context</text>
      <text x="152" y="152" textAnchor="end" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#22c55e">$49</text>
      {/* Card 2 */}
      <rect x="44" y="164" width="122" height="56" rx="5" fill="rgba(139,92,246,0.04)" stroke="#e5e7eb" strokeWidth="0.6" />
      <rect x="44" y="164" width="122" height="24" rx="5" fill="rgba(139,92,246,0.08)" />
      <text x="105" y="180" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">TypeScript</text>
      <text x="54" y="202" fontSize="6" fontFamily="system-ui" fill="#6b7280">Generics, utility types</text>
      <text x="152" y="214" textAnchor="end" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#22c55e">$39</text>
      {/* Tab bar */}
      <rect x="30" y="276" width="150" height="28" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="56" y="294" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#3b82f6">Home</text>
      <text x="90" y="294" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">Browse</text>
      <text x="124" y="294" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">Saved</text>
      <text x="156" y="294" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">Profile</text>
      {/* Arrow */}
      <path d="M188 164 L220 164" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <path d="M217 161 L222 164 L217 167" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      {/* Phone 2 — Detail */}
      <rect x="230" y="24" width="150" height="280" rx="14" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="230" y="24" width="150" height="28" rx="14" fill="#f9fafb" />
      <rect x="230" y="38" width="150" height="14" fill="#f9fafb" />
      <rect x="275" y="26" width="30" height="7" rx="3.5" fill="#e5e7eb" />
      <path d="M244 44 L238 48 L244 52" fill="none" stroke="#374151" strokeWidth="1" strokeLinecap="round" />
      <rect x="244" y="62" width="122" height="52" rx="5" fill="rgba(59,130,246,0.06)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="305" y="86" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#1e40af">React Patterns</text>
      <text x="305" y="100" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">12 lessons · 4.5 hrs</text>
      <text x="244" y="126" fontSize="6" fontFamily="system-ui" fill="#f59e0b">★★★★★</text>
      <text x="280" y="126" fontSize="6" fontFamily="system-ui" fill="#6b7280">4.8 (2,341)</text>
      {/* Lessons */}
      <rect x="244" y="134" width="122" height="18" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
      <text x="252" y="146" fontSize="6" fontFamily="system-ui" fill="#22c55e">✓</text>
      <text x="262" y="146" fontSize="6" fontFamily="system-ui" fill="#374151">1. Custom Hooks</text>
      <rect x="244" y="154" width="122" height="18" rx="3" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.6" />
      <text x="252" y="166" fontSize="6" fontFamily="system-ui" fill="#3b82f6">▶</text>
      <text x="262" y="166" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#1e40af">2. Context Patterns</text>
      <rect x="244" y="174" width="122" height="18" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
      <text x="262" y="186" fontSize="6" fontFamily="system-ui" fill="#9ca3af">3. Performance</text>
      {/* CTA */}
      <rect x="244" y="210" width="122" height="24" rx="12" fill="#3b82f6" />
      <text x="305" y="226" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="white">Continue — $49</text>
      {/* Arrow */}
      <path d="M388 164 L420 164" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <path d="M417 161 L422 164 L417 167" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      {/* Phone 3 — Player (dark) */}
      <rect x="430" y="24" width="150" height="280" rx="14" fill="#111827" stroke="#374151" strokeWidth="1.5" />
      <rect x="430" y="24" width="150" height="28" rx="14" fill="#1f2937" />
      <rect x="430" y="38" width="150" height="14" fill="#1f2937" />
      <rect x="475" y="26" width="30" height="7" rx="3.5" fill="#374151" />
      <rect x="444" y="62" width="122" height="56" rx="5" fill="#1f2937" stroke="#374151" strokeWidth="0.6" />
      <polygon points="505,82 505,100 518,91" fill="white" opacity="0.9" />
      <rect x="444" y="122" width="122" height="3" rx="1.5" fill="#374151" />
      <rect x="444" y="122" width="48" height="3" rx="1.5" fill="#3b82f6" />
      <circle cx="492" cy="123.5" r="3.5" fill="#3b82f6" />
      <text x="444" y="140" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#e5e7eb">Lesson 2: Context</text>
      <text x="444" y="152" fontSize="6" fontFamily="system-ui" fill="#6b7280">useContext, providers</text>
      {/* Notes */}
      <rect x="444" y="162" width="122" height="60" rx="5" fill="#1f2937" stroke="#374151" strokeWidth="0.6" />
      <text x="452" y="174" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#9ca3af">MY NOTES</text>
      <text x="452" y="186" fontSize="5" fontFamily="system-ui" fill="#d1d5db">Context = global state</text>
      <text x="452" y="196" fontSize="5" fontFamily="system-ui" fill="#d1d5db">without prop drilling</text>
      <text x="452" y="208" fontSize="5" fontFamily="system-ui" fill="#3b82f6">→ React.dev docs</text>
      {/* Controls */}
      <rect x="444" y="240" width="36" height="18" rx="3" fill="#374151" />
      <text x="462" y="252" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">Prev</text>
      <rect x="486" y="240" width="36" height="18" rx="3" fill="#3b82f6" />
      <text x="504" y="252" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="white">Next</text>
      {/* Annotation */}
      <path d="M105 316 L105 332 L305 332" stroke="#ef4444" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="3 2" />
      <text x="205" y="346" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#ef4444">User flow: Browse → Detail → Learn</text>
    </svg>
  )
}

/* 3. Flowchart — User Onboarding */
export function FlowchartExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      <text x="340" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui" fill="var(--text)">User Onboarding Flow</text>
      {/* Start */}
      <ellipse cx="80" cy="52" rx="36" ry="14" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1.2" />
      <text x="80" y="56" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#166534">Start</text>
      <path d="M80 66 L80 84" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M78 82 L80 86 L82 82" fill="none" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Sign Up */}
      <rect x="44" y="88" width="72" height="32" rx="4" fill="var(--doc-bg, #fff)" stroke="#3b82f6" strokeWidth="1" />
      <text x="80" y="104" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#1e40af">Sign Up</text>
      <text x="80" y="114" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Email or OAuth</text>
      <path d="M80 120 L80 140" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M78 138 L80 142 L82 138" fill="none" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Decision */}
      <path d="M80 144 L112 164 L80 184 L48 164 Z" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" />
      <text x="80" y="162" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Email</text>
      <text x="80" y="170" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">verified?</text>
      {/* No */}
      <path d="M48 164 L16 164" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round" />
      <text x="28" y="158" fontSize="5" fontFamily="system-ui" fill="#ef4444">No</text>
      <rect x="-8" y="154" width="32" height="20" rx="3" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="0.6" />
      <text x="8" y="167" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#ef4444">Resend</text>
      {/* Yes */}
      <path d="M80 184 L80 204" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <text x="88" y="196" fontSize="5" fontFamily="system-ui" fill="#22c55e">Yes</text>
      <path d="M78 202 L80 206 L82 202" fill="none" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Profile */}
      <rect x="44" y="208" width="72" height="32" rx="4" fill="var(--doc-bg, #fff)" stroke="#8b5cf6" strokeWidth="1" />
      <text x="80" y="224" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Profile Setup</text>
      <text x="80" y="234" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Name, avatar, role</text>
      {/* Arrow to onboarding */}
      <path d="M116 224 L180 224" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M177 221 L182 224 L177 227" fill="none" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Onboarding steps */}
      <rect x="188" y="80" width="110" height="200" rx="6" fill="rgba(59,130,246,0.02)" stroke="#e5e7eb" strokeWidth="0.6" strokeDasharray="3 2" />
      <text x="243" y="96" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#6b7280">ONBOARDING</text>
      <rect x="200" y="104" width="86" height="28" rx="3" fill="var(--doc-bg, #fff)" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="210" y="116" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#3b82f6">01</text>
      <text x="226" y="116" fontSize="6" fontFamily="system-ui" fill="#374151">Choose interest</text>
      <text x="226" y="126" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Tech, Design, Biz</text>
      <path d="M243 132 L243 140" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M242 139 L243 141 L244 139" fill="none" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <rect x="200" y="144" width="86" height="28" rx="3" fill="var(--doc-bg, #fff)" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="210" y="156" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#3b82f6">02</text>
      <text x="226" y="156" fontSize="6" fontFamily="system-ui" fill="#374151">Set goal</text>
      <text x="226" y="166" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Learn, Build, Teach</text>
      <path d="M243 172 L243 180" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M242 179 L243 181 L244 179" fill="none" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <rect x="200" y="184" width="86" height="28" rx="3" fill="var(--doc-bg, #fff)" stroke="#3b82f6" strokeWidth="0.8" />
      <text x="210" y="196" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#3b82f6">03</text>
      <text x="226" y="196" fontSize="6" fontFamily="system-ui" fill="#374151">Pick difficulty</text>
      <text x="226" y="206" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Beginner → Expert</text>
      <path d="M243 212 L243 220" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M242 219 L243 221 L244 219" fill="none" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <rect x="200" y="224" width="86" height="28" rx="3" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="0.8" />
      <text x="210" y="236" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#22c55e">04</text>
      <text x="226" y="236" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#166534">Get roadmap</text>
      <text x="226" y="246" fontSize="5" fontFamily="system-ui" fill="#6b7280">Personalized path</text>
      {/* Arrow to dashboard */}
      <path d="M298 238 L350 238" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M347 235 L352 238 L347 241" fill="none" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Dashboard */}
      <rect x="358" y="210" width="96" height="64" rx="6" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="1.2" />
      <text x="406" y="230" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#166534">Dashboard</text>
      <text x="406" y="242" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Welcome back!</text>
      <rect x="370" y="250" width="32" height="14" rx="3" fill="#22c55e" />
      <text x="386" y="260" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="white">Start</text>
      <rect x="408" y="250" width="32" height="14" rx="3" fill="none" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="424" y="260" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Tour</text>
      {/* Stats */}
      <rect x="500" y="80" width="96" height="52" rx="5" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="510" y="96" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#6b7280">Conversion</text>
      <text x="510" y="112" fontSize="12" fontWeight="700" fontFamily="system-ui" fill="#22c55e">72%</text>
      <text x="510" y="124" fontSize="5" fontFamily="system-ui" fill="#9ca3af">complete onboarding</text>
      {/* Completion badge */}
      <circle cx="548" cy="164" r="20" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="1" />
      <text x="548" y="168" textAnchor="middle" fontSize="14">🎉</text>
      <path d="M612 300 L612 312 L617 308 L622 316 L624 315 L619 307 L624 303Z" fill="var(--text)" />
    </svg>
  )
}

/* 4. Study Notes — Data Structures */
export function StudyNotesExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      <text x="36" y="28" fontSize="12" fontWeight="800" fontFamily="system-ui" fill="var(--text)">Data Structures — Week 3</text>
      <text x="36" y="42" fontSize="7" fontFamily="system-ui" fill="#6b7280">CS201 · Binary Trees & Heaps</text>
      {/* Left: BST */}
      <rect x="28" y="54" width="240" height="296" rx="6" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="42" y="72" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Binary Search Tree</text>
      {/* Tree */}
      <rect x="118" y="86" width="36" height="20" rx="4" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth="1" />
      <text x="136" y="100" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#1e40af">50</text>
      <path d="M136 106 L100 130" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M136 106 L172 130" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <rect x="80" y="130" width="36" height="20" rx="4" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="0.8" />
      <text x="98" y="144" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill="#166534">30</text>
      <rect x="156" y="130" width="36" height="20" rx="4" fill="rgba(236,72,153,0.06)" stroke="#ec4899" strokeWidth="0.8" />
      <text x="174" y="144" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill="#be185d">70</text>
      <path d="M98 150 L74 172" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M98 150 L122 172" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M174 150 L150 172" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M174 150 L198 172" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <rect x="58" y="172" width="32" height="16" rx="3" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="0.6" />
      <text x="74" y="184" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#374151">20</text>
      <rect x="108" y="172" width="32" height="16" rx="3" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="0.6" />
      <text x="124" y="184" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#374151">40</text>
      <rect x="136" y="172" width="32" height="16" rx="3" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="0.6" />
      <text x="152" y="184" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#374151">60</text>
      <rect x="184" y="172" width="32" height="16" rx="3" fill="var(--doc-bg, #fff)" stroke="#d1d5db" strokeWidth="0.6" />
      <text x="200" y="184" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#374151">80</text>
      {/* Properties */}
      <rect x="42" y="200" width="212" height="100" rx="4" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
      <text x="52" y="214" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#374151">Properties:</text>
      <text x="52" y="228" fontSize="6" fontFamily="monospace" fill="#6b7280">• Left child &lt; parent &lt; right child</text>
      <text x="52" y="240" fontSize="6" fontFamily="monospace" fill="#6b7280">• Search: O(log n) average</text>
      <text x="52" y="252" fontSize="6" fontFamily="monospace" fill="#6b7280">• Insert: O(log n) average</text>
      <text x="52" y="264" fontSize="6" fontFamily="monospace" fill="#6b7280">• Worst: O(n) if unbalanced</text>
      <text x="52" y="280" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#ef4444">⚠ AVL trees fix balance</text>
      <text x="52" y="292" fontSize="6" fontFamily="system-ui" fill="#6b7280">→ See lecture 4 notes</text>
      {/* Exam sticky */}
      <rect x="42" y="308" width="100" height="28" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.6" transform="rotate(-2 92 322)" />
      <text x="92" y="320" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#854d0e" transform="rotate(-2 92 322)">Midterm: BST + Heap</text>
      <text x="92" y="330" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#a16207" transform="rotate(-2 92 322)">Focus: time complexity</text>
      {/* Right: Heap */}
      <rect x="290" y="54" width="240" height="120" rx="6" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="304" y="72" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#7c3aed">Min Heap</text>
      <rect x="378" y="84" width="32" height="18" rx="3" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1" />
      <text x="394" y="97" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#7c3aed">10</text>
      <path d="M394 102 L364 124" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M394 102 L424 124" stroke="#6b7280" strokeWidth="0.6" strokeLinecap="round" />
      <rect x="348" y="124" width="32" height="18" rx="3" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="364" y="137" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill="#92400e">25</text>
      <rect x="408" y="124" width="32" height="18" rx="3" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="424" y="137" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill="#92400e">30</text>
      <rect x="460" y="84" width="56" height="56" rx="4" fill="#fef3c7" stroke="#eab308" strokeWidth="0.5" />
      <text x="468" y="98" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Key rule:</text>
      <text x="468" y="110" fontSize="5" fontFamily="system-ui" fill="#854d0e">parent ≤ children</text>
      <text x="468" y="126" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Use for:</text>
      <text x="468" y="136" fontSize="5" fontFamily="system-ui" fill="#854d0e">Priority queues</text>
      {/* Comparison table */}
      <rect x="290" y="184" width="240" height="128" rx="6" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="304" y="200" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#374151">Comparison</text>
      {/* Header */}
      <rect x="298" y="208" width="52" height="16" rx="2" fill="#f3f4f6" />
      <text x="324" y="219" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#374151">Structure</text>
      <rect x="350" y="208" width="40" height="16" rx="2" fill="#f3f4f6" />
      <text x="370" y="219" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#374151">Search</text>
      <rect x="390" y="208" width="40" height="16" rx="2" fill="#f3f4f6" />
      <text x="410" y="219" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#374151">Insert</text>
      <rect x="430" y="208" width="40" height="16" rx="2" fill="#f3f4f6" />
      <text x="450" y="219" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#374151">Delete</text>
      <rect x="470" y="208" width="52" height="16" rx="2" fill="#f3f4f6" />
      <text x="496" y="219" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="#374151">Use case</text>
      {/* BST */}
      <rect x="298" y="224" width="52" height="16" fill="rgba(59,130,246,0.04)" />
      <text x="324" y="235" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#1e40af">BST</text>
      <text x="370" y="235" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(log n)</text>
      <text x="410" y="235" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(log n)</text>
      <text x="450" y="235" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(log n)</text>
      <text x="496" y="235" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">Lookup</text>
      {/* Heap */}
      <rect x="298" y="240" width="52" height="16" fill="rgba(139,92,246,0.04)" />
      <text x="324" y="251" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Heap</text>
      <text x="370" y="251" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(n)</text>
      <text x="410" y="251" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(log n)</text>
      <text x="450" y="251" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(log n)</text>
      <text x="496" y="251" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">Priority</text>
      {/* Hash */}
      <rect x="298" y="256" width="52" height="16" fill="rgba(34,197,94,0.04)" />
      <text x="324" y="267" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#166534">Hash</text>
      <text x="370" y="267" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(1)</text>
      <text x="410" y="267" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(1)</text>
      <text x="450" y="267" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">O(1)</text>
      <text x="496" y="267" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#374151">Fast lookup</text>
      {/* Exam note */}
      <rect x="304" y="280" width="100" height="24" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.5" transform="rotate(-1 354 292)" />
      <text x="354" y="290" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e" transform="rotate(-1 354 292)">Midterm:BST + Heap</text>
      <text x="354" y="300" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#a16207" transform="rotate(-1 354 292)">Time complexity focus</text>
      <path d="M600 320 L600 332 L605 328 L610 336 L612 335 L607 327 L612 323Z" fill="var(--text)" />
    </svg>
  )
}

/* 5. Brainstorming — Feature Prioritization */
export function BrainstormExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      <text x="36" y="28" fontSize="12" fontWeight="800" fontFamily="system-ui" fill="var(--text)">Feature Prioritization</text>
      <text x="36" y="42" fontSize="7" fontFamily="system-ui" fill="#6b7280">Sprint planning · Team alpha · Sept 2026</text>
      {/* Matrix lines */}
      <line x1="340" y1="52" x2="340" y2="370" stroke="#e5e7eb" strokeWidth="0.6" />
      <line x1="16" y1="200" x2="664" y2="200" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="340" y="66" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#6b7280">High Impact</text>
      <text x="340" y="366" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#6b7280">Low Impact</text>
      <text x="24" y="200" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#6b7280">Easy</text>
      <text x="656" y="200" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#6b7280" textAnchor="end">Hard</text>
      <text x="170" y="80" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#22c55e" opacity="0.5">DO FIRST</text>
      <text x="510" y="80" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#f59e0b" opacity="0.5">SCHEDULE</text>
      <text x="170" y="356" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#3b82f6" opacity="0.5">QUICK WINS</text>
      <text x="510" y="356" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#ef4444" opacity="0.5">DROP</text>
      {/* DO FIRST cards */}
      <rect x="56" y="94" width="92" height="36" rx="3" fill="#fef3c7" stroke="#eab308" strokeWidth="0.8" transform="rotate(-2 102 112)" />
      <text x="102" y="108" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#854d0e" transform="rotate(-2 102 112)">Auth redesign</text>
      <text x="102" y="120" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#a16207" transform="rotate(-2 102 112)">3 votes · User pain</text>
      <rect x="56" y="140" width="92" height="36" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" transform="rotate(1 102 158)" />
      <text x="102" y="154" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#166534" transform="rotate(1 102 158)">API rate limits</text>
      <text x="102" y="166" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#166534" transform="rotate(1 102 158)">4 votes · Security</text>
      <rect x="164" y="110" width="92" height="36" rx="3" fill="#fef3c7" stroke="#eab308" strokeWidth="0.8" transform="rotate(-1 210 128)" />
      <text x="210" y="124" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#854d0e" transform="rotate(-1 210 128)">Dashboard v2</text>
      <text x="210" y="136" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#a16207" transform="rotate(-1 210 128)">5 votes · Top req</text>
      {/* SCHEDULE cards */}
      <rect x="376" y="94" width="92" height="36" rx="3" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" transform="rotate(2 422 112)" />
      <text x="422" y="108" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#7c3aed" transform="rotate(2 422 112)">Mobile app</text>
      <text x="422" y="120" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#7c3aed" transform="rotate(2 422 112)">6 votes · Big scope</text>
      <rect x="484" y="120" width="92" height="36" rx="3" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" transform="rotate(-1 530 138)" />
      <text x="530" y="134" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#7c3aed" transform="rotate(-1 530 138)">AI suggestions</text>
      <text x="530" y="146" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#7c3aed" transform="rotate(-1 530 138)">3 votes · Research</text>
      <rect x="396" y="150" width="92" height="36" rx="3" fill="#fce7f3" stroke="#ec4899" strokeWidth="0.8" transform="rotate(1 442 168)" />
      <text x="442" y="164" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#be185d" transform="rotate(1 442 168)">Team collab</text>
      <text x="442" y="176" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#be185d" transform="rotate(1 442 168)">2 votes · Complex</text>
      {/* QUICK WINS */}
      <rect x="56" y="230" width="92" height="36" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" transform="rotate(1 102 248)" />
      <text x="102" y="244" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#92400e" transform="rotate(1 102 248)">Dark mode</text>
      <text x="102" y="256" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#92400e" transform="rotate(1 102 248)">7 votes · Easy fix</text>
      <rect x="164" y="250" width="92" height="36" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" transform="rotate(-2 210 268)" />
      <text x="210" y="264" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#166534" transform="rotate(-2 210 268)">Export CSV</text>
      <text x="210" y="276" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#166534" transform="rotate(-2 210 268)">4 votes · 1 day</text>
      <rect x="76" y="280" width="92" height="36" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" transform="rotate(-1 122 298)" />
      <text x="122" y="294" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="#854d0e" transform="rotate(-1 122 298)">Kbd shortcuts</text>
      <text x="122" y="306" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#854d0e" transform="rotate(-1 122 298)">3 votes · Docs</text>
      {/* DROP */}
      <rect x="416" y="250" width="92" height="36" rx="3" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="3 2" transform="rotate(2 462 268)" />
      <text x="462" y="264" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af" textDecoration="line-through" transform="rotate(2 462 268)">Custom themes</text>
      <text x="462" y="276" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af" transform="rotate(2 462 268)">1 vote · Low ROI</text>
      <rect x="524" y="270" width="92" height="36" rx="3" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="3 2" transform="rotate(-1 570 288)" />
      <text x="570" y="284" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af" textDecoration="line-through" transform="rotate(-1 570 288)">Plugin API</text>
      <text x="570" y="296" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af" transform="rotate(-1 570 288)">1 vote · Too early</text>
      {/* Legend */}
      <circle cx="56" cy="340" r="5" fill="#22c55e" />
      <text x="56" y="343" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="white">5</text>
      <text x="66" y="343" fontSize="5" fontFamily="system-ui" fill="#6b7280">Sprint 1</text>
      <circle cx="130" cy="340" r="5" fill="#f59e0b" />
      <text x="130" y="343" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="white">3</text>
      <text x="140" y="343" fontSize="5" fontFamily="system-ui" fill="#6b7280">Sprint 2</text>
      <circle cx="200" cy="340" r="5" fill="#8b5cf6" />
      <text x="200" y="343" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="white">2</text>
      <text x="210" y="343" fontSize="5" fontFamily="system-ui" fill="#6b7280">Backlog</text>
      <circle cx="268" cy="340" r="5" fill="#ef4444" />
      <text x="268" y="343" textAnchor="middle" fontSize="5" fontWeight="700" fontFamily="system-ui" fill="white">2</text>
      <text x="278" y="343" fontSize="5" fontFamily="system-ui" fill="#6b7280">Dropped</text>
      <path d="M310 310 L310 322 L315 318 L320 326 L322 325 L317 317 L322 313Z" fill="var(--text)" />
    </svg>
  )
}

/* 6. System Architecture Diagram */
export function ArchitectureExample() {
  const dots = []
  for (let x = 0; x <= 680; x += 20) for (let y = 0; y <= 380; y += 20) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />)
  return (
    <svg viewBox="0 0 680 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <g className="doc-parallax-grid">{dots}</g>
      <text x="340" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui" fill="var(--text)">System Architecture — Board App</text>
      {/* Client */}
      <rect x="28" y="44" width="100" height="52" rx="6" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="1.2" />
      <text x="78" y="64" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Client</text>
      <text x="78" y="76" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">React + Vite</text>
      <text x="78" y="86" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Browser</text>
      {/* WS arrow */}
      <path d="M128 70 L178 70" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
      <text x="153" y="64" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#3b82f6">WebSocket</text>
      <path d="M175 67 L180 70 L175 73" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
      {/* API Gateway */}
      <rect x="186" y="44" width="100" height="52" rx="6" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="236" y="64" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#92400e">API Gateway</text>
      <text x="236" y="76" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">Express.js</text>
      <text x="236" y="86" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Auth + Rate limit</text>
      {/* Arrows to services */}
      <path d="M236 96 L178 140" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M236 96 L236 140" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M236 96 L294 140" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* Board Service */}
      <rect x="126" y="144" width="100" height="52" rx="6" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="1.2" />
      <text x="176" y="164" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#166534">Board Service</text>
      <text x="176" y="176" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">CRUD + Realtime</text>
      <text x="176" y="186" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Node.js</text>
      {/* User Service */}
      <rect x="236" y="144" width="100" height="52" rx="6" fill="rgba(139,92,246,0.04)" stroke="#8b5cf6" strokeWidth="1.2" />
      <text x="286" y="164" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#7c3aed">User Service</text>
      <text x="286" y="176" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">Auth + Profile</text>
      <text x="286" y="186" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Node.js</text>
      {/* Export Service */}
      <rect x="346" y="144" width="100" height="52" rx="6" fill="rgba(236,72,153,0.04)" stroke="#ec4899" strokeWidth="1.2" />
      <text x="396" y="164" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#be185d">Export Service</text>
      <text x="396" y="176" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">PNG / PDF / SVG</text>
      <text x="396" y="186" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#9ca3af">Sharp + Puppeteer</text>
      {/* Arrows to DBs */}
      <path d="M176 196 L176 230" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M286 196 L286 230" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      {/* PostgreSQL */}
      <rect x="126" y="234" width="100" height="44" rx="6" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="1" />
      <text x="176" y="252" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#1e40af">PostgreSQL</text>
      <text x="176" y="264" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">Boards + Shapes</text>
      {/* Redis */}
      <rect x="236" y="234" width="100" height="44" rx="6" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="1" />
      <text x="286" y="252" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#ef4444">Redis</text>
      <text x="286" y="264" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">Sessions + Cache</text>
      {/* S3 */}
      <path d="M396 196 L396 230" stroke="#6b7280" strokeWidth="0.8" strokeLinecap="round" />
      <rect x="346" y="234" width="100" height="44" rx="6" fill="rgba(245,158,11,0.04)" stroke="#f59e0b" strokeWidth="1" />
      <text x="396" y="252" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#92400e">S3 Bucket</text>
      <text x="396" y="264" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#6b7280">Images + Exports</text>
      {/* Monitoring sidebar */}
      <rect x="500" y="44" width="156" height="112" rx="6" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="512" y="60" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#374151">Monitoring</text>
      <rect x="512" y="68" width="60" height="36" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.4" />
      <text x="542" y="82" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Uptime</text>
      <text x="542" y="96" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#22c55e">99.9%</text>
      <rect x="580" y="68" width="60" height="36" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.4" />
      <text x="610" y="82" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#6b7280">Latency</text>
      <text x="610" y="96" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#3b82f6">42ms</text>
      <rect x="512" y="110" width="128" height="36" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.4" />
      <text x="522" y="124" fontSize="5" fontFamily="system-ui" fill="#6b7280">Error rate:</text>
      <text x="620" y="124" textAnchor="end" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#22c55e">0.02%</text>
      <text x="522" y="138" fontSize="5" fontFamily="system-ui" fill="#6b7280">Active boards:</text>
      <text x="620" y="138" textAnchor="end" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#3b82f6">1,247</text>
      {/* Legend */}
      <rect x="500" y="176" width="156" height="80" rx="6" fill="var(--doc-bg, #fff)" stroke="#e5e7eb" strokeWidth="0.6" />
      <text x="512" y="192" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#374151">Data Flow</text>
      <line x1="512" y1="204" x2="540" y2="204" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="548" y="207" fontSize="5" fontFamily="system-ui" fill="#6b7280">WebSocket (realtime)</text>
      <line x1="512" y1="220" x2="540" y2="220" stroke="#6b7280" strokeWidth="1" />
      <text x="548" y="223" fontSize="5" fontFamily="system-ui" fill="#6b7280">HTTP REST API</text>
      <line x1="512" y1="236" x2="540" y2="236" stroke="#6b7280" strokeWidth="0.8" strokeDasharray="3 2" />
      <text x="548" y="239" fontSize="5" fontFamily="system-ui" fill="#6b7280">Async (export queue)</text>
      <path d="M610 320 L610 332 L615 328 L620 336 L622 335 L617 327 L622 323Z" fill="var(--text)" />
    </svg>
  )
}
