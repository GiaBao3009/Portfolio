import { Fragment, useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import {
  getFeaturedProjects,
  getSupportingProjects,
  type FeaturedProject,
  type SupportingProject,
  type VideoAnnotation,
} from './data/selectedWorks'
import { useI18n } from './assets/i18n'
import PaperUnfoldScene from './PaperUnfoldScene'
import { useSelectedWorksMotion } from './hooks/useSelectedWorksMotion'
import './selected-works.css'

/**
 * Component đồ họa phác thảo Chalkboard Storyboard
 * Hiển thị khi video demo của dự án trọng tâm chưa được gắn file MP4 thật,
 * đảm bảo khung hình 16:9 luôn trực quan, đúng chất nghệ thuật bảng đen.
 */
function ProjectStoryboard({
  project,
  selectedAnnotation,
  demoFootageLabel,
}: {
  project: FeaturedProject
  selectedAnnotation: number
  demoFootageLabel: string
}) {
  const { storyboard } = project

  return (
    /* Khối bảng phác thảo chalkboard mô phỏng quy trình */
    <div className="workflow-storyboard">
      {/* Nhãn thể hiện quy trình kỹ thuật */}
      <span className="storyboard-label">{storyboard.badge}</span>

      {/* Tiêu đề ngắn viết tay */}
      <div className="storyboard-intro">
        <span className="hand">{storyboard.headline}</span>
        <p>{storyboard.subline}</p>
      </div>

      {/* SVG vẽ các đường liên kết chalk giữa các node quy trình */}
      <div
        className="storyboard-drawing"
        aria-label={`${project.name} workflow illustration`}
      >
        <svg
          viewBox="0 0 1000 390"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Đường nối node 1 sang node 2 */}
          <path
            className={selectedAnnotation === 0 ? 'highlight' : ''}
            d="M240 120C315 105 325 135 400 120m-12-7 13 7-12 8"
          />
          {/* Đường nối node 2 sang node 3 */}
          <path
            className={selectedAnnotation === 1 ? 'highlight' : ''}
            d="M585 120C645 135 670 102 735 120m-13-8 14 8-12 9"
          />
          {/* Đường nối phụ hoặc hồi tiếp */}
          <path
            className={selectedAnnotation === 2 ? 'highlight' : ''}
            d="M830 167C855 210 795 230 830 273m-11-9 11 11 6-14"
          />
          {/* Đường chalk nét đứt hồi quy */}
          <path
            className="drawing-return"
            d="M730 320C480 385 230 310 120 180"
          />
        </svg>

        {/* Danh sách các node tương tác của quy trình */}
        {storyboard.keypoints.map((point, i) => (
          <div
            key={point.title}
            className={`storyboard-node node-${i}${selectedAnnotation === i ? ' is-highlighted' : ''}`}
          >
            <span>0{i + 1}</span>
            <strong>{point.title}</strong>
            <small className="node-detail">{point.desc}</small>
            <i aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* Ghi chú chân trang mô phỏng */}
      <div className="storyboard-bottom">
        <span>AUTHENTIC ENGINEERING HIGHLIGHTS</span>
        <span>{demoFootageLabel} ↗</span>
      </div>
    </div>
  )
}

/**
 * Mũi tên phấn vẽ tay thủ công đúng chuẩn phong cách The Impossible Chalkboard
 * (Mô phỏng chính xác nét phấn xước, độ nghiêng và dáng gập tự nhiên của hình mẫu)
 */
function ChalkBentArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`chalk-bent-arrow ${className}`}
      viewBox="0 0 54 58"
      fill="none"
      aria-hidden="true"
    >
      <filter id="chalk-dust-arrow" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* Thân mũi tên phấn từ trên xuống hơi nghiêng nhẹ và bẻ góc sang phải */}
      <path
        d="M 18 5 Q 20 20, 24 36 L 44 32"
        stroke="var(--color-yellow)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chalk-dust-arrow)"
      />

      {/* Hai cạnh đầu mũi tên phấn sắc nét, tự nhiên */}
      <path
        d="M 33 24 L 44 32 L 38 43"
        stroke="var(--color-yellow)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chalk-dust-arrow)"
      />
    </svg>
  )
}

/**
 * Lấy ghi chú viết tay trên phần chân ảnh Polaroid của từng dự án kỷ niệm
 */
function getMemoryHandCaption(id: string): string {
  switch (id) {
    case 'erp-ecosystem':
      return 'Duyệt nghiệp vụ đa cấp · Nakano & Ohno ERP'
    case 'chips-task':
      return 'Bảng Kanban kéo thả · Quản trị task agile'
    case 'freshstore':
      return 'Mã QR PO động · Chi tiết đơn hàng'
    case 'nsi':
      return 'Knowledge Center & CMS chứng khoán'
    default:
      return 'Dự án thực tế'
  }
}

/**
 * Rút gọn nhãn vai trò hiển thị trên tem ảnh Polaroid
 */
function getShortRoleBadge(role: string): string {
  if (role.includes('Ticket-Driven')) return 'Ticket-Driven · Angular'
  if (role.includes('Tiếp quản') || role.includes('Co-developer')) return 'Co-developer · React DnD'
  if (role.includes('FreshStore') || role.includes('PO')) return 'Frontend · PO QR Code'
  if (role.includes('NSI') || role.includes('CMS')) return 'Frontend · CMS & Knowledge'
  return role.split('·')[0].trim()
}

/**
 * Component hiển thị snapshot giao diện phần mềm chân thực đại diện cho từng dự án bổ trợ
 * (Không dùng ảnh stock giả, hiển thị bản vẽ giao diện chân thực đúng nghiệp vụ của từng project)
 */
