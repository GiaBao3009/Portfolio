# Tài Liệu Kỹ Thuật: Showcase Workflow-Platform (Video Demo, Dự Án Cá Nhân 2025 & Hiệu Ứng Cuộn)

Tài liệu này mô tả chi tiết quá trình xử lý video demo thực tế, làm rõ nguồn gốc **Dự án cá nhân từ đầu năm 2025**, bổ sung **hiệu ứng cuộn landing page** và hệ thống **ghi chú mốc thời gian tương tác** cho tab **03 Workflow-Platform** trong Chapter 03.

---

## 1. Mục Đích

- Gắn video demo sản phẩm thật của **Workflow-Platform** vào đúng tab `03 Workflow-Platform` thay thế cho storyboard tĩnh trước đây.
- Làm nổi bật rõ ràng trên giao diện rằng đây là **dự án cá nhân do chính Gia Bảo khởi tạo và xây dựng từ đầu năm 2025**, giữ nguyên ngôn ngữ thiết kế **The Impossible Chalkboard** (nền bảng đen `#20211f`, phấn kem `#f4f0e6`, phấn vàng `#f4cb55`, font `Cormorant Garamond`, `Caveat`, `DM Sans`).
- Tăng tính sống động của landing page thông qua hiệu ứng cuộn (scroll-driven perspective, dấu phấn vẽ nét, stagger reveal) và hiển thị đầy đủ hệ thống ghi chú từng phân đoạn video để người xem nắm bắt nhanh toàn bộ năng lực kỹ thuật.

---

## 2. Xử Lý Video Demo (`public/videos/workflow-platform.mp4`)

- **Video nguồn:** `c:\Users\baold\Downloads\DEMO.mp4` (`1280x720`, `30fps`, `03:30`, `127.4 MB`).
- **Tối ưu & tinh gọn thành `public/videos/workflow-platform.mp4` (`1280x608`, `30fps`, `36.8s`, `~3.0 MB`):**
  1. **Crop thanh trình duyệt phía trên (`y = 112..720`):** Loại bỏ toàn bộ tab trình duyệt và thanh bookmark để chỉ hiển thị khung ứng dụng sạch sẽ tương đồng tỷ lệ với `chips-bill.mp4`.
  2. **Biên tập 4 chặng demo tinh gọn không có khoảng chờ thừa:**
     - `0:00 – 0:11`: Đồ thị 6 node AI, kéo thả/nối dây node trên React Flow, modal cấu hình tham số (`HTTP Request`, `Email`) và `Thư viện mẫu`.
     - `0:12 – 0:20`: Nhật ký thực thi Temporal (`Chi tiết Run`), đặt lịch chạy tự động Cron (`* * * * *`) và email thật gửi về Gmail.
     - `0:21 – 0:27`: Tạo & kích hoạt Webhook giới hạn tốc độ (`60 requests/phút`) gắn với luồng Gemini AI + Filter + Google Sheets.
     - `0:28 – 0:37`: Trò chuyện trực tiếp với bot Telegram (`@baol3009_bot`), AI ghi nhớ tên, trả lời câu hỏi sản phẩm và lưu phản hồi vào Google Sheets.
  3. **Bảo mật riêng tư:** Vùng sidebar danh bạ Telegram bên trái (`x: 0..344`) được làm mờ (`avgblur`) toàn bộ để không lộ đoạn chat cá nhân hay mã đăng nhập.

---

## 3. Cấu Trúc File Liên Quan

