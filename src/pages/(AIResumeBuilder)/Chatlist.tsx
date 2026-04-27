import React, { useState } from "react";
import { Plus, Trash2, X, MessageSquare } from "lucide-react";
import type { ChatSession } from "./types";

interface ChatListProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
  isVisible: boolean;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export default function ChatList({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClose,
  isVisible,
}: ChatListProps) {
  // Sort sessions by createdAt descending
  const sortedSessions = [...sessions].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  return (
    <>
      {/* Mobile overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-20 md:z-auto
          w-64 md:w-56 lg:w-64 flex flex-col bg-white border-r border-gray-200
          transition-transform duration-200
          ${isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-100 flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4 shrink-0" />
            New Chat
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sortedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <MessageSquare className="w-8 h-8 text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">No chats yet</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-2.5 rounded-lg transition group ${currentSessionId === session.id
                  ? "bg-orange-50 border border-orange-200"
                  : "hover:bg-gray-50 border border-transparent"
                  }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-medium text-gray-800 truncate flex-1">
                    AI_RESUME_CHAT #{session.id}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
                    {formatDate(session.createdAt)}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${session.mode === "jd"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {session.mode === "jd" ? "JD" : "AI Mode"}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {(session.messages?.length ?? 0) > 0
                      ? `${session.messages.length} msg${session.messages.length > 1 ? "s" : ""}`
                      : "Empty"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Delete Confirmation Popup */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chat Session?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Deleting this chat will lose your resume and data. You will need to pay again for building a new resume. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  onDeleteSession(sessionToDelete, e as unknown as React.MouseEvent);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}