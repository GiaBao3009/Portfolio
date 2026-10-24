export type VideoAnnotation = {
  id: string
  start: number
  end: number
  title: string
  description: string
  target: { x: number; y: number }
  cueLabel?: string
}

export type FeaturedProject = {
  id: string
  number: string
  name: string
  title: string
  role: string
  handNote: string
  summary: string
  highlight: string
  techStack: string[]
  videoSrc: string | null
  posterSrc: string | null
  annotations: VideoAnnotation[]
  storyboard: {
    badge: string
    headline: string
    subline: string
    keypoints: { title: string; desc: string; coord: { x: number; y: number } }[]
  }
}

export type SupportingProject = {
  id: string
  number: string
  name: string
  title: string
  category: string
  role: string
  techStack: string[]
  summary: string
  frontendHighlights: string[]
  badgeText: string
}

/**
 * 3 DỰ ÁN TRỌNG TÂM (FEATURED PROJECTS) — TRÌNH DIỄN VIDEO DEMO
 * Thể hiện chiều sâu kỹ thuật, khả năng giải quyết bài toán phức tạp và vai trò cụ thể.
 */
export const featuredProjects: FeaturedProject[] = [
  {
    id: 'chips-bill',
    number: '01',
    name: 'Chips Bill',
    title: 'Chips-Bill.',
    role: 'POS System · Solo Frontend Developer',
    handNote: 'Scale hardware integration & live price calculation.',
    summary:
      'Đảm nhiệm toàn bộ phần Front-end của ứng dụng bán hàng POS. Điểm nhấn kỹ thuật nổi bật nhất là kết nối trực tiếp giao diện web với cân điện tử qua Web Serial API, liên tục đọc trọng lượng thực và tính lại giá tiền tức thì cho các mặt hàng bán theo cân.',
    highlight: 'Tích hợp cân điện tử & tính toán giá tiền thời gian thực',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Web Serial API', 'Real-time Calculations'],
    videoSrc: null,
    posterSrc: null,
    annotations: [
      {
        id: 'scale-stream',
        start: 0,
        end: 7,
        cueLabel: '0:02 — HARDWARE STREAM',
        title: 'Đọc trọng lượng liên tục từ cân điện tử',
        description:
          'Giao diện Front-end lắng nghe luồng dữ liệu serial từ cân điện tử, bóc tách chuỗi byte trọng lượng thời gian thực mà không gây giật lag giao diện.',
        target: { x: 30, y: 38 },
      },
      {
        id: 'price-calc',
        start: 8,
        end: 16,
        cueLabel: '0:10 — REAL-TIME CALCULATION',
        title: 'Tự động tính lại số lượng và giá tiền',
        description:
          'Ngay khi trọng lượng thay đổi trên bàn cân, hệ thống lập tức nhân với đơn giá mặt hàng, cập nhật thành tiền trên giỏ hàng thu ngân với độ trễ dưới 100ms.',
        target: { x: 62, y: 44 },
      },
      {
        id: 'cart-workflow',
        start: 17,
        end: 26,
        cueLabel: '0:19 — CASHIER WORKFLOW',
        title: 'Hoàn tất đơn hàng và luồng hóa đơn',
        description:
          'Kết hợp liền mạch giữa hàng cân ký và sản phẩm quét mã vạch, chuẩn bị hóa đơn thanh toán và xuất lệnh in vé bán hàng.',
        target: { x: 80, y: 68 },
      },
    ],
    storyboard: {
      badge: 'POS HARDWARE INTEGRATION WORKFLOW',
      headline: 'Connecting physical scales to the web view.',
      subline: 'Scale stream → weight parser → dynamic price matrix → cart state',
      keypoints: [
        {
          title: 'Direct Scale Listener',
          desc: 'Liên tục đọc và giải mã tín hiệu serial từ bàn cân.',
          coord: { x: 26, y: 42 },
        },
        {
          title: 'Live Price Computation',
          desc: 'Nhân trọng lượng với đơn giá tức thì trên giao diện.',
          coord: { x: 55, y: 45 },
        },
        {
          title: 'Checkout Queue',
          desc: 'Đồng bộ hóa đơn và đẩy dữ liệu in phiếu thanh toán.',
          coord: { x: 82, y: 52 },
        },
      ],
    },
  },
  {
    id: 'chips-voting',
    number: '02',
    name: 'Chips Voting',
    title: 'Chips-Voting.',
    role: 'Shareholder Voting System · Solo Frontend Developer',
    handNote: 'Precision shareholding ratios & proxy delegation.',
    summary:
      'Đảm nhiệm toàn bộ giao diện và logic Front-end cho hệ thống biểu quyết đại hội cổ đông. Xử lý các nghiệp vụ khắt khe về tính toán tỷ lệ sở hữu cổ phần, ủy quyền tham dự, bỏ phiếu bảo mật và thống kê kết quả biểu quyết trực tiếp.',
    highlight: 'Hệ thống biểu quyết cổ đông, tỷ lệ cổ phần & ủy quyền',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'High-Precision Math', 'Real-time Quorum'],
    videoSrc: null,
    posterSrc: null,
    annotations: [
      {
        id: 'share-quorum',
        start: 0,
        end: 8,
        cueLabel: '0:03 — SHARE RATIO & QUORUM',
        title: 'Xác thực tư cách cổ đông và tính tỷ lệ biểu quyết',
        description:
          'Tính toán tỷ lệ sở hữu cổ phần chính xác đến nhiều chữ số thập phân, liên tục kiểm tra tỷ lệ túc số hợp lệ để tiến hành đại hội theo luật định.',
        target: { x: 28, y: 36 },
      },
      {
        id: 'proxy-auth',
        start: 9,
        end: 17,
        cueLabel: '0:11 — PROXY DELEGATION',
        title: 'Luồng ủy quyền biểu quyết cho người đại diện',
        description:
          'Cho phép cổ đông ủy quyền toàn phần hoặc phân tách quyền biểu quyết cho các đại diện được chỉ định với trạng thái xác thực rõ ràng.',
        target: { x: 54, y: 48 },
      },
      {
        id: 'live-tally',
        start: 18,
        end: 27,
        cueLabel: '0:20 — REAL-TIME STATISTICS',
        title: 'Bỏ phiếu và thống kê kết quả biểu quyết trực tiếp',
        description:
          'Tổng hợp tức thì các phiếu tán thành, không tán thành và không có ý kiến; biểu diễn trực quan qua thanh tiến trình kết quả đại hội.',
        target: { x: 76, y: 62 },
      },
    ],
    storyboard: {
      badge: 'SHAREHOLDER GOVERNANCE WORKFLOW',
      headline: 'Strict precision for critical decisions.',
      subline: 'Share ratio calculation → delegate authorization → confidential ballot → live tally',
      keypoints: [
        {
          title: 'Quorum Ratio Engine',
          desc: 'Tính toán tỷ lệ sở hữu cổ phần và kiểm tra túc số hợp lệ.',
          coord: { x: 25, y: 38 },
        },
        {
          title: 'Proxy Delegation Flow',
          desc: 'Xác thực và phân quyền cho người đại diện biểu quyết.',
          coord: { x: 53, y: 46 },
        },
        {
          title: 'Ballot Aggregator',
          desc: 'Tổng hợp số liệu biểu quyết trực tiếp theo từng nội dung.',
          coord: { x: 80, y: 58 },
        },
      ],
    },
  },
  {
    id: 'workflow-platform',
    number: '03',
    name: 'Workflow-Platform',
    title: 'Workflow-Platform.',
    role: 'Workflow Automation · Frontend Developer',
    handNote: 'React Flow node graphs & dynamic execution.',
    summary:
      'Xây dựng giao diện tự động hóa quy trình dạng node graph trực quan. Cho phép người dùng kéo thả các node hành động/kích hoạt, kết nối dây dẫn dữ liệu, cấu hình tham số động và kích hoạt quy trình tự động gửi email, tích hợp AI và Telegram bot.',
    highlight: 'Giao diện visual workflow builder dạng node graph với React Flow',
    techStack: ['React Flow', 'React', 'TypeScript', 'Zustand', 'Tailwind CSS'],
    videoSrc: null,
    posterSrc: null,
    annotations: [
      {
        id: 'node-canvas',
        start: 0,
        end: 7,
        cueLabel: '0:03 — DRAG & DROP CANVAS',
        title: 'Kéo thả và sắp xếp các node quy trình trên React Flow',
        description:
          'Khung vẽ tương tác mượt mà hỗ trợ kéo thả các custom node (Trigger, Condition, Action, Bot) với các cổng kết nối dữ liệu linh hoạt.',
        target: { x: 26, y: 42 },
      },
      {
        id: 'data-wiring',
        start: 8,
        end: 16,
        cueLabel: '0:12 — NODE WIRING & MAPPING',
        title: 'Kết nối node và ánh xạ luồng dữ liệu (Data Piping)',
        description:
          'Tạo các đường cong kết nối trực quan giữa các node, truyền giá trị output của bước trước vào làm tham số đầu vào cho bước tiếp theo.',
        target: { x: 52, y: 44 },
      },
      {
        id: 'execution-engine',
        start: 17,
        end: 26,
        cueLabel: '0:20 — CONFIG & EXECUTION',
        title: 'Cấu hình node và kích hoạt thực thi tự động',
        description:
          'Giao diện cấu hình tham số chi tiết cho từng node, hỗ trợ lên lịch chạy cron job, gọi prompt AI và gửi thông báo qua Telegram bot.',
        target: { x: 75, y: 65 },
      },
    ],
    storyboard: {
      badge: 'VISUAL WORKFLOW AUTOMATION ENGINE',
      headline: 'An idea, connected into reality.',
      subline: 'Trigger node → data mapper → AI processor → scheduled Telegram/email dispatch',
      keypoints: [
        {
          title: 'Configurable Nodes',
          desc: 'Kéo thả và quản lý vị trí các node trên canvas.',
          coord: { x: 27, y: 40 },
        },
        {
          title: 'Dynamic Data Mapping',
          desc: 'Kết nối đường dây và ánh xạ dữ liệu giữa các bước.',
          coord: { x: 53, y: 46 },
        },
        {
          title: 'Multi-Channel Bots',
          desc: 'Cấu hình thực thi bot Telegram, email và trí tuệ nhân tạo.',
          coord: { x: 78, y: 64 },
        },
      ],
    },
  },
]

