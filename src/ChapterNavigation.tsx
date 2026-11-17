import { useEffect, useRef, useState } from 'react'
import { useI18n } from './assets/i18n'
import './chapter-navigation.css'

/**
 * Component thanh điều hướng cố định theo dõi tiến trình 5 chương
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
  const progress = `${String(active + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`

  // Xử lý đóng menu khi click ra ngoài hoặc nhấn phím Escape
  useEffect(() => {
    if (!open) return

    const dismiss = (event: PointerEvent) => {
      if (!guide.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

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
    >
      {/* Khối hiển thị chỉ số tiến trình và nhãn chương */}
      <div className="chapter-guide-progress">
        <span>{progress}</span>
        <span>{t.common.chapters}</span>
      </div>

      {/* Nút bấm bật/tắt danh sách chương */}
      <button
        ref={toggle}
        className="chapter-guide-toggle"
        aria-expanded={open}
        aria-controls="chapter-guide-links"
        aria-label={`${progress}, ${chapters[active]}. ${open ? t.common.close : t.common.menuToggle}`}
        onClick={() => setOpen(!open)}
      >
        <span className="chapter-guide-count">{progress}</span>
        <span className="chapter-guide-current">{chapters[active]}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m4 10 4-4 4 4" />
        </svg>
      </button>

      {/* Danh sách các link chương mở rộng */}
      <div className="chapter-guide-links" id="chapter-guide-links">
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
          </a>
        ))}
      </div>

      {/* Chữ in hoa chạy dọc rail */}
      <span className="rail-word">{chapters[active]?.toUpperCase()}</span>
    </nav>
  )
}
