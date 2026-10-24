import { useEffect, useRef, useState } from 'react'
import ChapterNavigation from './ChapterNavigation'
import SelectedWorks from './SelectedWorks'

const chapters = ['The first mark', 'A mind full of ideas', 'The art of building', 'Ideas become real', 'Still in progress', 'The next chapter']

function Plane({ className = '', color = 'yellow' }: { className?: string; color?: string }) {
  return <svg className={`plane ${className} ${color}`} viewBox="0 0 160 115" fill="none" aria-hidden="true"><path d="M5 39 154 7 99 108 70 66 5 39Z" fill="currentColor"/><path d="m5 39 149-32-84 59L5 39Z" fill="#fff" opacity=".22"/><path d="m70 66 84-59-65 73 10 28-29-42Z" fill="#000" opacity=".16"/><path d="m70 66 84-59-65 73" stroke="#463f2c" strokeOpacity=".35"/><path d="m70 66-5 27 24-13" fill="currentColor"/></svg>
}

function Star({ className = '' }: { className?: string }) {
  return <svg className={`chalk-star ${className}`} viewBox="0 0 70 70" fill="none" aria-hidden="true"><path d="m36 5 5 22 22 3-20 11 4 23-15-17-22 10 12-22L8 19l23 7 5-21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
}

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="chapter-label"><span>{n}</span><i />{children}</div>
}

function ChalkSketch({ className = '' }: { className?: string }) {
  return <div className={`chalk-sketch ${className}`} aria-hidden="true"><div className="wire-nav"><span>form — an idea</span><i/><i/><i/></div><div className="wire-body"><div><div className="wire-title"/><div className="wire-title short"/><div className="wire-line"/><div className="wire-line"/><div className="wire-button">explore ↗</div></div><div className="wire-image"><span>an object,<br/>a possibility.</span></div></div><div className="component-tags"><span>&lt;Navigation /&gt;</span><span>&lt;Collection /&gt;</span><span>&lt;LittleDetails /&gt;</span></div></div>
}

function ProductPreview({ variant = 'studio' }: { variant?: string }) {
  return <div className={`product-preview ${variant}`}>
    <div className="browser-bar"><span /><span /><span /><div>{variant === 'studio' ? 'form.studio' : variant === 'folio' ? 'somewhere.travel' : 'gather.workspace'}</div><b>↗</b></div>
    {variant === 'studio' ? <div className="studio-content"><div className="product-nav"><b>form<span>®</span></b><span>Objects &nbsp; Our story &nbsp; Bag (0)</span></div><div className="studio-body"><div><small>LESS, BUT BETTER.</small><h4>Good things.<br/>Made for living.</h4><p>Considered objects for everyday moments.</p><span className="shop-link">Explore the collection ↗</span></div><div className="vase-scene"><div className="stem s1"/><div className="stem s2"/><div className="vase"/><div className="vase small-vase"/></div></div><div className="product-bottom">THOUGHTFULLY DESIGNED. &nbsp; NATURALLY YOURS.<span>01 — 03</span></div></div> : variant === 'folio' ? <div className="travel-content"><div className="product-nav"><b>somewhere.</b><span>Places &nbsp; Journal &nbsp; About</span></div><small>GO A LITTLE FURTHER</small><h4>Find your<br/><em>somewhere.</em></h4><div className="mountains"/><div className="travel-bottom">Extraordinary places. Unhurried days. <span>Explore destinations ↗</span></div></div> : <div className="gather-content"><aside><b>gather<span>✳</span></b><p>YOUR WORKSPACE</p><span>◫ &nbsp; Overview</span><span>☷ &nbsp; My projects</span><span>◷ &nbsp; Activity</span><span>⚑ &nbsp; Bookmarks</span><div className="mini-profile">JD &nbsp; Jamie Davis</div></aside><div className="gather-main"><small>MONDAY, A FRESH START</small><h4>A little space for big ideas.</h4><p>Make room for your next great thing.</p><div className="gather-tiles">{['Website refresh', 'A new perspective', 'Little experiments'].map((x, i) => <div key={x}><div className={`tile-art art-${i}`} /><b>{x}</b><small>Personal project · In progress</small></div>)}</div><div className="task-row">○ &nbsp; Collect a little inspiration <span>Today</span></div><div className="task-row">○ &nbsp; Turn the rough draft into something real <span>Tomorrow</span></div></div></div>}
  </div>
}

