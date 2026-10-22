'use client'

import React, { useEffect, useRef } from 'react'
import { X, ShieldCheck } from 'lucide-react'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  triggerRef?: React.RefObject<HTMLElement | null>
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  triggerRef,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Manage Body Scroll Lock & Focus Trap
  useEffect(() => {
    if (!isOpen) return

    // 1. Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // 2. Initial focus onto close button or dialog container
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    // 3. Handle Keyboard Trap & Escape Key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      // 4. Return focus to trigger element upon closing
      triggerRef?.current?.focus()
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessible-modal-title"
        aria-describedby={description ? 'accessible-modal-desc' : undefined}
        className="w-full max-w-2xl a11y-panel rounded-3xl p-6 md:p-8 border border-white/15 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 focus:outline-none"
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase">
                A11Y VERIFIED DIALOG
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Focus Trapped
              </span>
            </div>
            <h2 id="accessible-modal-title" className="text-xl font-bold tracking-tight text-white mt-1">
              {title}
            </h2>
            {description && (
              <p id="accessible-modal-desc" className="text-xs font-mono text-slate-300 mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Accessible Close Button with explicit touch target & sr-only label */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog (Escape)"
            title="Close dialog (Press Escape)"
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Close modal window</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}
