'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Square,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Terminal,
} from 'lucide-react'
import type { ChatMessage, AuditMode } from '../types'

interface ChatSectionProps {
  mode: AuditMode
  onAnnounce: (msg: string) => void
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      'Welcome to Nexus A11y & Performance Workstation. This interface has been audited against WCAG 2.2 AAA guidelines and Lighthouse Mobile standards. Ask me to perform an accessibility analysis, contrast check, or token streaming test.',
    timestamp: '10:42 AM',
  },
]

const SAMPLE_PROMPTS = [
  'Verify aria-live="polite" streaming announcement',
  'Audit color contrast ratios for dark theme',
  'Demonstrate keyboard navigation and focus trapping',
]

const SIMULATED_RESPONSES = [
  `### Accessibility Verification Report (WCAG 2.2 AAA)

1. **Live Region Status (aria-live="polite")**: 
   - Status: **PASSED (Level AA)**
   - Screen reader announcement is queued politely without interrupting user focus or typing.
   - Token streaming updates are batched smoothly to avoid NVDA/VoiceOver speech buffer flooding.

2. **Keyboard Abort Control**:
   - The Stop button can be activated via Tab focus or the \`Escape\` hotkey.
   - Accessible Name: \`"Stop generating response"\` with a guaranteed 44x44px touch target.

3. **Color Contrast**:
   - Body Text: **7.4:1** (Exceeds WCAG AAA 7:1 requirement).
   - Component Badges: **4.8:1** (Exceeds WCAG AA 4.5:1 requirement).`,

  `### Core Web Vitals & Performance Profile

- **Largest Contentful Paint (LCP)**: 0.8s (Good, budget < 2.5s)
- **Interaction to Next Paint (INP)**: 24ms (Good, budget < 200ms)
- **Cumulative Layout Shift (CLS)**: 0.000 (Zero layout jump during streaming)
- **Total Blocking Time (TBT)**: 10ms (Optimized main-thread execution)

All avatars and cards maintain fixed aspect ratios, preventing layout shifts when dynamic tokens render.`,
]

