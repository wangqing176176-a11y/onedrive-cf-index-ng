import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

const PASSWORD = 'wang176176' // ← 改密码改这里

export default function AccessGate() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState(false)

  // ✅ 只在“首页路由 /”弹窗
  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  useEffect(() => {
    if (!isHome) {
      setOpen(false)
      return
    }
    // 每次进入首页都弹（不记忆）
    setPwd('')
    setErr(false)
    setShowPwd(false)
    setOpen(true)

    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [isHome])

  function cancel() {
    // 取消访问：跳到拒绝访问页（你可以保留 /denied）
    window.location.href = '/denied'
  }

  function ok() {
    if (pwd.trim() === PASSWORD) {
      setErr(false)
      setOpen(false)
      document.documentElement.style.overflow = ''
    } else {
      setErr(true)
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
  }, [open, pwd])

  if (!open) return null

  return (
    <>
      <div className="wq-mask" role="dialog" aria-modal="true" aria-label="访问验证">
        <div className="wq-card">
          <div className="wq-top">
            <div className="wq-title">
              <span className="wq-badge">🔒</span>
              <div>
                <div className="wq-h1">访问提示</div>
                <div className="wq-h2">仅首页显示 · 每次访问都会验证</div>
              </div>
            </div>
          </div>

          <div className="wq-body">
            <p>
              您即将访问 <strong>WangQing&apos;s OneDrive</strong> 文件站点，站内包含文件与视频资源。
            </p>
            <p className="wq-muted">
              访问与下载仅供学习与参考。继续访问即表示您已阅读并同意相关说明与约定。
            </p>

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
              取消访问
            </button>
            <button className="wq-btn primary" type="button" onClick={ok}>
              验证并进入
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(html) {
          --wq-mask: rgba(0, 0, 0, 0.45);
          --wq-card: rgba(255, 255, 255, 0.82);
          --wq-border: rgba(0, 0, 0, 0.1);
          --wq-text: rgba(17, 24, 39, 0.95);
          --wq-muted: rgba(17, 24, 39, 0.62);
          --wq-primary: #2563eb;
          --wq-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
        }
        :global(html.dark) {
          --wq-mask: rgba(0, 0, 0, 0.62);
          --wq-card: rgba(24, 24, 27, 0.78);
          --wq-border: rgba(255, 255, 255, 0.1);
          --wq-text: rgba(255, 255, 255, 0.92);
          --wq-muted: rgba(255, 255, 255, 0.66);
          --wq-primary: #7aa2ff;
          --wq-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
        }
        .wq-mask {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background: var(--wq-mask);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .wq-card {
          width: min(560px, 100%);
          border: 1px solid var(--wq-border);
          border-radius: 18px;
          background: var(--wq-card);
          box-shadow: var(--wq-shadow);
          overflow: hidden;
        }
        .wq-top {
          padding: 18px 18px 10px;
        }
        .wq-title {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .wq-badge {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          border: 1px solid var(--wq-border);
          background: rgba(255, 255, 255, 0.35);
        }
        :global(html.dark) .wq-badge {
          background: rgba(255, 255, 255, 0.08);
        }
        .wq-h1 {
          font-weight: 800;
          font-size: 16px;
          color: var(--wq-text);
        }
        .wq-h2 {
          margin-top: 2px;
          font-size: 12.5px;
          color: var(--wq-muted);
        }
        .wq-body {
          padding: 0 18px 14px;
          color: var(--wq-text);
          font-size: 14px;
          line-height: 1.75;
        }
        .wq-muted {
          color: var(--wq-muted);
          font-size: 13px;
          margin-top: 8px;
        }
        .wq-inputwrap {
          margin-top: 14px;
          position: relative;
        }
        .wq-input {
          width: 100%;
          padding: 10px 44px 10px 12px;
          border-radius: 14px;
          border: 1px solid var(--wq-border);
          background: rgba(255, 255, 255, 0.55);
          color: var(--wq-text);
          outline: none;
          font-size: 14px;
        }
        :global(html.dark) .wq-input {
          background: rgba(255, 255, 255, 0.06);
        }
        .wq-input:focus {
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }
        .wq-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 12px;
          border: 1px solid var(--wq-border);
          background: transparent;
          color: var(--wq-text);
          cursor: pointer;
        }
        .wq-err {
          margin-top: 10px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 700;
        }
        .wq-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px 18px;
          border-top: 1px solid var(--wq-border);
          background: rgba(255, 255, 255, 0.22);
        }
        :global(html.dark) .wq-actions {
          background: rgba(255, 255, 255, 0.03);
        }
        .wq-btn {
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 800;
          font-size: 13.5px;
          cursor: pointer;
          border: 1px solid var(--wq-border);
        }
        .wq-btn.ghost {
          background: rgba(0, 0, 0, 0.04);
          color: var(--wq-text);
        }
        :global(html.dark) .wq-btn.ghost {
          background: rgba(255, 255, 255, 0.08);
        }
        .wq-btn.primary {
          background: var(--wq-primary);
          border-color: transparent;
          color: #fff;
        }
        :global(html.dark) .wq-btn.primary {
          color: rgba(0, 0, 0, 0.88);
        }
        @media (max-width: 420px) {
          .wq-actions {
            flex-direction: column;
          }
          .wq-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
