import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook điều phối hệ thống Scrollytelling GSAP + ScrollTrigger
 * cho các phân cảnh Scene 01 (Hero), Scene 02 (About), Scene 04 (Growth) và Scene 05 (Contact).
 * Chỉ sử dụng chuyển động vị trí, góc nghiêng, tỷ lệ và các nét vẽ gốc của thiết kế,
 * không vẽ thêm đường kẻ phụ gây rối mắt.
 */
export function useChalkboardScroll(
  boardRef: RefObject<HTMLDivElement | null>,
  lang: string
) {
  useEffect(() => {
    const boardEl = boardRef.current
    if (!boardEl) return

    // Bước 1: Kiểm tra tùy chọn giảm chuyển động của hệ điều hành
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      boardEl.dataset.gsapReady = 'reduced'
      return
    }

    boardEl.dataset.gsapReady = 'active'

    // Bước 2: Khởi tạo gsap.context gắn với boardEl để tự động revert mọi tween/ScrollTrigger khi unmount
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 701px)',
          isMobile: '(max-width: 700px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean
            isMobile: boolean
          }
          const shiftScale = isDesktop ? 1 : 0.45

          /* ================================================================
             SCENE 01 — THE BEGINNING (HERO PROGRESSIVE REVEAL & SCROLL SCRUB)
             ================================================================ */
          const heroSection = boardEl.querySelector<HTMLElement>('#chapter-1')
          if (heroSection) {
            const nameLoopPath =
              heroSection.querySelector<SVGPathElement>('h1 em svg path')
            const sideArrowPath =
              heroSection.querySelector<SVGPathElement>('.hero-side-note svg path')

              // Chuẩn bị stroke-dasharray cho nét phấn vòng tên "Bảo" và mũi tên phụ nguyên bản
              ;[nameLoopPath, sideArrowPath].forEach((p) => {
                if (!p) return
                try {
                  const len = p.getTotalLength()
                  gsap.set(p, {
                    strokeDasharray: len,
                    strokeDashoffset: len,
                  })
                } catch {
                  // ignore
                }
              })

            // Timeline mở màn khi vừa vào trang (Progressive Entry)
            const introTl = gsap.timeline({
              defaults: { ease: 'power3.out' },
            })

            introTl
              .fromTo(
                heroSection.querySelector('.hero-topline'),
                { opacity: 0, y: -14 },
                { opacity: 1, y: 0, duration: 0.55 }
              )
              .fromTo(
                heroSection.querySelector('.hero-kicker'),
                { opacity: 0, x: -18, rotate: -6 },
                { opacity: 1, x: 0, rotate: -3, duration: 0.6 },
                '-=0.3'
              )
              .fromTo(
                heroSection.querySelector('h1'),
                { opacity: 0, y: 24, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.75 },
                '-=0.35'
              )

            if (nameLoopPath) {
              introTl.to(
                nameLoopPath,
                { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' },
                '-=0.4'
              )
            }

            introTl
              .fromTo(
                heroSection.querySelector('.hero-description'),
                { opacity: 0, x: -16 },
                { opacity: 1, x: 0, duration: 0.55 },
                '-=0.45'
              )
              .fromTo(
                heroSection.querySelector('.hero-side-note'),
                { opacity: 0, y: 18, rotate: 11 },
                { opacity: 1, y: 0, rotate: isDesktop ? 7 : -5, duration: 0.6 },
                '-=0.4'
              )

            if (sideArrowPath) {
              introTl.to(
                sideArrowPath,
                { strokeDashoffset: 0, duration: 0.65, ease: 'power2.out' },
                '-=0.3'
              )
            }

            introTl.fromTo(
              heroSection.querySelector('.hero-plane'),
              { opacity: 0, x: -48 * shiftScale, y: 28 * shiftScale, rotate: -26 },
              { opacity: 1, x: 0, y: 0, rotate: -13, duration: 0.75 },
              '-=0.5'
            )

            // Timeline cuộn scrub điều khiển chiều sâu camera và đường bay máy bay giấy Scene 01
            const heroScrubTl = gsap.timeline({
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
            })

            heroScrubTl
              .to(
                heroSection.querySelector('.hero-content'),
                {
                  y: -48 * shiftScale,
                  scale: isDesktop ? 1.035 : 1.01,
                  ease: 'none',
                },
                0
              )
              .to(
                heroSection.querySelector('.hero-star'),
                {
                  y: -90 * shiftScale,
                  rotation: 72,
                  ease: 'none',
                },
                0
              )
              .to(
                heroSection.querySelector('.hero-side-note'),
                {
                  y: -62 * shiftScale,
                  x: 16 * shiftScale,
                  ease: 'none',
                },
                0
              )
              .to(
                heroSection.querySelector('.hero-plane'),
                {
                  x: 95 * shiftScale,
                  y: -120 * shiftScale,
                  rotation: 6,
                  scale: 1.12,
                  ease: 'none',
                },
                0
              )
              .to(
                heroSection.querySelector('.plane-note'),
                {
                  y: -55 * shiftScale,
                  opacity: 0.35,
                  ease: 'none',
                },
                0
              )
          }

          /* ================================================================
             SCENE 02 — ABOUT ME (SEQUENTIAL ARTIFACT BOARD EXPLORATION)
             ================================================================ */
          const aboutSection = boardEl.querySelector<HTMLElement>('#chapter-2')
          const artifactBoard =
            aboutSection?.querySelector<HTMLElement>('.artifact-board')

          if (aboutSection && artifactBoard) {
            const polaroid = artifactBoard.querySelector<HTMLElement>('.polaroid')
            const yellowNote =
              artifactBoard.querySelector<HTMLElement>('.yellow-note')
            const scribble =
              artifactBoard.querySelector<HTMLElement>('.about-scribble')
            const linedNote =
              artifactBoard.querySelector<HTMLElement>('.lined-note')
            const scribbleArrow =
              scribble?.querySelector<SVGPathElement>('svg path')

            if (scribbleArrow) {
              try {
                const len = scribbleArrow.getTotalLength()
                gsap.set(scribbleArrow, {
                  strokeDasharray: len,
                  strokeDashoffset: len,
                })
              } catch {
                // ignore
              }
            }

            // Timeline cuộn tuần tự khám phá từng hiện vật trên bảng đen với không gian thoáng
            const aboutTl = gsap.timeline({
              scrollTrigger: {
                trigger: artifactBoard,
                start: 'top 86%',
                end: 'bottom 35%',
                scrub: 0.65,
              },
            })

            // 1. Tấm ảnh Polaroid góc làm việc nghiêng vào từ bên trái
            if (polaroid) {
              aboutTl.fromTo(
                polaroid,
                {
                  x: -52 * shiftScale,
                  y: 34 * shiftScale,
                  rotation: -14,
                  scale: 0.94,
                },
                {
                  x: 0,
                  y: 0,
                  rotation: -7,
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                },
                0
              )
            }

            // 2. Mẩu giấy nhớ màu vàng ghim kim đáp xuống từ góc phải (không dịch lên trên gây đè chữ intro)
            if (yellowNote) {
              aboutTl.fromTo(
                yellowNote,
                {
                  x: 32 * shiftScale,
                  y: 22 * shiftScale,
                  rotation: 12,
                  scale: 0.94,
                },
                {
                  x: 0,
                  y: 0,
                  rotation: isDesktop ? 6 : 3,
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                },
                0.22
              )
            }

            // 3. Dòng chữ viết tay ngẫu hứng và mũi tên nguyên bản
            if (scribble) {
              aboutTl.fromTo(
                scribble,
                {
                  x: -28 * shiftScale,
                  y: 20 * shiftScale,
                  rotation: -9,
                },
                {
                  x: 0,
                  y: 0,
                  rotation: -5,
                  duration: 0.26,
                  ease: 'power2.out',
                },
                0.42
              )
            }

            if (scribbleArrow) {
              aboutTl.to(
                scribbleArrow,
                { strokeDashoffset: 0, duration: 0.22, ease: 'none' },
                0.52
              )
            }

            // 4. Tờ giấy kẻ dòng nghiêng nhẹ vào vị trí góc dưới phải
            if (linedNote) {
              aboutTl.fromTo(
                linedNote,
                {
                  x: 44 * shiftScale,
                  y: 42 * shiftScale,
                  rotation: isDesktop ? 10 : -8,
                  scale: 0.95,
                },
                {
                  x: 0,
                  y: 0,
                  rotation: isDesktop ? 4 : -3,
                  scale: 1,
                  duration: 0.32,
                  ease: 'power2.out',
                },
                0.6
              )
            }
          }

          /* ================================================================
             SCENE 04 — STILL IN PROGRESS (GROWTH NOTES & CHALK WINDOW FLIGHT)
             ================================================================ */
          const growthSection = boardEl.querySelector<HTMLElement>('#chapter-4')
          if (growthSection) {
            const growthItems = [
              ...growthSection.querySelectorAll<HTMLElement>(
                '.growth-notes > div'
              ),
            ]
            const chalkWindow =
              growthSection.querySelector<HTMLElement>('.chalk-window')
            const windowPlane =
              growthSection.querySelector<SVGSVGElement>('.chalk-window .plane')

            const growthTl = gsap.timeline({
              scrollTrigger: {
                trigger: growthSection,
                start: 'top 78%',
                end: 'bottom 40%',
                scrub: 0.65,
              },
            })

            growthItems.forEach((item, idx) => {
              growthTl.fromTo(
                item,
                {
                  y: 32 * shiftScale,
                  x: (idx - 1) * 14 * shiftScale,
                },
                {
                  y: 0,
                  x: 0,
                  duration: 0.28,
                  ease: 'power2.out',
                },
                idx * 0.18
              )
            })

            if (chalkWindow && isDesktop) {
              growthTl.fromTo(
                chalkWindow,
                { y: 36, rotation: 8 },
                { y: -18, rotation: 4, duration: 0.6, ease: 'none' },
                0.1
              )
            }

            if (windowPlane) {
              growthTl.fromTo(
                windowPlane,
                {
                  x: -34 * shiftScale,
                  y: 28 * shiftScale,
                  rotation: -32,
                  scale: 0.9,
                },
                {
                  x: 22 * shiftScale,
                  y: -24 * shiftScale,
                  rotation: -14,
                  scale: 1.06,
                  duration: 0.65,
                  ease: 'power1.inOut',
                },
                0.15
              )
            }
          }

          /* ================================================================
             SCENE 05 — THE NEXT CHAPTER (DEPARTURE FLIGHT & SIGNATURE FINALE)
             ================================================================ */
          const contactSection = boardEl.querySelector<HTMLElement>('#chapter-5')
          if (contactSection) {
            const contactPlane =
              contactSection.querySelector<SVGSVGElement>('.contact-plane')
            const contactHeading =
              contactSection.querySelector<HTMLElement>('h2')
            const contactStar =
              contactSection.querySelector<SVGSVGElement>('.contact-star')

            const contactTl = gsap.timeline({
              scrollTrigger: {
                trigger: contactSection,
                start: 'top 80%',
                end: 'bottom bottom',
                scrub: 0.6,
              },
            })

            if (contactStar) {
              contactTl.fromTo(
                contactStar,
                { y: 28 * shiftScale, rotation: -25 },
                { y: -24 * shiftScale, rotation: 35, duration: 0.5, ease: 'none' },
                0
              )
            }

            if (contactHeading) {
              contactTl.fromTo(
                contactHeading,
                { scale: 0.94, y: 22 * shiftScale },
                { scale: 1, y: 0, duration: 0.35, ease: 'power2.out' },
                0.05
              )
            }

            if (contactPlane) {
              contactTl.fromTo(
                contactPlane,
                {
                  x: isDesktop ? -65 : -18,
                  y: isDesktop ? 42 : 16,
                  rotation: -24,
                  scale: 0.9,
                },
                {
                  x: isDesktop ? 28 : 8,
                  y: isDesktop ? -36 : -6,
                  rotation: -10,
                  scale: 1.04,
                  duration: 0.55,
                  ease: 'power1.out',
                },
                0.2
              )
            }
          }
        }
      )
    }, boardEl)

    // Bước 3: Làm mới ScrollTrigger khi font chữ tải xong hoặc kích thước trang thay đổi
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    return () => {
      window.clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [boardRef, lang])
}
