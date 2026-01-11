import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

export default function TopNoticeBar() {
  const router = useRouter()

  // 只在首页显示（不影响子页面）
  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  // ✅ 每次进入首页都显示；点 X 仅本次隐藏（刷新/下次访问还会出现）
  useEffect(() => {
    if (!isHome) {
      setOpen(false)
      setClosing(false)
      setAnimateIn(false)
      return
    }

    // 每次回首页都重新出现，并走“淡入”
    setOpen(true)
    setClosing(false)
    setAnimateIn(false)

    // 下一帧触发淡入（确保 transition 生效）
    requestAnimationFrame(() => {
      setAnimateIn(true)
    })
  }, [isHome])

  function close() {
    // 关闭动画：淡出 + 轻微缩小
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setAnimateIn(false)
    }, 180)
  }

  if (!open) return null

  return (
    <div className="wq-noticebar" role="status" aria-live="polite">
      <div className={`wq-inner ${animateIn ? 'in' : ''} ${closing ? 'closing' : ''}`}>
        <div className="wq-dot" aria-hidden="true" />
        <div className="wq-text">
          <strong>提示：</strong>
          本站部署于Cloudflare，部分网络环境（大陆地区）可能出现加载失败或下载异常；若遇问题，请刷新页面后重试。
        </div>

        <button className="wq-close" type="button" onClick={close} aria-label="关闭提示" title="关闭提示">
          ✕
        </button>
      </div>

      <style jsx>{`
        :global(html) {
          --nb-bg: rgba(255, 255, 255, 0.70);
          --nb-border: rgba(0, 0, 0, 0.06);
          --nb-text: rgba(17, 24, 39, 0.78);
          --nb-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
          --nb-dot: rgba(37, 99, 235, 0.70);
          --nb-dot-ring: rgba(37, 99, 235, 0.10);
          --nb-close-bg: rgba(0, 0, 0, 0.05);
          --nb-close-text: rgba(17, 24, 39, 0.78);
        }

        :global(html.dark),
        :global(body.dark) {
          --nb-bg: rgba(24, 24, 27, 0.62);
          --nb-border: rgba(255, 255, 255, 0.10);
          --nb-text: rgba(255, 255, 255, 0.78);
          --nb-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          --nb-dot: rgba(147, 197, 253, 0.75);
          --nb-dot-ring: rgba(147, 197, 253, 0.12);
          --nb-close-bg: rgba(255, 255, 255, 0.08);
          --nb-close-text: rgba(255, 255, 255, 0.86);
        }

        @media (prefers-color-scheme: dark) {
          :global(html:not(.light):not(.dark)),
          :global(body:not(.light):not(.dark)) {
            --nb-bg: rgba(24, 24, 27, 0.62);
            --nb-border: rgba(255, 255, 255, 0.10);
            --nb-text: rgba(255, 255, 255, 0.78);
            --nb-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            --nb-dot: rgba(147, 197, 253, 0.75);
            --nb-dot-ring: rgba(147, 197, 253, 0.12);
            --nb-close-bg: rgba(255, 255, 255, 0.08);
            --nb-close-text: rgba(255, 255, 255, 0.86);
          }
        }

        /* ✅ 不贴浏览器顶：给一点呼吸感 */
        .wq-noticebar {
          position: sticky;
          top: 8px;
          z-index: 30;
          padding: 0 16px;
          margin-bottom: 10px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* ✅ 和内容区对齐 */
        .wq-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--nb-bg);
          border: 1px solid var(--nb-border);
          box-shadow: var(--nb-shadow);

          /* 入场/退场动画基座 */
          opacity: 0;
          transform: translateY(-2px) scale(0.992);
          transition: opacity 0.22s ease, transform 0.22s ease;
          will-change: opacity, transform;
        }

        /* ✅ 出现：淡入 */
        .wq-inner.in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ✅ 关闭：淡出 + 轻微缩小 + 上移 */
        .wq-inner.closing {
          opacity: 0;
          transform: translateY(-2px) scale(0.985);
        }

        .wq-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--nb-dot);
          box-shadow: 0 0 0 4px var(--nb-dot-ring);
          flex: 0 0 auto;
        }

        .wq-text {
          color: var(--nb-text);
          line-height: 1.55;
          font-size: 13px;
          font-weight: 600;
        }

        .wq-text strong {
          font-weight: 900;
        }

        .wq-close {
          margin-left: auto;
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          border-radius: 12px;
          border: 1px solid var(--nb-border);
          background: var(--nb-close-bg);
          color: var(--nb-close-text);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .wq-close:hover {
          transform: scale(1.03);
          opacity: 0.95;
        }

        @media (max-width: 520px) {
          .wq-noticebar {
            top: 6px;
            padding: 0 12px;
          }
          .wq-inner {
            align-items: flex-start;
          }
          .wq-text {
            font-size: 12.8px;
            font-weight: 600;
          }
        }
      `}</style>
    </div>
  )
}
