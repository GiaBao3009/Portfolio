import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'

/**
 * Props cho component PaperUnfoldScene
 */
export interface PaperUnfoldSceneProps {
  /** Ref trỏ tới phần tử DOM tờ giấy mục tiêu để khớp chính xác kích thước và tọa độ hiển thị */
  targetRef?: RefObject<HTMLElement | null>
  /** Ref trỏ tới vỏ bọc .paper-modal-shell để điều phối opacity xuất hiện liền mạch ở giai đoạn cuối */
  shellRef?: RefObject<HTMLElement | null>
  /** Cờ trạng thái đóng: nếu true, giấy sẽ co rúm lại thành cục giấy */
  isClosing?: boolean
  /** Thời lượng bung mở (ms), mặc định 880ms */
  duration?: number
  /** Callback cập nhật tiến trình mở (0 -> 1) */
  onProgress?: (progress: number) => void
  /** Callback khi giấy đã bung phẳng hoàn toàn */
  onComplete?: () => void
  /** Callback khi giấy đã co lại hoàn toàn và kết thúc đóng */
  onCloseComplete?: () => void
}

/**
 * Hàm sóng tam giác gập nhọn sắc nét (Sharp Triangular Fold)
 * Khác với hàm sin trơn, hàm này tạo các đỉnh gãy góc nhọn đặc trưng của nếp gấp giấy thật.
 */
function sharpTri(x: number): number {
  const frac = x - Math.floor(x)
  return 1.0 - 2.0 * Math.abs(frac - 0.5)
}

/**
 * Hàm Easing tùy biến cho quá trình bung mở tờ giấy
 * Nảy nhanh có quán tính ở giai đoạn đầu (0 -> 0.5), sau đó duy trì chuyển động mở liên tục
 * đến 95% thời lượng và tiếp đất phẳng êm ái tại đúng t = 1.0 (không có đuôi đứng hình).
 */
function paperUnfoldEase(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  // Đường cong Quad Ease-Out lũy thừa 2.15 mang lại cảm giác mở liên tục không bị dừng sớm
  return 1 - Math.pow(1 - c, 2.15)
}

/**
 * Sinh Texture hạt giấy thủ công màu ngà ấm và nếp gấp mờ vi mô bằng Canvas 2D
 * Khớp chính xác 100% với hệ màu và độ sáng của popup DOM (.memory-modal-content)
 */
function createIvoryPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // 1. Nền giấy kem ngà ấm, sáng trong và sạch sẽ:
    // Đồng điệu với nền popup (#faf5e8 kết hợp tâm #fefcf6 sáng trong và quầng #faf5e8 viền mềm)
    const radGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 360)
    radGrad.addColorStop(0.00, '#FFFFFF')
    radGrad.addColorStop(0.35, '#FEFCF6')
    radGrad.addColorStop(0.70, '#FAF5E8')
    radGrad.addColorStop(1.00, '#F5ECE0')
    ctx.fillStyle = radGrad
    ctx.fillRect(0, 0, 512, 512)

    // 2. Hạt xơ giấy thủ công siêu mịn (rất dịu nhẹ, không gây tối hay bẩn màu giấy)
    const imgData = ctx.getImageData(0, 0, 512, 512)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 1.5
      data[i] = Math.min(255, Math.max(0, data[i] + noise))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.95))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.85))
    }
    ctx.putImageData(imgData, 0, 0)

    // 3. Vài nét gân nếp gấp mờ vi mô đồng điệu với CSS linear-gradients
    ctx.strokeStyle = 'rgba(165, 138, 100, 0.035)'
    ctx.lineWidth = 1.0
    ctx.beginPath()
    ctx.moveTo(0, 160)
    ctx.lineTo(512, 360)
    ctx.moveTo(0, 135)
    ctx.lineTo(512, 135)
    ctx.moveTo(0, 350)
    ctx.lineTo(512, 350)
    ctx.stroke()

    // Điểm sáng phản quang nếp gấp nhẹ
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(0, 161)
    ctx.lineTo(512, 361)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

