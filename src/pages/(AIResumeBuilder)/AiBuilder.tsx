import React, { useState } from "react";
import { Menu } from "lucide-react";
import DashNav from "@/components/dashnav/dashnav";
import ChatList from "./Chatlist";
import ChatBox from "./Chatbox";

import type { ChatSession, ChatMessage } from "./types";
import {
  createAiSession,
  deleteAiSession,
  getAiSessions,
  startAiSession,
  getSessionChats,
  createChat,
} from "@/services/aiResumeService";

// Helper to get next session number
function getNextSessionNumber(sessions: ChatSession[]): number {
  const nums = sessions
    .map((s) => {
      const match = s.title.match(/^Session (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}

export default function AIBuilder() {
  // Get token from localStorage
  let token = "";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || "";
    }
  } catch {}

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<"jd" | "non-jd">("non-jd");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Fetch sessions on mount
  React.useEffect(() => {
    async function fetchSessions() {
      try {
        const sessions = await getAiSessions(token);
        const enrichedSessions = sessions.map((s) => ({
          ...s,
          id: String(s.id),
          messages: s.messages || [],
          started: s.started ?? false,
          createdAt: s.createdAt
        }));
        setChatSessions(enrichedSessions);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      }
    }
    fetchSessions();
  }, [token]);

  // Auto-select first session
  React.useEffect(() => {
    if (chatSessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(chatSessions[0].id);
    }
  }, [chatSessions, currentSessionId]);

  const currentSession = chatSessions.find((s) => s.id === currentSessionId);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleNewChat = async () => {
    try {
      const nextNum = getNextSessionNumber(chatSessions);
      const sessionName = `Session ${nextNum}`;
      const session = await createAiSession(mode, sessionName, token);
      const enrichedSession: ChatSession = {
        id: String(session.id),
        title: session.title,
        mode: session.mode,
        messages: [],
        started: false,
        createdAt: session.createdAt || new Date().toISOString(),
      };
      setChatSessions((prev) => [enrichedSession, ...prev]);
      setCurrentSessionId(enrichedSession.id);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create session", err);
    }
  };

  const handleSelectSession = async (id: string) => {
    setCurrentSessionId(id);
    const session = chatSessions.find((s) => s.id === id);
    if (session) setMode(session.mode);
    setSidebarOpen(false);

    // Fetch chats for this session
    try {
      const chats = await getSessionChats(id, token);
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                messages: chats,
                started: (chats && chats.length > 0) ? true : false,
              }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to fetch session chats", err);
    }
  };

  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await deleteAiSession(sessionId, token);
      setChatSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== sessionId);
        if (currentSessionId === sessionId && filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        }
        return filtered;
      });
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const handleModeChange = (newMode: "jd" | "non-jd") => {
    setMode(newMode);
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId ? { ...s, mode: newMode } : s
      )
    );
  };

  // Called when user presses Start on the pre-start screen
  const handleStart = async () => {
    if (!currentSessionId) return;

    try {
      // Call the API to start the session
      await startAiSession(currentSessionId, token);

      const openingMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: "Hi, I need to build my resume.",
        createdAt: new Date().toISOString(),
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                started: true,
                messages: [
                  ...(Array.isArray(s.messages) ? s.messages : []),
                  openingMsg,
                ],
                title: "Hi, I need to build my resume.",
              }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !currentSession || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      createdAt: new Date().toISOString(),
    };

    // Optimistically append user message
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: [
                ...(Array.isArray(s.messages) ? s.messages : []),
                userMsg,
              ],
              title:
                (Array.isArray(s.messages) ? s.messages.length : 0) === 0
                  ? inputValue.slice(0, 35)
                  : s.title,
            }
          : s
      )
    );
    setInputValue("");
    setIsLoading(true);

    try {
      // Send user message to API
      await createChat(currentSessionId, inputValue, "user", null, token);

      // TODO: replace with real API call
      // const reply = await apiSendMessage(currentSessionId, userMsg.content, mode);

      // ── Mock response — remove once API is wired ──
      await new Promise((r) => setTimeout(r, 800));
      const reply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `[Mock] You're in ${
          mode === "jd" ? "JD Mode" : "General Mode"
        }.\n\nReplace this with a real API call in handleSend().`,
        createdAt: new Date().toISOString(),
      };
      // ─────────────────────────────────────────────

      // Send assistant message to API
      await createChat(currentSessionId, reply.content, "assistant", null, token);

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...(Array.isArray(s.messages) ? s.messages : []), reply] }
            : s
        )
      );
    } catch (err) {
      console.error("Send message failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    // TODO: await apiUploadFile(currentSessionId, file)
    setInputValue(`[Uploaded: ${file.name}] `);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <DashNav heading="AI Resume Builder" />

      <div className="flex flex-1 overflow-hidden relative">
        <ChatList
          sessions={chatSessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClose={() => setSidebarOpen(false)}
          isVisible={sidebarOpen}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {currentSession?.title || "AI Resume Builder"}
            </span>
          </div>

          {currentSession ? (
            <ChatBox
              session={currentSession}
              mode={mode}
              inputValue={inputValue}
              isLoading={isLoading}
              onModeChange={handleModeChange}
              onInputChange={setInputValue}
              onSend={handleSend}
              onFileUpload={handleFileUpload}
              onStart={handleStart}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Start a new chat to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}