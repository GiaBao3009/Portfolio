import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  featuredProjects,
  supportingProjects,
  type FeaturedProject,
  type VideoAnnotation,
} from './data/selectedWorks'
import './selected-works.css'

/**
 * Component đồ họa phác thảo Chalkboard Storyboard
 * Hiển thị khi video demo của dự án trọng tâm chưa được gắn file MP4 thật,
 * đảm bảo khung hình 16:9 luôn trực quan, đúng chất nghệ thuật bảng đen.
 */
function ProjectStoryboard({
  project,
  selectedAnnotation,
}: {
  project: FeaturedProject
  selectedAnnotation: number
}) {
  const { storyboard } = project

  return (
    /* Khối bảng phác thảo chalkboard mô phỏng quy trình */
    <div className="workflow-storyboard">
      {/* Nhãn thể hiện quy trình kỹ thuật */}
      <span className="storyboard-label">{storyboard.badge}</span>

      {/* Tiêu đề ngắn viết tay */}
      <div className="storyboard-intro">
        <span className="hand">{storyboard.headline}</span>
        <p>{storyboard.subline}</p>
      </div>

      {/* SVG vẽ các đường liên kết chalk giữa các node quy trình */}
      <div
        className="storyboard-drawing"
        aria-label={`${project.name} workflow illustration`}
      >
        <svg
          viewBox="0 0 1000 390"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Đường nối node 1 sang node 2 */}
          <path
            className={selectedAnnotation === 0 ? 'highlight' : ''}
            d="M240 120C315 105 325 135 400 120m-12-7 13 7-12 8"
          />
          {/* Đường nối node 2 sang node 3 */}
          <path
            className={selectedAnnotation === 1 ? 'highlight' : ''}
            d="M585 120C645 135 670 102 735 120m-13-8 14 8-12 9"
          />
          {/* Đường nối phụ hoặc hồi tiếp */}
          <path
            className={selectedAnnotation === 2 ? 'highlight' : ''}
            d="M830 167C855 210 795 230 830 273m-11-9 11 11 6-14"
          />
          {/* Đường chalk nét đứt hồi quy */}
          <path
            className="drawing-return"
            d="M730 320C480 385 230 310 120 180"
          />
        </svg>

        {/* Danh sách các node tương tác của quy trình */}
        {storyboard.keypoints.map((point, i) => (
          <div
            key={point.title}
            className={`storyboard-node node-${i}${selectedAnnotation === i ? ' is-highlighted' : ''}`}
          >
            <span>0{i + 1}</span>
            <strong>{point.title}</strong>
            <small className="node-detail">{point.desc}</small>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* Ghi chú chân trang mô phỏng */}
      <div className="storyboard-bottom">
        <span>AUTHENTIC ENGINEERING HIGHLIGHTS</span>
        <span>ATTACH YOUR MP4/WEBM TO ACTIVATE FULL FOOTAGE ↗</span>
      </div>
    </div>
  )
}

/**
 * Component Chapter 03 — Selected Works
 * Trình diễn 3 dự án trọng tâm với video demo và 4 dự án bổ trợ thể hiện độ rộng kinh nghiệm.
 */
export default function SelectedWorks({
  sceneRef,
  flight,
}: {
  sceneRef: RefObject<HTMLDivElement | null>
  flight: React.ReactNode
}) {
  // Quản lý index trong 3 dự án trọng tâm có video (0: Chips Bill, 1: Chips Voting, 2: Workflow-Platform)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const currentFeatured = featuredProjects[featuredIndex]

  // Quản lý video DOM element và trạng thái phát
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLElement>(null)

  // Annotation đang active trong dự án hiện tại
  const [selectedCue, setSelectedCue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const hasVideo = Boolean(currentFeatured.videoSrc) && !videoFailed
  const currentAnnotation: VideoAnnotation | undefined =
    currentFeatured.annotations[selectedCue]

  // Lắng nghe tùy chọn giảm chuyển động của hệ điều hành
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) {
        videoRef.current?.pause()
      }
    }
    preference.addEventListener('change', handleChange)
    return () => preference.removeEventListener('change', handleChange)
  }, [])

  // Tự động reset annotation index và cờ video error khi đổi dự án trọng tâm
  useEffect(() => {
    setSelectedCue(0)
    setVideoFailed(false)
    setIsPlaying(false)
  }, [featuredIndex])

  // Tự động phát video không tiếng khi người dùng cuộn đến phân đoạn Selected Works
  useEffect(() => {
    if (!hasVideo || !stageRef.current || !videoRef.current) return
    const media = videoRef.current
    let attempted = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          media.pause()
        } else if (!reducedMotion && !attempted) {
          attempted = true
          media.play().catch(() => setIsPlaying(false))
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [hasVideo, reducedMotion, featuredIndex])

  // Đồng bộ thời gian video với danh sách annotation tương ứng
  const handleTimeSync = () => {
    if (!videoRef.current) return
    const time = videoRef.current.currentTime
    const matchedIndex = currentFeatured.annotations.findIndex(
      (cue) => time >= cue.start && time <= cue.end
    )
    if (matchedIndex >= 0 && matchedIndex !== selectedCue) {
      setSelectedCue(matchedIndex)
    }
  }

  // Điều hướng qua lại giữa các annotation note
  const navigateAnnotation = (direction: number) => {
    const count = currentFeatured.annotations.length
    const nextIndex = (selectedCue + direction + count) % count
    setSelectedCue(nextIndex)

    if (videoRef.current && hasVideo) {
      videoRef.current.currentTime = currentFeatured.annotations[nextIndex].start
      videoRef.current.play().catch(() => setIsPlaying(false))
    }
  }

  // Bật / tắt phát video
  const togglePlayback = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => setIsPlaying(false))
    }
  }

  return (
    /* Khối section chính của Chapter 03 */
    <section id="chapter-3" data-chapter className="projects chapter selected-works">
      {/* Nhãn chương số 03 với gạch ngang phấn */}
      <div className="chapter-label">
        <span>03</span>
        <i />
        IDEAS BECOME REAL — SELECTED WORKS
      </div>

      {/* Khối tiêu đề bắt buộc giữ nguyên: Here is how I think. Here is what I build. */}
      <div className="section-heading reveal">
        <h2>
          Here is how I think.
          <br />
          <em>Here is what I build.</em>
        </h2>
        <p>
          From a little “what if”
          <br />
          to engineering you can put to work.
        </p>
      </div>

      {/* ================================================================
          1. BA PROJECT TRỌNG TÂM — VIDEO DEMO & CHÚ THÍCH ĐỒNG BỘ
          ================================================================ */}
      <div className="featured-section-intro reveal">
        <span className="work-overline">FEATURED DEMONSTRATIONS · 03 CORE PROJECTS</span>
        <span className="hand">Depth of technical execution, captured in motion.</span>
      </div>

      {/* Thanh điều hướng tinh tế giữa 3 dự án trọng tâm */}
      <nav
        className="project-selector-rail reveal"
        aria-label="Core featured projects navigation"
      >
        <div className="project-selector-scroll">
          {featuredProjects.map((proj, idx) => (
            <button
              key={proj.id}
              className={`project-tab-btn ${featuredIndex === idx ? 'is-active' : ''}`}
              onClick={() => setFeaturedIndex(idx)}
              aria-current={featuredIndex === idx ? 'true' : undefined}
            >
              <span className="project-tab-num">{proj.number}</span>
              <span className="project-tab-name">{proj.name}</span>
            </button>
          ))}
        </div>

        {/* Nút lùi/tiến dự án nhanh */}
        <div className="project-quick-stepper">
          <button
            onClick={() =>
              setFeaturedIndex(
                (featuredIndex - 1 + featuredProjects.length) % featuredProjects.length
              )
            }
            aria-label="Previous core project"
            className="stepper-arrow"
          >
            ←
          </button>
          <span className="stepper-indicator">
            {currentFeatured.number} / {String(featuredProjects.length).padStart(2, '0')}
          </span>
          <button
            onClick={() =>
              setFeaturedIndex((featuredIndex + 1) % featuredProjects.length)
            }
            aria-label="Next core project"
            className="stepper-arrow"
          >
            →
          </button>
        </div>
      </nav>

      {/* Khối trình diễn chính cho dự án trọng tâm được chọn */}
      <div className="signature-scene workflow-feature" ref={sceneRef}>
        <article aria-labelledby={`project-title-${currentFeatured.id}`}>
          {/* Header dự án: overline, tên dự án, hand note và tóm tắt nghiệp vụ */}
          <div className="workflow-heading">
            {/* Tên và vai trò dự án */}
            <div>
              <span className="work-overline">
                {currentFeatured.number} / {currentFeatured.role.toUpperCase()}
              </span>
              <h3 id={`project-title-${currentFeatured.id}`}>
                {currentFeatured.name}
                <span>.</span>
              </h3>
              {/* Huy hiệu điểm nhấn nổi bật */}
              <div className="project-highlight-chip">
                <span className="highlight-dot" />
                {currentFeatured.highlight}
              </div>
              {/* Danh sách tech stack */}
              <div className="project-tech-badges">
                {currentFeatured.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Chữ viết tay và mô tả kỹ thuật thực tế với độ tương phản cao */}
            <div className="workflow-summary">
              <span className="hand">{currentFeatured.handNote}</span>
              <p>{currentFeatured.summary}</p>
            </div>
          </div>

          {/* Khung video 16:9 cinematic không player chrome */}
          <figure
            ref={stageRef}
            className="workflow-demonstration"
            aria-label={`${currentFeatured.name} demonstration video`}
          >
            {/* Vùng chứa media 16:9 */}
            <div className="workflow-media">
              {hasVideo ? (
                /* Video thực tế: không controls, tự động căn tỉ lệ 16:9 */
                <video
                  ref={videoRef}
                  src={currentFeatured.videoSrc!}
                  poster={currentFeatured.posterSrc ?? undefined}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label={`${currentFeatured.name} product demonstration`}
                  aria-describedby="workflow-note"
                  onTimeUpdate={handleTimeSync}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => {
                    setVideoFailed(true)
                    setIsPlaying(false)
                  }}
                />
              ) : (
                /* Đồ họa storyboard chalkboard minh họa luồng kỹ thuật */
                <ProjectStoryboard
                  project={currentFeatured}
                  selectedAnnotation={selectedCue}
                />
              )}

              {/* Đường chỉ dẫn bằng phấn nối từ annotation đến điểm tương tác trên video */}
              {currentAnnotation && (
                <svg
                  className="workflow-pointer"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={`M 48 99 Q ${currentAnnotation.target.x - 10} 86 ${currentAnnotation.target.x} ${currentAnnotation.target.y + 2}`}
                  />
                  <circle
                    cx={currentAnnotation.target.x}
                    cy={currentAnnotation.target.y}
                    r="1.3"
                  />
                </svg>
              )}
            </div>

            {/* Chiếc máy bay giấy lướt qua khi scroll */}
            {flight}

            {/* Chú thích kỹ thuật dưới video */}
            <figcaption className="workflow-caption">
              <span>
                FIG. {currentFeatured.number} — {currentFeatured.name.toUpperCase()} DEMONSTRATION WORKFLOW
              </span>
              <span>
                {hasVideo ? 'CINEMATIC VIDEO STREAM' : 'DEMO FOOTAGE READY'} · 16:9
              </span>
            </figcaption>
          </figure>

          {/* Khối hiển thị các annotation đồng bộ theo thời gian thực */}
          <div className="workflow-notes">
            {/* Tiêu đề mục ghi chú */}
            <div className="workflow-note-heading">
              <span className="hand">
                {hasVideo ? 'key engineering cues' : 'demonstrated workflows'}
              </span>
              <span className="work-overline">
                {hasVideo ? 'SYNCHRONIZED ANNOTATION' : 'FEATURE BREAKDOWN'}
              </span>
            </div>

            {/* Nội dung annotation đang hiển thị với độ tương phản cao */}
            <div
              className="workflow-note"
              id="workflow-note"
              aria-live={isPlaying ? 'off' : 'polite'}
              aria-atomic="true"
            >
              {currentAnnotation && (
                <div key={currentAnnotation.id} className="workflow-note-content">
                  <span className="note-pencil" aria-hidden="true">
                    ↳
                  </span>
                  <div>
                    {/* Timestamp cue pill gắn liền với video */}
                    {currentAnnotation.cueLabel && (
                      <span className="cue-timestamp-badge">
                        <span className="cue-pulse" />
                        {currentAnnotation.cueLabel}
                      </span>
                    )}
                    <h4>{currentAnnotation.title}</h4>
                    <p>{currentAnnotation.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Nút chuyển đổi qua lại giữa các annotation note */}
            <div
              className="workflow-note-navigation"
              aria-label="Annotation notes navigation"
            >
              <button
                onClick={() => navigateAnnotation(-1)}
                aria-label="Previous feature annotation"
              >
                ←
              </button>
              <span>
                {String(selectedCue + 1).padStart(2, '0')} /{' '}
                {String(currentFeatured.annotations.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => navigateAnnotation(1)}
                aria-label="Next feature annotation"
              >
                →
              </button>
            </div>
          </div>

          {/* Chân trang của khu vực featured project */}
          <div className="workflow-footnote">
            <p>
              Video proves technical execution in real-time. Portfolios guide the viewer to
              that evidence. Synchronized annotations anchor directly to the scale weighing,
              voting quota validation, and visual node mapping.
            </p>

            {/* Nút điều khiển playback nếu có video */}
            {hasVideo ? (
              <button className="workflow-playback" onClick={togglePlayback}>
                {isPlaying ? 'Pause demonstration' : 'Play demonstration'}{' '}
                <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▷'}</span>
              </button>
            ) : (
              <span className="workflow-awaiting hand">
                evidence of capability, made tangible.
              </span>
            )}
          </div>
        </article>
      </div>

      {/* ================================================================
          2. NARRATIVE BRIDGE:
          Chuyển cảnh có chủ đích từ 3 project video sang 4 project bổ trợ
          ================================================================ */}
      <div className="story-bridge-connector reveal" aria-hidden="true">
        {/* Đường phấn uốn lượn dẫn lối người xem xuống danh mục bổ trợ */}
        <svg className="bridge-path-svg" viewBox="0 0 800 90" preserveAspectRatio="none">
          <path d="M 400 0 C 400 45, 120 20, 120 75" />
          <path d="M 115 67 L 120 78 L 128 69" />
        </svg>
      </div>

      {/* Tiêu đề dẫn nhập mạch lạc sang 4 project bổ trợ */}
      <div className="more-work-intro reveal">
        <div>
          <span className="work-overline">BREADTH OF EXPERIENCE · 04 SUPPORTING PROJECTS</span>
          <h4 className="archive-bridge-title">
            From focused hardware POS, voting logic &amp; workflow graphs...
          </h4>
        </div>
        <span className="hand archive-bridge-hand">
          ↳ ...to enterprise ERPs, agile tools, order tracking &amp; financial hubs.
        </span>
      </div>

      {/* ================================================================
          3. BỐN PROJECT BỔ TRỢ — TRÌNH BÀY NGẮN GỌN & RÕ PHẦN VIỆC FRONTEND
          Dạng thẻ giấy dán băng dính (Taped paper cards), không cạnh tranh thị giác
          ================================================================ */}
      <div className="additional-works archive-grid reveal">
        {supportingProjects.map((proj) => (
          <article
            key={proj.id}
            className="additional-work archive-card supporting-card"
            tabIndex={0}
            aria-label={`${proj.name} — ${proj.category}`}
          >
            {/* Giấy mô phỏng đồ án dán băng dính trên bảng đen */}
            <div className="additional-work-paper">
              <span className="tape" aria-hidden="true" />
              <div className="additional-media supporting-media">
                <span className="supporting-media-num">{proj.number}</span>
                <small className="supporting-media-badge">{proj.badgeText}</small>
              </div>
              <span className="additional-paper-caption">
                {proj.category.toUpperCase()} · FRONTEND HIGHLIGHTS
              </span>
            </div>

            {/* Nội dung thông tin dự án bổ trợ với độ tương phản cao */}
            <div className="additional-work-copy">
              <div className="supporting-role-line">
                <span className="work-overline">{proj.number} / {proj.category.toUpperCase()}</span>
                <span className="supporting-role-badge">{proj.role}</span>
              </div>

              <h3>{proj.title}</h3>
              <p className="supporting-summary">{proj.summary}</p>

              {/* Danh sách các phần việc Frontend cụ thể đã thực hiện */}
              <div className="supporting-work-list">
                <span className="supporting-list-label">Phần việc Frontend cụ thể:</span>
                <ul>
                  {proj.frontendHighlights.map((item, idx) => (
                    <li key={idx}>
                      <span className="bullet-dash">↳</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Danh sách công nghệ sử dụng */}
              <div className="tech-tags">
                {proj.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lời dẫn chuyển tiếp sang Chapter tiếp theo */}
      <div className="selected-works-ending reveal">
        <span className="hand">Always another idea on the board.</span>
        <a href="#chapter-4">
          THE STORY CONTINUES <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
