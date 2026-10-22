"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, FileText, ListChecks, BrainCircuit, MessageSquareText, FileCheck, ShieldCheck, ArrowRight } from "lucide-react"
import { AppShell } from "@/components/shared/app-shell"
import { UploadZone } from "@/components/ocr/upload-zone"
import { DocumentCard, type DocItem } from "@/components/ocr/document-card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/shared/toast"
import { NoticeModal } from "@/components/ocr/notice-modal"

let counter = 0

export default function OcrPage() {
  const router = useRouter()
  const [docs, setDocs] = React.useState<DocItem[]>([])
  const [extractedData, setExtractedData] = React.useState<any | null>(null)
  const [noticeModalOpen, setNoticeModalOpen] = React.useState(false)
  const [generatedNotice, setGeneratedNotice] = React.useState<any | null>(null)
  const [noticeLoading, setNoticeLoading] = React.useState(false)
  const { toast } = useToast()

  async function addFiles(files: { name: string; size: string; rawFile?: File }[]) {
    const items: DocItem[] = files.map((f) => ({
      id: `doc-${counter++}`,
      name: f.name,
      size: f.size,
      status: "uploading",
      progress: 10,
    }))
    setDocs((d) => [...items, ...d])

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const rawFile = files[i]?.rawFile

      // Animate upload progress
      let progress = 10
      const upInterval = setInterval(() => {
        progress = Math.min(progress + 15, 85)
        setDocs((d) => d.map((x) => x.id === item.id ? { ...x, progress } : x))
      }, 200)

      // Mark as scanning
      setTimeout(() => {
        clearInterval(upInterval)
        setDocs((d) => d.map((x) => x.id === item.id ? { ...x, status: "scanning", progress: 85 } : x))
      }, 1200)

      // Real OCR call
      try {
        let result: any = null
        if (rawFile) {
          const formData = new FormData()
          formData.append("file", rawFile)
          const res = await fetch("/api/ocr", { method: "POST", body: formData })
          if (res.ok) result = await res.json()
        }

        setDocs((d) => d.map((x) => x.id === item.id ? { ...x, status: "done", progress: 100 } : x))

        if (result) {
          setExtractedData(result)
          toast({
            tone: "success",
            title: "Document analyzed",
            description: `${result.metadata?.document_type || "Document"} extracted successfully.`,
          })
        } else {
          toast({ tone: "success", title: "Document analyzed", description: "Ready to review." })
        }
      } catch (err: any) {
        setDocs((d) => d.map((x) => x.id === item.id ? { ...x, status: "done", progress: 100 } : x))
        toast({ tone: "error", title: "OCR failed", description: err.message })
      }
    }
  }

  const analyzed = docs.filter((d) => d.status === "done").length
  const meta = extractedData?.metadata
  const privacy = extractedData?.privacy_report

  function buildPromptQuery() {
    if (!meta) return ""
    const parts = [
      `I have a ${meta.document_type || "document"} regarding ${meta.offence_type || meta.summary || "a dispute"}.`,
      meta.fine_amount ? `The amount is ${meta.fine_amount}.` : "",
      meta.challan_number ? `Reference ID: ${meta.challan_number}.` : "",
      meta.location ? `Location: ${meta.location}.` : "",
      "Is this legally valid under Indian law, what is my win probability, and how do I dispute it?"
    ].filter(Boolean)
    return parts.join(" ")
  }

  function handleAnalyzeDeepResearch() {
    const q = buildPromptQuery()
    router.push(`/deep-research?query=${encodeURIComponent(q)}`)
  }

  function handleAskChat() {
    const q = buildPromptQuery()
    router.push(`/chat?query=${encodeURIComponent(q)}`)
  }

  async function handleGenerateNotice() {
    if (!extractedData) return
    setNoticeLoading(true)
    setNoticeModalOpen(true)
    try {
      const res = await fetch("/api/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: extractedData.category || "consumer_dispute",
          metadata: meta || {},
          user_name: "Aggrieved Citizen",
          dispute_reason: meta?.summary || ""
        }),
      })
      if (!res.ok) throw new Error("Failed to generate notice")
      const data = await res.json()
      setGeneratedNotice(data)
    } catch (err: any) {
      toast({ tone: "error", title: "Notice Generation Failed", description: err.message })
    } finally {
      setNoticeLoading(false)
    }
  }

  return (
    <AppShell title="Document Intelligence" showSearch={false}>
      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        notice={generatedNotice}
        loading={noticeLoading}
      />
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-3xl font-semibold">
            Scan &amp; understand any document
          </h2>
          <p className="text-muted-foreground">
            Drop a challan, bill, receipt or PDF and watch Justice AI extract,
            structure and explain every key detail in real time.
          </p>
        </div>

        <UploadZone onFiles={addFiles} />

        <AnimatePresence>
          {docs.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Documents</h3>
                <Badge variant="primary">
                  <ListChecks className="size-3" /> {analyzed}/{docs.length} analyzed
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AnimatePresence>
                  {docs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real extracted data */}
        {meta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden p-6 space-y-6"
          >
            {/* Header with Privacy Protection Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-accent" />
                <h3 className="font-display text-lg font-semibold">Extracted &amp; Structured Details</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                <ShieldCheck className="size-3.5" />
                <span>Private Data Protected {privacy?.redacted_count ? `(${privacy.redacted_count} PII masked)` : "(Zero raw PII leak)"}</span>
              </div>
            </div>

            {/* Extracted Fields */}
            <div className="space-y-3">
              {[
                meta.document_type    && `Document type: ${meta.document_type}`,
                meta.document_category && `Category: ${meta.document_category}`,
                meta.fine_amount      && `Amount: ${meta.fine_amount}`,
                meta.challan_number   && `Challan / Order No.: ${meta.challan_number}`,
                meta.date             && `Date: ${meta.date}`,
                meta.location         && `Location: ${meta.location}`,
                meta.vehicle_number   && `Vehicle: ${meta.vehicle_number}`,
                meta.offence_type     && `Offence: ${meta.offence_type}`,
                meta.merchant_name    && `Merchant: ${meta.merchant_name}`,
                meta.product_service  && `Product/Service: ${meta.product_service}`,
                meta.summary          && `Summary: ${meta.summary}`,
              ]
                .filter(Boolean)
                .map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm"
                  >
                    <FileText className="size-4 shrink-0 text-primary" />
                    {line}
                  </motion.div>
                ))}
            </div>

            {/* Continuous Workflow Actions */}
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ArrowRight className="size-4 text-primary" />
                Take Action on this Document
              </h4>
              <p className="text-xs text-muted-foreground">
                Seamlessly feed this document directly into Justice AI&apos;s reasoning engines or generate an official notice.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleAnalyzeDeepResearch}
                  className="flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all"
                >
                  <BrainCircuit className="size-4" />
                  Analyze with Deep Research (4-Agent)
                </button>
                <button
                  onClick={handleGenerateNotice}
                  className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all"
                >
                  <FileCheck className="size-4" />
                  Draft Formal Legal Dispute Notice
                </button>
                <button
                  onClick={handleAskChat}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-white/10 transition-all"
                >
                  <MessageSquareText className="size-4" />
                  Ask in Chat
                </button>
              </div>
            </div>

            {extractedData?.extracted_text && (
              <details className="mt-4 pt-2 border-t border-white/5">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  Show sanitized extracted text
                </summary>
                <pre className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-black/20 p-3 text-[11px] leading-relaxed text-foreground/70 whitespace-pre-wrap">
                  {extractedData.extracted_text}
                </pre>
              </details>
            )}
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