export default function App() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  const [project, setProject] = useState<number | null>(null)
  const board = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const flyer = useRef<HTMLDivElement>(null)
  const [motion, setMotion] = useState(false)
  const [route, setRoute] = useState({ d: '', width: 1440, height: 6000, clear: [] as { x: number; y: number; width: number; height: number }[] })
  const signatureScene = useRef<HTMLDivElement>(null)
  const modal = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = preference.matches
    const sections = [...document.querySelectorAll<HTMLElement>('section[data-chapter]')]
    const reveals = [...document.querySelectorAll<HTMLElement>('.reveal')]
    const landingPath = document.querySelector<SVGPathElement>('.transformation-flight path')
    const landingPlane = document.querySelector<SVGSVGElement>('.transformation-flight .plane')
    const landingLength = landingPath?.getTotalLength() ?? 0
    let frame = 0
    let samples: { length: number; x: number; y: number }[] = []
    const measure = () => {
      if (!board.current) return
      const bounds = board.current.getBoundingClientRect()
      const mobile = bounds.width <= 700
      const landmarks = ['.scroll-cue', '.polaroid', '.lined-note', '.blueprint', '.signature-scene', '.additional-work-1', '.additional-work-2', '.chalk-window', '.contact-main']
      const points = landmarks.flatMap((selector, i) => {
        const element = board.current!.querySelector(selector)
        if (!element) return []
        const r = element.getBoundingClientRect()
        const x = i === 0 ? r.left + r.width / 2 : i === 8 ? r.right + 24 : i % 2 ? r.left - 22 : r.right + 22
        return [{ x: Math.max(18, Math.min(bounds.width - 20, mobile && i > 0 ? (i % 2 ? 22 : bounds.width - 22) : x - bounds.left)), y: r.top - bounds.top + (i === 4 ? 40 : r.height * .65) }]
      }).sort((a, b) => a.y - b.y)
      const d = points.map((p, i) => {
        if (!i) return `M ${p.x} ${p.y}`
        const prev = points[i - 1]
        const dy = p.y - prev.y
        return `C ${prev.x + (i % 2 ? 35 : -35)} ${prev.y + dy * .48}, ${p.x + (i % 2 ? -45 : 45)} ${p.y - dy * .42}, ${p.x} ${p.y}`
      }).join(' ')
      const clear = [...board.current.querySelectorAll('h1, h2, .hero-description, .hero-side-note, .made-note, .project-info, .section-heading > p, .growth-title > p, .growth-notes, .contact > p, .contact-links, .ending')].map(el => {
        const r = el.getBoundingClientRect()
        return { x: r.left - bounds.left - 12, y: r.top - bounds.top - 8, width: r.width + 24, height: r.height + 16 }
      })
      setRoute({ d, width: bounds.width, height: bounds.height, clear })
      if (path.current && d) {
        path.current.setAttribute('d', d)
        const length = path.current.getTotalLength()
        samples = Array.from({ length: 501 }, (_, i) => {
          const point = path.current!.getPointAtLength(length * i / 500)
          return { length: length * i / 500, x: point.x, y: point.y }
        })
      }
      update()
    }
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight
        const progress = Math.min(1, Math.max(0, scrollY / Math.max(1, max)))
        document.documentElement.style.setProperty('--progress', `${progress}`)
        if (path.current && flyer.current && samples.length) {
          const length = samples[samples.length - 1].length
          const targetY = scrollY + innerHeight * .82
          const index = samples.findIndex(point => point.y >= targetY)
          const end = Math.max(1, index < 0 ? samples.length - 1 : index)
          const before = samples[end - 1], next = samples[end]
          const fraction = Math.min(1, Math.max(0, (targetY - before.y) / Math.max(1, next.y - before.y)))
          const point = { x: before.x + (next.x - before.x) * fraction, y: before.y + (next.y - before.y) * fraction, length: before.length + (next.length - before.length) * fraction }
          path.current.style.strokeDasharray = `${length}`
          path.current.style.strokeDashoffset = `${reduced ? 0 : length - point.length}`
          flyer.current.style.left = `${point.x}px`
          flyer.current.style.top = `${point.y}px`
          flyer.current.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(next.y - before.y, next.x - before.x) * 180 / Math.PI + 30}deg)`
        }
        if (signatureScene.current) {
          const r = signatureScene.current.getBoundingClientRect()
          const mobile = innerWidth <= 700
          const t = reduced ? 1 : Math.min(1, Math.max(0, mobile ? (innerHeight * .85 - r.top) / (innerHeight * .65) : (innerHeight * .5 - r.top) / (r.height - innerHeight * .55)))
          const unfold = Math.min(1, Math.max(0, (t - .12) / .65))
          signatureScene.current.style.setProperty('--unfold', `${unfold}`)
          signatureScene.current.dataset.stage = unfold < .1 ? 'sketch' : unfold < .95 ? 'unfold' : 'built'
          if (!reduced && landingPath && landingPlane) {
            const distance = landingLength * Math.min(1, unfold / .85)
            const p = landingPath.getPointAtLength(distance)
            const next = landingPath.getPointAtLength(Math.min(landingLength, distance + 2))
            const svg = landingPath.ownerSVGElement!
            landingPlane.style.left = `${p.x / 500 * 100}%`
            landingPlane.style.top = `${p.y / 120 * 100}%`
            landingPlane.style.transform = `translate(-50%, -50%) rotate(${Math.atan2((next.y - p.y) * svg.clientHeight / 120, (next.x - p.x) * svg.clientWidth / 500) * 180 / Math.PI + 30}deg)`
          }
        }
        let chapter = 0
        sections.forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight * .5) chapter = i })
        setActive(chapter)
        reveals.forEach(el => { if (el.getBoundingClientRect().top < innerHeight * .94) el.classList.add('visible') })
      })
    }
    const onPreference = () => { reduced = preference.matches; setMotion(reduced); update() }
    onPreference()
    const observer = new ResizeObserver(measure)
    if (board.current) observer.observe(board.current)
    document.fonts.ready.then(measure)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    preference.addEventListener('change', onPreference)
    return () => { observer.disconnect(); preference.removeEventListener('change', onPreference); window.removeEventListener('scroll', update); window.removeEventListener('resize', measure); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (project === null) return
    const previous = document.activeElement as HTMLElement | null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modal.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modal.current) return
      const controls = [...modal.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]')]
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    window.addEventListener('keydown', trap)
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', trap); previous?.focus({ preventScroll: true }) }
  }, [project])

  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setProject(null); setMenu(false) } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return <div className={`board ${motion ? 'still' : ''}`} ref={board}>
    <header className="site-header"><a href="#chapter-1" className="signature" aria-label="Gia Bảo home">gb<span>®</span></a><a className="header-note" href="#chapter-1">A LITTLE PORTFOLIO. A BIG IMAGINATION.</a><nav><a href="#chapter-4">Selected work <span>↗</span></a><a href="#chapter-6" className="talk-link">Let’s talk <span>↗</span></a><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Open chapter navigation">☰</button></nav></header>
    {menu && <div className="chapter-menu">{chapters.map((name, i) => <a key={name} href={`#chapter-${i + 1}`} onClick={() => setMenu(false)}><span>0{i + 1}</span>{name} ↗</a>)}</div>}
    <div className="journey-path" aria-hidden="true"><svg viewBox={`0 0 ${route.width} ${route.height}`} preserveAspectRatio="none"><defs><mask id="reading-space" maskUnits="userSpaceOnUse" x="0" y="0" width={route.width} height={route.height}><rect width={route.width} height={route.height} fill="white"/>{route.clear.map((r, i) => <rect key={i} {...r} fill="black" rx="12"/>)}</mask></defs><g mask="url(#reading-space)"><path className="path-ghost" d={route.d}/><path ref={path} className="drawn-path" d={route.d}/></g></svg></div>
    <div ref={flyer} className="travelling-plane" aria-hidden="true"><Plane /></div>
    <ChapterNavigation active={active} chapters={chapters} />

    <main>
      <section id="chapter-1" data-chapter className="hero">
        <div className="hero-topline"><span className="tiny-star">✳</span> THE IMPOSSIBLE CHALKBOARD <span className="edition">VOL. 01 — AN ONGOING STORY</span></div>
        <div className="hero-content"><div className="hero-kicker">Every story starts somewhere.</div><h1><span>Hi, I’m</span><br/>Gia <em>Bảo<svg viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M365 38C270-1 48 2 18 89S133 200 285 174 431 56 331 23" /></svg></em><span className="name-period">.</span></h1><div className="hero-description"><span className="drawn-arrow">↳</span><p>Frontend Developer.<br/>Building experiences,<br/><span>one interaction at a time.</span></p></div></div>
        <Star className="hero-star" /><div className="hero-side-note">A curious mind,<br/>a little code,<br/>& a lot of possibilities.<svg viewBox="0 0 90 90"><path d="M12 4Q72 15 63 74m-13-12 13 16 9-18" /></svg></div><Plane className="hero-plane" /><span className="plane-note">let’s see where this goes.</span>
        <div className="hero-bottom"><a href="#chapter-2" className="scroll-cue"><span>↓</span> SCROLL TO FOLLOW THE STORY</a><span className="made-note">Drawn with curiosity. Built with intention.</span><span className="hero-page">01 — 06</span></div>
      </section>

      <section id="chapter-2" data-chapter className="about chapter">
        <Label n="02">A MIND FULL OF IDEAS</Label>
        <div className="about-heading reveal"><h2>A little curious.<br/><em>A lot of possibility.</em></h2><p>I’m Gia Bảo, a frontend developer who likes to turn<br className="desktop"/> “what if?” into something you can actually click.</p></div>
        <div className="artifact-board">
          <div className="polaroid reveal"><span className="tape"/><img src="/images/workspace.jpg" width="750" height="500" alt="A sunlit creative desk with a laptop and notebook" /><span>where the little ideas begin.</span><small>WORKSPACE INSPIRATION · DENISE JANS / UNSPLASH</small></div>
          <div className="yellow-note reveal"><span className="pin"/><span className="hand">Curious<br/>by default.</span><p>Taking things apart.<br/>Figuring things out.<br/>Making them my own.</p><Star /></div>
          <div className="about-scribble">the best part?<br/><span>there’s always more to learn.</span><svg viewBox="0 0 180 70"><path d="M5 10q90 60 160 22m-20-5 22 4-12 17"/></svg></div>
          <div className="lined-note reveal"><span className="tape"/><span className="hand">A few things about me</span><p>Obsessed with the details.</p><p>Always building something.</p><p>Still learning. Always experimenting.</p><div className="note-bottom">Ideas → experiments → little breakthroughs</div></div>
        </div>
      </section>

      <section id="chapter-3" data-chapter className="skills chapter">
        <Label n="03">THE ART OF BUILDING</Label>
        <div className="section-heading reveal"><h2>A little structure.<br/><em>A little magic.</em></h2><p>Behind every playful interaction,<br/>there’s a thoughtful bit of engineering.</p></div>
        <div className="skills-composition"><div className="skill-lists reveal"><div><span className="skill-number">01 /</span><h3>Frontend</h3><p>React · Next.js<br/>TypeScript · JavaScript</p></div><div><span className="skill-number">02 /</span><h3>Styling</h3><p>HTML & CSS<br/>Tailwind CSS · Responsive design</p></div><div><span className="skill-number">03 /</span><h3>Workflow</h3><p>Git & developer tools<br/>Experiment. Refine. Repeat.</p></div></div><div className="blueprint reveal"><span className="blueprint-caption">from a rough idea...</span><div className="wire-nav"><span>logo</span><i/><i/><i/></div><div className="wire-body"><div><div className="wire-title"/><div className="wire-title short"/><div className="wire-line"/><div className="wire-line"/><div className="wire-button">let’s build ↗</div></div><div className="wire-image"><span>↗</span></div></div><div className="component-tags"><span>&lt;Header /&gt;</span><span>&lt;Possibility /&gt;</span><span>&lt;LittleDetails /&gt;</span></div><span className="blueprint-bottom">...to something that feels just right.</span><Plane color="blue" className="blueprint-plane"/></div></div>
      </section>

      <SelectedWorks sceneRef={signatureScene} flight={<div className="transformation-flight" aria-hidden="true"><svg viewBox="0 0 500 120" preserveAspectRatio="none"><path d="M0 85C100 140 220 12 310 58S430 120 495 15"/></svg><Plane color="blue"/></div>} />

      <section id="chapter-5" data-chapter className="growth chapter"><Label n="05">STILL IN PROGRESS</Label><div className="growth-title reveal"><span className="hand">a little reminder to myself</span><h2>Not finished.<br/><em>Just getting started.</em></h2><p>There’s always another thing to learn. Another idea to try.<br/>Another small step toward the developer I want to become.</p></div><div className="growth-notes reveal"><div><span>01 — KEEP EXPLORING</span><p>Follow the questions.<br/>Even the strange ones.</p></div><div><span>02 — KEEP MAKING</span><p>Build small things.<br/>Learn something big.</p></div><div><span>03 — WHAT’S NEXT?</span><p>A blank page.<br/>A new possibility.</p></div></div><div className="chalk-window"><div/><i/><span/><Plane color="mint"/></div><span className="window-note">there’s a whole world out there.</span></section>

      <section id="chapter-6" data-chapter className="contact chapter"><Label n="06">THE NEXT CHAPTER</Label><Star className="contact-star"/><span className="contact-kicker hand">Well, here we are.</span><h2>Every good story<br/>leads to <em>another.</em></h2><p>Have an idea worth building?<br/>Let’s make something memorable.</p><a className="contact-main" href="mailto:hello@example.com">Let’s start a conversation <span>↗</span></a><div className="contact-links"><a href="mailto:hello@example.com">Email ↗</a><button onClick={() => setProject(3)}>GitHub ↗</button><button onClick={() => setProject(4)}>LinkedIn ↗</button></div><span className="contact-placeholder">CONTACT LINKS ARE PLACEHOLDERS — READY FOR YOUR DETAILS</span><Plane color="coral" className="contact-plane"/><div className="ending"><span className="signature">gb.</span><span>Thanks for following my little adventure.</span><a href="#chapter-1">BACK TO THE FIRST MARK ↑</a></div></section>
    </main>
    <div className="bottom-progress" />
    {project !== null && <div className="modal-backdrop" onClick={() => setProject(null)}><div ref={modal} className="project-modal" role="dialog" aria-modal="true" aria-label="Concept project details" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setProject(null)} aria-label="Close dialog">×</button>{project < 3 ? <><span className="project-index">A SPACE FOR YOUR REAL WORK</span><h2>{['Objects & everyday things.', 'A change of scenery.', 'A place for the possibilities.'][project]}</h2><ProductPreview variant={['studio', 'folio', 'gather'][project]}/><p>This is an original interface concept, not a shipped client project. Replace it with your project name, real screenshot, responsibilities, and working links.</p><div className="placeholder-actions"><span>Live demo — coming with your project ↗</span><span>Source code — add your repository ↗</span></div></> : <><span className="hand">The next little detail.</span><h2>{project === 3 ? 'Find me on GitHub.' : 'Let’s connect on LinkedIn.'}</h2><p>This contact link is a placeholder. Add Gia Bảo’s actual {project === 3 ? 'GitHub profile' : 'LinkedIn URL'} before publishing.</p></>}</div></div>}
  </div>
}
