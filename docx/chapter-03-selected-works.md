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
1. **Chips Bill — Retail POS System**
   - **Bản chất:** Sản phẩm thương mại đang vận hành thực tế tại môi trường Production ở quầy thu ngân cửa hàng Pastie (Phú Quốc).
   - **Vai trò:** Solo Frontend Developer (xây dựng toàn bộ từ số 0).
   - **Điểm nhấn:** Kết nối trực tiếp cân điện tử với giao diện POS qua Web Serial API, đọc byte stream và tính giá thời gian thực.
   - **Bảo mật & Demo:** Vì bảo mật dữ liệu doanh thu của khách hàng, video demo được ghi hình trên môi trường Development / Sandbox.
   - **Video / Cues:** Đọc trọng lượng liên tục (`0:02`), tự động cập nhật số lượng và tính lại giá tiền tức thì (`0:10`), hoàn tất giỏ hàng và xuất hóa đơn (`0:19`).
2. **Chips Voting — Shareholder Voting System**
   - **Bản chất:** Hệ thống biểu quyết đại hội cổ đông đang trong quá trình phát triển & hoàn thiện.
   - **Vai trò:** Frontend UI Architect (tái cấu trúc và lái lại toàn bộ cấu trúc UI từ đầu).
   - **Điểm nhấn:** Import Excel 903 cổ đông, phát hành thẻ QR đại biểu, wizard ủy quyền 4 bước (kiểm tra hạn mức & chống ủy quyền chuỗi), phân loại hòm phiếu bằng phím tắt `[F1–F3]` / máy quét mã vạch, chốt kiểm phiếu Quorum và chuyển đổi Light/Dark Mode. Demo trên môi trường thử nghiệm.
   - **Video (`/videos/chips-voting.mp4`, `1866×880`, `27.7s`) / 3 Cues:** Import Excel 903 cổ đông & Thẻ QR Check-in (`0:00`), Wizard ủy quyền 4 bước & Thu hồi phiếu (`0:09`), Phân loại hòm phiếu `[F1–F3]` & Chốt kiểm phiếu / Dark Mode (`0:18`).