// Bảo vệ WebGL2 context an toàn trên môi trường headless / thiết bị không có hardware shader precision
if (typeof HTMLCanvasElement !== 'undefined') {
  const origGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (type: string, ...args: any[]) {
    const ctx = origGetContext.apply(this, [type, ...args] as any)
    if (ctx && (type === 'webgl2' || type === 'webgl')) {
      const gl = ctx as WebGL2RenderingContext
      if (!gl.getContextAttributes || !gl.getContextAttributes()) {
        gl.getContextAttributes = () => ({
          alpha: true,
          antialias: true,
          depth: true,
          stencil: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          desynchronized: false,
        }) as WebGLContextAttributes
      }
      const origPrecision = gl.getShaderPrecisionFormat?.bind(gl)
      if (origPrecision) {
        gl.getShaderPrecisionFormat = (shaderType: number, precisionType: number) => {
          try {
            const res = origPrecision(shaderType, precisionType)
            if (res && typeof res.precision === 'number' && res.precision > 0) return res
          } catch {
            // ignore
          }
          return { rangeMin: 1, rangeMax: 1, precision: 23 } as WebGLShaderPrecisionFormat
        }
      }

      // Polyfill an toàn cho getParameter để tránh null khi Three.js đọc thông số RENDERER / VENDOR
      const origGetParameter = gl.getParameter?.bind(gl)
      if (origGetParameter) {
        gl.getParameter = (pname: number) => {
          try {
            const val = origGetParameter(pname)
            if (val !== null && val !== undefined) return val
          } catch {
            // ignore
          }
          if (pname === gl.RENDERER) return 'WebKit WebGL'
          if (pname === gl.VENDOR) return 'WebKit'
          if (pname === gl.VERSION) return 'WebGL 2.0 (OpenGL ES 3.0 Chromium)'
          if (pname === gl.SHADING_LANGUAGE_VERSION) return 'WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)'
          if (pname === gl.MAX_TEXTURE_SIZE) return 4096
          if (pname === gl.MAX_CUBE_MAP_TEXTURE_SIZE) return 4096
          if (pname === gl.MAX_VERTEX_ATTRIBS) return 16
          return 0
        }
      }

      // Polyfill getSupportedExtensions để Three.js không đọc .indexOf trên null
      const origGetSupportedExtensions = gl.getSupportedExtensions?.bind(gl)
      if (origGetSupportedExtensions) {
        gl.getSupportedExtensions = () => {
          try {
            const exts = origGetSupportedExtensions()
            if (Array.isArray(exts)) return exts
          } catch {
            // ignore
          }
          return []
        }
      }
    }
    return ctx
  }
}

/**
 * Component Canvas Three.js: Mô phỏng cục giấy ngà vo tròn 3D bung mở chân thực
 * (The Crumpled Ivory Paper Ball to Unfolded Sheet 3D Scene)
 * Được căn chỉnh khớp chính xác 100% kích thước, tỷ lệ và tọa độ với popup DOM thật.
 */
