import { useEffect, useRef, useState } from 'react'
import ChapterNavigation from './ChapterNavigation'
import SelectedWorks from './SelectedWorks'

// Danh sách 5 chương câu chuyện theo cấu trúc chuẩn
const chapters = [
  'The first mark',
  'A mind full of ideas',
  'Selected works',
  'Still in progress',
  'The next chapter',
]

/**
 * Component SVG Chiếc máy bay giấy Origami
 */
function Plane({
  className = '',
  color = 'yellow',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg
      className={`plane ${className} ${color}`}
      viewBox="0 0 160 115"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 39 154 7 99 108 70 66 5 39Z" fill="currentColor" />
      <path d="m5 39 149-32-84 59L5 39Z" fill="#fff" opacity=".22" />
      <path
        d="m70 66 84-59-65 73 10 28-29-42Z"
        fill="#000"
        opacity=".16"
      />
      <path
        d="m70 66 84-59-65 73"
        stroke="#463f2c"
        strokeOpacity=".35"
      />
      <path d="m70 66-5 27 24-13" fill="currentColor" />
    </svg>
  )
}

/**
 * Component Ngôi sao phấn viết tay
 */
function Star({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`chalk-star ${className}`}
      viewBox="0 0 70 70"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m36 5 5 22 22 3-20 11 4 23-15-17-22 10 12-22L8 19l23 7 5-21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Component Nhãn tên chương với số thứ tự phong cách bảng đen
 */
function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="chapter-label">
      <span>{n}</span>
      <i />
      {children}
    </div>
  )
}

/**
 * Tìm index điểm sample gần nhất dọc theo đường SVG bằng thuật toán Binary Search
 * Giảm độ phức tạp từ O(N) xuống O(log N) trên mỗi frame cuộn màn hình.
 */
function findSampleIndex(
  samples: { length: number; x: number; y: number }[],
  targetY: number
): number {
  let low = 0
  let high = samples.length - 1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (samples[mid].y < targetY) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return Math.min(samples.length - 1, Math.max(1, low))
}

/**
 * Component chính điều phối toàn bộ Portfolio
 */
