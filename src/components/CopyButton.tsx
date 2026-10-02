import { useEffect, useRef, useState } from 'react'

type State = 'idle' | 'ok' | 'fail'

/** 命令复制按钮：优先使用剪贴板 API，失败时降级为隐藏 textarea + execCommand */
export default function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<State>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  async function copy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        ta.remove()
      } catch {
        ok = false
      }
    }
    setState(ok ? 'ok' : 'fail')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button
      type="button"
      className={`copy-btn ${state}`}
      onClick={copy}
      aria-live="polite"
    >
      {state === 'ok' ? '已复制 ✓' : state === 'fail' ? '复制失败' : '复制'}
    </button>
  )
}