3. **Workflow-Platform — Workflow Automation (Dự án cá nhân từ đầu năm 2025)**
   - **Bản chất:** Dự án cá nhân khởi tạo từ đầu năm 2025, tự tay thiết kế & xây dựng visual low-code workflow automation builder.
   - **Vai trò:** Solo Builder (Personal Project · Early 2025).
   - **Công nghệ:** React Flow, React, TypeScript, Zustand, Tailwind CSS, Webhooks & Gemini AI.
   - **Điểm nhấn:** Canvas kéo thả node graph, cấu hình modal động, Temporal run trace, Cron scheduler, Webhook rate-limit và bot Telegram AI chạy thực tế (xem chi tiết tại [workflow-platform-showcase.md](file:///c:/Users/baold/Desktop/Portfolio/docx/workflow-platform-showcase.md)).
   - **Video (`/videos/workflow-platform.mp4`) / 4 Cues:** Canvas React Flow & Mẫu (`0:00`), Temporal Run Trace, Cron & Gmail thật (`0:12`), Webhook Trigger & Luồng Gemini AI (`0:21`), Tương tác Telegram Bot & Google Sheets (`0:28`).

### 2.2. Bốn Project Bổ Trợ (Trình Bày Ngắn Gọn Dưới Dạng Thẻ Giấy Lưu Trữ)
1. **ERP Ecosystem (Ohno ERP · Nakano ERP · Chips ERP)**
   - **Bản chất:** Hệ thống ERP doanh nghiệp. Bản khách hàng (Ohno, Nakano) có tính bảo mật cao; video/hình ảnh demo được cung cấp từ bản Chips ERP nội bộ.
   - **Vai trò:** Frontend Developer (Ticket-Driven Development) — Nhận ticket yêu cầu từ trên đưa xuống, phân tích và hiện thực hóa chuẩn xác theo yêu cầu khách hàng.
   - **Phần việc:** Phát triển giao diện duyệt nghiệp vụ đa cấp; tối ưu hóa bảng dữ liệu lớn (data grids) và form nhập liệu chuyên sâu trên Angular.
2. **Chips Task**
   - **Bản chất:** Hệ thống quản trị công việc agile nội bộ (Dev demo).
   - **Vai trò:** Frontend Co-developer (tiếp quản và đồng phát triển).
   - **Công nghệ:** React, TypeScript, DnD, Sprint Workflow.
   - **Phần việc:** Xây dựng bảng Kanban kéo thả thẻ mượt mà; quản lý vòng đời task; modal chi tiết task với checklist và hoạt động.
3. **FreshStore**
   - **Bản chất:** Dự án bán lẻ & quản lý đơn hàng Node.js (Dev demo).
   - **Vai trò:** Frontend Developer (Module Mở Rộng).
   - **Phần việc:** Xây dựng tính năng tạo và render mã QR động theo từng mã Purchase Order (PO); triển khai trang chi tiết đơn hàng riêng biệt theo từng mã PO quét được.
4. **NSI**
   - **Bản chất:** Cổng tri thức tài chính & chứng khoán Node.js (Dev demo).
   - **Vai trò:** Frontend Developer (Module Mở Rộng).
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

---

## 5. Quy Chuẩn Thị Giác Bảng Đen & Tinh Chỉnh Gần Nhất

- **Video Chips Bill Đã Gắn & Cắt Tinh Gọn (20.5s):** File video gốc 37s đã được cắt lọc chính xác phân đoạn đẹp nhất từ 0:00 đến 0:20.5 (loại bỏ hoàn toàn đoạn mở DevTools và lỗi toast ở giây 25–26). Video chứa trọn vẹn 3 luồng: Luồng bán hàng POS & cân ký (0–6s) -> Thanh toán & xuất hóa đơn (7–11s) -> Sơ đồ bàn & tạo mã QR gọi món (12–21s).
- **Khắc phục Lỗi Video Bị Bóp Méo / Crop Mép (Dynamic Aspect Ratio):** Nhận diện tỷ lệ gốc của video (1912x918 = 2.08:1) qua sự kiện `onLoadedMetadata`, khung media `.workflow-media` tự động điều chỉnh tỉ lệ theo video thực tế và dùng `object-fit: contain`, đảm bảo 100% giao diện POS hiển thị chuẩn xác từng pixel, không bao giờ bị cắt xén 2 bên mép hay méo mó UI.
- **Loại bỏ Border cứng 1px kiểu Web UI:** Đã xóa bỏ đường kẻ ngang máy móc `border-top: 1px solid` trên `.workflow-footnote`. Bề mặt bảng đen giữ độ thở tự nhiên (whitespace) thay vì dùng thanh chia cắt như giao diện SaaS.
- **Loại bỏ Opaque Background Box trên `.workflow-notes`:** Xóa bỏ `background: var(--color-board)` trên `.workflow-notes`. Trước đây thuộc tính này tạo ra một khối chữ nhật xám đặc, đè mất lớp hạt bụi phấn (noise texture) và hiệu ứng radial gradient của bảng đen, tạo thành một khung hộp lộ viền thô kệch.
- **Tối ưu hóa Cue Timestamp Badge:** Đã loại bỏ khung hộp bo góc (border & background box kiểu tag admin) trên `.cue-timestamp-badge`, chuyển sang dạng chữ phấn vàng tinh tế kèm dấu chấm phấn `•` mộc mạc, giữ trọn sự liền mạch với font chữ viết tay `Caveat`.
- **Giữ Khung Hình Video Sạch 100% (Không Chắn UI Sản Phẩm):** 
  - Toàn bộ khung video được giữ nguyên vẹn, sạch sẽ 100%, không đặt bất kỳ thẻ hộp nào che chắn lên màn hình giao diện bán hàng POS.
  - Toàn bộ nội dung giải thích chi tiết, huy hiệu mốc thời gian và ghi chú kỹ thuật viết tay được bố trí trang trọng ngay bên dưới video tại khu vực `.workflow-notes`.
  - **Mũi Tên Phấn Vẽ Tay Thủ Công (ChalkBentArrow):** Xóa bỏ hoàn toàn ký tự unicode `↳` máy móc (vốn dùng font hệ thống có góc vuông 90 độ cứng nhắc làm lệch concept), thay thế bằng component SVG vẽ tay mô phỏng chính xác mẫu phấn xước tự nhiên (độ nghiêng thân 80 độ, bẻ góc hữu cơ, hai cạnh đầu nhọn và filter bụi phấn xước `feTurbulence`), đồng thời loại bỏ thanh timeline rườm rà để trả lại sự tĩnh lặng, mộc mạc và chân thực cho bố cục bảng đen. Cụm điều hướng giữ đúng chất tối giản nguyên bản: `← 01 / 03 →`.
- **Bảo vệ Vùng Chữ khỏi Chalk Path:** Cập nhật bộ chọn SVG mask `clear` trong [src/App.tsx](file:///c:/Users/baold/Desktop\Portfolio\src\App.tsx) để bao gồm `.workflow-summary`, `.workflow-notes`, `.workflow-footnote`, `.more-work-intro`, `.hanging-memories-section`, `.polaroid-memory-card`, ngăn đường bay máy bay giấy cắt ngang qua mặt chữ kỹ thuật.

---

## 6. Thiết Kế Mới: Concept "Hanging Project Memories" (Dây Treo Ảnh Kỷ Niệm Đồ Án)

Khu vực 4 dự án bổ trợ (04 ERP Ecosystem, 05 Chips Task, 06 FreshStore, 07 NSI) đã được tái thiết kế toàn diện theo concept **"Hanging Project Memories"** — những tấm ảnh chụp đồ án dạng Polaroid được treo trên sợi dây thừng mảnh hơi võng tự nhiên với kẹp gỗ hoài niệm thời học trò/xưởng thủ công.

### 6.1. Visual Metaphor & Thiết Kế Vật Lý
1. **Sợi Dây Thừng & Đinh Đồng (`.hanging-clothesline`):**
   - Sợi dây thừng mảnh bắc ngang qua bảng đen với đường cong bezier võng tự nhiên (`M 0 16 Q 300 42, 600 28 T 1200 18`).
   - Hai đầu dây được cố định chắc chắn bằng đinh tán đồng phản chiếu ánh kim (`#ffd770` đến `#5a4214`).
   - Sợi dây có bóng đổ nhẹ `filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5))` và nét xơ sợi đứt đoạn `stroke-dasharray: 4 2`.
2. **Kẹp Gỗ Tự Nhiên (`.wooden-clothespin`):**
   - Kẹp gỗ ghim trực tiếp mép trên của từng tấm ảnh vào sợi dây.
   - Thân kẹp được tạo hình góc vát bằng `clip-path` đa giác sắc sảo, phủ vân gỗ sáng ấm (`#a5814e` đến `#d6be92`).
   - Lò xo kim loại ở giữa (`.clothespin-spring`) được khắc họa với viền kim khí và độ bóng inset chân thực.
3. **Khung Ảnh Giấy Polaroid (`.polaroid-frame`):**
   - Màu giấy kem vintage `#f7f4ea` với viền trên/hai bên 13px và phần cằm dưới rộng 20px đặc trưng của ảnh chụp lấy liền.
   - Các biến thiên góc nghiêng tự nhiên: Card 0 (`-2.2deg`), Card 1 (`+1.8deg`), Card 2 (`-1.5deg`), Card 3 (`+2.4deg`).
   - Chuyển động đung đưa nhẹ nhàng lệch pha (`memorySway0` -> `memorySway3`) mô phỏng làn gió nhẹ trong lớp học. Tự động tạm dừng (`animation-play-state: paused`) khi người dùng hover hoặc focus.
   - Lớp tráng gương bóng mờ góc 135 độ (`.photo-sheen`) và số thứ tự dập chìm (`.photo-watermark-num`).
   - Cằm ảnh chứa lời đề tựa viết tay thân mật bằng font `Caveat` (`.polaroid-hand-caption`), tiêu đề dự án serif, số hiệu và huy hiệu vai trò rút gọn.
4. **Screenshot UI Thu Nhỏ Chân Thực (Snapshot Mockups):**
   - Tuyệt đối không dùng ảnh stock trừu tượng giả làm giao diện sản phẩm.
   - **04 ERP Ecosystem:** Giao diện data table duyệt nghiệp vụ đa cấp (Ohno/Nakano/Chips ERP) với các status pill `Đã duyệt` (xanh lá) và `Chờ duyệt` (vàng).
   - **05 Chips Task:** Bảng Agile Sprint Kanban 3 cột (`Backlog`, `In Progress`, `Done`) với các thẻ task kéo thả trực quan.
   - **06 FreshStore:** Chi tiết đơn hàng bán lẻ với ma trận mã QR Purchase Order (PO) dạng vector động và nút xác thực.
   - **07 NSI:** Cổng tri thức tài chính với lưới bài viết phân tích cổ phiếu và nhãn phân loại thị trường.

### 6.2. Cơ Chế Tương Tác & Trải Nghiệm Khám Phá
- **Trải Nghiệm Cuộn / Kéo Ngang (Mouse Drag to Scroll) Không Có Thanh Cuộn Thô:**
  - Ẩn hoàn toàn thanh cuộn ngang mặc định của trình duyệt (`scrollbar-width: none; -ms-overflow-style: none; &::-webkit-scrollbar { display: none; }`).
  - Người dùng có thể dùng chuột kéo thả track theo trục ngang tự nhiên trên desktop (`cursor: grab` -> `cursor: grabbing`).
  - Hỗ trợ vuốt chạm cảm ứng mượt mà trên thiết bị di động (`scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch`).
  - Trang bị cặp nút mũi tên phấn tròn `←` và `→` để cuộn từng bước có kiểm soát.
  - Phân biệt chuẩn xác giữa thao tác kéo rê chuột và nhấp chuột mở modal (ngăn ngừa việc vừa kéo vừa vô tình mở popup).

- **Popup Kỹ Thuật 2 Cột (The Paper-Unfolding Modal — Animation Cục Giấy Vò Mở Vội):**
  - **Animation mở popup như một cục giấy bị vò mở vội ra (`paperBallUnroll`):**
    - Trạng thái 0%: Tờ giấy như một cục giấy vo tròn nhỏ, biến dạng nhẹ (`scale(0.16) rotate(-24deg) skew(12deg, -8deg)`).
    - Trạng thái 22%–52%: Bung nảy cực nhanh (`scale(0.55)` -> `scale(1.045) rotate(-3.5deg)`), các mép giấy bung rộng với quán tính nảy tự nhiên.
    - Trạng thái 72%–100%: Lắng dịu và ép phẳng xuống mặt bảng đen (`scale(1) rotate(-0.4deg)`).
    - Băng dính washi dán ập xuống cố định mép trên (`washiTapePin`), và nội dung chữ / tư liệu hiện lên mượt mà theo nhịp mở giấy (`paperContentReveal`).
  - **Layout 2 cột trên Desktop, 1 cột trên Mobile (The Crumpled Ivory Paper Concept):**
    - **Tờ giấy màu kem/ngà tự nhiên (`#faf5e8` đến `#f6efe2`):**
      - Bề mặt giấy màu kem/ngà nhã nhặn, sang trọng, hài hòa tuyệt đối với ngôn ngữ thiết kế The Impossible Chalkboard.
      - **Giản lược nếp nhăn vừa vặn:** Thay vì nhăn nhúm vụn vặt, bề mặt sở hữu 4–5 nếp gấp cấu trúc chính thanh thoát (nếp gấp chéo chính, 2 nếp gập ngang thư tín, nếp gấp dọc lệch tâm), giữ trọn độ thoáng và sạch sẽ cho không gian đọc.
      - Mép giấy xé nhẹ tự nhiên (Subtle Deckled Paper Edges) với đường `clip-path` hữu cơ.
      - Vỏ bọc `.paper-modal-shell` với bóng đổ vật lý `filter: drop-shadow(...)` đổ bóng ôm sát mép rách lên nền bảng đen charcoal.
      - Miếng băng dán washi mờ ghim mép trên tờ giấy vào mặt bảng.
      - **Tuyệt đối không có thanh cuộn (Zero Scrollbars):** Thiết lập `overflow: hidden !important` trên tờ giấy, căn chỉnh tỷ lệ và padding vi mô chuẩn xác để toàn bộ nội dung và chân trang hiển thị trọn vẹn trong khung nhìn.
    - **01. Phần đầu — Nhận diện project (Cột 2, trên):** Tên project bằng font Serif `Cormorant Garamond` màu than đậm `#140f09`, lời đề tựa viết tay phấn vàng font `Caveat`, huy hiệu vai trò chính xác, và một dòng giới thiệu tóm tắt nghiệp vụ.
    - **02. Phần chính — Sản phẩm thực tế (Cột 1):** Khung tư liệu đính kèm bằng 4 góc băng dính mờ (`.specimen-corner-tape`), có tab chuyển đổi góc nhìn:
      - *FreshStore:* Chuyển đổi giữa **Mã QR PO động** (vector QR matrix, mã lô hàng, nút xác thực) và **Trang chi tiết đơn hàng (PO Detail)** (bảng 3 mặt hàng trái cây nhập khẩu, số lượng, đơn giá, tổng tiền 37.650.000 VNĐ).
      - *ERP Ecosystem:* Chuyển đổi giữa **Data Grid lớn** (bảng duyệt đa cấp) và **Quy trình duyệt 3 cấp** (Trưởng phòng -> Kế toán trưởng -> Ban Giám đốc).
      - *Chips Task:* Chuyển đổi giữa **Bảng Sprint Kanban** (3 cột kéo thả) và **Chi tiết thẻ công việc & Checklist**.
      - *NSI:* Chuyển đổi giữa **Cổng tri thức chứng khoán** và **CMS Quản trị nội dung biên tập viên**.
    - **03. Phần cuối — Tôi đã làm gì (Cột 2, dưới):** Tiêu đề chuẩn mực `03. TÔI ĐÃ LÀM GÌ` (thay vì câu hỏi suồng sã), trình bày 4 khối súc tích:
      - *Bài toán nghiệp vụ:* Thách thức thực tế cần giải quyết.
      - *Phần việc Frontend cụ thể:* Danh sách các gạch đầu dòng với ký hiệu `↳` màu sepia ấm.
      - *Điểm kỹ thuật đáng chú ý:* Giải pháp kiến trúc và tối ưu hóa hiệu năng.
      - *Stack đã xác minh:* Các thẻ badge công nghệ nhỏ gọn màu kem viền vàng.

- **Điều Hướng & Trải Nghiệm Popup Liền Mạch:**
  - **Chuyển dự án trực tiếp ngay trong popup:** Tích hợp nút `← Trước` và `Sau →` ở cả thanh Top bar và Footer, cho phép duyệt lần lượt cả 4 dự án mà không cần đóng modal rồi mở lại.
  - **Hỗ trợ phím tắt bàn phím:** Dùng `ArrowLeft` và `ArrowRight` để chuyển qua lại giữa các dự án; dùng `Escape` để đóng popup.
  - **Khóa scroll nền:** Tự động gán `overflow: hidden` cho thẻ `body` khi popup mở và khôi phục khi đóng.
  - **Đóng popup & Khôi phục tiêu điểm:** Nhấp nút `✕`, phím `Esc`, hoặc click vùng backdrop bên ngoài sẽ đóng popup và tự động đưa tiêu điểm bàn phím (`focus`) cùng vị trí cuộn trên sợi dây về đúng tấm ảnh Polaroid tương ứng.

### 6.3. Tích Hợp Animation Three.js: Cục Giấy Ngà Bung Mở 3D Chân Thực

Triển khai hoạt cảnh WebGL Three.js mô phỏng một tờ giấy màu ngà (`#F3EBDD`) bị vo tròn thành cục nhỏ, bung mở nhanh và ép phẳng thành popup chi tiết dự án hoàn chỉnh.

1. **Kiến Trúc & Thuật Toán Tạo Hình 3D ([src/PaperUnfoldScene.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/PaperUnfoldScene.tsx)):**
   - **Lưới hình học & Mật độ đỉnh:** Sử dụng `THREE.PlaneGeometry(5.4, 3.9, 48, 36)` (1813 đỉnh) tương ứng với tỷ lệ `1.38 : 1` của popup desktop 980px.
   - **Tọa độ cục giấy vo tròn (`crumpledPositions`):** Sử dụng toán học nếp gấp tam giác nhọn đa hướng (`sharpTri`), các hốc lõm do ngón tay vo ép (`dent1`, `dent2`, `dent3`), và các mép giấy xoăn nhô ra ngoài (`protrude`), tạo hình cục giấy bất quy tắc gồ ghề chân thực.
   - **Tọa độ tờ giấy phẳng (`flatPositions`):** Bề mặt phẳng kết hợp các gợn sóng vi mô tự nhiên của giấy thật (`microCrease`).
   - **Vật liệu & Texture thủ công:** Procedural Canvas Texture 512x512 sinh các hạt xơ giấy li ti và gân nếp gấp mờ sepia, truyền vào `THREE.MeshStandardMaterial` với màu `#F3EBDD`, `roughness: 0.86`, `metalness: 0.02`, `bumpMap` và `bumpScale: 0.015`.
   - **Hệ thống chiếu sáng 3D:** Kết hợp ánh sáng môi trường vàng ấm `AmbientLight(0xfff7e8, 1.4)`, nguồn sáng chính xiên góc `DirectionalLight(0xfff2dc, 2.3)` đổ bóng sâu vào các nếp rãnh gập, đèn phụ nâng sáng `DirectionalLight` và đèn điểm rực rỡ `PointLight(0xffe6b0, 0.8)`.

2. **Động Học Bung Mở & Đóng Giấy (Dynamic Unfolding Motion):**
   - **Thời lượng mở:** 1250ms với đường cong gia tốc tùy biến `paperUnfoldEase(t) = 1 - (1 - t)^3.4` (bật mở có quán tính mạnh lúc đầu, hãm tốc và ép phẳng đầm chắc lúc sau).
   - **Độ trễ từ mép vào tâm (`delay`):** Các góc ngoài và mép giấy bung ra trước, vùng tâm bung sau, tạo cảm giác một tờ giấy duy nhất đang được tháo mở liên tục.
   - **Sóng uốn lượn khi mở (`waveAmp`):** Tạo chuyển động dợn sóng z-axis hữu cơ trong quá trình tháo nếp nhăn.
   - **Xoay 3D quán tính:** Mesh xoay nhẹ trên 3 trục (`rotFactor`) khi bung trong không gian và kết thúc ở góc nghiêng `-0.4deg` khớp với góc nghiêng của popup.
   - **Thu phóng:** Khởi đầu ở scale nhỏ của cục giấy và phóng lớn thành kích thước tờ giấy chuẩn.
   - **Thời lượng đóng (`isClosing`):** Giấy co rúm lại thành cục giấy trong 480ms trước khi unmount modal.

3. **Vòng Đời Quản Lý Trạng Thái & Giải Phóng Tài Nguyên (Zero Memory Leak):**
   - Máy trạng thái `phase`: `'unfolding'` -> `'open'` -> `'folding'`.
   - **Đồng bộ hiển thị (Progress Cross-fade):** Khi giấy 3D mở đến 82% (bắt đầu phẳng), nội dung React DOM thật bắt đầu mờ mờ hiện lên (`domContentOpacity`) và đạt `1` khi giấy phẳng hoàn toàn.
   - **Unmount Canvas khi phẳng (`phase === 'open'`):** Ngay khi giấy bung phẳng, Canvas Three.js tự động unmount hoàn toàn khỏi DOM để giải phóng 100% tài nguyên CPU/GPU. Toàn bộ tương tác (cuộn bảng mã QR, chuyển tab PO detail, chuyển project) chạy trên DOM thật mượt mà 60fps.
   - **Chuyển project không lặp animation:** Bấm chuyển dự án tiếp theo / trước đó giữ nguyên `phase === 'open'`, không kích hoạt lại animation 3D.
   - **An toàn với React 19 StrictMode:** Dọn dẹp `geometry.dispose()`, `material.dispose()`, `paperTexture.dispose()`, `renderer.dispose()`, không gọi `forceContextLoss` gây lỗi `CONTEXT_LOST_WEBGL (37442)` trong chu kỳ double-mount của StrictMode.
   - **Hỗ trợ `prefers-reduced-motion`:** Tự động bỏ qua Three.js canvas và hiển thị popup trực tiếp cho người dùng nhạy cảm với chuyển động.

4. **Polyfill WebGL Headless & CI Testing:**
   - Polyfill tự động cho `gl.getParameter` (`RENDERER`, `VENDOR`, `VERSION`, `MAX_TEXTURE_SIZE`) và `gl.getSupportedExtensions()` trong hook prototype của canvas, ngăn lỗi null pointer `indexOf` trên các môi trường test tự động.
   - Cấu hình Playwright hỗ trợ WebGL phần mềm với SwiftShader (`--use-gl=angle --use-angle=swiftshader`).

### 6.4. Kiểm Thử Tự Động Với Playwright
- File kiểm thử: `tests/hanging-memories.spec.ts`
- Cấu hình: `playwright.config.ts` (timeout 60s cho software rasterization)
- Kết quả chạy thực tế: **6/6 bài test pass 100%**:
  1. `Hiển thị sợi dây treo và đủ 4 tấm ảnh kỷ niệm Polaroid` (kiểm tra đầy đủ clothesline, đinh tán đồng, kẹp gỗ, watermark, chin).
  2. `Nút mũi tên điều hướng cuộn ngang hoạt động tốt` (kiểm tra click tiến / lùi mượt mà, không lộ thanh cuộn thô).
  3. `Mở popup chi tiết dự án FreshStore: kiểm tra layout 2 cột, 3 phần nội dung và tab QR/PO detail` (kiểm tra chuẩn 3 phần, tiêu đề "TÔI ĐÃ LÀM GÌ", không có scrollbar, tab chuyển đổi sản phẩm thực tế và khóa scroll nền).
  4. `Chuyển qua lại các project ngay trong popup bằng nút hoặc phím mũi tên` (kiểm tra điều hướng liền mạch không cần mở lại modal).
  5. `Click vùng bên ngoài popup (backdrop) để đóng modal` (kiểm tra đóng modal linh hoạt bằng backdrop click).
  6. `Animation Three.js: Cục giấy ngà vo tròn bung mở 3D và tự động giải phóng tài nguyên WebGL` (kiểm tra canvas 3D xuất hiện khi mở, tự động unmount khi phẳng, nội dung đạt opacity 1, nút bấm tương tác mượt mà và đóng hoàn tất).

### 6.5. Tinh Chỉnh Bố Cục Cân Đối & Layer Z-Index (Bugfix Layout Offset)
- **Nguyên nhân lỗi lệch layout sang phải 50%:**
  - Khối `.hanging-memories-section` trước đó sử dụng thủ thuật breakout `margin-left: 50%; translate: -50% 0;`.
  - Khi class hiệu ứng cuộn `.reveal.visible` kích hoạt, thuộc tính `translate: 0 0` của hệ thống animation chung đã vô tình ghi đè `translate: -50% 0`, khiến thuộc tính `margin-left: 50%` đẩy toàn bộ khối dây treo và các card Polaroid lệch hẳn sang nửa phải màn hình, đè lên thanh chapter rail `01 02 03 04 05`.
- **Giải pháp xử lý:**
  - Chuẩn hóa `.hanging-memories-section` về `width: 100%; max-width: 100%; margin: 35px 0 75px; margin-left: 0; margin-right: 0;`.
  - Thiết lập `z-index: 25` để đảm bảo toàn bộ khối dây treo và các thẻ Polaroid nằm ở layer trên cùng (lớp đầu), hiển thị sắc nét trên nền bảng đen charcoal và không bị các canvas vẽ nền hay plane che khuất.
  - Kích hoạt lại sợi dây thừng ngang `.hanging-clothesline` (`display: flex`) kết nối giữa 2 đinh tán đồng ở 2 mép bảng.
  - Căn chỉnh `.hanging-memories-track` thành `flex-wrap: nowrap; justify-content: space-between; gap: 20px;`, giúp cả 4 tấm ảnh Polaroid dàn đều cân xứng tuyệt đối trên toàn bộ chiều rộng trang web trên desktop, đồng thời hỗ trợ cuộn ngang linh hoạt trên mobile/tablet.
  - Mở lại cụm nút điều hướng mũi tên phấn tròn `←` `→` (`.memories-stepper-btns`) để người xem có thể cuộn từng nhóm ảnh có kiểm soát.

### 6.6. Tinh Chỉnh Khớp Tỷ Lệ Pixel-Perfect Tờ Giấy 3D & Khôi Phục Màu Giấy Gốc

Sau khi tích hợp animation Three.js, hai vấn đề thực tế đã được phát hiện và xử lý triệt để:

1. **Khắc Phục Tờ Giấy Animation Lớn Hơn Popup Thật (Pixel-Perfect Matching):**
   - **Nguyên nhân cốt lõi:**
     - Trước đó Three.js mesh sử dụng kích thước cố định `PlaneGeometry(5.4, 3.9)` kết hợp với camera phối cảnh có `fov: 42deg` đặt ở cự ly cố định `z = 7`.
     - Tỷ lệ khung nhìn này không tự động co giãn theo kích thước thực tế của DOM `.memory-modal-content` (vốn thay đổi theo viewport: tối đa 980px trên desktop và co lại còn ~355px trên mobile 375px). Kết quả là tờ giấy 3D bung mở ra kích thước ~1114px trên desktop (lớn hơn popup DOM 980px) và bị tràn ra ngoài màn hình mobile.
   - **Giải pháp toán học 1:1 Pixel Frustum:**
     - Bổ sung `targetRef` vào `PaperUnfoldScene` liên kết trực tiếp với DOM element `.memory-modal-content.paper-unfold-modal`.
     - Đo đạc chính xác kích thước pixel thực tế của DOM qua `offsetWidth` và `offsetHeight` (hoặc `getBoundingClientRect()`), đồng thời lấy tọa độ tâm `targetCenterX`, `targetCenterY`.
     - Tính toán góc nhìn camera phối cảnh (Perspective Frustum) theo chiều cao viewport:
       $$\text{vFov} = 2 \cdot \arctan\left(\frac{\text{viewportHeight} / 2}{\text{cameraDistance}}\right) \cdot \left(\frac{180}{\pi}\right)$$
       với $\text{cameraDistance} = 1200\text{px}$. Với công thức này, **tại mặt phẳng $Z = 0$, đúng 1 đơn vị Three.js tương ứng chính xác với 1 pixel CSS**.
     - Khởi tạo lưới hình học `THREE.PlaneGeometry(targetWidth, targetHeight, 48, 36)`.
     - Dịch chuyển tâm mesh theo độ lệch giữa tâm popup DOM và tâm viewport (`targetOffsetX = targetCenterX - width / 2`, `targetOffsetY = -(targetCenterY - height / 2)`).
     - Khớp chính xác góc nghiêng kết thúc: `finalRotationZ = width <= 860 ? 0 : -0.4 * (Math.PI / 180)` đồng bộ hoàn toàn với `transform: rotate(-0.4deg)` của CSS.

2. **Khắc Phục Màu Popup Sau Animation Bị Đậm Hơn Thiết Kế Gốc (Restoring Original Warm Ivory Paper):**
   - **Nguyên nhân cốt lõi:**
     - Lớp CSS `.crumpled-paper-creases::after` bị chèn tĩnh với độ mờ cao `opacity: 0.7` chứa 4 lớp `radial-gradient` màu nâu sẫm sepia (`rgba(80, 50, 20, 0.22)`, `rgba(100, 70, 30, 0.16)...`), đè lên bề mặt popup tạo cảm giác các vết đốm bẩn và làm sẫm màu toàn bộ tờ giấy.
     - Đồng thời, `background-image` của `.memory-modal-content` trước đó bị chèn thêm các dải gradient viền `#ebe0c4` dày đặc.
     - Về phía Three.js, vật liệu sử dụng màu `#F3EBDD` với đèn chiếu có cường độ tương phản bóng đổ quá gắt khiến bề mặt mesh 3D tối hơn, dẫn tới sự chênh lệch màu rõ rệt khi chuyển từ 3D sang DOM.
   - **Giải pháp đồng bộ màu sắc:**
     - Ẩn triệt để lớp overlay đốm bẩn: `.crumpled-paper-creases::after { display: none; }`.
     - Khôi phục `background-image` của `.memory-modal-content.paper-unfold-modal` về các đường gấp linear gradient mờ tinh tế và quầng sáng mềm mại (`radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.25) 0%, transparent 80%)`) của thiết kế gốc.
     - Cân chỉnh Three.js material sang màu chuẩn `0xFAF5E8` khớp 100% với thuộc tính CSS `background-color: #faf5e8`.
     - Tinh chỉnh hệ thống chiếu sáng Three.js: `AmbientLight(0xfff8ee, 1.05)`, `DirectionalLight(0xfff4e4, 1.45)`, `DirectionalLight(0xe8dcc8, 0.55)` và `PointLight(0xffeed0, 0.45)`, tạo bề mặt giấy sáng trong, ấm áp, liền mạch tuyệt đối khi chuyển giao từ hoạt cảnh bung mở 3D sang popup DOM.

### 6.7. Tinh Chỉnh Thứ Tự Animation Liền Mạch & Khớp Màu Sắc Tuyệt Đối Giữa Giấy 3D Và Popup

Sau đợt rà soát video thực tế, hai vấn đề cốt lõi đã được phân tích và xử lý dứt điểm:

1. **Bảo Toàn Nghiêm Ngặt Thứ Tự Animation & Triệt Tiêu Khoảng Khựng (Seamless Handoff):**
   - **Nguyên nhân khoảng chờ cũ:**
     - Trước đó hàm easing $1 - (1 - t)^{3.4}$ khiến tờ giấy phẳng từ $t \approx 0.78$ (~1.5s - 1.6s thực tế), trong khi callback `onComplete` lại đợi đến tận $t = 1.0$ (1250ms, ~2.0s thực tế) mới mở popup, tạo ra khoảng "đứng hình" ~400ms sau khi giấy đã phẳng.
     - Ngoài ra, việc dùng state React cập nhật liên tục 60fps gây nghẽn luồng render của trình duyệt.
   - **Giải pháp xử lý:**
     - **Bảo toàn thứ tự animation:** Khi click mở, popup DOM (`.paper-modal-shell`) được thiết lập `opacity: 0` tuyệt đối trong suốt giai đoạn đầu ($t < 0.78$), hoàn toàn vô hình. Người xem chỉ thấy cục giấy Three.js vo tròn xuất hiện và bung mở mạnh mẽ ở trung tâm.
     - **Đồng bộ chuyển giao sát thời điểm hoàn tất:** Ở giai đoạn cuối khi giấy 3D gần đạt trạng thái phẳng ($t \ge 0.78$, khoảng 160ms cuối của thời lượng 880ms), `PaperUnfoldScene` trực tiếp điều phối `shellEl.style.opacity` tăng mượt mà từ $0 \rightarrow 1$ đồng bộ với việc giảm nhẹ `material.opacity` của lớp 3D.
     - **Hoàn tất tức thì tại $t = 1.0$:** Đúng tại frame $t = 1.0$, popup DOM đạt `opacity: 1`, `onComplete` lập tức unmount canvas Three.js để giải phóng tài nguyên. Người xem cảm nhận rõ rệt **tờ giấy 3D mở ra và biến thành popup** mà không có bất kỳ khung hình đứng yên nào.

2. **Khắc Phục Màu Tờ Giấy 3D Bị Đậm Hơn Popup (Color Matching Precision):**
   - **Nguyên nhân:**
     - Texture 2D trước đó sử dụng dải `radial-gradient` có bán kính quá hẹp kèm điểm dừng `#ebe0c4` sẫm màu, kết hợp viền nâu `strokeRect` và ánh sáng thiếu hụt kênh Blue (đèn ngả vàng/nâu sepia). Kết quả là tờ giấy 3D bị ám vàng sẫm và tối hơn so với nền popup DOM sáng sạch `#FAF5E8` / `#FEFCF6`.
   - **Giải pháp xử lý:**
     - Thiết kế lại Canvas Texture với gradient rộng bán kính 360: tâm `#FFFFFF` sáng bóng (khớp với quầng phản quang `.crumpled-paper-creases`), chuyển dần sang `#FEFCF6`, `#FAF5E8` và mép giấy mềm `#F5ECE0`. Loại bỏ hoàn toàn viền `strokeRect` thô và các nếp vẽ đậm.
     - Tinh chỉnh hệ thống chiếu sáng trung tính ấm: `AmbientLight(0xfffdf7, 1.25)`, `DirectionalLight(0xfffcf2, 0.45)` và `DirectionalLight(0xf8f5ed, 0.25)`, cân bằng hoàn hảo các kênh RGB.
     - **Kết quả đo đạc điểm ảnh thực tế (Pixel Color Verification):**
       - Tọa độ tâm giấy 3D: `RGB(253, 251, 245)` — Khớp hoàn toàn với DOM `RGB(253, 251, 245)`.
       - Tọa độ mép giấy 3D: `RGB(244, 238, 224)` — Khớp hoàn toàn với DOM `RGB(244, 238, 224)`.
       - Độ lệch màu $\Delta = 0$ điểm ảnh (trùng khớp thị giác 100%, không còn hiện tượng nhảy màu, nháy sáng hay sẫm màu).
