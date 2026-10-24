# Tài Liệu Kỹ Thuật: Chapter 03 — Selected Works (3 Trọng Tâm & 4 Bổ Trợ)

Tài liệu này ghi lại chi tiết kiến trúc, dữ liệu dự án thực tế, các quyết định thiết kế và luồng hiển thị của phân đoạn **Chapter 03 — Selected Works** trong Portfolio cá nhân của Gia Bảo.

---

## 1. Mục tiêu & Định hướng (Core Objectives)

- **Chiều sâu kỹ thuật (Depth):** Trình diễn qua **3 project trọng tâm** có video demo không controls (16:9 cinematic), có storyboard phấn tương tác dự phòng và hệ thống chú thích đồng bộ (synchronized annotations) trỏ trực tiếp vào giao diện thực tế.
- **Độ rộng kinh nghiệm (Breadth):** Thể hiện qua **4 project bổ trợ** trình bày ngắn gọn, súc tích dưới dạng thẻ giấy dán băng dính (taped paper cards), nêu rõ vai trò Frontend và các phần việc thực tế, không cạnh tranh thị giác với 3 project trọng tâm.
- **Tính chân thực & Nhất quán:**
  - Giữ trọn vẹn phong cách bảng đen/charcoal, serif Cormorant Garamond, chữ viết tay Caveat, điểm nhấn vàng và câu chuyển đoạn bắt buộc: *“Here is how I think. Here is what I build.”*
  - Không tự nhận là Backend Developer (các dự án FreshStore, NSI sử dụng stack Node.js nhưng vai trò chính xác là Frontend Developer).
  - Không bịa đặt số liệu hiệu năng hay thành tích không có bằng chứng.

---

## 2. Phân Bổ Danh Mục Dự Án Thực Tế

### 2.1. Ba Project Trọng Tâm (Video Demo & Chú Thích Đồng Bộ)
1. **Chips Bill — POS System**
   - **Vai trò:** Solo Frontend Developer.
   - **Điểm nhấn:** Kết nối trực tiếp cân điện tử với giao diện POS qua Web Serial API.
   - **Video / Cues:** Đọc trọng lượng liên tục (`0:02`), tự động cập nhật số lượng và tính lại giá tiền tức thì (`0:10`), hoàn tất giỏ hàng và xuất hóa đơn (`0:19`).
2. **Chips Voting — Shareholder Voting System**
   - **Vai trò:** Solo Frontend Developer.
   - **Điểm nhấn:** Xây dựng giao diện và logic frontend cho hệ thống biểu quyết cổ đông.
   - **Video / Cues:** Xác thực tư cách và tỷ lệ túc số (`0:03`), luồng ủy quyền biểu quyết cho người đại diện (`0:11`), bỏ phiếu và thống kê kết quả trực tiếp (`0:20`).
3. **Workflow-Platform — Workflow Automation**
   - **Vai trò:** Frontend Developer (Dự án kỹ thuật / cá nhân).
   - **Công nghệ:** React Flow, Zustand, React, TypeScript, Tailwind CSS.
   - **Điểm nhấn:** Giao diện canvas dạng node graph.
   - **Video / Cues:** Kéo thả và bố trí các node (`0:03`), kết nối đường dây và ánh xạ dữ liệu (`0:12`), cấu hình tham số và thực thi tự động qua Telegram bot/AI (`0:20`).

### 2.2. Bốn Project Bổ Trợ (Trình Bày Ngắn Gọn Dưới Dạng Thẻ Giấy Lưu Trữ)
1. **ERP Ecosystem (Ohno ERP · Nakano ERP · Chips ERP)**
   - **Vai trò:** Frontend Contributor | **Công nghệ:** Angular, TypeScript, SCSS.
   - **Phần việc:** Phát triển giao diện duyệt nghiệp vụ đa cấp; tái cấu trúc source code theo chuẩn module của Angular; tối ưu hóa bảng dữ liệu lớn (data grids) và form nhập liệu chuyên sâu.
2. **Chips Task**
   - **Vai trò:** Frontend Co-developer | **Công nghệ:** React, TypeScript, DnD, Sprint Workflow.
   - **Phần việc:** Cùng tiếp quản và đồng phát triển; xây dựng bảng Kanban kéo thả thẻ mượt mà; quản lý trạng thái công việc (Backlog, In Progress, Review, Done); modal chi tiết task với checklist và hoạt động.
3. **FreshStore**
   - **Vai trò:** Frontend Developer (Dự án dùng Node.js).
   - **Công nghệ:** React / JS, QR Code Generator, Responsive CSS.
   - **Phần việc:** Xây dựng tính năng tạo và render mã QR động theo từng mã Purchase Order (PO); triển khai trang chi tiết đơn hàng riêng biệt theo từng mã PO quét được; hiển thị thông tin khách hàng và danh mục đơn hàng đã làm sạch.
4. **NSI**
   - **Vai trò:** Frontend Developer (Dự án chứng khoán dùng Node.js).
   - **Công nghệ:** React, TypeScript, CMS Admin UI, Tailwind CSS.
   - **Phần việc:** Phát triển giao diện Trung tâm kiến thức (Knowledge Center) và danh mục chủ đề; trang chi tiết bài học chứng khoán; xây dựng giao diện Admin cho biên tập viên nhập liệu và xuất bản bài viết.

---

## 3. Cấu Trúc File & Mã Nguồn

```text
src/
├── data/
│   └── selectedWorks.ts      # Chứa mảng featuredProjects (3 dự án) và supportingProjects (4 dự án)
├── SelectedWorks.tsx         # Component hiển thị Chapter 03: Video player 16:9, annotations, narrative bridge, 4 thẻ giấy
├── selected-works.css        # Toàn bộ CSS phong cách bảng đen: tương phản cao, drop-shadow pointer, responsive mobile
├── App.tsx                   # Điều phối 5 chương, máy bay giấy, tối ưu IntersectionObserver
└── ChapterNavigation.tsx     # Widget hiển thị tiến trình (03 / 05)
docx/
└── chapter-03-selected-works.md # Tài liệu kiến trúc và hướng dẫn bảo trì
```

---

## 4. Hướng Dẫn Gắn Video Demo Thực Tế

Khi quay video demo giao diện sản phẩm thật (15–30s):
1. Xuất video định dạng `.mp4` hoặc `.webm`, tỷ lệ 16:9, không dính thanh điều khiển player bên ngoài.
2. Đặt file vào `public/videos/` (ví dụ `public/videos/chips-bill.mp4`).
3. Mở file [src/data/selectedWorks.ts](file:///c:/Users/baold/Desktop/Portfolio/src/data/selectedWorks.ts), cập nhật `videoSrc`:
   ```typescript
   videoSrc: '/videos/chips-bill.mp4',
   ```
4. Căn chỉnh `start`, `end` và tọa độ `{ x, y }` của các mục trong `annotations` sao cho đường trỏ phấn hướng chính xác vào đúng vị trí bàn cân, nút bấm hay node graph trên màn hình.
