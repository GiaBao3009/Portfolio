import { test, expect } from '@playwright/test'

test.describe('GSAP Scrollytelling & Clean Kinetic Motion (5 Scenes)', () => {
  test('Khởi tạo GSAP ScrollTrigger và vận hành mượt qua cả 5 Scene không dư đường kẻ rối mắt', async ({
    page,
  }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    await page.goto('/')

    // Bước 1: Kiểm tra hệ thống GSAP Scrollytelling đã kích hoạt trên .board
    const board = page.locator('.board')
    await expect(board).toHaveAttribute('data-gsap-ready', 'active')

    // Bước 2: Đảm bảo chỉ giữ đúng đường bay nguyên bản .journey-path, không có các đường kẻ phụ gây rối
    await expect(page.locator('.journey-path path.drawn-path')).toBeAttached()
    await expect(page.locator('.about-chalk-connections')).toHaveCount(0)
    await expect(page.locator('.stage-chalk-border')).toHaveCount(0)
    await expect(page.locator('.workflow-architecture-map')).toHaveCount(0)

    // Bước 3: Scene 02 — Cuộn tới Artifact Board và kiểm tra các hiện vật xuất hiện sạch sẽ
    const aboutSection = page.locator('#chapter-2')
    await aboutSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(350)
    await expect(page.locator('#chapter-2 .polaroid')).toBeVisible()
    await expect(page.locator('#chapter-2 .yellow-note')).toBeVisible()
    await expect(page.locator('#chapter-2 .lined-note')).toBeVisible()

    // Bước 4: Scene 03 — Chuyển cảnh đa lớp mượt mà giữa các dự án trọng tâm
    const chapter3 = page.locator('#chapter-3')
    await chapter3.scrollIntoViewIfNeeded()
    await page.waitForTimeout(350)

    await page.locator('.project-tab-btn', { hasText: 'Workflow-Platform' }).click()
    await page.waitForTimeout(450)
    await expect(page.locator('#project-title-workflow-platform')).toBeVisible()
    await expect(page.locator('.workflow-cue-timeline .cue-timeline-item')).toHaveCount(4)

    // Bước 5: Scene 04 & Scene 05 — Cuộn mượt tới cuối trang và kiểm tra tiêu đề tiếng Việt chuẩn
    await page.locator('#chapter-4').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await expect(page.locator('#chapter-4 .chalk-window .plane')).toBeVisible()

    await page.locator('#chapter-5').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await expect(page.locator('#chapter-5 h2')).not.toContainText('leads to')
    await expect(page.locator('.contact-main')).toHaveAttribute(
      'href',
      'mailto:nguyenducgiabao3009@gmail.com'
    )
    await expect(page.locator('.contact-links a')).toHaveAttribute(
      'href',
      'mailto:nguyenducgiabao3009@gmail.com'
    )
    await expect(page.locator('.contact-links button')).toHaveCount(1)

    // Kiểm tra trên màn hình Laptop (1280x800): .yellow-note không đè lên dòng mô tả .about-heading > p
    await page.locator('#chapter-2').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    const noOverlapDesktop = await page.evaluate(() => {
      const introP = document.querySelector('#chapter-2 .about-heading > p')
      const yellow = document.querySelector('#chapter-2 .yellow-note')
      if (!introP || !yellow) return true
      const r1 = introP.getBoundingClientRect()
      const r2 = yellow.getBoundingClientRect()
      const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left))
      const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top))
      return overlapX * overlapY === 0
    })
    expect(noOverlapDesktop).toBe(true)

    // Bước 6: Cuộn ngược lên Scene 01 (backward scrolling) mượt mà
    await page.locator('#chapter-1').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await expect(page.locator('#chapter-1 h1')).toBeVisible()

    expect(pageErrors).toEqual([])
  })

  test('Responsive trên Mobile (390x844) không bị tràn ngang và tôn trọng prefers-reduced-motion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.locator('.board')).toHaveAttribute('data-gsap-ready', 'reduced')

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasOverflow).toBe(false)

    // Kiểm tra trên Mobile: nút liên hệ chính .contact-main không bị máy bay .contact-plane đè lên
    await page.locator('#chapter-5').scrollIntoViewIfNeeded()
    const noPlaneOverlapMobile = await page.evaluate(() => {
      const cta = document.querySelector('.contact-main')
      const plane = document.querySelector('.contact-plane')
      if (!cta || !plane) return true
      const r1 = cta.getBoundingClientRect()
      const r2 = plane.getBoundingClientRect()
      const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left))
      const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top))
      return overlapX * overlapY === 0
    })
    expect(noPlaneOverlapMobile).toBe(true)

    // Kiểm tra Mobile Story Navigation: 3 thành phần (Logo gb., Back to First Mark, Editorial Chapter Marker) & Nét phấn vàng ngang
    const mobileNav = page.locator('.chapter-rail.chapter-guide')
    await expect(mobileNav).toBeVisible()
    await expect(page.locator('.chapter-guide-signature')).toBeVisible()
    await expect(page.locator('.chapter-guide-first-mark')).toBeVisible()
    await expect(page.locator('.chapter-guide-toggle')).toBeVisible()
    await expect(page.locator('.chapter-guide-chalk-line .chalk-line-fill')).toBeVisible()
    await expect(page.locator('.bottom-progress')).toBeAttached()

    // Kiểm tra mở/đóng bảng mục lục chương trên Mobile
    await page.locator('.chapter-guide-toggle').click()
    await expect(mobileNav).toHaveClass(/is-open/)
    await expect(page.locator('#chapter-guide-links a')).toHaveCount(5)

    // Nhấn chọn Chương 1 từ bảng mục lục để đóng panel và điều hướng
    await page.locator('#chapter-guide-links a').first().click()
    await expect(mobileNav).not.toHaveClass(/is-open/)
  })
})