export default function App() {
  // Trạng thái chương hiện tại (0 -> 4)
  const [active, setActive] = useState(0)

  // Trạng thái menu điều hướng trên mobile
  const [menu, setMenu] = useState(false)

  // Modal hiển thị thông tin liên hệ / profile
  const [modalTarget, setModalTarget] = useState<'github' | 'linkedin' | null>(null)

  // Tham chiếu đến bảng vẽ và các element chuyển động
  const board = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const flyer = useRef<HTMLDivElement>(null)
  const signatureScene = useRef<HTMLDivElement>(null)
  const modal = useRef<HTMLDivElement>(null)

  // Cờ giảm chuyển động theo tùy chọn người dùng
  const [motion, setMotion] = useState(false)

  // Đường dẫn SVG chalk path và các vùng tránh chữ
  const [route, setRoute] = useState({
    d: '',
    width: 1440,
    height: 6000,
    clear: [] as { x: number; y: number; width: number; height: number }[],
  })

  // Hiệu ứng tính toán và vẽ đường bay máy bay khi cuộn
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

    // Tối ưu hiệu năng: Dùng IntersectionObserver cho các element .reveal thay vì getBoundingClientRect liên tục
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => revealObserver.observe(el))

    // Tính toán các mốc tọa độ và sinh đường cong Bézier chalk path
    const measure = () => {
      if (!board.current) return
      const bounds = board.current.getBoundingClientRect()
      const mobile = bounds.width <= 700

      // Các mốc landmarks dọc theo trang
      const landmarks = [
        '.scroll-cue',
        '.polaroid',
        '.lined-note',
        '.signature-scene',
        '.archive-card',
        '.chalk-window',
        '.contact-main',
      ]

      const points = landmarks
        .flatMap((selector, i) => {
          const element = board.current!.querySelector(selector)
          if (!element) return []
          const r = element.getBoundingClientRect()
          const x =
            i === 0
              ? r.left + r.width / 2
              : i === landmarks.length - 1
                ? r.right + 24
                : i % 2
                  ? r.left - 22
                  : r.right + 22
          return [
            {
              x: Math.max(
                18,
                Math.min(
                  bounds.width - 20,
                  mobile && i > 0 ? (i % 2 ? 22 : bounds.width - 22) : x - bounds.left
                )
              ),
              y: r.top - bounds.top + (i === 3 ? 40 : r.height * 0.65),
            },
          ]
        })
        .sort((a, b) => a.y - b.y)

      // Sinh chuỗi lệnh SVG Bézier curves
      const d = points
        .map((p, i) => {
          if (!i) return `M ${p.x} ${p.y}`
          const prev = points[i - 1]
          const dy = p.y - prev.y
          return `C ${prev.x + (i % 2 ? 35 : -35)} ${prev.y + dy * 0.48}, ${p.x + (i % 2 ? -45 : 45)} ${p.y - dy * 0.42}, ${p.x} ${p.y}`
        })
        .join(' ')

      // Vùng chắn để mask không che mất chữ
      const clear = [
        ...board.current.querySelectorAll(
          'h1, h2, .hero-description, .hero-side-note, .made-note, .section-heading > p, .growth-title > p, .growth-notes, .contact > p, .contact-links, .ending'
        ),
      ].map((el) => {
        const r = el.getBoundingClientRect()
        return {
          x: r.left - bounds.left - 12,
          y: r.top - bounds.top - 8,
          width: r.width + 24,
          height: r.height + 16,
        }
      })

      setRoute({ d, width: bounds.width, height: bounds.height, clear })

      if (path.current && d) {
        path.current.setAttribute('d', d)
        const length = path.current.getTotalLength()
        samples = Array.from({ length: 501 }, (_, i) => {
          const point = path.current!.getPointAtLength((length * i) / 500)
          return { length: (length * i) / 500, x: point.x, y: point.y }
        })
      }
      update()
    }

    // Hàm cập nhật animation trên mỗi frame cuộn (RAF)
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight
        const progress = Math.min(1, Math.max(0, scrollY / Math.max(1, max)))
        document.documentElement.style.setProperty('--progress', `${progress}`)

        // Cập nhật vị trí máy bay giấy bay dọc theo đường chalk path
        if (path.current && flyer.current && samples.length) {
          const length = samples[samples.length - 1].length
          const targetY = scrollY + innerHeight * 0.82

          // Tìm sample bằng Binary Search nhanh chóng
          const end = findSampleIndex(samples, targetY)
          const before = samples[end - 1]
          const next = samples[end]

          const fraction = Math.min(
            1,
            Math.max(0, (targetY - before.y) / Math.max(1, next.y - before.y))
          )
          const point = {
            x: before.x + (next.x - before.x) * fraction,
            y: before.y + (next.y - before.y) * fraction,
            length: before.length + (next.length - before.length) * fraction,
          }

          path.current.style.strokeDasharray = `${length}`
          path.current.style.strokeDashoffset = `${reduced ? 0 : length - point.length}`
          flyer.current.style.left = `${point.x}px`
          flyer.current.style.top = `${point.y}px`
          flyer.current.style.transform = `translate(-50%, -50%) rotate(${(Math.atan2(next.y - before.y, next.x - before.x) * 180) / Math.PI + 30}deg)`
        }

        // Cập nhật hiệu ứng unfold tại Signature Scene nếu có
        if (signatureScene.current) {
          const r = signatureScene.current.getBoundingClientRect()
          const mobile = innerWidth <= 700
          const t = reduced
            ? 1
            : Math.min(
                1,
                Math.max(
                  0,
                  mobile
                    ? (innerHeight * 0.85 - r.top) / (innerHeight * 0.65)
                    : (innerHeight * 0.5 - r.top) / (r.height - innerHeight * 0.55)
                )
              )
          const unfold = Math.min(1, Math.max(0, (t - 0.12) / 0.65))
          signatureScene.current.style.setProperty('--unfold', `${unfold}`)
          signatureScene.current.dataset.stage =
            unfold < 0.1 ? 'sketch' : unfold < 0.95 ? 'unfold' : 'built'

          if (!reduced && landingPath && landingPlane) {
            const distance = landingLength * Math.min(1, unfold / 0.85)
            const p = landingPath.getPointAtLength(distance)
            const next = landingPath.getPointAtLength(Math.min(landingLength, distance + 2))
            const svg = landingPath.ownerSVGElement!
            landingPlane.style.left = `${(p.x / 500) * 100}%`
            landingPlane.style.top = `${(p.y / 120) * 100}%`
            landingPlane.style.transform = `translate(-50%, -50%) rotate(${
              (Math.atan2(
                ((next.y - p.y) * svg.clientHeight) / 120,
                ((next.x - p.x) * svg.clientWidth) / 500
              ) *
                180) /
                Math.PI +
              30
            }deg)`
          }
        }

        // Xác định chương đang active
        let chapter = 0
        sections.forEach((el, i) => {
          if (el.getBoundingClientRect().top < innerHeight * 0.5) chapter = i
        })
        setActive(chapter)
      })
    }

    const onPreference = () => {
      reduced = preference.matches
      setMotion(reduced)
      update()
    }
    onPreference()

    const observer = new ResizeObserver(measure)
    if (board.current) observer.observe(board.current)
    document.fonts.ready.then(measure)

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    preference.addEventListener('change', onPreference)

    return () => {
      observer.disconnect()
      revealObserver.disconnect()
      preference.removeEventListener('change', onPreference)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Khóa scroll và bẫy focus bàn phím khi modal mở
  useEffect(() => {
    if (!modalTarget) return
    const previous = document.activeElement as HTMLElement | null
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modal.current?.querySelector<HTMLButtonElement>('button')?.focus()

    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modal.current) return
      const controls = [
        ...modal.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex="0"]'
        ),
      ]
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', trap)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', trap)
      previous?.focus({ preventScroll: true })
    }
  }, [modalTarget])

  // Đóng modal hoặc menu khi nhấn phím Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalTarget(null)
        setMenu(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    /* Khối bảng vẽ lớn chứa toàn bộ ứng dụng */
    <div className={`board ${motion ? 'still' : ''}`} ref={board}>
      {/* Header trang với logo viết tay, slogan và thanh điều hướng */}
      <header className="site-header">
        {/* Logo chữ ký Gia Bảo */}
        <a href="#chapter-1" className="signature" aria-label="Gia Bảo home">
          gb<span>®</span>
        </a>

        {/* Khẩu hiệu phong cách editorial */}
        <a className="header-note" href="#chapter-1">
          A LITTLE PORTFOLIO. A BIG IMAGINATION.
        </a>

        {/* Liên kết điều hướng nhanh đến Selected Works và Contact */}
        <nav>
          <a href="#chapter-3">
            Selected work <span>↗</span>
          </a>
          <a href="#chapter-5" className="talk-link">
            Let’s talk <span>↗</span>
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Open chapter navigation"
          >
            ☰
          </button>
        </nav>
      </header>

      {/* Backdrop mờ phía sau menu mobile khi mở */}
      {menu && (
        <div
          className="chapter-menu-backdrop"
          onClick={() => setMenu(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu dropdown danh sách các chương trên mobile */}
      {menu && (
        <div className="chapter-menu" role="menu">
          {chapters.map((name, i) => (
            <a
              key={name}
              href={`#chapter-${i + 1}`}
              onClick={() => setMenu(false)}
              role="menuitem"
            >
              <span>0{i + 1}</span>
              {name} ↗
            </a>
          ))}
        </div>
      )}

      {/* Vùng vẽ chalk path SVG với mask che chữ */}
      <div className="journey-path" aria-hidden="true">
        <svg
          viewBox={`0 0 ${route.width} ${route.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <mask
              id="reading-space"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={route.width}
              height={route.height}
            >
              <rect width={route.width} height={route.height} fill="white" />
              {route.clear.map((r, i) => (
                <rect key={i} {...r} fill="black" rx="12" />
              ))}
            </mask>
          </defs>
          <g mask="url(#reading-space)">
            <path className="path-ghost" d={route.d} />
            <path ref={path} className="drawn-path" d={route.d} />
          </g>
        </svg>
      </div>

      {/* Chiếc máy bay giấy bay theo đường cuộn trang */}
      <div ref={flyer} className="travelling-plane" aria-hidden="true">
        <Plane />
      </div>

      {/* Widget điều hướng chương cố định bên góc phải */}
      <ChapterNavigation active={active} chapters={chapters} />

      {/* Nội dung chính của trang */}
      <main>
        {/* ================================================================
            CHAPTER 01: HERO SECTION
            ================================================================ */}
        <section id="chapter-1" data-chapter className="hero">
          {/* Topline đầu trang */}
          <div className="hero-topline">
            <span className="tiny-star">✳</span>
            THE IMPOSSIBLE CHALKBOARD
            <span className="edition">VOL. 01 — AN ONGOING STORY</span>
          </div>

          {/* Khối giới thiệu tiêu đề tên và chức danh */}
          <div className="hero-content">
            <div className="hero-kicker">Every story starts somewhere.</div>
            <h1>
              <span>Hi, I’m</span>
              <br />
              Gia{' '}
              <em>
                Bảo
                <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M365 38C270-1 48 2 18 89S133 200 285 174 431 56 331 23" />
                </svg>
              </em>
              <span className="name-period">.</span>
            </h1>
            <div className="hero-description">
              <span className="drawn-arrow">↳</span>
              <p>
                Frontend Developer.
                <br />
                Building experiences,
                <br />
                <span>one interaction at a time.</span>
              </p>
            </div>
          </div>

          {/* Các chi tiết phấn trang trí và máy bay giấy */}
          <Star className="hero-star" />
          <div className="hero-side-note">
            A curious mind,
            <br />
            a little code,
            <br />
            & a lot of possibilities.
            <svg viewBox="0 0 90 90">
              <path d="M12 4Q72 15 63 74m-13-12 13 16 9-18" />
            </svg>
          </div>
          <Plane className="hero-plane" />
          <span className="plane-note">let’s see where this goes.</span>

          {/* Chân trang phần Hero với nút cuộn và số trang */}
          <div className="hero-bottom">
            <a href="#chapter-2" className="scroll-cue">
              <span>↓</span> SCROLL TO FOLLOW THE STORY
            </a>
            <span className="made-note">
              Drawn with curiosity. Built with intention.
            </span>
            <span className="hero-page">01 — 05</span>
          </div>
        </section>

        {/* ================================================================
            CHAPTER 02: ABOUT ME & ENGINEERING CRAFT
            ================================================================ */}
        <section id="chapter-2" data-chapter className="about chapter">
          <Label n="02">A MIND FULL OF IDEAS</Label>

          {/* Tiêu đề chương About */}
          <div className="about-heading reveal">
            <h2>
              A little curious.
              <br />
              <em>A lot of possibility.</em>
            </h2>
            <p>
              I’m Gia Bảo, a frontend developer who likes to turn
              <br className="desktop" /> “what if?” into something you can actually click.
            </p>
          </div>

          {/* Bảng hiện vật sáng tạo (Artifact board) */}
          <div className="artifact-board">
            {/* Ảnh polaroid góc làm việc sáng tạo */}
            <div className="polaroid reveal">
              <span className="tape" />
              <img
                src="/images/workspace.jpg"
                width="750"
                height="500"
                alt="A sunlit creative desk with a laptop and notebook"
              />
              <span>where the little ideas begin.</span>
              <small>WORKSPACE INSPIRATION · DENISE JANS / UNSPLASH</small>
            </div>

            {/* Mẩu giấy nhớ màu vàng ghim kim */}
            <div className="yellow-note reveal">
              <span className="pin" />
              <span className="hand">
                Curious
                <br />
                by default.
              </span>
              <p>
                Taking things apart.
                <br />
                Figuring things out.
                <br />
                Making them my own.
              </p>
              <Star />
            </div>

            {/* Chữ viết tay ngẫu hứng */}
            <div className="about-scribble">
              the best part?
              <br />
              <span>there’s always more to learn.</span>
              <svg viewBox="0 0 180 70">
                <path d="M5 10q90 60 160 22m-20-5 22 4-12 17" />
              </svg>
            </div>

            {/* Giấy kẻ dòng dán băng keo ghi vài điều về bản thân */}
            <div className="lined-note reveal">
              <span className="tape" />
              <span className="hand">A few things about me</span>
              <p>Obsessed with the details.</p>
              <p>Always building something.</p>
              <p>Still learning. Always experimenting.</p>
              <div className="note-bottom">
                Ideas → experiments → little breakthroughs
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            CHAPTER 03: SELECTED WORKS (CINEMATIC FEATURED PROJECTS)
            ================================================================ */}
        <SelectedWorks
          sceneRef={signatureScene}
          flight={
            <div className="transformation-flight" aria-hidden="true">
              <svg viewBox="0 0 500 120" preserveAspectRatio="none">
                <path d="M0 85C100 140 220 12 310 58S430 120 495 15" />
              </svg>
              <Plane color="blue" />
            </div>
          }
        />

        {/* ================================================================
            CHAPTER 04: STILL IN PROGRESS
            ================================================================ */}
        <section id="chapter-4" data-chapter className="growth chapter">
          <Label n="04">STILL IN PROGRESS</Label>

          <div className="growth-title reveal">
            <span className="hand">a little reminder to myself</span>
            <h2>
              Not finished.
              <br />
              <em>Just getting started.</em>
            </h2>
            <p>
              There’s always another thing to learn. Another idea to try.
              <br />
              Another small step toward the developer I want to become.
            </p>
          </div>

          {/* 3 mẩu ghi nhớ nguyên tắc phát triển bản thân */}
          <div className="growth-notes reveal">
            <div>
              <span>01 — KEEP EXPLORING</span>
              <p>
                Follow the questions.
                <br />
                Even the strange ones.
              </p>
            </div>
            <div>
              <span>02 — KEEP MAKING</span>
              <p>
                Build small things.
                <br />
                Learn something big.
              </p>
            </div>
            <div>
              <span>03 — WHAT’S NEXT?</span>
              <p>
                A blank page.
                <br />
                A new possibility.
              </p>
            </div>
          </div>

          {/* Cửa sổ phấn nhìn ra thế giới */}
          <div className="chalk-window">
            <div />
            <i />
            <span />
            <Plane color="mint" />
          </div>
          <span className="window-note">there’s a whole world out there.</span>
        </section>

        {/* ================================================================
            CHAPTER 05: THE NEXT CHAPTER (CONTACT & SOCIALS)
            ================================================================ */}
        <section id="chapter-5" data-chapter className="contact chapter">
          <Label n="05">THE NEXT CHAPTER</Label>
          <Star className="contact-star" />
          <span className="contact-kicker hand">Well, here we are.</span>
          <h2>
            Every good story
            <br />
            leads to <em>another.</em>
          </h2>
          <p>
            Have an idea worth building?
            <br />
            Let’s make something memorable.
          </p>

          {/* Nút gửi email liên hệ chính */}
          <a className="contact-main" href="mailto:hello@example.com">
            Let’s start a conversation <span>↗</span>
          </a>

          {/* Các liên kết mạng xã hội */}
          <div className="contact-links">
            <a href="mailto:hello@example.com">Email ↗</a>
            <button onClick={() => setModalTarget('github')}>GitHub ↗</button>
            <button onClick={() => setModalTarget('linkedin')}>LinkedIn ↗</button>
          </div>

          <span className="contact-placeholder">
            GIA BẢO · FRONTEND DEVELOPER · PORTFOLIO
          </span>

          <Plane color="coral" className="contact-plane" />

          {/* Chân trang kết thúc câu chuyện */}
          <div className="ending">
            <span className="signature">gb.</span>
            <span>Thanks for following my little adventure.</span>
            <a href="#chapter-1">BACK TO THE FIRST MARK ↑</a>
          </div>
        </section>
      </main>

      {/* Thanh tiến trình màu vàng dưới đáy màn hình */}
      <div className="bottom-progress" />

      {/* Modal hiển thị chi tiết GitHub hoặc LinkedIn */}
      {modalTarget !== null && (
        <div
          className="modal-backdrop"
          onClick={() => setModalTarget(null)}
          role="presentation"
        >
          <div
            ref={modal}
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModalTarget(null)}
              aria-label="Close dialog"
            >
              ×
            </button>
            <span className="hand">The next little detail.</span>
            <h2 id="contact-modal-title">
              {modalTarget === 'github'
                ? 'Find me on GitHub.'
                : 'Let’s connect on LinkedIn.'}
            </h2>
            <p>
              Explore my repositories and open-source contributions on GitHub,
              or connect directly via LinkedIn to discuss frontend engineering
              opportunities.
            </p>
            <div className="placeholder-actions">
              {modalTarget === 'github' ? (
                <a
                  href="https://github.com/GiaBao3009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-ext-link"
                >
                  Visit https://github.com/GiaBao3009 ↗
                </a>
              ) : (
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-ext-link"
                >
                  Connect on LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
