import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook điều phối chuyển động GSAP + ScrollTrigger cho Chapter 03 (Selected Works):
 * 1. Vẽ đường dẫn cầu nối nguyên bản (.story-bridge-connector) và dây treo Polaroid khi cuộn
 * 2. Chuyển cảnh đa lớp mượt mà (clip-path, scale, stagger) khi chuyển đổi giữa 3 dự án trọng tâm
 */
export function useSelectedWorksMotion({
  sectionRef,
  sceneRef,
  stageRef,
  featuredIndex,
  reducedMotion,
}: {
  sectionRef: RefObject<HTMLElement | null>
  sceneRef: RefObject<HTMLDivElement | null>
  stageRef: RefObject<HTMLElement | null>
  featuredIndex: number
  reducedMotion: boolean
}) {
  const isFirstProjectRender = useRef(true)

  // Luồng 1: Thiết lập các timeline ScrollTrigger gắn với thao tác cuộn trong Chapter 03
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl || reducedMotion) return

    const ctx = gsap.context(() => {
      // 1.1. Vẽ đường cầu nối phấn nguyên bản (.story-bridge-connector) dẫn sang 4 dự án bổ trợ
      const bridgeConnector = sectionEl.querySelector<HTMLElement>(
        '.story-bridge-connector'
      )
      if (bridgeConnector) {
        const bridgePaths = [
          ...bridgeConnector.querySelectorAll<SVGPathElement>('path'),
        ]
        bridgePaths.forEach((p) => {
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

        gsap.to(bridgePaths, {
          strokeDashoffset: 0,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeConnector,
            start: 'top 88%',
            end: 'bottom 52%',
            scrub: 0.5,
          },
        })
      }

      // 1.2. Vẽ sợi dây treo ảnh kỷ niệm Polaroid (.hanging-memories-section)
      const memoriesSection = sectionEl.querySelector<HTMLElement>(
        '.hanging-memories-section'
      )
      if (memoriesSection) {
        const stringPath =
          memoriesSection.querySelector<SVGPathElement>('.hanging-string-path')
        if (stringPath) {
          try {
            const len = stringPath.getTotalLength()
            gsap.set(stringPath, {
              strokeDasharray: len,
              strokeDashoffset: len,
            })
            gsap.to(stringPath, {
              strokeDashoffset: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: memoriesSection,
                start: 'top 86%',
                end: 'top 45%',
                scrub: 0.55,
              },
            })
          } catch {
            // ignore
          }
        }
      }
    }, sectionEl)

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 180)

    return () => {
      window.clearTimeout(refreshId)
      ctx.revert()
    }
  }, [sectionRef, stageRef, featuredIndex, reducedMotion])

  // Luồng 2: Chuyển cảnh đa lớp có chủ đích khi người dùng đổi giữa 3 dự án trọng tâm
  useEffect(() => {
    if (isFirstProjectRender.current) {
      isFirstProjectRender.current = false
      return
    }
    if (reducedMotion || !sceneRef.current) return

    const sceneEl = sceneRef.current
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      const identityCol = sceneEl.querySelector('.workflow-identity-col')
      const summaryCol = sceneEl.querySelector('.workflow-summary')
      const mediaBox = sceneEl.querySelector('.workflow-media')
      const cueItems = sceneEl.querySelectorAll('.cue-timeline-item')

      if (identityCol) {
        tl.fromTo(
          identityCol,
          { x: -24, opacity: 0.25 },
          { x: 0, opacity: 1, duration: 0.52 },
          0
        )
      }

      if (summaryCol) {
        tl.fromTo(
          summaryCol,
          { x: 24, opacity: 0.25 },
          { x: 0, opacity: 1, duration: 0.52 },
          0.04
        )
      }

      if (mediaBox) {
        tl.fromTo(
          mediaBox,
          {
            clipPath: 'inset(0 14% 0 0)',
            scale: 0.968,
            opacity: 0.4,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            scale: 1,
            opacity: 1,
            duration: 0.62,
            clearProps: 'clipPath',
          },
          0.04
        )
      }

      if (cueItems.length) {
        tl.fromTo(
          cueItems,
          { y: 14, opacity: 0.2 },
          { y: 0, opacity: 1, duration: 0.42, stagger: 0.055 },
          0.12
        )
      }
    }, sceneEl)

    return () => ctx.revert()
  }, [featuredIndex, reducedMotion, sceneRef])
}
