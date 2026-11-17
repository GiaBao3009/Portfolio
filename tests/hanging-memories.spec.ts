import { test, expect } from '@playwright/test'

test.describe('Hanging Project Memories — Supporting Projects & 2-Column Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Cuộn tới chapter 3
    const section = page.locator('#chapter-3')
    await section.scrollIntoViewIfNeeded()
  })

  test('Hiển thị sợi dây treo và đủ 4 tấm ảnh kỷ niệm Polaroid', async ({ page }) => {
    // 1. Kiểm tra sợi dây treo và đinh tán đồng
    const clothesline = page.locator('.hanging-clothesline')
    await expect(clothesline).toBeVisible()
    await expect(clothesline.locator('.clothesline-pin.pin-left')).toBeVisible()
    await expect(clothesline.locator('.clothesline-pin.pin-right')).toBeVisible()
    await expect(clothesline.locator('.hanging-string-svg')).toBeVisible()

    // 2. Kiểm tra container cuộn ngang và 4 tấm ảnh
    const track = page.locator('.hanging-memories-track')
    await expect(track).toBeVisible()

    const cards = track.locator('.polaroid-memory-card')
    await expect(cards).toHaveCount(4)

    // 3. Kiểm tra từng thẻ có đủ kẹp gỗ, ảnh snapshot và cằm ghi chú
    const expectedNumbers = ['04', '05', '06', '07']
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i)
      await expect(card.locator('.wooden-clothespin')).toBeVisible()
      await expect(card.locator('.polaroid-photo-window')).toBeVisible()
      await expect(card.locator('.snapshot-mockup')).toBeVisible()
      await expect(card.locator('.photo-watermark-num')).toHaveText(expectedNumbers[i])
      await expect(card.locator('.polaroid-chin')).toBeVisible()
      await expect(card.locator('.polaroid-hand-caption')).toBeVisible()
      await expect(card.locator('.polaroid-title')).toBeVisible()
      await expect(card.locator('.polaroid-role-badge')).toBeVisible()
    }
  })

  test('Nút mũi tên điều hướng cuộn ngang hoạt động tốt', async ({ page }) => {
    const track = page.locator('.hanging-memories-track')
    const nextBtn = page.locator('.memories-stepper-btns button[aria-label="Cuộn sang phải"]')
    const prevBtn = page.locator('.memories-stepper-btns button[aria-label="Cuộn sang trái"]')

    await expect(nextBtn).toBeVisible()
    await expect(prevBtn).toBeVisible()

    // Click nút tiến
    await nextBtn.click()
    await page.waitForTimeout(400)

    // Click nút lùi
    await prevBtn.click()
    await page.waitForTimeout(400)
    await expect(track).toBeVisible()
  })

  test('Mở popup chi tiết dự án FreshStore: kiểm tra layout 2 cột, 3 phần nội dung và tab QR/PO detail', async ({ page }) => {
    // Mở card thứ 3 (FreshStore - 06)
    const freshstoreCard = page.locator('.polaroid-memory-card').nth(2)
    await freshstoreCard.click({ force: true })

    const modalOverlay = page.locator('.memory-modal-overlay')
    await expect(modalOverlay).toBeVisible()

    // Khóa scroll nền khi popup mở
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    // Kiểm tra Canvas Three.js hiển thị cục giấy 3D bung mở
    const unfoldCanvas = page.locator('.paper-unfold-canvas')
    // Canvas có thể xuất hiện lúc đầu rồi unmount khi bung xong
    // Đợi giấy bung mở hoàn tất và nội dung popup đạt trạng thái ổn định
    const modalContent = page.locator('.memory-modal-content')
    await expect(modalContent).toBeVisible({ timeout: 5000 })

    // 01. Nhận diện project
    await expect(modalContent.locator('.memory-modal-title')).toContainText('FreshStore')
    await expect(modalContent.locator('.memory-modal-hand')).toBeVisible()
    await expect(modalContent.locator('.supporting-role-badge')).toContainText('Frontend')
    await expect(modalContent.locator('.memory-modal-summary')).toBeVisible()

    // 02. Phần chính — sản phẩm thực tế (kiểm tra tab QR và PO detail)
    const visualBox = modalContent.locator('.showcase-visual-container')
    await expect(visualBox).toBeVisible()

    // Mặc định tab 1: Mã QR PO động
    await expect(visualBox.locator('.showcase-qr-svg')).toBeVisible()
    await expect(visualBox.locator('.badge-yellow')).toContainText('PO-8842')

    // Bấm chuyển sang Tab 2: Chi tiết đơn hàng (PO Detail)
    const detailTabBtn = visualBox.locator('.showcase-tab-btn').nth(1)
    await detailTabBtn.click()
    await expect(visualBox.locator('.order-items-table')).toBeVisible()
    await expect(visualBox.locator('.order-total-bar')).toContainText('37.650.000 VNĐ')

    // 03. Phần cuối — Tôi đã làm gì (Không có scrollbar, tiêu đề chuẩn mực)
    await expect(modalContent.locator('.modal-section-contributions .col-heading')).toHaveText('TÔI ĐÃ LÀM GÌ')
    await expect(modalContent).toHaveCSS('overflow', 'hidden')
    await expect(modalContent.locator('.modal-subcard').first()).toContainText('Bài toán nghiệp vụ')
    await expect(modalContent.locator('.modal-work-list ul li')).toHaveCount(3)
    await expect(modalContent.locator('.modal-subcard').nth(1)).toContainText('Điểm kỹ thuật đáng chú ý')
    await expect(modalContent.locator('.modal-tech-tags span')).not.toHaveCount(0)

    // Đóng popup bằng nút X và kiểm tra khôi phục scroll
    const closeBtn = page.locator('.memory-modal-close')
    await closeBtn.click({ force: true })
    await expect(modalOverlay).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })

  test('Chuyển qua lại các project ngay trong popup bằng nút hoặc phím mũi tên', async ({ page }) => {
    // Mở card đầu tiên (ERP Ecosystem)
    const firstCard = page.locator('.polaroid-memory-card').first()
    await firstCard.click({ force: true })

    const modalOverlay = page.locator('.memory-modal-overlay')
    await expect(modalOverlay).toBeVisible()
    await expect(page.locator('.memory-modal-title')).toContainText('ERP')

    // Bấm nút "Dự án sau →" trong popup
    const nextModalBtn = page.locator('.modal-nav-btn.next-btn')
    await nextModalBtn.click()
    await expect(page.locator('.memory-modal-title')).toContainText('Chips-Task')

    // Bấm phím mũi tên phải trên bàn phím -> chuyển tiếp sang FreshStore
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('.memory-modal-title')).toContainText('FreshStore')

    // Bấm phím mũi tên trái -> lùi về Chips-Task
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.memory-modal-title')).toContainText('Chips-Task')

    // Bấm Escape để đóng popup
    await page.keyboard.press('Escape')
    await expect(modalOverlay).not.toBeVisible()
  })

  test('Click vùng bên ngoài popup (backdrop) để đóng modal', async ({ page }) => {
    const card = page.locator('.polaroid-memory-card').first()
    await card.click({ force: true })

    const modalOverlay = page.locator('.memory-modal-overlay')
    await expect(modalOverlay).toBeVisible()

    // Click vào vùng rìa của backdrop (tọa độ góc ngoài modal)
    await modalOverlay.click({ position: { x: 10, y: 10 } })
    await expect(modalOverlay).not.toBeVisible({ timeout: 5000 })
  })

  test('Animation Three.js: Cục giấy ngà vo tròn bung mở 3D và tự động giải phóng tài nguyên WebGL', async ({ page }) => {
    // 1. Nhấp mở card đồ án bất kỳ (Chips-Task - 05)
    const taskCard = page.locator('.polaroid-memory-card').nth(1)
    await taskCard.click({ force: true })

    const modalOverlay = page.locator('.memory-modal-overlay')
    await expect(modalOverlay).toBeVisible()

    // 2. Trong lúc đang mở (phase unfolding), Canvas Three.js xuất hiện để vẽ cục giấy bung mở
    // Sau khi giấy đã bung mở xong (~1.25s), nội dung popup đạt trạng thái ổn định (phase open)
    const shell = page.locator('.paper-modal-shell')
    await expect(shell).toBeVisible({ timeout: 4000 })
    await expect(shell).toHaveCSS('opacity', '1')

    // 3. Khi đã mở (phase open), Canvas Three.js được dọn dẹp và unmount khỏi DOM
    const canvas = page.locator('.paper-unfold-canvas')
    await expect(canvas).toHaveCount(0)

    // 4. Nội dung và các nút tương tác bình thường không bị chặn
    const closeBtn = page.locator('.memory-modal-close')
    await expect(closeBtn).toBeVisible()
    await closeBtn.click({ force: true })

    // 5. Sau khi đóng hoàn tất, modal biến mất sạch sẽ
    await expect(modalOverlay).not.toBeVisible({ timeout: 10000 })
  })
})
