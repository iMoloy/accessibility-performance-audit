export type AuditMode = 'hardened' | 'baseline'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  isStreaming?: boolean
  tokensCount?: number
}

export interface DefectComparison {
  id: string
  title: string
  category: 'ARIA & Screen Readers' | 'Focus & Keyboard' | 'Color Contrast' | 'Semantic HTML' | 'Core Web Vitals'
  wcagRule: string
  severity: 'Critical' | 'Serious' | 'Moderate'
  impact: string
  baselineDescription: string
  baselineSnippet: string
  hardenedDescription: string
  hardenedSnippet: string
  lighthouseImpact: string
}

export interface TelemetryMetrics {
  lighthouse: {
    performance: { before: number; after: number }
    accessibility: { before: number; after: number }
    bestPractices: { before: number; after: number }
    seo: { before: number; after: number }
  }
  wave: {
    errors: { before: number; after: number }
    contrastErrors: { before: number; after: number }
    alerts: { before: number; after: number }
    features: { before: number; after: number }
    structure: { before: number; after: number }
    aria: { before: number; after: number }
  }
  webVitals: {
    lcp: { before: string; after: string; status: 'Good' }
    inp: { before: string; after: string; status: 'Good' }
    cls: { before: string; after: string; status: 'Good' }
    tbt: { before: string; after: string; status: 'Good' }
  }
}
