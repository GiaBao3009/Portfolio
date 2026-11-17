import { test, expect } from '@playwright/test'

test.describe('Chips Voting — Video Demo & Synchronized Ballot Cues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Cuộn tới Chapter 03 — Selected Works
    const chapter3 = page.locator('#chapter-3')
    await chapter3.scrollIntoViewIfNeeded()
  })

  test('Hiển thị video demo thật chips-voting.mp4 và đúng danh tính dự án', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (err) => pageErrors.push(err.message))

    // Bước 1: Chọn tab 02 Chips Voting
    const votingTab = page.locator('.project-tab-btn', { hasText: 'Chips Voting' })
    await expect(votingTab).toBeVisible()
    await votingTab.click()

    // Bước 2: Đảm bảo hiển thị đúng nội dung Chips Voting và không hiển thị nhầm tem dự án cá nhân của Workflow-Platform
    await expect(page.locator('#project-title-chips-voting')).toContainText('Chips Voting')
    await expect(page.locator('.personal-project-stamp')).toHaveCount(0)
    await expect(page.locator('.project-provenance-board')).toHaveCount(0)

    // Bước 3: Kiểm tra video demo thật đã nạp thành công đúng kích thước 1866x880
    const video = page.locator('.workflow-media video')
    await expect(video).toBeVisible()
    await expect(video).toHaveAttribute('src', '/videos/chips-voting.mp4')

    await expect
      .poll(
        async () =>
          video.evaluate((el: HTMLVideoElement) => ({
            width: el.videoWidth,
            height: el.videoHeight,
          })),
        { timeout: 10000 }
      )
      .toMatchObject({
        width: 1866,
        height: 880,
      })

    expect(pageErrors).toEqual([])
  })

  test('Ghi chú 3 mốc tương tác đồng bộ video và chuyển đổi song ngữ VI / EN', async ({ page }) => {
    const votingTab = page.locator('.project-tab-btn', { hasText: 'Chips Voting' })
    await votingTab.click()

    // Bước 1: Kiểm tra đủ 3 mốc thời gian trong timeline
    const timeline = page.locator('.workflow-cue-timeline')
    await timeline.scrollIntoViewIfNeeded()
    const cues = timeline.locator('.cue-timeline-item')
    await expect(cues).toHaveCount(3)
    await expect(cues.nth(0)).toContainText('0:00 – 0:08')
    await expect(cues.nth(1)).toContainText('0:09 – 0:17')
    await expect(cues.nth(2)).toContainText('0:18 – 0:28')

    // Bước 2: Click mốc 02 (Ủy quyền 4 bước) và kiểm tra tua video tới mốc 9s
    await cues.nth(1).click()
    await expect(cues.nth(1)).toHaveClass(/is-active/)
    await expect(page.locator('#workflow-note')).toContainText('0:09 — ỦY QUYỀN 4 BƯỚC')

    const currentTime = await page
      .locator('.workflow-media video')
      .evaluate((el: HTMLVideoElement) => el.currentTime)
    expect(currentTime).toBeGreaterThanOrEqual(8.5)

    // Bước 3: Chuyển đổi ngôn ngữ sang EN và kiểm tra cập nhật tức thì
    await page.locator('.lang-toggle-btn').click()
    await expect(page.locator('#workflow-note')).toContainText('0:09 — 4-STEP PROXY')

    // Chuyển lại về VI
    await page.locator('.lang-toggle-btn').click()
    await expect(page.locator('#workflow-note')).toContainText('0:09 — ỦY QUYỀN 4 BƯỚC')
  })
})
