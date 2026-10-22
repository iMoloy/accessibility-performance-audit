# Accessibility and Performance Audit Studio (FE-10)

> **Track:** Frontend AI Engineering · **Phase:** Build (polish) · **Workload:** 4h  
> **Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, WebAIM WAVE, Lighthouse Mobile  
> **Evaluated Baseline:** 71 Perf / 64 A11y &rarr; **Post-Audit:** 98 Perf / 100 A11y / 100 Best Practices / 100 SEO

---

## 🎯 Project Overview

This project implements and documents an exhaustive **Accessibility & Performance Audit (FE-10)** on a production-grade AI Workstation and Streaming Chat interface. 

Rather than merely fixing issues in static isolation, this application features an **Interactive Baseline vs. Hardened Mode Switcher**, allowing developers and interviewers to test the exact difference between pre-audit accessibility anti-patterns and production-grade WCAG 2.2 AAA remediated code directly in the browser.

---

## 🚀 Key Features & Highlights

1. **AI-Specific Accessibility**:
   - **Polite Live Region (`aria-live="polite"`, `aria-atomic="false"`)**: Streaming AI responses are batched smoothly into 80ms chunks, ensuring screen readers (NVDA, VoiceOver) announce incoming sentences naturally without speech buffer stutter or clipping.
   - **Keyboard-Reachable Abort Control**: Dedicated Stop Generation button with minimum 44x44px touch target, visible focus outline, and global <kbd>Escape</kbd> shortcut.

2. **W3C Accessible Dialog (Modal)**:
   - Built from scratch without third-party bloat, featuring full focus trapping (`Tab` / `Shift+Tab`), `Escape` dismissal, background body scroll lock, and opener focus restoration.

3. **100% Keyboard Completable User Flow**:
   - Skip to main content link.
   - High-contrast 2px sky focus rings (`*:focus-visible`).
   - Roving tabindex for tab panels and suggested prompt pills.

4. **WAVE & WCAG 2.2 AAA Contrast**:
   - Zero automated WAVE errors and zero contrast failures.
   - All body copy maintains a **7.4:1 contrast ratio**, exceeding the strictest WCAG AAA standard.

5. **Core Web Vitals & Zero Layout Shift (CLS 0.000)**:
   - Fixed aspect ratios on avatars and media.
   - Content-visibility and layout pinning during rapid token streaming.

6. **Live Telemetry & Diagnostics**:
   - In-app **Lighthouse Scorecard** displaying real-time metrics.
   - **Live Keyboard Focus Tracker** showing active element, role, and tabindex.
   - **Screen Reader Channel Visualizer** simulating assistive speech in real time.

---

## 📊 Summary of Audit Scores (Deltas)

| Metric | Baseline | Remediated | Delta | Result |
| :--- | :---: | :---: | :---: | :--- |
| **Lighthouse Performance** | `71` | **`98`** | `+27` | 🟢 Exceeds 90+ Target |
| **Lighthouse Accessibility** | `64` | **`100`** | `+36` | 🟢 Perfect Score |
| **Lighthouse Best Practices** | `78` | **`100`** | `+22` | 🟢 Perfect Score |
| **Lighthouse SEO** | `80` | **`100`** | `+20` | 🟢 Perfect Score |
| **WAVE Automated Errors** | `14` | **`0`** | `-14` | 🟢 Zero Errors |
| **WAVE Contrast Errors** | `9` | **`0`** | `-9` | 🟢 Zero Errors |
| **Cumulative Layout Shift** | `0.24` | **`0.000`** | `-0.24` | 🟢 Rock Solid |

*(Full defect logs, remediation diffs, and checklist are documented in [`AUDIT.md`](AUDIT.md).)*

---

## 🛠️ Running Locally

```bash
# 1. Navigate to project folder
cd accessibility-performance-audit

# 2. Install dependencies with pnpm
pnpm install

# 3. Start development server
pnpm run dev

# 4. Build and start production bundle
pnpm run build
pnpm run start
```

Open [http://localhost:3000](http://localhost:3000) to explore the live application.
