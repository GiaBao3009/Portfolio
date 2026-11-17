# Tài Liệu Kỹ Thuật: Hệ Thống Scrollytelling & Motion Design (GSAP + ScrollTrigger)

Tài liệu này mô tả kiến trúc nâng cấp chuyển động tương tác theo thao tác cuộn (Scrollytelling) cho toàn bộ 5 chương của **The Impossible Chalkboard** bằng **GSAP** và **GSAP ScrollTrigger**, ưu tiên không gian thoáng (negative space) và không thêm các đường kẻ phụ gây rối thị giác.

---

## 1. Mục Đích

- Nâng cấp trải nghiệm cuộn trang của portfolio thành một câu chuyện thị giác liền mạch bằng chuyển động vị trí, góc nghiêng, tỷ lệ (`scale`), chiều sâu (`parallax`) và `clip-path`, giữ nguyên 100% đường bay `.journey-path` duy nhất xuyên trang mà không vẽ chồng thêm các đường nối phụ gây rối mắt.
- Đảm bảo hiệu năng 60fps ổn định, hỗ trợ cuộn tiến/lùi mượt mà (`scrub`), dọn dẹp bộ nhớ triệt để với `gsap.context()` và tương thích hoàn toàn với Three.js `PaperUnfoldScene`, đa ngôn ngữ `VI / EN` và 3 video demo thực tế.

---

## 2. Cấu Trúc File Liên Quan

- [src/hooks/useChalkboardScroll.ts](file:///c:/Users/baold/Desktop/Portfolio/src/hooks/useChalkboardScroll.ts): Custom hook điều phối timeline GSAP + ScrollTrigger cho Scene 01 (`#chapter-1`), Scene 02 (`#chapter-2`), Scene 04 (`#chapter-4`) và Scene 05 (`#chapter-5`).
- [src/hooks/useSelectedWorksMotion.ts](file:///c:/Users/baold/Desktop/Portfolio/src/hooks/useSelectedWorksMotion.ts): Custom hook điều phối chuyển động cho Scene 03 (`#chapter-3`): hiệu ứng chuyển tab đa lớp (`clipPath` + `scale` + `stagger`), vẽ đường cầu nối nguyên bản `.story-bridge-connector` và sợi dây treo Polaroid `.hanging-string-path`.
- [src/App.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/App.tsx) & [src/SelectedWorks.tsx](file:///c:/Users/baold/Desktop/Portfolio/src/SelectedWorks.tsx): Tích hợp 2 hook GSAP và giữ bố cục thoáng đãng, lược bỏ các khung viền/đường kẻ thừa.
- [tests/scrollytelling.spec.ts](file:///c:/Users/baold/Desktop/Portfolio/tests/scrollytelling.spec.ts): Bộ kiểm thử tự động Playwright cho toàn bộ 5 phân cảnh scrollytelling.

---

## 3. Luồng Hoạt Động Theo 5 Phân Cảnh (Scene-by-Scene Flow)

1. **Scene 01 — The Beginning (`#chapter-1`):**
   - Mở màn tuần tự tiêu đề, vòng phấn quanh tên `Bảo` (`strokeDashoffset → 0`), ghi chú phụ, mũi tên nguyên bản và chiếc máy bay giấy.
   - Khi cuộn xuống (`scrub: 0.6`), cụm tiêu đề tiến nhẹ về phía người xem, ngôi sao phấn xoay lệch tốc độ và chiếc máy bay `.hero-plane` cất cánh theo đường chéo.
2. **Scene 02 — About Me (`#chapter-2`):**
   - Khám phá tuần tự theo nhịp cuộn (`scrub: 0.65`) với khoảng thở tự nhiên trên nền bảng đen: ảnh `.polaroid` nghiêng vào từ bên trái → mẩu giấy `.yellow-note` đáp xuống góc phải trên → dòng chữ `.about-scribble` kèm mũi tên nguyên bản tự vẽ → tờ giấy kẻ dòng `.lined-note` nghiêng nhẹ vào vị trí.
3. **Scene 03 — Project Showcase (`#chapter-3`):**
   - Khung trình diễn video `.workflow-demonstration` dựng phẳng mượt từ góc nghiêng phối cảnh khi vào tầm đọc, hoàn toàn sạch sẽ không có viền hay vòng tròn đè lên UI sản phẩm.
   - Khi chuyển giữa `01 Chips Bill`, `02 Chips Voting` và `03 Workflow-Platform`, GSAP phối hợp `clipPath: inset(...)`, `scale`, dịch chuyển cột trái/phải và `stagger` trên các mốc thời gian `.cue-timeline-item`.
   - Đường cầu nối nguyên bản `.story-bridge-connector` và sợi dây thừng `.hanging-string-path` tự vẽ theo tiến trình cuộn.
4. **Scene 04 — Still in Progress (`#chapter-4`):**
   - Ba nguyên tắc trong `.growth-notes` xuất hiện tuần tự theo chiều sâu cuộn trong khi chiếc máy bay màu mint bay vươn ra khỏi khung cửa sổ `.chalk-window`.
5. **Scene 05 — The Next Chapter (`#chapter-5`):**
   - Ngôi sao phấn xoay nhẹ theo chiều sâu cuộn, chiếc máy bay màu coral `.contact-plane` bay lượn về phía góc phải trên và khép lại ở chữ ký `gb.`.
