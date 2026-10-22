'use client'

import React, { useState, useEffect } from 'react'
import { Focus, Eye } from 'lucide-react'

export const LiveFocusTracker: React.FC = () => {
  const [focusedElement, setFocusedElement] = useState<{
    tag: string
    name: string
    role: string
    tabIndex: number
  } | null>(null)

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement
      if (!el) return

      const tag = el.tagName.toLowerCase()
      const name =
        el.getAttribute('aria-label') ||
        el.getAttribute('aria-labelledby') ||
        el.innerText?.slice(0, 30) ||
        el.getAttribute('placeholder') ||
        el.id ||
        'anonymous-element'

      const role = el.getAttribute('role') || tag
      const tabIndex = el.tabIndex

      setFocusedElement({ tag, name, role, tabIndex })
    }

    const handleFocusOut = () => {
      // Keep state or set null
    }

    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)

    return () => {
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  if (!focusedElement) return null

  return (
    <aside
      aria-label="Active Keyboard Focus Diagnostic"
      className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/30 text-[11px] font-mono text-slate-300 shadow-lg backdrop-blur-md"
    >
      <Focus className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" aria-hidden="true" />
      <span className="text-slate-400">FOCUS:</span>
      <span className="text-sky-300 font-semibold">{`<${focusedElement.tag}>`}</span>
      <span className="truncate max-w-[140px] text-white">"{focusedElement.name}"</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
        tabIndex: {focusedElement.tabIndex}
      </span>
    </aside>
  )
}
