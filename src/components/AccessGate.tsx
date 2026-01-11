import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const PASSWORD = 'wang176176'
const AGREEMENT_URL = 'https://qinghub.top/about/'

// ✅ 会话内不重复弹（关闭标签页才重新弹）
const SESSION_KEY = 'wq_onedrive_gate_authed_v1'

export default function AccessGate() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState(false)
  const [agree, setAgree] = useState(false)

  // ✅ 震动状态（最稳）
  const [shakeOn, setShakeOn] = useState(false)

  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  useEffect(() => {
    if (!isHome) {
      setOpen(false)
      return
    }

    // ✅ 会话内已验证：不再弹
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1') {
      setOpen(false)
      return
    }

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
    window.location.href = 'https://qinghub.top'
  }

  function shake() {
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
      // ✅ 写入会话：本标签页本次会话内不再弹
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch (e) {}

      setErr(false)
      setOpen(false)
      document.documentElement.style.overflow = ''
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
        aria-label="访问验证"
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
              <div className="wq-title">访问验证</div>
              <div className="wq-sub">本页面内容受保护。请输入密码并确认后继续访问。</div>
            </div>
          </div>

          <div className="wq-body">
            <div className="wq-notice">
              <p>
                您即将访问 <strong>WangQing&apos;s OneDrive</strong> 文件存储站点，站内包含文件、视频等资源。
              </p>
              <p className="muted">
                访问与下载仅供学习与参考。继续访问前，请先阅读并理解本站的
                <a href={AGREEMENT_URL} target="_blank" rel="noopener noreferrer">
                  《关于》页面
                </a>
                。
              </p>
            </div>

            <label className="wq-agree">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>我已阅读并理解上述《关于》，并自愿继续访问</span>
            </label>

            <div className="wq-inputwrap">
              <input
                className="wq-input"
                type={showPwd ? 'text' : 'password'}
                placeholder="请输入访问密码"
                value={pwd}
                onChange={e => {
                  setPwd(e.target.value)
                  setErr(false)
                }}
                autoFocus
              />
              <button
                className="wq-eye"
                type="button"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? '隐藏密码' : '显示密码'}
                title={showPwd ? '隐藏密码' : '显示密码'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>

            {err && <div className="wq-err">密码错误，请重试。</div>}
          </div>

          <div className="wq-actions">
            <button className="wq-btn ghost" type="button" onClick={cancel}>
              返回主页
            </button>
            <button
              className="wq-btn primary"
              type="button"
              onClick={ok}
              disabled={!canConfirm}
              aria-disabled={!canConfirm}
              title={!agree ? '请先勾选“我已阅读并理解”' : '请输入密码'}
            >
              确认访问
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===================== 颜色变量（默认浅色） ===================== */
        :global(html) {
          --mask: rgba(0, 0, 0, 0.45);
          --card: rgba(255, 255, 255, 0.86);
          --border: rgba(0, 0, 0, 0.10);
          --text: rgba(17, 24, 39, 0.95);
          --muted: rgba(17, 24, 39, 0.62);
          --shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
          --focus: rgba(37, 99, 235, 0.12);
          --link: #2563eb;
          --btn: rgba(0, 0, 0, 0.06);
          --btnText: rgba(17, 24, 39, 0.92);
          --primaryBg: #111827;
          --primaryText: #fff;
          --cardHeadBg: rgba(255, 255, 255, 0.16);
          --agreeBg: rgba(255, 255, 255, 0.10);
          --inputBg: rgba(255, 255, 255, 0.55);
        }

        /* ===================== 深色模式：三种情况都兼容 ===================== */
        :global(html.dark),
        :global(body.dark) {
          --mask: rgba(0, 0, 0, 0.62);
          --card: rgba(24, 24, 27, 0.82);
          --border: rgba(255, 255, 255, 0.10);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.66);
          --shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
          --focus: rgba(147, 197, 253, 0.12);
          --link: #7aa2ff;
          --btn: rgba(255, 255, 255, 0.08);
          --btnText: rgba(255, 255, 255, 0.92);
          --primaryBg: rgba(255, 255, 255, 0.92);
          --primaryText: rgba(0, 0, 0, 0.88);
          --cardHeadBg: rgba(255, 255, 255, 0.04);
          --agreeBg: rgba(255, 255, 255, 0.05);
          --inputBg: rgba(255, 255, 255, 0.06);
        }

        /* 兼容：如果项目没加 .dark，但系统是深色 */
        @media (prefers-color-scheme: dark) {
          :global(html:not(.light):not(.dark)),
          :global(body:not(.light):not(.dark)) {
            --mask: rgba(0, 0, 0, 0.62);
            --card: rgba(24, 24, 27, 0.82);
            --border: rgba(255, 255, 255, 0.10);
            --text: rgba(255, 255, 255, 0.92);
            --muted: rgba(255, 255, 255, 0.66);
            --shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
            --focus: rgba(147, 197, 253, 0.12);
            --link: #7aa2ff;
            --btn: rgba(255, 255, 255, 0.08);
            --btnText: rgba(255, 255, 255, 0.92);
            --primaryBg: rgba(255, 255, 255, 0.92);
            --primaryText: rgba(0, 0, 0, 0.88);
            --cardHeadBg: rgba(255, 255, 255, 0.04);
            --agreeBg: rgba(255, 255, 255, 0.05);
            --inputBg: rgba(255, 255, 255, 0.06);
          }
        }

        /* ===================== 轻微震动（更弱、更克制） ===================== */
        @keyframes wq-shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
        .wq-shake {
          animation: wq-shake .22s ease;
        }

        /* ===================== 布局样式（保持你原 UI） ===================== */
        .wq-mask {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: var(--mask);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .wq-card {
          width: min(720px, 100%);
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .wq-head {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 18px 18px 12px;
          border-bottom: 1px solid var(--border);
          background: var(--cardHeadBg);
        }

        .wq-icon {
          width: 44px;
          height: 44px;
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

        .wq-body {
          padding: 14px 18px 14px;
          color: var(--text);
          line-height: 1.75;
          font-size: 14px;
        }

        .wq-notice p { margin: 8px 0; }
        .muted { color: var(--muted); font-size: 13px; }

        .wq-notice a {
          color: var(--link);
          font-weight: 800;
          text-decoration: none;
          margin: 0 4px;
        }
        .wq-notice a:hover { text-decoration: underline; }

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
          margin-top: 14px;
          position: relative;
        }

        .wq-input {
          width: 100%;
          padding: 12px 44px 12px 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--inputBg);
          color: var(--text);
          outline: none;
          font-size: 14px;
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

        .wq-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px 18px;
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

        @media (max-width: 520px) {
          .wq-actions { flex-direction: column; }
          .wq-btn { width: 100%; }
          .wq-card { width: min(720px, 100%); }
        }
      `}</style>
    </>
  )
}
