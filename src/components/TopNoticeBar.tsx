import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function TopNoticeBar() {
  const router = useRouter();

  // 只在首页显示（不影响子页面）
  const isHome = useMemo(() => router.pathname === "/", [router.pathname]);

  const [open, setOpen] = useState(false);

  // ✅ 每次进入首页都显示；点 X 仅本次隐藏（刷新/下次访问还会出现）
  useEffect(() => {
    if (!isHome) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [isHome]);

  if (!open) return null;

  return (
    <div className="wq-noticebar" role="status" aria-live="polite">
      <div className="wq-inner">
        <div className="wq-dot" aria-hidden="true" />
        <div className="wq-text">
          <strong>提示：</strong>
          本站部署于Cloudflare，部分网络环境（大陆地区）可能出现加载失败或下载异常。若遇问题，请刷新页面后重试。
        </div>

        <button
          className="wq-close"
          type="button"
          onClick={() => setOpen(false)}
          aria-label="关闭提示"
          title="关闭提示"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        /* ===== 默认（浅色） ===== */
        :global(html) {
          --nb-bg: rgba(255, 255, 255, 0.82);
          --nb-border: rgba(0, 0, 0, 0.10);
          --nb-text: rgba(17, 24, 39, 0.86);
          --nb-muted: rgba(17, 24, 39, 0.62);
          --nb-shadow: 0 10px 30px rgba(0, 0, 0, 0.10);
          --nb-dot: rgba(37, 99, 235, 0.85);
          --nb-dot-ring: rgba(37, 99, 235, 0.14);
          --nb-close-bg: rgba(0, 0, 0, 0.06);
          --nb-close-text: rgba(17, 24, 39, 0.85);
        }

        /* ===== 深色（兼容 html.dark / body.dark） ===== */
        :global(html.dark),
        :global(body.dark) {
          --nb-bg: rgba(24, 24, 27, 0.80);
          --nb-border: rgba(255, 255, 255, 0.12);
          --nb-text: rgba(255, 255, 255, 0.88);
          --nb-muted: rgba(255, 255, 255, 0.66);
          --nb-shadow: 0 14px 50px rgba(0, 0, 0, 0.45);
          --nb-dot: rgba(147, 197, 253, 0.85);
          --nb-dot-ring: rgba(147, 197, 253, 0.16);
          --nb-close-bg: rgba(255, 255, 255, 0.10);
          --nb-close-text: rgba(255, 255, 255, 0.92);
        }

        /* ===== 系统暗色偏好兜底（iOS/Safari 更稳） ===== */
        @media (prefers-color-scheme: dark) {
          :global(html:not(.light):not(.dark)),
          :global(body:not(.light):not(.dark)) {
            --nb-bg: rgba(24, 24, 27, 0.80);
            --nb-border: rgba(255, 255, 255, 0.12);
            --nb-text: rgba(255, 255, 255, 0.88);
            --nb-muted: rgba(255, 255, 255, 0.66);
            --nb-shadow: 0 14px 50px rgba(0, 0, 0, 0.45);
            --nb-dot: rgba(147, 197, 253, 0.85);
            --nb-dot-ring: rgba(147, 197, 253, 0.16);
            --nb-close-bg: rgba(255, 255, 255, 0.10);
            --nb-close-text: rgba(255, 255, 255, 0.92);
          }
        }

        .wq-noticebar {
          position: sticky;
          top: 0;
          z-index: 40;
          padding: 10px 12px;
          /* 轻微毛玻璃感 */
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* 让提示条看起来像“系统通知”悬浮在页面顶端 */
        .wq-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--nb-bg);
          border: 1px solid var(--nb-border);
          box-shadow: var(--nb-shadow);
        }

        .wq-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          margin-top: 6px;
          background: var(--nb-dot);
          box-shadow: 0 0 0 5px var(--nb-dot-ring);
          flex: 0 0 auto;
        }

        .wq-text {
          color: var(--nb-text);
          line-height: 1.55;
          font-size: 13.5px;
        }

        .wq-text strong {
          font-weight: 900;
        }

        .wq-close {
          margin-left: auto;
          flex: 0 0 auto;
          width: 32px;
          height: 32px;
          border-radius: 12px;
          border: 1px solid var(--nb-border);
          background: var(--nb-close-bg);
          color: var(--nb-close-text);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .wq-close:hover {
          transform: scale(1.03);
        }

        @media (max-width: 520px) {
          .wq-inner {
            align-items: center;
          }
          .wq-dot {
            margin-top: 2px;
          }
          .wq-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
