import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

/** =========================
 * ✅ 可改：访问密码（改这里）
 * ========================= */
const PASSWORD = 'wang176176'

/** =========================
 * ✅ 可改：协议/说明链接（改这里）
 * ========================= */
const AGREEMENT_URL = 'https://qinghub.top/about/'

/** =========================
 * ✅ 可改：返回主页跳转（改这里）
 * 你现在写的是跳回博客主页；如果想返回 OneDrive 站点首页，就改成你需要的地址
 * ========================= */
const CANCEL_URL = 'https://qinghub.top'

/** =========================
 * ✅ 可改：弹窗文案（改这里）
 * ========================= */
const COPY = {
  title: '访问验证',
  sub: '本页面内容受保护。请输入密码并确认后继续访问。',
  noticeStrong: "您即将访问 WangQing's OneDrive 文件存储站点，站内包含文件、视频等资源。",
  noticeMutedPrefix: '访问与下载仅供学习与参考。继续访问前，请先阅读并理解本站的',
  noticeLinkText: '《关于》页面',
  agreeText: '我已阅读并理解上述《关于》，并自愿继续访问',
  placeholder: '请输入访问密码',
  err: '密码错误，请重试。',
  btnBack: '返回主页',
  btnOk: '确认访问',
}

export default function AccessGate() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState(false)
  const [agree, setAgree] = useState(false)

  // ✅ 震动状态：用 class 反复触发（最稳）
  const [shakeOn, setShakeOn] = useState(false)

  // ✅ 方案A：会话内不重复弹（关闭标签页/浏览器后再弹）
  const SESSION_KEY = 'wq_access_gate_ok_session_v1'

  // ✅ 只在首页弹窗（不影响任何子页面）
  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  useEffect(() => {
    if (!isHome) {
      setOpen(false)
      return
    }

    // ✅ 会话内已通过就不再弹
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        setOpen(false)
        return
      }
    } catch (_) {}

    setPwd('')
    setErr(false)
    setShowPwd(false)
    setAgree(false)
    setShakeOn(false)
    setOpen(true)

    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [isHome])

  function cancel() {
    window.location.href = CANCEL_URL
  }

  function shake() {
    // ✅ 每次都能重播动画
    setShakeOn(false)
    requestAnimationFrame(() => {
      setShakeOn(true)
      window.setTimeout(() => setShakeOn(false), 260)
    })
  }

  function ok() {
    if (!agree) {
      shake()
      return
    }
    if (pwd.trim() === PASSWORD) {
      setErr(false)
      setOpen(false)
      document.documentElement.style.overflow = ''

      // ✅ 记忆到会话：当前标签页/窗口内不再弹
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch (_) {}
    } else {
      setErr(true)
      shake()
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancel()
      if (e.key === 'Enter') ok()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pwd, agree])

  if (!open) return null

  const canConfirm = agree && pwd.trim().length > 0

  return (
    <>
      <div
        className="wq-mask"
        role="dialog"
        aria-modal="true"
        aria-label={COPY.title}
        // ✅ 未勾选时，点遮罩空白也抖一下（桌面端）
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !agree) shake()
        }}
        // ✅ 未勾选时，点遮罩空白也抖一下（移动端/iOS）
        onTouchStart={(e) => {
          if (e.target === e.currentTarget && !agree) shake()
        }}
      >
        <div className={`wq-card ${shakeOn ? 'wq-shake' : ''}`}>
          <div className="wq-head">
            <div className="wq-icon">🔒</div>
            <div className="wq-headtext">
              <div className="wq-title">{COPY.title}</div>
              <div className="wq-sub">{COPY.sub}</div>
            </div>
          </div>

          <div className="wq-body">
            <div className="wq-notice">
              <p>
                <strong>{COPY.noticeStrong}</strong>
              </p>
              <p className="muted">
                {COPY.noticeMutedPrefix}
                <a href={AGREEMENT_URL} target="_blank" rel="noopener noreferrer">
                  {COPY.noticeLinkText}
                </a>
                。
              </p>
            </div>

            <label className="wq-agree">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>{COPY.agreeText}</span>
            </label>

            <div className="wq-inputwrap">
              <input
                className="wq-input"
                type={showPwd ? 'text' : 'password'}
                placeholder={COPY.placeholder}
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value)
                  setErr(false)
                }}
                autoFocus
                inputMode="text"
                // ✅ iOS 防“输入自动放大”：确保字体 >= 16px（关键）
              />
              <button
                className="wq-eye"
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? '隐藏密码' : '显示密码'}
                title={showPwd ? '隐藏密码' : '显示密码'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>

            {err && <div className="wq-err">{COPY.err}</div>}
          </div>

          <div className="wq-actions">
            <button className="wq-btn ghost" type="button" onClick={cancel}>
              {COPY.btnBack}
            </button>
            <button
              className="wq-btn primary"
              type="button"
              onClick={ok}
              disabled={!canConfirm}
              aria-disabled={!canConfirm}
              title={!agree ? '请先勾选“我已阅读并理解”' : '请输入密码'}
            >
              {COPY.btnOk}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===================== 颜色变量（默认浅色） ===================== */
        :global(html) {
          --mask: rgba(0, 0, 0, 0.38);
          --card: rgba(255, 255, 255, 0.72); /* ✅ 更接近你博客弹窗：更通透 */
          --border: rgba(0, 0, 0, 0.10);
          --text: rgba(17, 24, 39, 0.95);
          --muted: rgba(17, 24, 39, 0.62);

          --shadow: 0 26px 70px rgba(0, 0, 0, 0.18);
          --focus: rgba(37, 99, 235, 0.12);
          --link: #2563eb;

          --btn: rgba(0, 0, 0, 0.06);
          --btnText: rgba(17, 24, 39, 0.92);
          --primaryBg: #111827;
          --primaryText: #fff;

          --cardHeadBg: rgba(255, 255, 255, 0.14);
          --agreeBg: rgba(255, 255, 255, 0.10);
          --inputBg: rgba(255, 255, 255, 0.55);
        }

        /* ===================== 深色模式：兼容 html.dark / body.dark / 系统深色 ===================== */
        :global(html.dark),
        :global(body.dark) {
          --mask: rgba(0, 0, 0, 0.62);
          --card: rgba(24, 24, 27, 0.74); /* ✅ 更通透一点 */
          --border: rgba(255, 255, 255, 0.12);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.66);

          --shadow: 0 28px 90px rgba(0, 0, 0, 0.45);
          --focus: rgba(147, 197, 253, 0.12);
          --link: #7aa2ff;

          --btn: rgba(255, 255, 255, 0.08);
          --btnText: rgba(255, 255, 255, 0.92);
          --primaryBg: rgba(255, 255, 255, 0.92);
          --primaryText: rgba(0, 0, 0, 0.88);

          --cardHeadBg: rgba(255, 255, 255, 0.04);
          --agreeBg: rgba(255, 255, 255, 0.06);
          --inputBg: rgba(255, 255, 255, 0.06);
        }

        @media (prefers-color-scheme: dark) {
          :global(html:not(.light):not(.dark)),
          :global(body:not(.light):not(.dark)) {
            --mask: rgba(0, 0, 0, 0.62);
            --card: rgba(24, 24, 27, 0.74);
            --border: rgba(255, 255, 255, 0.12);
            --text: rgba(255, 255, 255, 0.92);
            --muted: rgba(255, 255, 255, 0.66);
            --shadow: 0 28px 90px rgba(0, 0, 0, 0.45);
            --focus: rgba(147, 197, 253, 0.12);
            --link: #7aa2ff;
            --btn: rgba(255, 255, 255, 0.08);
            --btnText: rgba(255, 255, 255, 0.92);
            --primaryBg: rgba(255, 255, 255, 0.92);
            --primaryText: rgba(0, 0, 0, 0.88);
            --cardHeadBg: rgba(255, 255, 255, 0.04);
            --agreeBg: rgba(255, 255, 255, 0.06);
            --inputBg: rgba(255, 255, 255, 0.06);
          }
        }

        /* ===================== 轻微震动（更弱） ===================== */
        @keyframes wq-shake {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-3px);
          }
          40% {
            transform: translateX(3px);
          }
          60% {
            transform: translateX(-2px);
          }
          80% {
            transform: translateX(2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .wq-shake {
          animation: wq-shake 0.24s ease;
        }

        /* ===================== 遮罩 ===================== */
        .wq-mask {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: var(--mask);
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
        }

        /* ===================== 卡片（✅ 手机端更小） ===================== */
        .wq-card {
          width: min(680px, 100%);
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        /* 头部 */
        .wq-head {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px 16px 12px;
          border-bottom: 1px solid var(--border);
          background: var(--cardHeadBg);
        }

        .wq-icon {
          width: 42px;
          height: 42px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.28);
          font-size: 18px;
          flex: 0 0 auto;
        }
        :global(html.dark) .wq-icon,
        :global(body.dark) .wq-icon {
          background: rgba(255, 255, 255, 0.08);
        }

        .wq-title {
          font-weight: 900;
          font-size: 16px;
          color: var(--text);
          letter-spacing: 0.2px;
        }
        .wq-sub {
          margin-top: 3px;
          font-size: 13px;
          color: var(--muted);
        }

        /* 内容 */
        .wq-body {
          padding: 12px 16px 14px;
          color: var(--text);
          line-height: 1.75;
          font-size: 14px;
        }

        .wq-notice p {
          margin: 8px 0;
        }
        .muted {
          color: var(--muted);
          font-size: 13px;
        }

        .wq-notice a {
          color: var(--link);
          font-weight: 800;
          text-decoration: none;
          margin: 0 4px;
        }
        .wq-notice a:hover {
          text-decoration: underline;
        }

        .wq-agree {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: 12px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--agreeBg);
          user-select: none;
        }
        .wq-agree input {
          margin-top: 3px;
          width: 16px;
          height: 16px;
          accent-color: var(--link);
          flex: 0 0 auto;
        }
        .wq-agree span {
          color: var(--text);
          font-size: 13.5px;
          line-height: 1.6;
        }

        .wq-inputwrap {
          margin-top: 12px;
          position: relative;
        }

        .wq-input {
          width: 100%;
          padding: 12px 46px 12px 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--inputBg);
          color: var(--text);
          outline: none;

          /* ✅ iOS 防缩放关键：>=16px */
          font-size: 16px;
        }

        .wq-input:focus {
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 0 0 0 4px var(--focus);
        }

        .wq-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          cursor: pointer;
        }

        .wq-err {
          margin-top: 10px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 800;
        }
        :global(html.dark) .wq-err,
        :global(body.dark) .wq-err {
          color: #fca5a5;
        }

        /* 按钮区 */
        .wq-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 16px 16px;
          border-top: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.18);
        }
        :global(html.dark) .wq-actions,
        :global(body.dark) .wq-actions {
          background: rgba(255, 255, 255, 0.03);
        }

        .wq-btn {
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          font-size: 13.5px;
          cursor: pointer;
          border: 1px solid var(--border);
        }

        .wq-btn.ghost {
          background: var(--btn);
          color: var(--btnText);
        }

        .wq-btn.primary {
          background: var(--primaryBg);
          color: var(--primaryText);
          border-color: transparent;
        }

        .wq-btn.primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ✅ 手机端：弹窗更“小卡片化”，不会占满屏 */
        @media (max-width: 520px) {
          .wq-mask {
            padding: 14px;
          }
          .wq-card {
            width: min(520px, 100%);
            border-radius: 16px;
          }
          .wq-head {
            padding: 14px 14px 10px;
          }
          .wq-body {
            padding: 10px 14px 12px;
            font-size: 13.5px;
          }
          .wq-actions {
            padding: 12px 14px 14px;
            flex-direction: column;
          }
          .wq-btn {
            width: 100%;
          }
        }

        /* ✅ 额外保险：防 iOS 自动调大字体（不影响桌面） */
        :global(html),
        :global(body) {
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
      `}</style>
    </>
  )
}