import { test, expect } from '@playwright/test'

test.describe('Workflow-Platform — Video Demo, Personal Project 2025 & Scroll Choreography', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Cuộn tới Chapter 03 — Selected Works
    const chapter3 = page.locator('#chapter-3')
    await chapter3.scrollIntoViewIfNeeded()
  })

  test('Hiển thị rõ ràng Dự án cá nhân từ đầu năm 2025 và video demo thật cho Workflow-Platform', async ({
    page,
  }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    // Bước 1: Chọn tab 03 Workflow-Platform
    const wfTab = page.locator('.project-tab-btn', { hasText: 'Workflow-Platform' })
    await expect(wfTab).toBeVisible()
    await wfTab.click()

    // Bước 2: Kiểm tra tem & dấu ấn Dự án cá nhân từ đầu năm 2025
    await expect(page.locator('.personal-project-stamp')).toContainText('DỰ ÁN CÁ NHÂN · ĐẦU NĂM 2025')
    await expect(page.locator('.provenance-period-note')).toContainText('Bắt đầu từ đầu năm 2025')
    await expect(page.locator('.workflow-heading .work-overline')).toContainText('DỰ ÁN CÁ NHÂN')

    // Bước 3: Kiểm tra khối 3 cột tổng kết dấu ấn dự án cá nhân
    const provenanceBoard = page.locator('.project-provenance-board')
    await provenanceBoard.scrollIntoViewIfNeeded()
    await expect(provenanceBoard).toBeVisible()
    await expect(provenanceBoard).toHaveClass(/is-revealed/)
    await expect(provenanceBoard.locator('.provenance-pillar-item')).toHaveCount(3)

    // Bước 4: Kiểm tra video demo thật đã gắn và tải metadata hợp lệ
    const video = page.locator('.workflow-media video')
    await expect(video).toBeVisible()
    await expect(video).toHaveAttribute('src', '/videos/workflow-platform.mp4')

    await expect
      .poll(
        async () =>
          video.evaluate((el: HTMLVideoElement) => ({
            readyState: el.readyState,
            width: el.videoWidth,
            height: el.videoHeight,
            duration: el.duration,
          })),
        { timeout: 10000 }
      )
      .toMatchObject({
        width: 1280,
        height: 608,
      })

    expect(pageErrors).toEqual([])
  })

  test('Hiệu ứng cuộn landing page & ghi chú timeline tương tác 4 mốc rõ ràng', async ({ page }) => {
    const wfTab = page.locator('.project-tab-btn', { hasText: 'Workflow-Platform' })
    await wfTab.click()

    // Bước 1: Cuộn tới khung video và kiểm tra biến tiến trình cuộn --stage-scroll cập nhật
    const demoFigure = page.locator('.workflow-demonstration')
    await demoFigure.scrollIntoViewIfNeeded()
    await page.waitForTimeout(450)

    const stageScrollVal = await page.locator('.workflow-feature').evaluate((el) => {
      return Number(getComputedStyle(el).getPropertyValue('--stage-scroll').trim() || '0')
    })
    expect(stageScrollVal).toBeGreaterThan(0.5)
    await expect(demoFigure).toHaveClass(/is-revealed/)

    // Bước 2: Kiểm tra danh sách 4 mốc ghi chú rõ ràng bên dưới video
    const timeline = page.locator('.workflow-cue-timeline')
    await timeline.scrollIntoViewIfNeeded()
    await expect(timeline).toBeVisible()
    await expect(timeline).toHaveClass(/is-revealed/)

    const cues = timeline.locator('.cue-timeline-item')
    await expect(cues).toHaveCount(4)
    await expect(cues.nth(0)).toContainText('0:00 – 0:11')
    await expect(cues.nth(1)).toContainText('0:12 – 0:20')
    await expect(cues.nth(2)).toContainText('0:21 – 0:27')
    await expect(cues.nth(3)).toContainText('0:28 – 0:37')

    // Bước 3: Bấm chọn mốc 03 (0:21) -> đồng bộ spotlight note và tua video tới đúng mốc
    await cues.nth(2).click()
    await expect(cues.nth(2)).toHaveClass(/is-active/)
    await expect(page.locator('#workflow-note')).toContainText('0:21 — WEBHOOK TRIGGER')

    const currentTime = await page
      .locator('.workflow-media video')
      .evaluate((el: HTMLVideoElement) => el.currentTime)
    expect(currentTime).toBeGreaterThanOrEqual(20.5)

    // Bước 4: Bấm nút điều hướng → để sang mốc 04
    await page.locator('.workflow-note-navigation button[aria-label="Next feature annotation"]').click()
    await expect(cues.nth(3)).toHaveClass(/is-active/)
    await expect(page.locator('#workflow-note')).toContainText('0:28 — TƯƠNG TÁC TELEGRAM BOT')
  })

  test('Chuyển đổi song ngữ VI / EN giữ nguyên đầy đủ thông tin dự án cá nhân 2025 và ghi chú', async ({
    page,
  }) => {
    const wfTab = page.locator('.project-tab-btn', { hasText: 'Workflow-Platform' })
    await wfTab.click()

    // Bấm nút đổi ngôn ngữ sang EN
    const langBtn = page.locator('.lang-toggle-btn')
    await langBtn.click()

    await expect(page.locator('.personal-project-stamp')).toContainText('PERSONAL PROJECT · EARLY 2025')
    await expect(page.locator('.provenance-period-note')).toContainText('Started Early 2025')
    await expect(page.locator('.project-provenance-board')).toContainText('SOLO PERSONAL PROJECT · STARTED EARLY 2025')
    await expect(page.locator('#workflow-note')).toContainText('0:00 — REACT FLOW CANVAS')

    // Đổi lại về VI
    await langBtn.click()
    await expect(page.locator('.personal-project-stamp')).toContainText('DỰ ÁN CÁ NHÂN · ĐẦU NĂM 2025')
  })
})
