import { test, expect } from '@playwright/test'
import path from 'path'

test('Capture Screenshots of Paper Unfolding and Fully Unfolded Popup', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message))

  const artifactDir = 'C:/Users/baold/.gemini/antigravity/brain/fec35df1-ca4b-4f6e-9766-61632ea7310d'
  
  await page.goto('/')
  
  // 1. Cuộn tới khu vực Hanging Project Memories
  await page.evaluate(() => {
    const el = document.querySelector('.hanging-memories-section')
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await page.waitForTimeout(800)

  // Chụp ảnh khu vực Hanging Memories với 4 ảnh Polaroid trên dây treo
  await page.screenshot({
    path: path.join(artifactDir, 'hanging-memories-overview.png'),
    fullPage: false,
  })

  // 2. Click vào card thứ 3 (FreshStore - 06) để kích hoạt hiệu ứng Three.js bung mở
  const freshstoreCard = page.locator('.polaroid-memory-card').nth(2)
  await freshstoreCard.click({ force: true })

  // 3. Chụp khoảnh khắc Three.js canvas đang render cục giấy 3D bung mở
  const canvas = page.locator('.paper-unfold-canvas')
  // Đợi canvas xuất hiện
  await expect(canvas).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(350)
  
  await page.screenshot({
    path: path.join(artifactDir, 'paper-unfolding-3d.png'),
    fullPage: false,
  })

  // 4. Chờ animation hoàn tất và popup phẳng hiển thị đầy đủ
  const modalContent = page.locator('.memory-modal-content')
  await modalContent.waitFor({ state: 'visible', timeout: 8000 })
  await page.waitForTimeout(600)
  
  await page.screenshot({
    path: path.join(artifactDir, 'paper-unfolded-modal.png'),
    fullPage: false,
  })
})