function SupportingProjectSnapshot({ projectId }: { projectId: string }) {
  switch (projectId) {
    case 'erp-ecosystem':
      return (
        /* Giao diện bảng phê duyệt nghiệp vụ đa cấp hệ thống ERP (Ohno / Nakano / Chips) */
        <div className="snapshot-mockup snapshot-erp" aria-hidden="true">
          {/* Header thanh tìm kiếm và tab trạng thái duyệt */}
          <div className="mockup-header">
            <span className="mockup-tag">ANGULAR ERP</span>
            <div className="mockup-tabs">
              <span className="tab is-active">Chờ duyệt (08)</span>
              <span className="tab">Đã duyệt</span>
            </div>
          </div>

          {/* Bảng dữ liệu lớn AG-Grid thu nhỏ */}
          <div className="mockup-grid">
            <div className="grid-row grid-head">
              <span>MÃ PHIẾU</span>
              <span>PHÒNG BAN</span>
              <span>SỐ TIỀN</span>
              <span>TRẠNG THÁI</span>
            </div>
            <div className="grid-row">
              <span className="code">PO-0891</span>
              <span>Kho vận</span>
              <span>45.2M</span>
              <span className="status-pill status-warn">Chờ duyệt</span>
            </div>
            <div className="grid-row">
              <span className="code">REQ-0428</span>
              <span>Sản xuất</span>
              <span>128.5M</span>
              <span className="status-pill status-ok">Đã duyệt</span>
            </div>
            <div className="grid-row">
              <span className="code">INV-9021</span>
              <span>Kế toán</span>
              <span>14.8M</span>
              <span className="status-pill status-ok">Đã duyệt</span>
            </div>
          </div>
        </div>
      )

    case 'chips-task':
      return (
        /* Giao diện bảng Kanban kéo thả thẻ công việc Agile Sprint */
        <div className="snapshot-mockup snapshot-kanban" aria-hidden="true">
          {/* Header thanh công cụ Sprint */}
          <div className="mockup-header">
            <span className="mockup-tag">SPRINT #24</span>
            <span className="mockup-sprint-meta">DnD Kanban</span>
          </div>

          {/* 3 cột Kanban đặc trưng */}
          <div className="kanban-columns">
            {/* Cột Backlog */}
            <div className="kanban-col">
              <div className="col-title">BACKLOG</div>
              <div className="kanban-card">
                <p>Socket đồng bộ task</p>
                <span className="card-tag">FE</span>
              </div>
            </div>

            {/* Cột Đang làm có thẻ active */}
            <div className="kanban-col is-active-col">
              <div className="col-title">IN PROGRESS</div>
              <div className="kanban-card card-drag-highlight">
                <p>Kéo thả task mượt mà</p>
                <span className="card-tag tag-active">WIP</span>
              </div>
            </div>

            {/* Cột Hoàn thành */}
            <div className="kanban-col">
              <div className="col-title">DONE</div>
              <div className="kanban-card card-done">
                <p>Setup Kanban layout</p>
                <span className="card-tag tag-done">✓</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'freshstore':
      return (
        /* Giao diện module tạo và hiển thị mã QR động theo từng Purchase Order */
        <div className="snapshot-mockup snapshot-freshstore" aria-hidden="true">
          {/* Thông tin đơn hàng PO */}
          <div className="mockup-header">
            <span className="mockup-tag">PURCHASE ORDER</span>
            <span className="mockup-sprint-meta">#PO-8842</span>
          </div>

          {/* Khung mô phỏng mã QR động trung tâm */}
          <div className="po-qr-box">
            {/* SVG mô phỏng ma trận mã QR quét nhận hàng */}
            <svg className="mini-qr-svg" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="3" fill="#ffffff" />
              {/* Định vị 3 góc mã QR */}
              <rect x="4" y="4" width="12" height="12" fill="#1c1d1a" />
              <rect x="6" y="6" width="8" height="8" fill="#ffffff" />
              <rect x="8" y="8" width="4" height="4" fill="#1c1d1a" />

              <rect x="28" y="4" width="12" height="12" fill="#1c1d1a" />
              <rect x="30" y="6" width="8" height="8" fill="#ffffff" />
              <rect x="32" y="8" width="4" height="4" fill="#1c1d1a" />

              <rect x="4" y="28" width="12" height="12" fill="#1c1d1a" />
              <rect x="6" y="30" width="8" height="8" fill="#ffffff" />
              <rect x="8" y="32" width="4" height="4" fill="#1c1d1a" />

              {/* Các điểm data pixel */}
              <rect x="20" y="8" width="4" height="4" fill="#1c1d1a" />
              <rect x="8" y="20" width="4" height="4" fill="#1c1d1a" />
              <rect x="20" y="20" width="8" height="8" fill="#e65100" />
              <rect x="32" y="22" width="6" height="4" fill="#1c1d1a" />
              <rect x="22" y="32" width="8" height="4" fill="#1c1d1a" />
              <rect x="34" y="30" width="6" height="6" fill="#1c1d1a" />
            </svg>

            {/* Chi tiết đơn hàng quét */}
            <div className="po-info">
              <strong>Mã PO-8842</strong>
              <small>12 mặt hàng · Quét nhận kho</small>
            </div>
          </div>
        </div>
      )

    case 'nsi':
      return (
        /* Giao diện Trung tâm kiến thức chứng khoán & CMS biên tập viên */
        <div className="snapshot-mockup snapshot-nsi" aria-hidden="true">
          {/* Header cổng thông tin kiến thức */}
          <div className="mockup-header">
            <span className="mockup-tag">KNOWLEDGE CENTER</span>
            <span className="mockup-sprint-meta">NSI CMS</span>
          </div>

          {/* Lưới bài viết chứng khoán và sidebar CMS */}
          <div className="nsi-grid">
            <div className="nsi-article-card is-featured">
              <span className="nsi-badge">PHÂN TÍCH</span>
              <p>Mô hình nến Nhật & Điểm vào lệnh kỹ thuật</p>
            </div>
            <div className="nsi-article-card">
              <span className="nsi-badge">CƠ BẢN</span>
              <p>Quản trị rủi ro giao dịch chứng khoán phái sinh</p>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}

/**
 * Thông tin chi tiết kỹ thuật cho 4 dự án bổ trợ (Bài toán, Điểm kỹ thuật, Stack xác minh)
 */
function getTechnicalHighlights(id: string) {
  switch (id) {
    case 'erp-ecosystem':
      return {
        challenge:
          'Khối lượng dữ liệu lớn trong các phân hệ kho vận, mua sắm và nhân sự cần hiển thị đồng thời mà không làm giảm tốc độ render trang.',
        takeaway:
          'Tối ưu hóa bảng dữ liệu lớn (data grids) và luồng duyệt phân quyền đa cấp trên nền tảng Angular.',
        verifiedStack: ['Angular', 'TypeScript', 'SCSS', 'Multi-level Workflow', 'Data Grid Optimization'],
      }
    case 'chips-task':
      return {
        challenge:
          'Thao tác kéo thả thẻ công việc giữa các cột Sprint cần đồng bộ tức thời trạng thái task và duy trì frame rate 60fps.',
        takeaway:
          'Tối ưu hóa thao tác kéo thả (DnD) mượt mà giữa các cột Kanban và quản lý vòng đời task theo chuẩn Agile.',
        verifiedStack: ['React', 'TypeScript', 'Drag-and-Drop', 'Sprint Workflow', 'State Management'],
      }
    case 'freshstore':
      return {
        challenge:
          'Quy trình giao nhận hàng tại kho đòi hỏi đối soát nhanh chóng từng mã đơn Purchase Order (PO) mà không cần nhân viên gõ tay từng ký tự.',
        takeaway:
          'Tạo & render mã QR động theo từng mã PO, xây dựng trang xem chi tiết đơn đặt hàng riêng biệt sau khi quét mã.',
        verifiedStack: ['React', 'JavaScript', 'QR Matrix Generator', 'Responsive CSS', 'PO Order Flow'],
      }
    case 'nsi':
      return {
        challenge:
          'Cần phân phối khối lượng lớn bài viết phân tích chứng khoán với giao diện đọc trực quan và trang quản trị nội dung dễ sử dụng cho ban biên tập.',
        takeaway:
          'Xây dựng giao diện Trung tâm kiến thức (Knowledge Center) và hệ thống CMS biên tập, xuất bản bài viết chứng khoán.',
        verifiedStack: ['React', 'TypeScript', 'CMS Editorial UI', 'Knowledge Grid', 'Tailwind CSS'],
      }
    default:
      return {
        challenge: 'Phát triển module giao diện tối ưu theo đúng yêu cầu nghiệp vụ.',
        takeaway: 'Hiện thực hóa các tính năng Frontend chuyên sâu.',
        verifiedStack: ['React', 'TypeScript'],
      }
  }
}

/**
 * Component trình diễn sản phẩm thực tế chi tiết bên trong Popup
 * (Hỗ trợ chuyển đổi giữa 2 góc nhìn UI thực tế cho từng dự án, ví dụ FreshStore có cả QR và Trang chi tiết đơn hàng)
 */
function ProjectShowcaseVisual({ project }: { project: SupportingProject }) {
  const [activeTab, setActiveTab] = useState<'view1' | 'view2'>('view1')

  // Reset về tab 1 mỗi khi chuyển sang dự án khác
  useEffect(() => {
    setActiveTab('view1')
  }, [project.id])

  switch (project.id) {
    case 'freshstore':
      return (
        /* Khung trình diễn sản phẩm thực tế FreshStore */
        <div className="showcase-visual-container">
          {/* Băng keo dán góc tư liệu lên trang giấy */}
          <div className="specimen-corner-tape tape-top-left" aria-hidden="true" />
          <div className="specimen-corner-tape tape-top-right" aria-hidden="true" />

          {/* Thanh chuyển đổi tab góc nhìn sản phẩm */}
          <div className="showcase-tabs-bar">
            {/* Tab 1: Mã QR Purchase Order */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view1' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view1')}
            >
              <span>Mã QR PO động</span>
            </button>

            {/* Tab 2: Trang chi tiết đơn hàng */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view2' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view2')}
            >
              <span>Chi tiết đơn hàng (PO Detail)</span>
            </button>
          </div>

          {/* Nội dung tương tác tương ứng */}
          {activeTab === 'view1' ? (
            /* View 1: Ma trận mã QR PO động */
            <div className="showcase-view-panel freshstore-qr-panel">
              {/* Header thẻ đơn hàng */}
              <div className="showcase-panel-header">
                <span className="badge-yellow">PURCHASE ORDER #PO-8842</span>
                <span className="status-text-green">● Chờ nhận kho</span>
              </div>

              {/* Khung quét mã QR trung tâm */}
              <div className="freshstore-qr-showcase">
                <div className="qr-matrix-card">
                  {/* SVG mô phỏng ma trận mã QR quét nhận hàng */}
                  <svg className="showcase-qr-svg" viewBox="0 0 44 44" fill="none">
                    <rect width="44" height="44" rx="3" fill="#ffffff" />
                    {/* Định vị 3 góc mã QR */}
                    <rect x="4" y="4" width="12" height="12" fill="#1c1d1a" />
                    <rect x="6" y="6" width="8" height="8" fill="#ffffff" />
                    <rect x="8" y="8" width="4" height="4" fill="#1c1d1a" />

                    <rect x="28" y="4" width="12" height="12" fill="#1c1d1a" />
                    <rect x="30" y="6" width="8" height="8" fill="#ffffff" />
                    <rect x="32" y="8" width="4" height="4" fill="#1c1d1a" />

                    <rect x="4" y="28" width="12" height="12" fill="#1c1d1a" />
                    <rect x="6" y="30" width="8" height="8" fill="#ffffff" />
                    <rect x="8" y="32" width="4" height="4" fill="#1c1d1a" />

                    {/* Các điểm data pixel */}
                    <rect x="20" y="8" width="4" height="4" fill="#1c1d1a" />
                    <rect x="8" y="20" width="4" height="4" fill="#1c1d1a" />
                    <rect x="20" y="20" width="8" height="8" fill="#e65100" />
                    <rect x="32" y="22" width="6" height="4" fill="#1c1d1a" />
                    <rect x="22" y="32" width="8" height="4" fill="#1c1d1a" />
                    <rect x="34" y="30" width="6" height="6" fill="#1c1d1a" />
                  </svg>
                  <span className="qr-scan-guide">Mã PO: PO-8842</span>
                </div>

                {/* Thông tin kiện hàng quét nhận */}
                <div className="freshstore-qr-meta">
                  <h4>Đơn nhập nông sản chi nhánh</h4>
                  <p>Mã QR tự động mã hóa mã PO, kho đích và số lượng kiện hàng.</p>
                  <div className="qr-verify-pill">
                    <span>✓ Quét tự động mở trang đối soát nhận hàng</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: Trang chi tiết đơn hàng PO Detail */
            <div className="showcase-view-panel freshstore-detail-panel">
              {/* Thanh tiêu đề cửa sổ web */}
              <div className="browser-address-bar">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="address-url">freshstore.internal/orders/PO-8842</span>
              </div>

              {/* Thông tin đơn hàng */}
              <div className="order-detail-header">
                <div>
                  <strong>ĐƠN ĐẶT HÀNG #PO-8842</strong>
                  <span className="order-date">12/03/2026 · Nhà cung ứng: Đà Lạt Farm</span>
                </div>
                <span className="order-store-pill">Kho Quận 1</span>
              </div>

              {/* Bảng danh sách sản phẩm trong đơn */}
              <div className="order-items-table">
                <div className="order-table-head">
                  <span>MẶT HÀNG</span>
                  <span>SL</span>
                  <span>ĐƠN GIÁ</span>
                  <span className="col-right">THÀNH TIỀN</span>
                </div>
                <div className="order-table-row">
                  <span>Táo Envy New Zealand (18kg)</span>
                  <span>10</span>
                  <span>1.250.000đ</span>
                  <span className="col-right">12.500.000đ</span>
                </div>
                <div className="order-table-row">
                  <span>Cam Vàng Navel Úc (15kg)</span>
                  <span>15</span>
                  <span>850.000đ</span>
                  <span className="col-right">12.750.000đ</span>
                </div>
                <div className="order-table-row">
                  <span>Nho Đen Không Hạt Mỹ (5kg)</span>
                  <span>20</span>
                  <span>620.000đ</span>
                  <span className="col-right">12.400.000đ</span>
                </div>
              </div>

              {/* Tổng cộng đơn hàng */}
              <div className="order-total-bar">
                <span>Tổng giá trị đơn nhập:</span>
                <strong>37.650.000 VNĐ</strong>
              </div>
            </div>
          )}

          {/* Chú thích nguồn demo chân thực */}
          <span className="showcase-caption-note">
            {project.badgeText}
          </span>
        </div>
      )

    case 'erp-ecosystem':
      return (
        /* Khung trình diễn sản phẩm thực tế ERP Ecosystem */
        <div className="showcase-visual-container">
          {/* Băng keo dán góc tư liệu lên trang giấy */}
          <div className="specimen-corner-tape tape-top-left" aria-hidden="true" />
          <div className="specimen-corner-tape tape-top-right" aria-hidden="true" />

          {/* Thanh chuyển đổi tab góc nhìn sản phẩm */}
          <div className="showcase-tabs-bar">
            {/* Tab 1: Bảng dữ liệu phê duyệt */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view1' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view1')}
            >
              <span>Bảng dữ liệu phê duyệt</span>
            </button>

            {/* Tab 2: Luồng duyệt 3 cấp */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view2' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view2')}
            >
              <span>Quy trình duyệt 3 cấp</span>
            </button>
          </div>

          {activeTab === 'view1' ? (
            /* View 1: Data Table Angular lớn */
            <div className="showcase-view-panel erp-table-panel">
              {/* Header thanh lọc trạng thái */}
              <div className="showcase-panel-header">
                <span className="badge-yellow">ANGULAR ERP DATA GRID</span>
                <div className="erp-filter-tags">
                  <span className="erp-tag is-active">Chờ duyệt (08)</span>
                  <span className="erp-tag">Đã duyệt (16)</span>
                </div>
              </div>

              {/* Bảng dữ liệu lớn */}
              <div className="erp-data-grid">
                <div className="erp-grid-header">
                  <span>MÃ PHIẾU</span>
                  <span>PHÒNG BAN</span>
                  <span>SỐ TIỀN</span>
                  <span>CẤP DUYỆT</span>
                  <span className="col-right">TRẠNG THÁI</span>
                </div>
                <div className="erp-grid-row">
                  <span className="code">PO-0891</span>
                  <span>Kho vận</span>
                  <span>45.2M</span>
                  <span>Cấp 2/3</span>
                  <span className="status-pill status-warn col-right">Chờ duyệt</span>
                </div>
                <div className="erp-grid-row">
                  <span className="code">REQ-0428</span>
                  <span>Sản xuất</span>
                  <span>128.5M</span>
                  <span>Cấp 3/3</span>
                  <span className="status-pill status-ok col-right">Đã duyệt</span>
                </div>
                <div className="erp-grid-row">
                  <span className="code">INV-9021</span>
                  <span>Kế toán</span>
                  <span>14.8M</span>
                  <span>Cấp 1/3</span>
                  <span className="status-pill status-warn col-right">Chờ duyệt</span>
                </div>
                <div className="erp-grid-row">
                  <span className="code">HR-0114</span>
                  <span>Nhân sự</span>
                  <span>8.2M</span>
                  <span>Cấp 3/3</span>
                  <span className="status-pill status-ok col-right">Đã duyệt</span>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: Quy trình phê duyệt đa cấp */
            <div className="showcase-view-panel erp-pipeline-panel">
              <div className="showcase-panel-header">
                <span className="badge-yellow">LUỒNG DUYỆT PHÂN QUYỀN #PO-0891</span>
                <span className="status-text-warn">● Đang ở Cấp 2</span>
              </div>

              {/* 3 bước duyệt tuần tự */}
              <div className="approval-steps-flow">
                <div className="approval-step is-done">
                  <div className="step-circle">✓</div>
                  <div className="step-body">
                    <strong>Cấp 1: Trưởng phòng Kho vận</strong>
                    <small>Đã phê duyệt ngân sách vật tư · 08:30</small>
                  </div>
                </div>

                <div className="approval-step is-current">
                  <div className="step-circle">2</div>
                  <div className="step-body">
                    <strong>Cấp 2: Kế toán trưởng</strong>
                    <small>Đang đối chiếu chứng từ hóa đơn VAT</small>
                  </div>
                </div>

                <div className="approval-step is-pending">
                  <div className="step-circle">3</div>
                  <div className="step-body">
                    <strong>Cấp 3: Ban Giám đốc điều hành</strong>
                    <small>Ký duyệt lệnh chi chuyển khoản ngân hàng</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          <span className="showcase-caption-note">
            {project.badgeText}
          </span>
        </div>
      )

    case 'chips-task':
      return (
        /* Khung trình diễn sản phẩm thực tế Chips Task */
        <div className="showcase-visual-container">
          {/* Băng keo dán góc tư liệu lên trang giấy */}
          <div className="specimen-corner-tape tape-top-left" aria-hidden="true" />
          <div className="specimen-corner-tape tape-top-right" aria-hidden="true" />

          <div className="showcase-tabs-bar">
            {/* Tab 1: Bảng Kanban Sprint */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view1' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view1')}
            >
              <span>Bảng Sprint Kanban</span>
            </button>

            {/* Tab 2: Chi tiết thẻ công việc */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view2' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view2')}
            >
              <span>Chi tiết thẻ task & Checklist</span>
            </button>
          </div>

          {activeTab === 'view1' ? (
            /* View 1: 3 cột Kanban */
            <div className="showcase-view-panel kanban-board-panel">
              <div className="showcase-panel-header">
                <span className="badge-yellow">SPRINT #24 · AGILE PIPELINE</span>
                <span className="status-text-green">● 60 FPS Drag & Drop</span>
              </div>

              <div className="kanban-showcase-columns">
                {/* Cột Backlog */}
                <div className="kanban-showcase-col">
                  <div className="col-head">
                    <span>BACKLOG</span>
                    <span className="count-pill">2</span>
                  </div>
                  <div className="kanban-showcase-card">
                    <p>Socket đồng bộ task realtime</p>
                    <span className="card-tag">FE · P2</span>
                  </div>
                  <div className="kanban-showcase-card">
                    <p>Bộ lọc phân công nhân sự</p>
                    <span className="card-tag">UI · P3</span>
                  </div>
                </div>

                {/* Cột In Progress */}
                <div className="kanban-showcase-col is-active-col">
                  <div className="col-head">
                    <span>IN PROGRESS</span>
                    <span className="count-pill">1</span>
                  </div>
                  <div className="kanban-showcase-card card-highlight">
                    <p>Kéo thả task mượt mà giữa các cột</p>
                    <span className="card-tag tag-active">WIP · P1</span>
                  </div>
                </div>

                {/* Cột Done */}
                <div className="kanban-showcase-col">
                  <div className="col-head">
                    <span>DONE</span>
                    <span className="count-pill">2</span>
                  </div>
                  <div className="kanban-showcase-card is-done">
                    <p>Modal checklist công việc</p>
                    <span className="card-tag tag-done">✓ DONE</span>
                  </div>
                  <div className="kanban-showcase-card is-done">
                    <p>Setup Sprint layout 3 cột</p>
                    <span className="card-tag tag-done">✓ DONE</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: Modal chi tiết Task & Checklist */
            <div className="showcase-view-panel task-modal-panel">
              <div className="showcase-panel-header">
                <span className="badge-yellow">TASK-104 · CHI TIẾT CÔNG VIỆC</span>
                <span className="priority-pill">HIGH PRIORITY</span>
              </div>

              <div className="task-detail-body">
                <h4>[FE] Tối ưu hóa kéo thả Kanban mượt mà</h4>
                <p>Giữ frame rate ổn định 60fps khi kéo thả thẻ có khối lượng nội dung lớn.</p>

                <div className="task-checklist">
                  <span className="checklist-title">Checklist tiến độ (3/4 hoàn thành):</span>
                  <div className="check-item is-checked">
                    <span>☑</span>
                    <span>Khởi tạo DragDropContext và Droppable containers</span>
                  </div>
                  <div className="check-item is-checked">
                    <span>☑</span>
                    <span>Tính toán tọa độ và collision detection tối ưu</span>
                  </div>
                  <div className="check-item is-checked">
                    <span>☑</span>
                    <span>Tránh re-render toàn bộ bảng Kanban khi hover</span>
                  </div>
                  <div className="check-item">
                    <span>☐</span>
                    <span>Hỗ trợ điều hướng bàn phím theo chuẩn WAI-ARIA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <span className="showcase-caption-note">
            {project.badgeText}
          </span>
        </div>
      )

    case 'nsi':
      return (
        /* Khung trình diễn sản phẩm thực tế NSI */
        <div className="showcase-visual-container">
          {/* Băng keo dán góc tư liệu lên trang giấy */}
          <div className="specimen-corner-tape tape-top-left" aria-hidden="true" />
          <div className="specimen-corner-tape tape-top-right" aria-hidden="true" />

          <div className="showcase-tabs-bar">
            {/* Tab 1: Knowledge Center */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view1' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view1')}
            >
              <span>Knowledge Center</span>
            </button>

            {/* Tab 2: CMS Biên tập viên */}
            <button
              type="button"
              className={`showcase-tab-btn ${activeTab === 'view2' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('view2')}
            >
              <span>CMS Quản trị nội dung</span>
            </button>
          </div>

          {activeTab === 'view1' ? (
            /* View 1: Cổng tri thức tài chính */
            <div className="showcase-view-panel nsi-center-panel">
              <div className="showcase-panel-header">
                <span className="badge-yellow">NSI KNOWLEDGE HUB</span>
                <span className="status-text-green">● Chuẩn SEO Semantic</span>
              </div>

              <div className="nsi-article-showcase-grid">
                <div className="nsi-card is-spotlight">
                  <span className="nsi-pill">PHÂN TÍCH KỸ THUẬT</span>
                  <h4>Mô hình nến đảo chiều & Điểm vào lệnh chuẩn xác</h4>
                  <p>Phân tích xác suất thành công của các cụm nến Pinbar và Engulfing.</p>
                </div>
                <div className="nsi-card">
                  <span className="nsi-pill">QUẢN TRỊ RỦI RO</span>
                  <h4>Tỷ lệ Risk / Reward trong hợp đồng phái sinh</h4>
                  <p>Nguyên tắc bảo toàn vốn và thiết lập điểm cắt lỗ tự động.</p>
                </div>
                <div className="nsi-card">
                  <span className="nsi-pill">CƠ BẢN</span>
                  <h4>Đọc hiểu Báo cáo tài chính doanh nghiệp niêm yết</h4>
                  <p>Cách phân tích dòng tiền và đòn bẩy tài chính thực tế.</p>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: CMS Soạn thảo bài viết */
            <div className="showcase-view-panel nsi-cms-panel">
              <div className="showcase-panel-header">
                <span className="badge-yellow">CMS BIÊN TẬP VIÊN #KB-402</span>
                <span className="status-text-green">● Đã xuất bản (Live)</span>
              </div>

              <div className="nsi-cms-form">
                <div className="form-field">
                  <span className="field-label">Tiêu đề bài viết:</span>
                  <div className="field-box">Mô hình nến đảo chiều & Điểm vào lệnh chuẩn xác</div>
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <span className="field-label">Chuyên mục:</span>
                    <div className="field-box">Phân tích kỹ thuật (CKPS)</div>
                  </div>
                  <div className="form-field">
                    <span className="field-label">URL Slug:</span>
                    <div className="field-box">mo-hinh-nen-dao-chieu</div>
                  </div>
                </div>
                <div className="cms-action-bar">
                  <span className="cms-btn">Lưu nháp</span>
                  <span className="cms-btn is-primary">Cập nhật bài viết</span>
                </div>
              </div>
            </div>
          )}

          <span className="showcase-caption-note">
            {project.badgeText}
          </span>
        </div>
      )

    default:
      return null
  }
}

/**
 * Component Popup Lightbox chi tiết dự án kỷ niệm
 * Thiết kế chuẩn bảng đen charcoal & giấy kem, layout 2 cột trên desktop, 1 cột trên mobile.
 * Gồm 3 phần rõ rệt: 01. Nhận diện project -> 02. Sản phẩm thực tế -> 03. Mày đã làm gì.
 */
function MemoryDetailModal({
  projects,
  currentIndex,
  onNavigate,
  onClose,
  t,
}: {
  projects: SupportingProject[]
  currentIndex: number
  onNavigate: (index: number) => void
  onClose: () => void
  t: any
}) {
  const project = projects[currentIndex]
  const highlights = getTechnicalHighlights(project.id)
  const total = projects.length
  const shellRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Kiểm tra tùy chọn giảm chuyển động của hệ điều hành
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Quản lý giai đoạn animation: 'unfolding' (đang bung) -> 'open' (đã mở) -> 'folding' (đang gập co lại)
  const [phase, setPhase] = useState<'unfolding' | 'open' | 'folding'>(() =>
    prefersReducedMotion ? 'open' : 'unfolding'
  )
  const closeTimerRef = useRef<number | null>(null)

  // Xử lý chuyển dự án trước / sau
  const prevIndex = (currentIndex - 1 + total) % total
  const nextIndex = (currentIndex + 1) % total

  // Callback khi Three.js đã bung mở phẳng hoàn toàn (t = 1.0)
  const handleUnfoldComplete = useCallback(() => {
    setPhase('open')
  }, [])

  // Callback khi Three.js đã co gập giấy lại hoàn toàn khi đóng
  const handleCloseComplete = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }
    onClose()
  }, [onClose])

  // Yêu cầu đóng modal có kiểm soát
  const requestClose = useCallback(() => {
    if (phase === 'folding') return
    if (prefersReducedMotion) {
      onClose()
      return
    }
    setPhase('folding')
    // Đặt timer dự phòng (560ms) đề phòng trường hợp tab bị ẩn
    closeTimerRef.current = window.setTimeout(onClose, 560)
  }, [phase, prefersReducedMotion, onClose])

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  // Lắng nghe phím bấm: Esc để đóng, ArrowLeft / ArrowRight để chuyển dự án
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose()
      } else if (e.key === 'ArrowLeft') {
        onNavigate(prevIndex)
      } else if (e.key === 'ArrowRight') {
        onNavigate(nextIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [requestClose, onNavigate, prevIndex, nextIndex])

  return (
    /* Lớp phủ nền mờ backdrop */
    <div
      className={`memory-modal-overlay modal-phase-${phase} ${phase === 'folding' ? 'is-closing' : phase === 'open' ? 'is-open' : 'is-opening'}`}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-modal-title"
    >
      {/* ================================================================
          CANVAS THREE.JS: MÔ PHỎNG CỤC GIẤY VO TRÒN BUNG MỞ 3D CHÂN THỰC
          (Chỉ kích hoạt trong giai đoạn mở 'unfolding' hoặc đóng 'folding',
          tự động unmount khi đã mở hoàn tất để giải phóng tài nguyên WebGL)
          ================================================================ */}
      {!prefersReducedMotion && (phase === 'unfolding' || phase === 'folding') && (
        <PaperUnfoldScene
          targetRef={contentRef}
          shellRef={shellRef}
          isClosing={phase === 'folding'}
          duration={880}
          onComplete={handleUnfoldComplete}
          onCloseComplete={handleCloseComplete}
        />
      )}

      {/* Vỏ bọc vật lý tạo bóng đổ theo mép rách tự nhiên của tờ giấy */}
      <div
        ref={shellRef}
        className="paper-modal-shell"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: phase === 'open' ? 1 : 0,
          pointerEvents: phase === 'open' ? 'auto' : 'none',
          transition: phase === 'folding' ? 'opacity 0.15s ease' : 'none',
        }}
      >
        {/* Miếng băng dán washi cố định mép trên của tờ giấy vào bảng đen */}
        <div
          className="crumpled-paper-washi"
          aria-hidden="true"
        />

        {/* Tờ giấy màu kem/ngà ghi chép đồ án */}
        <div
          ref={contentRef}
          className="memory-modal-content paper-unfold-modal"
        >
          {/* Lớp phủ hiệu ứng nếp nhăn & nếp gấp vật lý của giấy thật */}
          <div
            className="crumpled-paper-creases"
            aria-hidden="true"
          />

          {/* ================================================================
              THANH ĐIỀU HƯỚNG TRÊN CÙNG CỦA POPUP (TOP BAR)
              ================================================================ */}
          <div className="memory-modal-topbar">
            {/* Nhãn định danh kỷ niệm đồ án */}
            <div className="modal-topbar-brand">
              <span className="modal-badge-index">
                KỶ NIỆM ĐỒ ÁN {project.number} / 0{total + 3}
              </span>
            </div>

            {/* Cụm điều khiển chuyển dự án và nút đóng */}
            <div className="modal-topbar-actions">
              {/* Nút lùi về dự án trước */}
              <button
                type="button"
                className="modal-nav-btn prev-btn"
                onClick={() => onNavigate(prevIndex)}
                aria-label={`Xem dự án trước: ${projects[prevIndex].title}`}
                title="Phím tắt: Mũi tên trái (←)"
              >
                <span>← Trước</span>
              </button>

              {/* Nút tiến tới dự án tiếp theo */}
              <button
                type="button"
                className="modal-nav-btn next-btn"
                onClick={() => onNavigate(nextIndex)}
                aria-label={`Xem dự án tiếp theo: ${projects[nextIndex].title}`}
                title="Phím tắt: Mũi tên phải (→)"
              >
                <span>Sau →</span>
              </button>

              {/* Nút đóng popup bằng phấn vẽ tay */}
              <button
                type="button"
                className="memory-modal-close"
                onClick={requestClose}
                aria-label="Đóng bảng chi tiết dự án"
                title="Phím tắt: Esc"
              >
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* ================================================================
              THÂN POPUP: LAYOUT 2 CỘT TRÊN DESKTOP, 1 CỘT TRÊN MOBILE
              ================================================================ */}
          <div className="memory-modal-body-grid">
            {/* CỘT 1: 02. PHẦN CHÍNH — SẢN PHẨM THỰC TẾ (VISUAL SHOWCASE) */}
            <div className="modal-col-visual">
              <div className="col-section-header">
                <span className="col-step-tag">02</span>
                <h4 className="col-heading">SẢN PHẨM THỰC TẾ (DEMO GIAO DIỆN)</h4>
              </div>

              {/* Khung giao diện chi tiết với các góc nhìn tương tác */}
              <ProjectShowcaseVisual project={project} />
            </div>

            {/* CỘT 2: 01. NHẬN DIỆN PROJECT & 03. TÔI ĐÃ LÀM GÌ */}
            <div className="modal-col-content">
              {/* ------------------------------------------------------------
                  01. PHẦN ĐẦU — NHẬN DIỆN PROJECT
                  ------------------------------------------------------------ */}
              <section className="modal-section-identity">
                <div className="col-section-header">
                  <span className="col-step-tag">01</span>
                  <span className="identity-overline">
                    FIG. {project.number} · {project.category.toUpperCase()}
                  </span>
                </div>

                {/* Tên project bằng Serif màu giấy kem */}
                <h3
                  id="memory-modal-title"
                  className="memory-modal-title"
                >
                  {project.title}
                </h3>

                {/* Chữ viết tay cảm xúc bằng font Caveat màu phấn vàng */}
                <span className="hand memory-modal-hand">
                  {getMemoryHandCaption(project.id)}
                </span>

                {/* Huy hiệu vai trò chính xác */}
                <div className="modal-role-pill-wrap">
                  <span className="supporting-role-badge">
                    {project.role}
                  </span>
                </div>

                {/* Một dòng giới thiệu tóm tắt nghiệp vụ */}
                <p className="memory-modal-summary">
                  {project.summary}
                </p>
              </section>

              {/* ------------------------------------------------------------
                  03. PHẦN CUỐI — TÔI ĐÃ LÀM GÌ (FRONTEND & ĐÓNG GÓP)
                  ------------------------------------------------------------ */}
              <section className="modal-section-contributions">
                <div className="col-section-header">
                  <span className="col-step-tag">03</span>
                  <h4 className="col-heading">TÔI ĐÃ LÀM GÌ</h4>
                </div>

                {/* Khối bài toán nghiệp vụ cần giải quyết */}
                <div className="modal-subcard">
                  <span className="subcard-label">Bài toán nghiệp vụ:</span>
                  <p className="subcard-text">{highlights.challenge}</p>
                </div>

                {/* Danh sách phần việc Frontend cụ thể */}
                <div className="supporting-work-list modal-work-list">
                  <span className="supporting-list-label">
                    {t.selectedWorks.frontendHighlightsTitle}
                  </span>
                  <ul>
                    {project.frontendHighlights.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-dash">↳</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Điểm kỹ thuật đáng chú ý */}
                <div className="modal-subcard tech-takeaway-card">
                  <span className="subcard-label">Điểm kỹ thuật đáng chú ý:</span>
                  <p className="subcard-text">{highlights.takeaway}</p>
                </div>

                {/* Stack công nghệ đã xác minh */}
                <div className="modal-stack-wrap">
                  <span className="subcard-label">Stack đã xác minh:</span>
                  <div className="tech-tags modal-tech-tags">
                    {highlights.verifiedStack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ================================================================
              THANH CHÂN TRANG ĐIỀU HƯỚNG NHANH CỦA POPUP (FOOTER)
              ================================================================ */}
          <div className="memory-modal-footer">
            <div className="modal-footer-nav">
              <button
                type="button"
                className="footer-nav-link"
                onClick={() => onNavigate(prevIndex)}
              >
                <span>← {projects[prevIndex].title}</span>
              </button>
              <span className="footer-nav-separator">·</span>
              <button
                type="button"
                className="footer-nav-link"
                onClick={() => onNavigate(nextIndex)}
              >
                <span>{projects[nextIndex].title} →</span>
              </button>
            </div>

            <div className="modal-footer-hint">
              <span className="hand">
                Dùng phím ← / → để lật trang · Esc để quay lại dây treo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Định dạng giây thành chuỗi mốc thời gian m:ss cho thanh ghi chú video
 */
function formatCueTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

/**
 * Component Chapter 03 — Selected Works
 * Trình diễn 3 dự án trọng tâm với video demo, hiệu ứng cuộn landing page,
 * hệ thống ghi chú đồng bộ rõ ràng và 4 dự án bổ trợ dạng Polaroid.
 */
export default function SelectedWorks({
  sceneRef,
  flight,
}: {
  sceneRef: RefObject<HTMLDivElement | null>
  flight: React.ReactNode
}) {
  const { t } = useI18n()

  // Sinh danh sách dự án trọng tâm và bổ trợ đồng bộ với ngôn ngữ hiện tại
  const featuredProjects = getFeaturedProjects(t)
  const supportingProjects = getSupportingProjects(t)

  // Quản lý index trong 3 dự án trọng tâm (0: Chips Bill, 1: Chips Voting, 2: Workflow-Platform)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const currentFeatured = featuredProjects[featuredIndex]

  // Quản lý tham chiếu vùng Chapter 03, khung video và trạng thái phát
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLElement>(null)

  // Annotation đang active và cờ chuyển tab để kích hoạt hiệu ứng vào cảnh
  const [selectedCue, setSelectedCue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [mediaAspect, setMediaAspect] = useState<string>('16 / 9')
  const [tabEntering, setTabEntering] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const hasVideo = Boolean(currentFeatured.videoSrc) && !videoFailed
  const currentAnnotation: VideoAnnotation | undefined =
    currentFeatured.annotations[selectedCue]

  // Kích hoạt hệ thống chuyển động GSAP + ScrollTrigger cho Chapter 03
  useSelectedWorksMotion({
    sectionRef,
    sceneRef,
    stageRef,
    featuredIndex,
    reducedMotion,
  })

  // Lắng nghe tùy chọn giảm chuyển động của hệ điều hành
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) {
        videoRef.current?.pause()
      }
    }
    preference.addEventListener('change', handleChange)
    return () => preference.removeEventListener('change', handleChange)
  }, [])

  // Tự động reset annotation index, video time và kích hoạt hiệu ứng chuyển tab khi đổi dự án
  useEffect(() => {
    // Bước 1: Đặt lại mốc chú thích đầu tiên và trạng thái video
    setSelectedCue(0)
    setVideoFailed(false)
    setIsPlaying(false)
    setMediaAspect('16 / 9')

    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }

    // Bước 2: Kích hoạt nhịp chuyển động vào cảnh nhẹ nhàng kiểu bảng đen (bỏ qua nếu reducedMotion)
    if (reducedMotion) return
    setTabEntering(true)
    const timer = window.setTimeout(() => setTabEntering(false), 520)
    return () => window.clearTimeout(timer)
  }, [featuredIndex, reducedMotion])

  // Điều phối hiệu ứng cuộn landing page:
  // - Bước 1: Quan sát các khối [data-chalk-reveal] để bung hiệu ứng xuất hiện tuần tự khi cuộn tới
  // - Bước 2: Tính toán biến --stage-scroll (0 -> 1) theo vị trí khung video để tạo chiều sâu phối cảnh & nét phấn vẽ khi cuộn
  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const revealNodes = [...sectionEl.querySelectorAll<HTMLElement>('[data-chalk-reveal]')]

    // Nếu người dùng bật giảm chuyển động, hiển thị ngay toàn bộ khối nội dung và khóa tiến trình cuộn ở 1
    if (reducedMotion) {
      revealNodes.forEach((node) => node.classList.add('is-revealed'))
      sceneRef.current?.style.setProperty('--stage-scroll', '1')
      return
    }

    // Bước 1: Thiết lập IntersectionObserver cho từng khối ghi chú, tem 2025 và danh sách cue
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
    )

    revealNodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.96) {
        node.classList.add('is-revealed')
      }
      revealObserver.observe(node)
    })

    // Bước 2: Cập nhật biến CSS --stage-scroll (0 -> 1) theo nhịp cuộn màn hình qua requestAnimationFrame
    let rafId = 0
    const updateScrollChoreography = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const sceneEl = sceneRef.current
        const stageEl = stageRef.current
        if (!sceneEl || !stageEl) return

        const rect = stageEl.getBoundingClientRect()
        const vh = window.innerHeight || 800
        // Tiến trình đi từ lúc cạnh trên video chạm 94% chiều cao màn hình đến khi định vị ổn định ở 32%
        const rawProgress = (vh * 0.94 - rect.top) / (vh * 0.62)
        const stageScroll = Math.min(1, Math.max(0, rawProgress))

        sceneEl.style.setProperty('--stage-scroll', stageScroll.toFixed(4))
      })
    }

    updateScrollChoreography()
    window.addEventListener('scroll', updateScrollChoreography, { passive: true })
    window.addEventListener('resize', updateScrollChoreography)

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateScrollChoreography)
      window.removeEventListener('resize', updateScrollChoreography)
      cancelAnimationFrame(rafId)
    }
  }, [featuredIndex, reducedMotion, sceneRef])

  // Tự động phát video không tiếng khi người dùng cuộn đến khung trình diễn Selected Works
  useEffect(() => {
    if (!hasVideo || !stageRef.current || !videoRef.current) return
    const media = videoRef.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          media.pause()
        } else if (!reducedMotion) {
          media.play().catch(() => setIsPlaying(false))
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [hasVideo, reducedMotion, featuredIndex])

  // Đồng bộ thời gian video với danh sách annotation tương ứng một cách liên tục
  const handleTimeSync = () => {
    if (!videoRef.current) return
    const time = videoRef.current.currentTime
    const annotations = currentFeatured.annotations
    if (!annotations || annotations.length === 0) return

    let matchedIndex = -1
    for (let i = 0; i < annotations.length; i++) {
      const cue = annotations[i]
      const nextCue = annotations[i + 1]
      const end = nextCue ? nextCue.start : (cue.end || 999)
      if (time >= cue.start && time < end) {
        matchedIndex = i
        break
      }
    }
    // Nếu gần hết video hoặc vượt quá, giữ ở mốc cuối cùng
    if (matchedIndex === -1 && time >= annotations[annotations.length - 1].start) {
      matchedIndex = annotations.length - 1
    }

    if (matchedIndex >= 0 && matchedIndex !== selectedCue) {
      setSelectedCue(matchedIndex)
    }
  }

  // Nhảy trực tiếp đến mốc annotation được chọn và đồng bộ thời gian video
  const seekToCue = (index: number) => {
    // Bước 1: Cập nhật mốc ghi chú đang được chọn
    setSelectedCue(index)

    // Bước 2: Tua video tới đúng giây bắt đầu của mốc và tiếp tục phát
    if (videoRef.current && hasVideo) {
      videoRef.current.currentTime = currentFeatured.annotations[index].start
      videoRef.current.play().catch(() => setIsPlaying(false))
    }
  }

  // Điều hướng qua lại giữa các annotation note
  const navigateAnnotation = (direction: number) => {
    const count = currentFeatured.annotations.length
    const nextIndex = (selectedCue + direction + count) % count
    seekToCue(nextIndex)
  }

  // Bật / tắt phát video
  const togglePlayback = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => setIsPlaying(false))
    }
  }

  // Quản lý modal xem chi tiết dự án kỷ niệm Polaroid
  const [activeMemoryIndex, setActiveMemoryIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const memoriesTrackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const hasDraggedRef = useRef(false)

  // Xử lý kéo chuột để cuộn ngang (Mouse drag to scroll)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!memoriesTrackRef.current) return
    setIsDragging(true)
    hasDraggedRef.current = false
    dragStartXRef.current = e.pageX - memoriesTrackRef.current.offsetLeft
    dragStartScrollLeftRef.current = memoriesTrackRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !memoriesTrackRef.current) return
    e.preventDefault()
    const x = e.pageX - memoriesTrackRef.current.offsetLeft
    const walk = (x - dragStartXRef.current) * 1.3
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true
    }
    memoriesTrackRef.current.scrollLeft = dragStartScrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Điều hướng cuộn ngang bằng nút mũi tên phấn
  const scrollMemories = (direction: 'left' | 'right') => {
    if (!memoriesTrackRef.current) return
    const scrollOffset = 340
    memoriesTrackRef.current.scrollBy({
      left: direction === 'left' ? -scrollOffset : scrollOffset,
      behavior: 'smooth',
    })
  }

  // Xử lý click mở modal xem chi tiết kỹ thuật
  const handleMemoryCardClick = (idx: number) => {
    if (hasDraggedRef.current) return
    setActiveMemoryIndex(idx)
  }

  // Xử lý đóng modal và khôi phục tiêu điểm bàn phím về đúng vị trí thẻ trên sợi dây
  const handleCloseModal = () => {
    const lastIdx = activeMemoryIndex
    setActiveMemoryIndex(null)
    if (lastIdx !== null && cardRefs.current[lastIdx]) {
      const el = cardRefs.current[lastIdx]
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      el?.focus()
    }
  }

  // Xử lý chuyển dự án tiếp theo / trước đó ngay trong modal
  const handleNavigateModal = (newIdx: number) => {
    setActiveMemoryIndex(newIdx)
    if (cardRefs.current[newIdx]) {
      cardRefs.current[newIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }

  return (
    /* Khối section chính của Chapter 03 */
    <section
      ref={sectionRef}
      id="chapter-3"
      data-chapter
      className="projects chapter selected-works"
    >
      {/* Nhãn chương số 03 với gạch ngang phấn */}
      <div className="chapter-label">
        <span>{t.selectedWorks.chapterNum}</span>
        <i />
        {t.selectedWorks.chapterTitle}
      </div>

      {/* Khối tiêu đề bắt buộc giữ nguyên: Here is how I think. Here is what I build. */}
      <div className="section-heading reveal" data-chalk-reveal>
        <h2>
          {t.selectedWorks.headingMain}
          <br />
          <em>{t.selectedWorks.headingAccent}</em>
        </h2>
        <p>
          {t.selectedWorks.headingSub.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      {/* ================================================================
          1. BA PROJECT TRỌNG TÂM — VIDEO DEMO & CHÚ THÍCH ĐỒNG BỘ
          ================================================================ */}
      <div className="featured-section-intro reveal" data-chalk-reveal>
        <span className="work-overline">{t.selectedWorks.featuredOverline}</span>
        <span className="hand">{t.selectedWorks.featuredIntroHand}</span>
      </div>

      {/* Thanh điều hướng tinh tế giữa 3 dự án trọng tâm */}
      <nav
        className="project-selector-rail reveal"
        data-chalk-reveal
        aria-label="Core featured projects navigation"
      >
        {/* Danh sách các tab dự án trọng tâm */}
        <div className="project-selector-scroll">
          {featuredProjects.map((proj, idx) => (
            <button
              key={proj.id}
              className={`project-tab-btn ${featuredIndex === idx ? 'is-active' : ''}`}
              onClick={() => setFeaturedIndex(idx)}
              aria-current={featuredIndex === idx ? 'true' : undefined}
            >
              <span className="project-tab-num">{proj.number}</span>
              <span className="project-tab-name">{proj.name}</span>
            </button>
          ))}
        </div>

        {/* Nút lùi/tiến dự án nhanh */}
        <div className="project-quick-stepper">
          <button
            onClick={() =>
              setFeaturedIndex(
                (featuredIndex - 1 + featuredProjects.length) % featuredProjects.length
              )
            }
            aria-label={t.common.previousProject}
            className="stepper-arrow"
          >
            ←
          </button>
          <span className="stepper-indicator">
            {currentFeatured.number} / {String(featuredProjects.length).padStart(2, '0')}
          </span>
          <button
            onClick={() =>
              setFeaturedIndex((featuredIndex + 1) % featuredProjects.length)
            }
            aria-label={t.common.nextProject}
            className="stepper-arrow"
          >
            →
          </button>
        </div>
      </nav>

      {/* Khối trình diễn chính cho dự án trọng tâm được chọn */}
      <div
        className={`signature-scene workflow-feature${tabEntering ? ' is-tab-entering' : ''}`}
        ref={sceneRef}
      >
        <article aria-labelledby={`project-title-${currentFeatured.id}`}>
          {/* Header dự án: overline, dấu ấn cá nhân 2025 (nếu có), tên dự án, hand note và tóm tắt */}
          <div className="workflow-heading" data-chalk-reveal>
            {/* Cột trái: vai trò, tem dự án cá nhân, tên dự án và công nghệ */}
            <div className="workflow-identity-col">
              {/* Dấu ấn dự án cá nhân từ đầu năm 2025 tối giản không khung viền rối */}
              {currentFeatured.provenance && (
                <div className="personal-project-stamp">
                  <span className="stamp-star" aria-hidden="true">
                    ✦
                  </span>
                  <span className="stamp-label">
                    {currentFeatured.provenance.badge}
                  </span>
                </div>
              )}

              <span className="work-overline">
                {currentFeatured.number} / {currentFeatured.role.toUpperCase()}
              </span>
              <h3 id={`project-title-${currentFeatured.id}`}>
                {currentFeatured.name}
                <span>.</span>
              </h3>

              {/* Huy hiệu điểm nhấn nổi bật */}
              <div className="project-highlight-chip">
                <span className="highlight-dot" />
                {currentFeatured.highlight}
              </div>

              {/* Danh sách tech stack */}
              <div className="project-tech-badges">
                {currentFeatured.techStack.map((tech, techIdx) => (
                  <span
                    key={tech}
                    className="tech-badge"
                    style={{ transitionDelay: `${techIdx * 45}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Cột phải: chữ viết tay, mốc thời gian cá nhân và mô tả kỹ thuật thực tế */}
            <div className="workflow-summary">
              <span className="hand">{currentFeatured.handNote}</span>

              {/* Nhấn mạnh mốc thời gian khởi tạo dự án cá nhân nếu có */}
              {currentFeatured.provenance && (
                <div className="provenance-period-note">
                  <span className="period-pill">
                    {currentFeatured.provenance.period}
                  </span>
                  <span className="period-caption">
                    {currentFeatured.provenance.caption}
                  </span>
                </div>
              )}

              <p>{currentFeatured.summary}</p>
            </div>
          </div>

          {/* Khung video 16:9 cinematic sạch sẽ, không viền phụ gây rối */}
          <figure
            ref={stageRef}
            className="workflow-demonstration"
            data-chalk-reveal
            aria-label={`${currentFeatured.name} demonstration video`}
          >
            {/* Vùng chứa media tự động khớp tỉ lệ tự nhiên của video */}
            <div
              className="workflow-media"
              style={{ aspectRatio: hasVideo ? mediaAspect : '16 / 9' }}
            >
              {hasVideo ? (
                /* Video thực tế: không controls, tự động căn tỉ lệ tự nhiên, không crop */
                <video
                  ref={videoRef}
                  src={currentFeatured.videoSrc!}
                  poster={currentFeatured.posterSrc ?? undefined}
                  muted
                  playsInline
                  autoPlay
                  loop
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label={`${currentFeatured.name} product demonstration`}
                  aria-describedby="workflow-note"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget
                    if (v.videoWidth && v.videoHeight) {
                      setMediaAspect(`${v.videoWidth} / ${v.videoHeight}`)
                    }
                  }}
                  onTimeUpdate={handleTimeSync}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => {
                    setVideoFailed(true)
                    setIsPlaying(false)
                  }}
                />
              ) : (
                /* Đồ họa storyboard chalkboard minh họa luồng kỹ thuật */
                <ProjectStoryboard
                  project={currentFeatured}
                  selectedAnnotation={selectedCue}
                  demoFootageLabel={t.selectedWorks.archiveViewDemo}
                />
              )}
            </div>

            {/* Chiếc máy bay giấy lướt qua khi scroll */}
            {flight}

            {/* Chú thích kỹ thuật dưới video */}
            <figcaption className="workflow-caption">
              <span>
                FIG. {currentFeatured.number} — {currentFeatured.name.toUpperCase()} {t.selectedWorks.featuredDemonstration}
              </span>
              <span>
                {hasVideo ? 'CINEMATIC VIDEO STREAM' : 'DEMO FOOTAGE READY'}
              </span>
            </figcaption>
          </figure>

          {/* Khối hiển thị ghi chú nổi bật đồng bộ theo thời gian thực */}
          <div className="workflow-notes" data-chalk-reveal>
            {/* Tiêu đề mục ghi chú */}
            <div className="workflow-note-heading">
              <span className="hand">{t.selectedWorks.annotationsHeading}</span>
              <span className="work-overline">
                {t.selectedWorks.annotationsOverline}
              </span>
            </div>

            {/* Nội dung annotation đang hiển thị với độ tương phản cao */}
            <div
              className="workflow-note"
              id="workflow-note"
              aria-live={isPlaying ? 'off' : 'polite'}
              aria-atomic="true"
            >
              {currentAnnotation && (
                <div key={currentAnnotation.id} className="workflow-note-content">
                  {/* Mũi tên phấn vẽ tay thủ công chuẩn mực The Impossible Chalkboard */}
                  <span className="note-pencil" aria-hidden="true">
                    <ChalkBentArrow />
                  </span>

                  {/* Khối chữ nội dung ghi chú */}
                  <div className="workflow-note-copy">
                    {/* Timestamp cue badge gắn liền với video */}
                    {currentAnnotation.cueLabel && (
                      <span className="cue-timestamp-badge">
                        <span className="cue-pulse" />
                        {currentAnnotation.cueLabel}
                      </span>
                    )}
                    <h4>{currentAnnotation.title}</h4>
                    <p>{currentAnnotation.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Nút chuyển đổi qua lại giữa các annotation note */}
            <div
              className="workflow-note-navigation"
              aria-label="Annotation notes navigation"
            >
              <button
                type="button"
                onClick={() => navigateAnnotation(-1)}
                aria-label="Previous feature annotation"
              >
                ←
              </button>
              <span>
                {String(selectedCue + 1).padStart(2, '0')} /{' '}
                {String(currentFeatured.annotations.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => navigateAnnotation(1)}
                aria-label="Next feature annotation"
              >
                →
              </button>
            </div>
          </div>

          {/* Danh sách toàn bộ mốc ghi chú chi tiết theo thời gian video để đọc rõ và bấm tua nhanh */}
          <div
            className="workflow-cue-timeline"
            data-chalk-reveal
            aria-label={t.selectedWorks.timelineCueHint}
          >
            {/* Dòng hướng dẫn mốc ghi chú video */}
            <div className="cue-timeline-header">
              <span className="work-overline">
                {t.selectedWorks.annotationsOverline}
              </span>
              <span className="hand cue-timeline-hint">
                {t.selectedWorks.timelineCueHint}
              </span>
            </div>

            {/* Lưới các mốc ghi chú tương tác dọc theo video */}
            <div
              className={`cue-timeline-grid cue-count-${currentFeatured.annotations.length}`}
            >
              {currentFeatured.annotations.map((ann, idx) => {
                const isActiveCue = idx === selectedCue
                return (
                  <button
                    key={ann.id}
                    type="button"
                    className={`cue-timeline-item${isActiveCue ? ' is-active' : ''}`}
                    style={{ transitionDelay: `${idx * 75}ms` }}
                    onClick={() => seekToCue(idx)}
                    aria-pressed={isActiveCue}
                    aria-label={`${t.selectedWorks.jumpToTimestamp} ${formatCueTime(ann.start)}: ${ann.title}`}
                  >
                    {/* Hàng trên cùng của thẻ ghi chú: số thứ tự và mốc thời gian */}
                    <div className="cue-item-top">
                      <span className="cue-item-index">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="cue-item-time">
                        {formatCueTime(ann.start)} – {formatCueTime(ann.end)}
                      </span>
                    </div>

                    {/* Tiêu đề viết tay ngắn gọn của mốc */}
                    <strong className="cue-item-title">
                      {ann.title}
                    </strong>

                    {/* Mô tả rõ ràng hành động trong đoạn demo */}
                    <p className="cue-item-desc">
                      {ann.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Khối 3 cột ghi dấu ấn dự án cá nhân từ đầu năm 2025 theo phong cách phấn bảng đen */}
          {currentFeatured.provenance && (
            <div className="project-provenance-board" data-chalk-reveal>
              {/* Overline tiêu đề khối dấu ấn cá nhân */}
              <div className="provenance-board-header">
                <span className="work-overline">
                  {t.selectedWorks.provenanceHeading}
                </span>
                <span className="hand provenance-board-hand">
                  {currentFeatured.provenance.period}
                </span>
              </div>

              {/* Ba cột tổng kết mạch lạc nguồn gốc và điểm nhấn tự xây dựng */}
              <div className="provenance-pillars-grid">
                {currentFeatured.provenance.pillars.map((pillar, idx) => (
                  <div
                    key={pillar.label}
                    className="provenance-pillar-item"
                    style={{ transitionDelay: `${idx * 95}ms` }}
                  >
                    <span className="pillar-label">{pillar.label}</span>
                    <h4 className="pillar-title">{pillar.title}</h4>
                    <p className="pillar-detail">{pillar.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chân trang của khu vực featured project */}
          <div className="workflow-footnote" data-chalk-reveal>
            <p>{t.selectedWorks.footnote}</p>

            {/* Nút điều khiển playback nếu có video */}
            {hasVideo ? (
              <button className="workflow-playback" onClick={togglePlayback}>
                {isPlaying ? t.selectedWorks.playbackPause : t.selectedWorks.playbackPlay}{' '}
                <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▷'}</span>
              </button>
            ) : (
              <span className="workflow-awaiting hand">
                {t.selectedWorks.awaitingEvidence}
              </span>
            )}
          </div>
        </article>
      </div>

      {/* ================================================================
          2. NARRATIVE BRIDGE:
          Chuyển cảnh có chủ đích từ 3 project video sang 4 project bổ trợ
          ================================================================ */}
      <div className="story-bridge-connector reveal" aria-hidden="true">
        {/* Đường phấn uốn lượn dẫn lối người xem xuống danh mục bổ trợ */}
        <svg className="bridge-path-svg" viewBox="0 0 800 90" preserveAspectRatio="none">
          <path d="M 400 0 C 400 45, 120 20, 120 75" />
          <path d="M 115 67 L 120 78 L 128 69" />
        </svg>
      </div>

      {/* Tiêu đề dẫn nhập mạch lạc sang 4 project bổ trợ */}
      <div className="more-work-intro reveal">
        <div>
          <span className="work-overline">{t.selectedWorks.bridgeOverline}</span>
          <h4 className="archive-bridge-title">
            {t.selectedWorks.bridgeTitle}
          </h4>
        </div>
        <span className="hand archive-bridge-hand">
          {t.selectedWorks.bridgeHand}
        </span>
      </div>

      {/* ================================================================
          3. BỐN PROJECT BỔ TRỢ — CONCEPT "HANGING PROJECT MEMORIES"
          Những tấm ảnh chụp đồ án dạng Polaroid treo trên sợi dây tự nhiên
          với kẹp gỗ hoài niệm thời học trò. Khám phá dạng cuộn / kéo ngang.
          ================================================================ */}
      <div className="hanging-memories-section reveal">
        {/* Sợi dây treo uốn lượn tự nhiên bắc ngang qua bảng đen */}
        <div className="hanging-clothesline" aria-hidden="true">
          {/* Đinh đồng cố định bên trái */}
          <span className="clothesline-pin pin-left" />

          {/* Đường cong sợi dây thừng mảnh hơi võng */}
          <svg
            className="hanging-string-svg"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 16 Q 300 42, 600 28 T 1200 18"
              className="hanging-string-path"
            />
          </svg>

          {/* Đinh đồng cố định bên phải */}
          <span className="clothesline-pin pin-right" />
        </div>

        {/* Thanh điều hướng và gợi ý tương tác kéo chuột / vuốt */}
        <div className="hanging-memories-controls">
          {/* Gợi ý tương tác bằng chữ viết tay phấn trắng */}
          <div className="memories-drag-hint">
            <span className="hand">
              Những tấm ảnh kỷ niệm đồ án — nhấp vào ảnh để mở chi tiết kỹ thuật
            </span>
          </div>

          {/* Cặp nút mũi tên cuộn nhanh */}
          <div className="memories-stepper-btns">
            {/* Nút lùi về bên trái */}
            <button
              type="button"
              className="memory-step-btn"
              onClick={() => scrollMemories('left')}
              aria-label="Cuộn sang trái"
            >
              <span>
                ←
              </span>
            </button>

            {/* Nút tiến sang bên phải */}
            <button
              type="button"
              className="memory-step-btn"
              onClick={() => scrollMemories('right')}
              aria-label="Cuộn sang phải"
            >
              <span>
                →
              </span>
            </button>
          </div>
        </div>

        {/* Khung cuộn ngang chứa danh sách các tấm ảnh Polaroid */}
        <div
          ref={memoriesTrackRef}
          className={`hanging-memories-track ${isDragging ? 'is-dragging' : ''}`}
          role="region"
          aria-label="Dây treo ảnh đồ án dự án bổ trợ"
          tabIndex={0}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {supportingProjects.map((proj, idx) => (
            /* Tấm ảnh Polaroid kỷ niệm treo trên dây */
            <article
              key={proj.id}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              className={`polaroid-memory-card polaroid-tilt-${idx % 4}`}
              tabIndex={0}
              role="button"
              aria-label={`Mở xem chi tiết đồ án ${proj.title}`}
              onClick={() => handleMemoryCardClick(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveMemoryIndex(idx)
                }
              }}
            >
              {/* Kẹp gỗ tự nhiên ghim ảnh vào sợi dây */}
              <div className="wooden-clothespin" aria-hidden="true">
                {/* Thân kẹp gỗ có rãnh */}
                <div className="clothespin-wood" />

                {/* Vòng lò xo kim loại kẹp giữ */}
                <div className="clothespin-spring" />
              </div>

              {/* Khung ảnh giấy Polaroid cổ điển màu kem */}
              <div className="polaroid-frame">
                {/* Cửa sổ hiển thị ảnh snapshot thực tế của đồ án */}
                <div className="polaroid-photo-window">
                  {/* Mockup UI thực tế thu nhỏ của dự án */}
                  <SupportingProjectSnapshot projectId={proj.id} />

                  {/* Lớp tráng gương bóng mờ tự nhiên của ảnh chụp */}
                  <div className="photo-sheen" aria-hidden="true" />

                  {/* Số thứ tự đồ án dập mờ kiểu ảnh kỷ niệm */}
                  <span className="photo-watermark-num" aria-hidden="true">
                    {proj.number}
                  </span>

                  {/* Nhãn gợi ý xem chi tiết khi rê chuột */}
                  <div className="photo-hover-badge" aria-hidden="true">
                    <span>
                      {t.selectedWorks.archiveViewDemo}
                    </span>
                  </div>
                </div>

                {/* Phần cằm giấy trắng dưới ảnh dành cho chữ viết tay */}
                <div className="polaroid-chin">
                  {/* Lời ghi chú tay thân mật như trong sổ kỷ yếu */}
                  <span className="polaroid-hand-caption">
                    {getMemoryHandCaption(proj.id)}
                  </span>

                  {/* Tiêu đề đồ án trang trọng bằng font Serif */}
                  <h4 className="polaroid-title">
                    {proj.title}
                  </h4>

                  {/* Hàng meta tóm tắt vai trò và năm/thể loại */}
                  <div className="polaroid-meta-row">
                    {/* Mã số và phân loại */}
                    <span className="polaroid-num-badge">
                      {proj.number} / {proj.category}
                    </span>

                    {/* Huy hiệu vai trò rút gọn */}
                    <span className="polaroid-role-badge">
                      {getShortRoleBadge(proj.role)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox modal xem chi tiết kỹ thuật đồ án khi nhấp vào Polaroid */}
      {activeMemoryIndex !== null && (
        <MemoryDetailModal
          projects={supportingProjects}
          currentIndex={activeMemoryIndex}
          onNavigate={handleNavigateModal}
          onClose={handleCloseModal}
          t={t}
        />
      )}

      {/* Lời dẫn chuyển tiếp sang Chapter tiếp theo */}
      <div className="selected-works-ending reveal">
        <span className="hand">{t.contact.thanksNote}</span>
        <a href="#chapter-4">
          {t.common.storyContinues} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
