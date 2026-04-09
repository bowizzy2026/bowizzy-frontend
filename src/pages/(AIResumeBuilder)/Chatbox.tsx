import React, { useRef, useEffect } from "react";
import { Send, Upload, Loader2, Bot, User } from "lucide-react";
import type { ChatSession } from "./types";

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
}: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

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

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Hidden file input — always mounted so ref works on pre-start screen */}
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