- [public/videos/workflow-platform.mp4](file:///c:/Users/baold/Desktop/Portfolio/public/videos/workflow-platform.mp4): Video demo đã cắt gọn, crop sạch và nén web-ready (`+faststart`).
- [src/assets/i18n/types.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/types.ts): Mở rộng `TranslationDictionary` thêm `timelineCueHint`, `jumpToTimestamp`, `provenanceHeading` và cấu trúc `provenance` cho dự án.
- [src/assets/i18n/vi.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/vi.ts) & [src/assets/i18n/en.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/en.ts): Nội dung song ngữ VI/EN cho dấu ấn **Dự án cá nhân từ đầu năm 2025**, 3 cột tổng kết (`provenance.pillars`) và 4 mốc ghi chú video đồng bộ.
- [src/data/selectedWorks.ts](file:///c:/Users/baold/Desktop/Portfolio/src/data/selectedWorks.ts): Gắn `videoSrc: '/videos/workflow-platform.mp4'`, cập nhật `techStack`, `provenance` và 4 mốc `annotations` (`start`/`end` chuẩn từng giây).
- [src/SelectedWorks.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/SelectedWorks.tsx):
  - Hiển thị tem phấn `.personal-project-stamp` kèm đường gạch phấn vẽ nét (`stroke-dashoffset`).
  - Tính toán `--stage-scroll` bằng `requestAnimationFrame` và kích hoạt `[data-chalk-reveal]` qua `IntersectionObserver`.
  - Bổ sung lưới ghi chú chi tiết `.workflow-cue-timeline` (click nhảy tới đúng giây video) và khối 3 cột `.project-provenance-board`.
- [src/selected-works.css](file:///c:/Users/baold/Desktop/Portfolio/src/selected-works.css): Style bảng đen cho tem 2025, 4 góc ngắm phấn `.chalk-frame-corner`, hiệu ứng phối cảnh khi cuộn, staggered transitions và responsive tablet/mobile + `prefers-reduced-motion`.
- [src/App.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/App.tsx): Cập nhật selector mask `<mask id="reading-space">` để đường bay phấn nền né các khối tem, timeline ghi chú và bảng provenance mới.
- [tests/workflow-platform.spec.ts](file:///c:/Users/baold/Desktop/Portfolio/tests/workflow-platform.spec.ts): Bộ test Playwright kiểm tra tem 2025, video load thật, hiệu ứng cuộn, tua video theo cue và chuyển đổi VI/EN.

---

## 4. Luồng Hoạt Động (UI Flow & Data Flow)

1. Khi cuộn xuống `#chapter-3`, `IntersectionObserver` lần lượt thêm `.is-revealed` cho từng khối `[data-chalk-reveal]` (tiêu đề, thanh chọn tab, header dự án, khung video, spotlight note, lưới 4 mốc timeline, khối 3 cột dự án cá nhân).
2. Song song, `scroll` listener kết hợp `requestAnimationFrame` cập nhật biến CSS `--stage-scroll` (`0 → 1`) trên `.workflow-feature`, giúp khung video `.workflow-demonstration` dựng phẳng mượt từ góc nghiêng nhẹ và 4 góc phấn `.chalk-frame-corner` thu vào ôm sát khung hình.
3. Khi chuyển sang tab `03 Workflow-Platform`, video `/videos/workflow-platform.mp4` tự phát không tiếng khi vào vùng nhìn; `onTimeUpdate` liên tục đối chiếu `currentTime` với 4 mốc `annotations` để highlight đồng thời cả khối `#workflow-note` lẫn thẻ tương ứng trong `.workflow-cue-timeline`.
4. Người dùng có thể bấm trực tiếp bất kỳ mốc `01`..`04` nào trong `.workflow-cue-timeline` (hoặc `←` / `→`) để tua video tới đúng phân đoạn đó.

---

## 5. Lưu Ý Bảo Trì

- Khi cập nhật lại video mới cho `Workflow-Platform`, giữ tỷ lệ sạch không dính thanh tab trình duyệt và cập nhật lại `start` / `end` trong `src/data/selectedWorks.ts` để khớp `onTimeUpdate`.
- Luôn giữ đầy đủ key trong cả [vi.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/vi.ts) và [en.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/en.ts) theo `TranslationDictionary` trong [types.ts](file:///c:/Users/baold/Desktop/Portfolio/src/assets/i18n/types.ts).
- Tôn trọng `@media (prefers-reduced-motion: reduce)`: mọi hiệu ứng cuộn và animation chuyển tab được vô hiệu hóa tự động khi hệ điều hành bật giảm chuyển động.
