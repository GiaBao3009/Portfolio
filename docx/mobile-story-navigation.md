# Tài Liệu Kỹ Thuật: Thiết Kế Lại Thanh Điều Hướng Chương Trên Mobile (Mobile Story Navigation)

Tài liệu này mô tả chi tiết việc thiết kế lại thanh điều hướng chương trên thiết bị di động (`<= 700px`) của **The Impossible Chalkboard**, biến bộ chọn chương dạng hộp phẳng thành một **Thẻ Đánh Dấu Chương Thủ Công (Editorial Chapter Marker)** gắn trên bảng đen lớp học.

---

## 1. Mục Đích

- Nâng cấp thẩm mỹ của thanh điều hướng chương trên Mobile theo phong cách Editorial kết hợp thủ công bảng phấn (Chalkboard Storytelling), đồng thời giữ nguyên 100% giao diện thanh rail dọc bên phải trên Desktop (`> 700px`).
- Bảo toàn và tinh chỉnh 3 thành phần chức năng cốt lõi:
  1. **Logo chữ ký (`gb.`)** ở góc trên bên trái.
  2. **Hành động quay về đầu trang (`QUAY VỀ NÉT VẼ ĐẦU TIÊN ↑` / `BACK TO THE FIRST MARK ↑`)** ở góc trên bên phải.
  3. **Thẻ đánh dấu chương hiện tại (`05 / 05`, tên chương, vạch tiến độ 5 chương, nút đóng/mở danh sách chương)**.
- Giữ nguyên thanh tiến trình vàng dưới đáy trang (`.bottom-progress`) và bổ sung nét phấn vàng chạy ngang xuyên suốt đáy phần navigation (`.chapter-guide-chalk-line`) như một chi tiết nhận diện xuyên suốt.

---

## 2. Cấu Trúc File Liên Quan

- [src/ChapterNavigation.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/ChapterNavigation.tsx): Component hiển thị thanh điều hướng chương cố định (Desktop rail & Mobile editorial chapter marker).
- [src/chapter-navigation.css](file:///c:/Users/baold/Desktop/Portfolio/src/chapter-navigation.css): Hệ thống style phân tách rõ giữa Desktop (`> 700px`) và Mobile (`<= 700px`), bao gồm animation trượt tên chương, bảng mục lục mở rộng và nét phấn vàng chạy ngang.
- [src/refinements.css](file:///c:/Users/baold/Desktop/Portfolio/src/refinements.css): Căn chỉnh khoảng đệm đáy của `.ending` trên Mobile (`padding-bottom: 126px`) và ẩn phần chữ ký/nút lặp lại ở `.ending` trên Mobile vì đã được tích hợp trực tiếp vào thanh điều hướng chương.
- [tests/scrollytelling.spec.ts](file:///c:/Users/baold/Desktop/Portfolio/tests/scrollytelling.spec.ts): Kiểm thử tự động Playwright cho giao diện và tương tác của Mobile Story Navigation.

---

## 3. Luồng Hoạt Động (Data Flow & UI Flow)

1. **Đồng bộ chương tự động khi cuộn:**
   - `App.tsx` tính toán chỉ số chương đang hiển thị (`active` từ `0` đến `4`) và truyền xuống `ChapterNavigation`.
   - Biến CSS `--chapter-ratio` (`20%` → `100%`) được tính từ `(active + 1) / chapters.length` và gán vào `<nav className="chapter-rail chapter-guide">`.
   - Khi đổi chương, tên chương `.chapter-guide-current-text` (được gắn `key={active}`) kích hoạt animation trượt dọc nhẹ `@keyframes chapterTitleSlide`, đồng thời 5 vạch tiến độ `.chapter-guide-mini-ticks` và nét phấn vàng `.chalk-line-fill` cập nhật tức thì.
2. **Đóng/mở bảng mục lục chương (`.chapter-guide-links`):**
   - Khi nhấn vào `.chapter-guide-toggle`, state `open` chuyển đổi trạng thái `.is-open` trên `<nav>`.
   - Bảng mục lục 5 chương mở mượt lên phía trên với hiệu ứng `cubic-bezier(0.22, 1, 0.36, 1)`, làm nổi bật chương hiện tại bằng vòng phấn vàng `.chapter-guide-mark`, chữ nghiêng màu vàng ấm và chấm sáng `.chapter-guide-active-dot`.
   - Khi chọn một chương, nhấn phím `Escape`, hoặc chạm ra ngoài vùng navigation (`pointerdown`), bảng mục lục tự động đóng lại.

---

## 4. Lưu Ý Cho Người Sau

- Không xóa `.bottom-progress` trong `src/App.tsx` hoặc `.chapter-guide-chalk-line` trong `src/ChapterNavigation.tsx` vì đây là chi tiết nhận diện nét phấn vàng chạy ngang theo yêu cầu thiết kế.
- Các phần tử chỉ dành cho Mobile (`.chapter-guide-mobile-top`, `.chapter-guide-panel-head`, `.chapter-guide-active-dot`, `.chapter-guide-toggle`, `.chapter-guide-chalk-line`) luôn đặt `display: none` ở ngoài `@media (max-width: 700px)` để không ảnh hưởng tới thanh rail dọc trên màn hình Desktop.
