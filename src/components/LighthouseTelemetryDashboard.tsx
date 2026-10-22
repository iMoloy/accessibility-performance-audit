import React from 'react'
import {
  Gauge,
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { AUDIT_METRICS } from '../data/auditData'

interface LighthouseTelemetryDashboardProps {
  mode: 'hardened' | 'baseline'
}

export const LighthouseTelemetryDashboard: React.FC<LighthouseTelemetryDashboardProps> = ({
  mode,
}) => {
  const isHardened = mode === 'hardened'
  const metrics = AUDIT_METRICS

  const scores = [
    {
      label: 'Performance',
      score: isHardened ? metrics.lighthouse.performance.after : metrics.lighthouse.performance.before,
      before: metrics.lighthouse.performance.before,
      after: metrics.lighthouse.performance.after,
      color: isHardened ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      label: 'Accessibility',
      score: isHardened ? metrics.lighthouse.accessibility.after : metrics.lighthouse.accessibility.before,
      before: metrics.lighthouse.accessibility.before,
      after: metrics.lighthouse.accessibility.after,
      color: isHardened ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    },
    {
      label: 'Best Practices',
      score: isHardened ? metrics.lighthouse.bestPractices.after : metrics.lighthouse.bestPractices.before,
      before: metrics.lighthouse.bestPractices.before,
      after: metrics.lighthouse.bestPractices.after,
      color: isHardened ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      label: 'SEO',
      score: isHardened ? metrics.lighthouse.seo.after : metrics.lighthouse.seo.before,
      before: metrics.lighthouse.seo.before,
      after: metrics.lighthouse.seo.after,
      color: isHardened ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
  ]

  return (
    <section
      aria-label="Lighthouse and WAVE Telemetry Dashboard"
      className="a11y-panel rounded-3xl p-6 md:p-8 space-y-6 border border-white/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h2 className="text-base font-bold tracking-tight text-white uppercase">
              LIGHTHOUSE MOBILE &amp; WAVE VERIFICATION
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-300 mt-0.5">
            Evaluated using Chromium Mobile Profile · Moto G Power / Slow 4G Simulation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              isHardened
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isHardened ? 'Post-Audit Hardened (100% Passed)' : 'Pre-Audit Baseline (Simulated Violations)'}</span>
          </span>
        </div>
      </div>

      {/* 4 Lighthouse Score Rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scores.map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center text-center space-y-2"
          >
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xl transition-all ${s.color}`}
            >
              {s.score}
            </div>
            <span className="text-xs font-semibold text-white tracking-wide">{s.label}</span>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <span>Baseline: {s.before}</span>
              <TrendingUp className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-400 font-semibold">+{s.after - s.before}</span>
            </div>
          </div>
        ))}
      </div>

      {/* WAVE & Core Web Vitals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* WAVE Card */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              WAVE Evaluation Results
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {isHardened ? '0 Errors' : '14 Errors Detected'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">ERRORS</span>
              <span className={`text-sm font-bold ${isHardened ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHardened ? 0 : 14}
              </span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">CONTRAST</span>
              <span className={`text-sm font-bold ${isHardened ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isHardened ? 0 : 9}
              </span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">ALERTS</span>
              <span className={`text-sm font-bold ${isHardened ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isHardened ? 0 : 12}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            {isHardened
              ? 'WAVE validated: Complete landmark tree, unique labels, zero contrast issues.'
              : 'Baseline failures: low contrast text, missing aria-live, unlabelled icon buttons.'}
          </p>
        </div>

        {/* Core Web Vitals Card */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" aria-hidden="true" />
              Core Web Vitals Thresholds
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
              All Green
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">LCP</span>
              <span className="text-sm font-bold text-emerald-400">
                {isHardened ? metrics.webVitals.lcp.after.split(' ')[0] : metrics.webVitals.lcp.before.split(' ')[0]}
              </span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">INP</span>
              <span className="text-sm font-bold text-emerald-400">
                {isHardened ? metrics.webVitals.inp.after.split(' ')[0] : metrics.webVitals.inp.before.split(' ')[0]}
              </span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 block text-[9px]">CLS</span>
              <span className="text-sm font-bold text-emerald-400">
                {isHardened ? metrics.webVitals.cls.after.split(' ')[0] : metrics.webVitals.cls.before.split(' ')[0]}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Zero Cumulative Layout Shift (CLS 0.000) during token streaming and message insertions.
          </p>
        </div>
      </div>
    </section>
  )
}