/**
 * 4 DỰ ÁN BỔ TRỢ (SUPPORTING PROJECTS) — TRÌNH BÀY NGẮN GỌN & RÕ PHẦN VIỆC
 * Thể hiện độ rộng kinh nghiệm qua các bài toán doanh nghiệp, ERP, bán lẻ và chứng khoán.
 */
export const supportingProjects: SupportingProject[] = [
  {
    id: 'erp-ecosystem',
    number: '04',
    name: 'ERP Ecosystem',
    title: 'ERP-Ecosystem.',
    category: 'Enterprise Resource Planning',
    role: 'Frontend Contributor',
    techStack: ['Angular', 'TypeScript', 'SCSS', 'Enterprise Architecture'],
    summary:
      'Hệ sinh thái giải pháp hoạch định nguồn lực doanh nghiệp gồm Ohno ERP, Nakano ERP và Chips ERP. Tham gia phát triển tính năng, bảo trì và nâng cấp cấu trúc source code cho các phân hệ nghiệp vụ.',
    frontendHighlights: [
      'Phát triển giao diện các luồng duyệt nghiệp vụ nhiều cấp (mua hàng, kho bãi, nhân sự).',
      'Tái cấu trúc và nâng cấp source code theo chuẩn module của Angular, tách biệt tầng service.',
      'Tối ưu hóa hiển thị cho các bảng dữ liệu lớn (data grids) và form nhập liệu chuyên sâu.',
    ],
    badgeText: 'OHNO · NAKANO · CHIPS ERP',
  },
  {
    id: 'chips-task',
    number: '05',
    name: 'Chips Task',
    title: 'Chips-Task.',
    category: 'Task & Project Management',
    role: 'Frontend Co-developer',
    techStack: ['React', 'TypeScript', 'Drag-and-Drop', 'Sprint Workflow'],
    summary:
      'Hệ thống quản lý công việc và dự án tương tự Jira. Tham gia tiếp quản và đồng phát triển cùng một thành viên khác, tập trung vào trải nghiệm tương tác kéo thả mượt mà và quản lý trạng thái công việc.',
    frontendHighlights: [
      'Phát triển bảng Kanban với tương tác kéo thả (drag & drop) thẻ công việc mượt mà giữa các cột.',
      'Quản lý trạng thái vòng đời công việc (Backlog, In Progress, Review, Done) và bộ lọc linh hoạt.',
      'Xây dựng modal chi tiết công việc với danh sách checklist, phân công nhân sự và luồng hoạt động.',
    ],
    badgeText: 'AGILE KANBAN & SPRINT ENGINE',
  },
  {
    id: 'freshstore',
    number: '06',
    name: 'FreshStore',
    title: 'FreshStore.',
    category: 'Retail & Order Fulfillment',
    role: 'Frontend Developer',
    techStack: ['React', 'JavaScript', 'QR Code Generator', 'Responsive CSS'],
    summary:
      'Dự án thuộc hệ thống quản lý và xử lý đơn đặt hàng bán lẻ (sử dụng nền tảng Node.js). Đảm nhiệm vai trò Frontend Developer, xây dựng chức năng tạo mã QR cho từng mã PO và trang tra cứu đơn hàng.',
    frontendHighlights: [
      'Xây dựng chức năng tạo và render mã QR động tương ứng theo từng mã Purchase Order (PO).',
      'Thiết kế và triển khai trang xem chi tiết đơn đặt hàng riêng biệt cho từng mã PO được quét.',
      'Hiển thị rõ ràng, chuẩn hóa các thông tin khách hàng, số điện thoại liên hệ và danh mục đơn hàng.',
    ],
    badgeText: 'PO QR GENERATOR & DETAIL VIEW',
  },
  {
    id: 'nsi',
    number: '07',
    name: 'NSI',
    title: 'NSI.',
    category: 'Securities & Stock Knowledge Hub',
    role: 'Frontend Developer',
    techStack: ['React', 'TypeScript', 'CMS Admin UI', 'Tailwind CSS'],
    summary:
      'Dự án thuộc lĩnh vực chứng khoán và tài chính (sử dụng nền tảng Node.js). Đảm nhiệm vai trò Frontend Developer, phát triển toàn bộ giao diện Trung tâm kiến thức chứng khoán và cổng quản trị nhập liệu.',
    frontendHighlights: [
      'Xây dựng giao diện người dùng cho Trung tâm kiến thức (Knowledge Center) và danh mục chủ đề.',
      'Phát triển trang chi tiết bài học / chủ đề kiến thức chứng khoán với trải nghiệm đọc trực quan.',
      'Xây dựng giao diện Admin cho ban biên tập nhập liệu, định dạng nội dung và xuất bản bài viết.',
    ],
    badgeText: 'KNOWLEDGE CENTER & ADMIN CMS',
  },
]
