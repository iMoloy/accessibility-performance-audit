'use client'

import React from 'react'
import { Volume2, Radio } from 'lucide-react'

interface ScreenReaderAnnouncerProps {
  announcement: string
  isStreaming: boolean
}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  announcement,
  isStreaming,
}) => {
  return (
    <div
      aria-label="Screen Reader Simulation Telemetry"
      className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono space-y-1.5"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
        <div className="flex items-center gap-2 text-sky-400">
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">
            Screen Reader Live Channel
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}
            aria-hidden="true"
          />
          <span className="text-[10px] text-slate-400">
            {isStreaming ? 'aria-live="polite" broadcasting' : 'Idle'}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-slate-300 leading-relaxed min-h-[32px] p-2 rounded bg-black/40 border border-white/5">
        {announcement || (
          <span className="text-slate-500 italic">
            Waiting for live region status message...
          </span>
        )}
      </div>
    </div>
  )
}
