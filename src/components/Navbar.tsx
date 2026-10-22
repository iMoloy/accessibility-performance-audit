'use client'

import React from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Gauge,
  FileText,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react'
import { LiveFocusTracker } from './LiveFocusTracker'
import type { AuditMode } from '../types'

interface NavbarProps {
  mode: AuditMode
  onToggleMode: () => void
  onOpenReportModal: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onToggleMode,
  onOpenReportModal,
}) => {
  const isHardened = mode === 'hardened'

  return (
    <header role="banner" className="sticky top-0 z-40 w-full border-b border-white/10 a11y-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Technical Metadata */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm">
            <Gauge className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                NEXUS <span className="text-sky-400">A11Y</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 border border-sky-500/25">
                FE-10
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-300 block -mt-0.5">
              ACCESSIBILITY &amp; PERFORMANCE AUDIT
            </span>
          </div>
        </div>

        {/* Center: Live Keyboard Focus Tracker */}
        <LiveFocusTracker />

        {/* Right Nav & Interactive Audit Mode Switcher */}
        <nav aria-label="Audit Mode Controls" className="flex items-center gap-2">
          {/* Baseline vs Hardened Simulation Toggle */}
          <button
            type="button"
            onClick={onToggleMode}
            aria-pressed={isHardened}
            aria-label={`Toggle audit comparison mode. Currently ${
              isHardened ? 'Post-Audit Hardened Mode' : 'Pre-Audit Baseline Mode'
            }`}
            title={`Switch to ${isHardened ? 'Pre-Audit Baseline' : 'Post-Audit Hardened'}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 ${
              isHardened
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
            }`}
          >
            {isHardened ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {isHardened ? 'Hardened (100/100)' : 'Baseline Simulation'}
            </span>
          </button>

          {/* Audit Report Modal Launcher */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Open full AUDIT.md report dialog"
            title="Open AUDIT.md breakdown"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span className="hidden md:inline">AUDIT.md Report</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