export default function PaperUnfoldScene({
  targetRef,
  shellRef,
  isClosing = false,
  duration = 880,
  onProgress,
  onComplete,
  onCloseComplete,
}: PaperUnfoldSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Lưu trữ các hàm callback và ref trong ref để tránh re-subscribe loop
  const callbacksRef = useRef({ onProgress, onComplete, onCloseComplete })
  useEffect(() => {
    callbacksRef.current = { onProgress, onComplete, onCloseComplete }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Bước 1: Khởi tạo kích thước theo khung nhìn trình duyệt
    let width = window.innerWidth
    let height = window.innerHeight

    let animationFrameId = 0
    let renderer: THREE.WebGLRenderer | null = null
    let geometry: THREE.PlaneGeometry | null = null
    let material: THREE.MeshStandardMaterial | null = null
    let paperTexture: THREE.CanvasTexture | null = null
    let handleResize = () => {}

    try {
      // Đo kích thước và tọa độ thực tế của tờ giấy DOM popup mục tiêu
      const targetEl = targetRef?.current
      const targetRect = targetEl?.getBoundingClientRect()

      // Kích thước hiển thị pixel thực tế của tờ giấy
      const targetWidth = targetEl
        ? targetEl.offsetWidth
        : targetRect
          ? targetRect.width
          : Math.min(width * 0.92, 980)
      const targetHeight = targetEl
        ? targetEl.offsetHeight
        : targetRect
          ? targetRect.height
          : Math.min(height * 0.88, 640)

      // Tọa độ tâm pixel của tờ giấy trên màn hình
      const targetCenterX = targetRect
        ? targetRect.left + targetRect.width / 2
        : width / 2
      const targetCenterY = targetRect
        ? targetRect.top + targetRect.height / 2
        : height / 2

      // Bước 2: Thiết lập Camera Perspective với phép chiếu 1 unit = 1 pixel tại Z = 0
      const scene = new THREE.Scene()
      const cameraDistance = 1200

      // Tính toán vertical FOV sao cho tại khoảng cách cameraDistance,
      // Frustum height tại Z = 0 tương ứng CHÍNH XÁC height (pixels) của khung nhìn
      const vFov = 2 * Math.atan((height / 2) / cameraDistance) * (180 / Math.PI)
      const camera = new THREE.PerspectiveCamera(vFov, width / height, 1, 6000)
      camera.position.set(0, 0, cameraDistance)
      camera.lookAt(0, 0, 0)

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)

      // Bước 3: Thiết lập hệ thống ánh sáng chuẩn mực, hài hòa với độ sáng của giấy DOM
      // Ánh sáng môi trường vàng kem sáng, cân bằng RGB tự nhiên giữ đúng sắc ngà sáng trong
      const ambientLight = new THREE.AmbientLight(0xfffdf7, 1.25)
      scene.add(ambientLight)

      // Nguồn sáng chính xiên góc tạo khối 3D cho các rãnh nếp gấp khi cuộn tròn
      const keyLight = new THREE.DirectionalLight(0xfffcf2, 0.45)
      keyLight.position.set(250, 400, 700)
      scene.add(keyLight)

      // Nguồn sáng phụ cân bằng vùng tối
      const fillLight = new THREE.DirectionalLight(0xf8f5ed, 0.25)
      fillLight.position.set(-250, -200, 500)
      scene.add(fillLight)

      // Bước 4: Tạo Texture và Vật liệu giấy ngà ấm khớp chính xác với nền popup
      paperTexture = createIvoryPaperTexture()
      material = new THREE.MeshStandardMaterial({
        map: paperTexture,
        bumpMap: paperTexture,
        bumpScale: 0.003,
        roughness: 0.88,
        metalness: 0.0,
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0,
      })

      // Bước 5: Khởi tạo Lưới hình học (PlaneGeometry) khớp chính xác pixel với popup
      const segmentsX = 48
      const segmentsY = 36
      geometry = new THREE.PlaneGeometry(targetWidth, targetHeight, segmentsX, segmentsY)
      const vertexCount = geometry.attributes.position.count

      // Mảng lưu tọa độ phẳng (Flat Target) và tọa độ cục giấy vo tròn (Crumpled Ball Source)
      const flatPositions = new Float32Array(vertexCount * 3)
      const crumpledPositions = new Float32Array(vertexCount * 3)
      const posAttr = geometry.attributes.position

      const halfW = targetWidth / 2
      const halfH = targetHeight / 2
      // Bán kính cục giấy tỉ lệ tương ứng với kích thước popup
      const ballRadius = Math.min(targetWidth, targetHeight) * 0.20

      // Bước 6: Tính toán trước toàn bộ đỉnh cho 2 trạng thái
      for (let i = 0; i < vertexCount; i++) {
        const x0 = posAttr.getX(i)
        const y0 = posAttr.getY(i)

        const u = x0 / halfW // [-1, 1]
        const v = y0 / halfH // [-1, 1]

        // 6.1. Tọa độ phẳng với nếp gợn vi mô nhẹ của giấy thật
        const microCrease =
          (ballRadius * 0.035) *
          Math.sin(2.4 * u * 4 + 1.5 * v * 4) * Math.cos(1.8 * u * 4 - 2.2 * v * 4) +
          (ballRadius * 0.015) * Math.sin(5.5 * u * 4) * Math.cos(4.8 * v * 4)
        flatPositions[i * 3] = x0
        flatPositions[i * 3 + 1] = y0
        flatPositions[i * 3 + 2] = microCrease

        // 6.2. Tọa độ 3D khi bị vo tròn thành cục giấy (The 3D Crumpled Ball)
        const rNorm = Math.sqrt(u * u + v * v)
        const alpha = Math.atan2(v, u)

        // Ánh xạ góc cầu xoắn ốc
        const phi = u * Math.PI * 1.25 + 0.3 * Math.sin(3.0 * v) + 0.15 * Math.cos(4.5 * u)
        const theta = v * (Math.PI / 2) * 0.92 + 0.25 * Math.cos(2.8 * u) - 0.18 * Math.sin(3.5 * v)

        // Tạo các nếp gấp gãy góc nhọn bất quy tắc (Sharp Creases)
        const f1 = sharpTri(1.8 * u + 1.4 * v + 0.3) * 0.35
        const f2 = sharpTri(2.2 * u - 1.7 * v - 0.5) * 0.30
        const f3 = sharpTri(3.5 * u + 0.6 * v) * sharpTri(0.5 * u - 3.8 * v) * 0.25
        const w1 = sharpTri(6.2 * u - 4.8 * v + 0.2) * 0.12
        const w2 = sharpTri(9.5 * u + 7.2 * v) * 0.07

        // Hốc lõm co rút do ngón tay vo ép (Cavities)
        const dent1 = -0.32 * Math.max(0, 1.0 - 3.0 * ((u - 0.3) ** 2 + (v + 0.2) ** 2))
        const dent2 = -0.28 * Math.max(0, 1.0 - 3.2 * ((u + 0.4) ** 2 + (v - 0.35) ** 2))
        const dent3 = -0.25 * Math.max(0, 1.0 - 3.5 * (u ** 2 + (v + 0.5) ** 2))

        // Mép và góc giấy nhô ra ngoài (Curled protruding edges)
        const protrude =
          rNorm > 0.65
            ? (rNorm - 0.65) ** 2 * (0.45 * Math.cos(3.0 * alpha) + 0.35 * Math.sin(5.0 * alpha))
            : 0

        // Bán kính cục giấy tại đỉnh
        const R = ballRadius * (0.65 + f1 + f2 + f3 + w1 + w2 + dent1 + dent2 + dent3 + protrude)

        const xc = R * Math.cos(theta) * Math.sin(phi) + ballRadius * (0.14 * Math.sin(3.5 * u) * Math.cos(2.0 * v))
        const yc = R * Math.sin(theta) * 0.88 + ballRadius * (0.12 * Math.cos(4.0 * v) - 0.05)
        const zc = R * Math.cos(theta) * Math.cos(phi) + ballRadius * (0.18 * f1 - 0.1 * f2)

        crumpledPositions[i * 3] = xc
        crumpledPositions[i * 3 + 1] = yc
        crumpledPositions[i * 3 + 2] = zc
      }

      // Gán vị trí khởi tạo ban đầu
      const initPositions = isClosing ? flatPositions : crumpledPositions
      for (let i = 0; i < vertexCount * 3; i++) {
        posAttr.array[i] = initPositions[i]
      }
      posAttr.needsUpdate = true
      geometry.computeVertexNormals()

      // Bước 7: Khởi tạo Mesh và đưa vào Scene
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Bước 8: Render Loop điều phối animation bung mở theo thời gian thực
      let animationFrameId = 0
      const startTime = performance.now()
      const animDuration = isClosing ? 480 : duration
      let hasCompleted = false

      // Tọa độ mục tiêu của tâm popup trên màn hình
      const targetOffsetX = targetCenterX - width / 2
      const targetOffsetY = -(targetCenterY - height / 2)
      mesh.position.set(targetOffsetX, targetOffsetY, 0)

      // Góc nghiêng mục tiêu khớp chính xác với CSS transform: rotate(-0.4deg) trên desktop
      const finalRotationZ = width <= 860 ? 0 : -0.4 * (Math.PI / 180)

      // Hàm truy xuất phần tử vỏ bọc .paper-modal-shell một cách an toàn
      const getShellEl = (): HTMLElement | null => {
        return shellRef?.current || (targetRef?.current?.closest('.paper-modal-shell') as HTMLElement | null)
      }

      // Ban đầu khi bung mở, đảm bảo popup DOM hoàn toàn vô hình (opacity: 0)
      const initShell = getShellEl()
      if (initShell && !isClosing) {
        initShell.style.opacity = '0'
      }

      const render = () => {
        const now = performance.now()
        const elapsed = now - startTime
        const rawProgress = Math.min(1.0, elapsed / animDuration)

        // Tiến trình mở (0 -> 1) hoặc đóng (1 -> 0)
        const t = isClosing ? 1.0 - rawProgress : rawProgress
        const globalEase = paperUnfoldEase(t)

        if (typeof window !== 'undefined') {
          ;(window as any).__paperProgress = t
        }

        callbacksRef.current.onProgress?.(t)

        // Điều phối hiển thị popup DOM liền mạch ở giai đoạn cuối của animation:
        // - Khi t < 0.78: Popup DOM hoàn toàn vô hình (opacity: 0), chỉ thấy cục giấy bung ra.
        // - Khi t >= 0.78: Giấy 3D gần đạt trạng thái phẳng, popup DOM xuất hiện mượt mà khớp vào mặt giấy.
        // - Khi t = 1.0: Popup DOM đạt opacity: 1, Three.js mesh hoàn tất chuyển giao.
        const shellEl = getShellEl()
        if (shellEl && !isClosing) {
          if (t < 0.78) {
            shellEl.style.opacity = '0'
          } else {
            const revealProgress = Math.min(1.0, (t - 0.78) / 0.22)
            shellEl.style.opacity = String(revealProgress)
            if (material) {
              material.opacity = Math.max(0, 1.0 - revealProgress * 0.4)
            }
          }
        }

        // Cập nhật vị trí từng đỉnh theo độ trễ mở từ mép vào tâm
        const positions = posAttr.array as Float32Array
        for (let i = 0; i < vertexCount; i++) {
          const i3 = i * 3
          const x0 = flatPositions[i3]
          const y0 = flatPositions[i3 + 1]
          const u = x0 / halfW
          const v = y0 / halfH
          const dist = Math.sqrt(u * u + v * v) / Math.SQRT2

          // Các góc ngoài bung trước, phần tâm bung sau
          const delay = (1.0 - dist) * 0.18
          const localT = Math.max(0, Math.min(1, (t - delay) / (1.0 - delay)))
          const vertexEase = paperUnfoldEase(localT)

          // Nội suy tọa độ
          const xc = crumpledPositions[i3]
          const yc = crumpledPositions[i3 + 1]
          const zc = crumpledPositions[i3 + 2]

          const xf = flatPositions[i3]
          const yf = flatPositions[i3 + 1]
          const zf = flatPositions[i3 + 2]

          let curX = xc + (xf - xc) * vertexEase
          let curY = yc + (yf - yc) * vertexEase
          let curZ = zc + (zf - zc) * vertexEase

          // Sóng uốn lượn khi mở (Undulating Unroll Wave)
          if (vertexEase > 0.08 && vertexEase < 0.92) {
            const waveAmp = (1.0 - vertexEase) * vertexEase * (ballRadius * 0.65)
            const wave = Math.sin(2.8 * u * Math.PI + (1.0 - vertexEase) * 6.2) * waveAmp
            curZ += wave
          }

          positions[i3] = curX
          positions[i3 + 1] = curY
          positions[i3 + 2] = curZ
        }

        posAttr.needsUpdate = true
        geometry.computeVertexNormals()

        // Xoay 3D nhẹ có quán tính như tờ giấy bung trong không gian
        const rotFactor = 1.0 - globalEase
        mesh.rotation.x = rotFactor * 0.38 * Math.cos(globalEase * Math.PI)
        mesh.rotation.y = rotFactor * -0.52 * Math.sin(globalEase * Math.PI)
        mesh.rotation.z = rotFactor * 0.22 + finalRotationZ

        // Thu phóng từ cục nhỏ thành tờ giấy đầy đủ khớp chuẩn 1.0
        const baseScale = isClosing ? 1.0 : 0.88 + 0.12 * globalEase
        mesh.scale.set(baseScale, baseScale, baseScale)

        renderer.render(scene, camera)

        // Kiểm tra khi hoàn thành tiến trình
        if (rawProgress >= 1.0) {
          if (!hasCompleted) {
            hasCompleted = true
            if (shellEl && !isClosing) {
              shellEl.style.opacity = '1'
            }
            if (isClosing) {
              callbacksRef.current.onCloseComplete?.()
            } else {
              callbacksRef.current.onComplete?.()
            }
          }
        } else {
          animationFrameId = requestAnimationFrame(render)
        }
      }

      animationFrameId = requestAnimationFrame(render)

      // Bước 9: Xử lý thay đổi kích thước màn hình
      handleResize = () => {
        width = window.innerWidth
        height = window.innerHeight
        const newVfov = 2 * Math.atan((height / 2) / cameraDistance) * (180 / Math.PI)
        camera.fov = newVfov
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer?.setSize(width, height)
      }
      window.addEventListener('resize', handleResize)

      // Bước 10: Dọn dẹp tài nguyên WebGL triệt để khi component unmount
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        window.removeEventListener('resize', handleResize)

        geometry?.dispose()
        material?.dispose()
        paperTexture?.dispose()
        renderer?.dispose()
      }
    } catch (err) {
      console.warn('PaperUnfoldScene encountered an error, falling back:', err)
      callbacksRef.current.onComplete?.()
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [targetRef, isClosing, duration])

  return (
    /* Khung canvas WebGL bao phủ toàn màn hình với pointer-events none */
    <canvas
      ref={canvasRef}
      className="paper-unfold-canvas"
      aria-hidden="true"
    />
  )
}
