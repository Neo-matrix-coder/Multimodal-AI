"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Download, FileText, X, ShieldCheck } from "lucide-react"

interface NoticeModalProps {
  isOpen: boolean
  onClose: () => void
  notice: {
    title: string
    category: string
    statutes: string
    notice_text: string
  } | null
  loading?: boolean
}

export function NoticeModal({ isOpen, onClose, notice, loading }: NoticeModalProps) {
  const [copied, setCopied] = React.useState(false)

  if (!isOpen) return null

  function handleCopy() {
    if (!notice?.notice_text) return
    navigator.clipboard.writeText(notice.notice_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!notice?.notice_text) return
    const blob = new Blob([notice.notice_text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Legal_Dispute_Notice_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0d1117] text-foreground shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  {notice?.title || "Legal Dispute Notice"}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Grounded in Indian Statutory Law
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm">Drafting formal statutory notice...</p>
              </div>
            ) : notice ? (
              <>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary-foreground/90">
                  <span className="font-semibold text-primary">Statutory Reference: </span>
                  {notice.statutes}
                </div>
                <pre className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap select-all">
                  {notice.notice_text}
                </pre>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No notice generated.</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
            <span className="text-[11px] text-muted-foreground">
              Ready to submit to Parivahan, NCH, or Consumer Court
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!notice || loading}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!notice || loading}
                className="flex items-center gap-1.5 rounded-xl bg-brand-gradient px-4 py-2 text-xs font-medium text-white shadow-glow hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                <Download className="size-3.5" />
                Download Draft (.txt)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