export const ChatSection: React.FC<ChatSectionProps> = ({ mode, onAnnounce }) => {
  const isHardened = mode === 'hardened'
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [streamBuffer, setStreamBuffer] = useState('')

  const abortControllerRef = useRef<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamBuffer])

  // Global Escape key shortcut to abort streaming (AI-Specific A11y Requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStreaming) {
        e.preventDefault()
        handleStopGeneration()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isStreaming])

  // Stop Generation Handler
  const handleStopGeneration = () => {
    abortControllerRef.current = true
    setIsStreaming(false)
    if (streamBuffer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: streamBuffer + ' [Generation stopped by user]',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setStreamBuffer('')
    }
    onAnnounce('AI generation stopped by user via keyboard abort.')
  }

  // Simulated Streaming Response Handler
  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const messageContent = textToSend || input
      if (!messageContent.trim() || isStreaming) return

      const userMsg: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsStreaming(true)
      abortControllerRef.current = false

      onAnnounce(`User sent prompt: "${messageContent}". AI response generation started.`)

      const chosenResponse =
        SIMULATED_RESPONSES[Math.floor(Math.random() * SIMULATED_RESPONSES.length)]
      const tokens = chosenResponse.split(' ')
      let currentIndex = 0
      let accumulated = ''

      const interval = setInterval(() => {
        if (abortControllerRef.current || currentIndex >= tokens.length) {
          clearInterval(interval)
          if (!abortControllerRef.current) {
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-ai-${Date.now()}`,
                role: 'assistant',
                content: accumulated,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
            setStreamBuffer('')
            setIsStreaming(false)
            onAnnounce('AI completed response.')
          }
          return
        }

        accumulated += (currentIndex > 0 ? ' ' : '') + tokens[currentIndex]
        setStreamBuffer(accumulated)

        // Polite announcement updates every ~8 tokens
        if (currentIndex % 8 === 0) {
          onAnnounce(`Streaming: ...${tokens.slice(Math.max(0, currentIndex - 4), currentIndex + 1).join(' ')}`)
        }

        currentIndex++
      }, 45)
    },
    [input, isStreaming, onAnnounce]
  )

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    onAnnounce('Message copied to clipboard.')
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <section
      aria-label="Accessible AI Chat Interface"
      className="a11y-panel rounded-3xl p-6 md:p-8 flex flex-col h-[650px] border border-white/10 relative overflow-hidden"
    >
      {/* Chat Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>NEXUS STREAMING AGENT</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                ARIA-LIVE VALIDATED
              </span>
            </h2>
            <span
              className={`text-xs font-mono ${
                isHardened ? 'text-slate-300' : 'text-slate-500' /* Simulated low-contrast violation */
              }`}
            >
              Polite Live Region · Keyboard Abortable · WCAG 4.1.3 Compliant
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages(INITIAL_MESSAGES)
            setStreamBuffer('')
            onAnnounce('Chat conversation cleared.')
          }}
          className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-label="Clear chat conversation history"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div
        role="group"
        aria-label="Suggested Prompt Quick Starters"
        className="flex items-center gap-2 py-3 overflow-x-auto shrink-0"
      >
        <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          Quick Test:
        </span>
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={isStreaming}
            className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shrink-0 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-sky-400 text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div
        role="log"
        aria-label="Conversation message feed"
        className="flex-1 overflow-y-auto space-y-4 pr-1 py-2"
        tabIndex={0}
      >
        {messages.map((msg) => (
          <article
            key={msg.id}
            aria-label={`${msg.role === 'user' ? 'User' : 'Assistant'} message at ${msg.timestamp}`}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 aspect-square">
                <Bot className="w-4 h-4" aria-hidden="true" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 border ${
                msg.role === 'user'
                  ? 'bg-sky-600/20 text-white border-sky-500/30'
                  : 'bg-slate-900/80 border-white/10 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-1 text-[10px] font-mono text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-sky-300">
                  {msg.role === 'user' ? 'You' : 'Nexus AI'}
                </span>
                <div className="flex items-center gap-2">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      aria-label="Copy message text to clipboard"
                      className="hover:text-white p-1 rounded focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3 h-3" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="whitespace-pre-wrap font-sans text-slate-200">{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center shrink-0 aspect-square">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
            )}
          </article>
        ))}

        {/* ACTIVE STREAMING BUBBLE WITH ARIA-LIVE */}
        {isStreaming && (
          <article
            aria-label="Assistant streaming response in progress"
            className="flex gap-3 justify-start animate-in fade-in duration-150"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 aspect-square">
              <Bot className="w-4 h-4 animate-pulse" aria-hidden="true" />
            </div>

            {/* In Hardened Mode: Full aria-live="polite" and aria-atomic="false" */}
            {isHardened ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="false"
                aria-relevant="additions text"
                aria-label="AI assistant streaming response"
                className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 border bg-slate-900/90 border-sky-400/30 text-slate-100 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-1 text-[10px] font-mono text-sky-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
                    Generating Tokens...
                  </span>
                  <span>aria-live="polite" active</span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-slate-200">
                  {streamBuffer || 'Thinking and compiling response...'}
                </div>
              </div>
            ) : (
              /* Simulated Baseline Defect: Plain div without live region */
              <div className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 border bg-slate-900/50 border-white/5 text-slate-400">
                <span className="text-[10px] text-rose-400 font-mono block">
                  [Baseline Defect: Missing aria-live region (Silent to screen readers)]
                </span>
                <div className="whitespace-pre-wrap font-sans">{streamBuffer}</div>
              </div>
            )}
          </article>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Accessible Controls Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="pt-3 border-t border-white/10 shrink-0 space-y-2"
      >
        <div className="relative flex items-center gap-2">
          {/* Accessible Textarea */}
          <div className="relative flex-1">
            <label htmlFor="chat-prompt-input" className="sr-only">
              Enter your prompt message for the AI assistant
            </label>
            <textarea
              ref={textareaRef}
              id="chat-prompt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask an a11y question or test streaming... (Enter to send, Shift+Enter for newline)"
              rows={2}
              className={`w-full p-3 pr-12 rounded-2xl bg-black/50 border text-xs text-white placeholder-slate-400 resize-none transition-all focus:outline-none ${
                isHardened
                  ? 'border-white/15 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-400'
                  : 'border-slate-800' /* Simulated baseline missing focus outline */
              }`}
            />
          </div>

          {/* Action Buttons: Stop Stream or Send */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              /* Accessible Keyboard Stop Button */
              <button
                type="button"
                onClick={handleStopGeneration}
                aria-label="Stop generating response (Press Escape)"
                title="Stop generating response (Press Escape)"
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all font-mono text-xs flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span className="hidden sm:inline">Stop (Esc)</span>
              </button>
            ) : (
              /* Accessible Send Button */
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message to AI assistant"
                title="Send prompt (Enter)"
                className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-all font-mono text-xs flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-sky-300 shadow-md shadow-sky-500/20"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Send</span>
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Helper Text */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>
            Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white text-[10px]">Enter</kbd> to send,{' '}
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-white text-[10px]">Esc</kbd> to abort stream
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Zero WAVE Errors
          </span>
        </div>
      </form>
    </section>
  )
}
