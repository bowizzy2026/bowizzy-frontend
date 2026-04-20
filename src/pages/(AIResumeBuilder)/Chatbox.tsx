import React, { useRef, useEffect, Suspense, useState, useMemo } from "react";
import { Send, Upload, Loader2, Bot, User, Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import type { ChatSession } from "./types";
import { aiTemplateRegistry } from './templates/aiTemplateRegistry';
import { mapInfoJsonToResumeData } from './mapInfoJsonToResumeData';
import DataChips, { type DataChip } from "./DataChips";

interface ChatBoxProps {
  session: ChatSession | undefined;
  mode: "jd" | "non-jd";
  inputValue: string;
  isLoading: boolean;
  onModeChange: (mode: "jd" | "non-jd") => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (file: File) => void;
  onStart: () => void;
  // Chip props — only present when a chip-question is active
  activeChips?: DataChip[];
  onChipDelete?: (id: string) => void;
  onChipUndo?: (id: string) => void;
  // ID of the message that should render chips below it
  chipMessageId?: string | null;
}

export default function ChatBox({
  session,
  mode,
  inputValue,
  isLoading,
  onModeChange,
  onInputChange,
  onSend,
  onFileUpload,
  onStart,
  activeChips,
  onChipDelete,
  onChipUndo,
  chipMessageId,
}: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, activeChips]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    e.target.value = "";
  };

  const started = session?.started ?? false;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!started ? (
          <PreStartState
            mode={mode}
            onModeChange={onModeChange}
            onFileUpload={() => fileInputRef.current?.click()}
            onStart={onStart}
          />
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {session?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-orange-100" : "bg-gray-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 text-orange-600" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}

                  {/* ── Chips rendered inline inside this bot bubble ── */}
                  {msg.role === "assistant" &&
                    chipMessageId === msg.id &&
                    activeChips &&
                    activeChips.length > 0 &&
                    onChipDelete &&
                    onChipUndo && (
                      <DataChips
                        chips={activeChips}
                        onDelete={onChipDelete}
                        onUndo={onChipUndo}
                      />
                    )}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map((d) => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Inline resume template preview */}
            {session?.infoJson && !isLoading && (
              <InlineResumePreview infoJson={session.infoJson} />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />

      {/* Input bar — only visible after start */}
      {started && (
        <div className="bg-white border-t border-gray-200 px-4 pt-3 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 min-w-0 text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white placeholder-gray-400 transition"
              />
              <button
                onClick={onSend}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pre-start onboarding screen ───────────────────────────────────────────────
function PreStartState({
  mode,
  onModeChange,
  onFileUpload,
  onStart,
}: {
  mode: "jd" | "non-jd";
  onModeChange: (m: "jd" | "non-jd") => void;
  onFileUpload: () => void;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 py-16 gap-6">
      {/* Icon + heading */}
      <div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 mx-auto">
          <Bot className="w-6 h-6 text-orange-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          Let's build your resume
        </h2>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Choose a mode, optionally upload a file, then hit Start.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Mode</span>
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {(["non-jd", "jd"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`text-xs px-4 py-1.5 rounded-md font-medium transition ${
                mode === m
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {m === "jd" ? "JD Mode" : "General"}
            </button>
          ))}
        </div>
        {mode === "jd" && (
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
            Tailored to job description
          </span>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={onFileUpload}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-800 transition"
      >
        <Upload className="w-4 h-4" />
        Upload resume or JD
      </button>

      {/* Start button */}
      <button
        onClick={onStart}
        className="px-8 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 active:scale-95 transition"
      >
        Start
      </button>
    </div>
  );
}

// ── Inline resume template cards shown inside chat ────────────────────────────
function InlineResumePreview({ infoJson }: { infoJson: any }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const resumeData = useMemo(() => mapInfoJsonToResumeData(infoJson), [infoJson]);

  useEffect(() => {
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const selectedTemplate = selectedIndex !== null ? aiTemplateRegistry[selectedIndex] : null;
  const SelectedDisplay = selectedTemplate?.displayComponent ?? null;

  const handleDownload = async (index: number) => {
    setDownloading(true);
    const tmpl = aiTemplateRegistry[index];
    try {
      const PdfModule = await tmpl.importPdf();
      const PdfComp = PdfModule.default;
      const blob = await pdf(
        <PdfComp data={resumeData} primaryColor={tmpl.primaryColor} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personal.firstName || 'Resume'}_${resumeData.personal.lastName || ''}_${tmpl.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div ref={previewRef} className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Choose a template to preview and download:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {aiTemplateRegistry.map((tmpl, i) => {
            const CardDisplay = tmpl.displayComponent;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedIndex(i)}
                className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-orange-400 hover:shadow-md transition bg-white group"
              >
                <div className="overflow-hidden flex justify-center" style={{ height: 180 }}>
                  <div
                    style={{
                      transform: 'scale(0.25)',
                      transformOrigin: 'top center',
                      width: '210mm',
                      minHeight: '297mm',
                      pointerEvents: 'none',
                    }}
                  >
                    <Suspense fallback={<div className="h-full bg-gray-50" />}>
                      <CardDisplay data={resumeData} primaryColor={tmpl.primaryColor} />
                    </Suspense>
                  </div>
                </div>
                <div className="px-2 py-2 border-t border-gray-100 text-center">
                  <span className="text-xs font-medium text-gray-600 group-hover:text-orange-500 transition">
                    {tmpl.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedIndex !== null && selectedTemplate && SelectedDisplay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <span className="text-sm font-semibold text-gray-800">
                {selectedTemplate.name} Template
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedIndex)}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 flex justify-center p-4">
              <div
                style={{
                  transform: 'scale(0.85)',
                  transformOrigin: 'top center',
                  width: '210mm',
                  minHeight: '297mm',
                }}
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                      Loading template...
                    </div>
                  }
                >
                  <SelectedDisplay data={resumeData} primaryColor={selectedTemplate.primaryColor} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}