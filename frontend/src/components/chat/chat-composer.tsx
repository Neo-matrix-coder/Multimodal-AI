"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Paperclip, Mic, MicOff, Sparkles, Loader2, FileCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatComposer({
  onSend,
  disabled,
}: {
  onSend: (value: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [attachedDoc, setAttachedDoc] = React.useState<{ name: string; summary: string } | null>(null)
  const [isListening, setIsListening] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const recognitionRef = React.useRef<any>(null)

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    setAttachedDoc(null)
  }

  // Handle OCR file upload from Paperclip
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to process document")
      }

      const data = await res.json()
      const meta = data.metadata || {}
      const summaryText = meta.summary || meta.offence_type || `${meta.document_type || "Document"} details`
      const attachmentLabel = `${meta.document_type || "Document"}${meta.fine_amount ? ` (${meta.fine_amount})` : ""}`

      setAttachedDoc({ name: file.name, summary: attachmentLabel })

      const promptContext = `[Attached Document: ${attachmentLabel} - ${summaryText}]. Is this legally valid and what steps should I take under Indian law?`
      setValue((prev) => (prev ? `${prev} ${promptContext}` : promptContext))
    } catch (err) {
      console.error("[ChatComposer] Document extraction error:", err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Handle Mic speech recognition
  function toggleListening() {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
      return
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.")
      return
    }

    try {
      const recognition = new SpeechRec()
      recognition.lang = "en-IN"
      recognition.interimResults = false
      recognition.continuous = false

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || ""
        if (transcript) {
          setValue((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      console.error("[ChatComposer] Speech recognition init failed:", e)
      setIsListening(false)
    }
  }

  return (
    <div className="pointer-events-none sticky bottom-0 z-20 flex justify-center px-4 pb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
      />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className={cn(
          "pointer-events-auto w-full max-w-3xl rounded-3xl border p-2 backdrop-blur-2xl transition-all duration-300",
          focused
            ? "border-primary/40 bg-white/[0.07] shadow-glow"
            : "border-white/10 bg-white/[0.04] shadow-glass",
        )}
      >
        {/* Attached Document Pill */}
        <AnimatePresence>
          {attachedDoc && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-1.5 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary-foreground"
            >
              <div className="flex items-center gap-2 truncate">
                <FileCheck className="size-3.5 text-primary shrink-0" />
                <span className="truncate font-medium">{attachedDoc.name}</span>
                <span className="text-muted-foreground truncate">({attachedDoc.summary})</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedDoc(null)}
                className="ml-2 rounded p-0.5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2">
          <button
            type="button"
            title="Attach Challan or Bill (Image/PDF)"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="grid size-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-40"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : (
              <Paperclip className="size-5" />
            )}
          </button>
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={isListening ? "Listening... Speak your legal dispute naturally..." : "Ask Justice AI anything, attach a challan, or use voice…"}
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="button"
            title={isListening ? "Stop listening" : "Speak your query (Speech to Text)"}
            onClick={toggleListening}
            disabled={disabled}
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl transition-all",
              isListening
                ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/50 animate-pulse"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {isListening ? <MicOff className="size-5 text-red-400" /> : <Mic className="size-5" />}
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={submit}
            disabled={!value.trim() || disabled}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        </div>
        <div className="flex items-center gap-2 px-2 pb-1 pt-1.5">
          <Sparkles className="size-3 text-accent" />
          <span className="text-[11px] text-muted-foreground">
            {uploading ? "Extracting document data with Gemini Vision..." : "Multimodal legal defense — upload documents, speak in voice, or chat."}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

