import { useEffect, useRef, useState } from 'react'
import { useI18n } from './assets/i18n'
import './chapter-navigation.css'

/**
 * Component thanh điều hướng cố định theo dõi tiến trình 5 chương:
 * - Trên Desktop (> 700px): Thanh rail dọc cố định bên phải màn hình.
 * - Trên Mobile (<= 700px): Thẻ đánh dấu chương phong cách bảng đen thủ công (Editorial Chapter Marker)
 *   kèm chữ ký gb., nút quay về nét vẽ đầu tiên và đường phấn vàng chạy xuyên suốt theo tiến độ đọc.
 */
export default function ChapterNavigation({
  active,
  chapters,
}: {
  active: number
  chapters: string[]
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const guide = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const activeNumber = String(active + 1).padStart(2, '0')
  const totalNumber = String(chapters.length).padStart(2, '0')
  const progress = `${activeNumber} / ${totalNumber}`
  const chapterRatio = ((active + 1) / Math.max(1, chapters.length)) * 100

  // Xử lý đóng menu khi click ra ngoài hoặc nhấn phím Escape
  useEffect(() => {
    // Bước 1: Chỉ lắng nghe sự kiện khi danh sách chương đang mở
    if (!open) return

    // Bước 2: Đóng panel nếu người dùng chạm ra ngoài vùng navigation
    const dismiss = (event: PointerEvent) => {
      if (!guide.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    // Bước 3: Đóng panel và trả lại focus cho nút bấm khi nhấn phím Escape
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }

    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    /* Thanh điều hướng cố định bám theo góc màn hình */
    <nav
      ref={guide}
      className={`chapter-rail chapter-guide${open ? ' is-open' : ''}`}
      aria-label="Story chapters"
      style={{ '--chapter-ratio': `${chapterRatio}%` } as React.CSSProperties}
    >
      {/* Khối hiển thị chỉ số tiến trình và nhãn chương (Desktop rail) */}
      <div className="chapter-guide-progress">
        <span>{progress}</span>
        <span>{t.common.chapters}</span>
      </div>

      {/* Hàng trên cùng trên Mobile: Chữ ký gb. bên trái & Quay về nét vẽ đầu tiên bên phải */}
      <div className="chapter-guide-mobile-top">
        {/* Chữ ký viết tay nhỏ góc trên trái */}
        <a
          href="#chapter-1"
          className="chapter-guide-signature"
          aria-label="Gia Bảo home"
          onClick={() => setOpen(false)}
        >
          gb<span>.</span>
        </a>

        {/* Hành động quay về chương mở đầu góc trên phải */}
        <a
          href="#chapter-1"
          className="chapter-guide-first-mark"
          onClick={() => setOpen(false)}
        >
          <span>{t.contact.backToTop.replace('↑', '').trim()}</span>
          <i aria-hidden="true">↑</i>
        </a>
      </div>

      {/* Danh sách các link chương mở rộng (mở lên phía trên thanh chọn trên Mobile) */}
      <div className="chapter-guide-links" id="chapter-guide-links">
        {/* Tiêu đề phụ trong bảng mục lục mở rộng trên Mobile */}
        <div className="chapter-guide-panel-head">
          <span className="panel-head-label">{t.common.chapters}</span>
          <span className="panel-head-count">{progress}</span>
        </div>

        {chapters.map((name, i) => (
          <a
            key={name}
            href={`#chapter-${i + 1}`}
            className={active === i ? 'current' : ''}
            aria-current={active === i ? 'step' : undefined}
            aria-label={`${t.common.chapters} ${i + 1}: ${name}`}
            onClick={() => {
              if (open) {
                setOpen(false)
                toggle.current?.focus({ preventScroll: true })
              }
            }}
          >
            <span className="chapter-guide-mark" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="chapter-guide-label" aria-hidden="true">
              {name}
            </span>
            <span className="chapter-guide-active-dot" aria-hidden="true" />
          </a>
        ))}
      </div>

      {/* Nút bấm bật/tắt danh sách chương (Editorial Chapter Marker trên Mobile) */}
      <button
        ref={toggle}
        type="button"
        className="chapter-guide-toggle"
        aria-expanded={open}
        aria-controls="chapter-guide-links"
        aria-label={`${progress}, ${chapters[active]}. ${open ? t.common.close : t.common.menuToggle}`}
        onClick={() => setOpen(!open)}
      >
        {/* Nhãn số thứ tự chương hiện tại (05 / 05) */}
        <span className="chapter-guide-count">
          <b className="count-active">{activeNumber}</b>
          <i className="count-sep">/</i>
          <small className="count-total">{totalNumber}</small>
        </span>

        {/* Vạch phấn ngăn cách thủ công */}
        <span className="chapter-guide-divider" aria-hidden="true" />

        {/* Tên chương hiện tại với hiệu ứng trượt dọc nhẹ khi đổi chương */}
        <span className="chapter-guide-current">
          <span key={active} className="chapter-guide-current-text">
            {chapters[active]}
          </span>
        </span>

        {/* Cụm 5 vạch chấm tiến độ chương và icon đóng/mở */}
        <span className="chapter-guide-right" aria-hidden="true">
          <span className="chapter-guide-mini-ticks">
            {chapters.map((_, idx) => (
              <i
                key={idx}
                className={
                  idx === active
                    ? 'is-current'
                    : idx < active
                      ? 'is-passed'
                      : ''
                }
              />
            ))}
          </span>

          <span className="chapter-guide-chevron">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="m4 10 4-4 4 4" />
            </svg>
          </span>
        </span>
      </button>

      {/* Đường viền phấn vàng ngang chạy xuyên suốt đáy navigation theo tiến độ đọc */}
      <div className="chapter-guide-chalk-line" aria-hidden="true">
        <span className="chalk-line-fill" />
      </div>

      {/* Chữ in hoa chạy dọc rail (Desktop) */}
      <span className="rail-word">{chapters[active]?.toUpperCase()}</span>
    </nav>
  )
}
