import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

export default function TopNoticeBar() {
  const router = useRouter()

  // 只首页显示（不影响子页面）
  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setOpen(false)
      setClosing(false)
      setAnimateIn(false)
      return
    }

    // ✅ 每次进入首页都显示（不记忆）
    setOpen(true)
    setClosing(false)
    setAnimateIn(false)
    requestAnimationFrame(() => setAnimateIn(true))
  }, [isHome])

  function close() {
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setAnimateIn(false)
    }, 180)
  }

  if (!open) return null

  return (
    <div className="wq-topbar" role="status" aria-live="polite">
      <div className={`wq-topbar-inner ${animateIn ? 'in' : ''} ${closing ? 'closing' : ''}`}>
        {/* ✅ 桌面端：正常显示；移动端：跑马灯滚动 */}
        <div className="wq-topbar-text">
          <div className="wq-marquee" aria-hidden="false">
            <span className="wq-marquee-inner">
              <strong>📣 提示：</strong>
              本站部署于 Cloudflare，部分网络环境可能出现404加载失败或下载异常；若遇问题，请刷新页面后重试。
              <a className="wq-topbar-link" href="https://qinghub.top/about/" target="_blank" rel="noopener noreferrer">
                关于 ↗
              </a>
            </span>
          </div>
        </div>

        <button className="wq-topbar-close" type="button" onClick={close} aria-label="关闭提示" title="关闭提示">
          ✕
        </button>
      </div>

      <style jsx>{`
        /* 顶部黑条（Hextra-like） */
        .wq-topbar {
          position: sticky;
          top: 0;
          z-index: 60;
          height: 40px;
          background: rgba(0, 0, 0, 0.88);
          color: rgba(255, 255, 255, 0.92);
        }

        .wq-topbar-inner {
          position: relative; /* ✅ 让 X 的 absolute 有定位基准 */
          height: 40px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          /* 动画基座 */
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
          will-change: opacity, transform;
        }

        /* 出现：淡入 */
        .wq-topbar-inner.in compiler {
          opacity: 1;
          transform: translateY(0);
        }
        .wq-topbar-inner.in {
          opacity: 1;
          transform: translateY(0);
        }

        /* 关闭：淡出 */
        .wq-topbar-inner.closing {
          opacity: 0;
          transform: translateY(-6px);
        }

        /* 文本容器（桌面端：省略号） */
        .wq-topbar-text {
          font-size: 13px;
          line-height: 40px;
          text-align: center;
          padding: 0 40px; /* 给右侧 X 留空间 */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .wq-topbar-text strong {
          font-weight: 900;
        }

        .wq-topbar-link {
          margin-left: 8px;
          color: rgba(255, 255, 255, 0.95);
          text-decoration: none;
          font-weight: 800;
        }
        .wq-topbar-link:hover {
          text-decoration: underline;
        }

        .wq-topbar-close {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: transparent;
          color: rgba(255, 255, 255, 0.88);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.15s ease, background 0.15s ease, opacity 0.15s ease;
        }
        .wq-topbar-close:hover {
          transform: translateY(-50%) scale(1.03);
          background: rgba(255, 255, 255, 0.1);
        }

        /* ====== 跑马灯（默认不动：桌面端看不到动画） ====== */
        .wq-marquee {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        .wq-marquee-inner {
          display: inline-block;
          white-space: nowrap;
        }

        /* ✅ 手机端：启用滚动播放（marquee） */
        @media (max-width: 520px) {
          .wq-topbar {
            height: 40px; /* 保持一条细黑条，不换行 */
          }
          .wq-topbar-inner {
            height: 40px;
            padding: 0 12px;
          }

          /* 手机端不需要省略号，改成滚动 */
          .wq-topbar-text {
            font-size: 12.5px;
            line-height: 40px;
            padding: 0 44px 0 10px; /* 右边给 X 留更大空间 */
            text-align: left;
            text-overflow: clip;
          }

          .wq-marquee-inner {
            padding-left: 100%;
            animation: wqMarquee 14s linear infinite;
            will-change: transform;
          }

          @keyframes wqMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        }

        /* ✅ 无动画偏好：禁用滚动 */
        @media (prefers-reduced-motion: reduce) {
          .wq-marquee-inner {
            animation: none !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
