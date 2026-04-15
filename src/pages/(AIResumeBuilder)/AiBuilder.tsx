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

// ── Hardcoded question queue ──────────────────────────────────────────────────
const HARDCODED_QUESTIONS = [
  "Can you give me a brief about yourself?",
  "Can you tell me about the projects you have worked on?",
  "Can you tell me about your work experience?",
  "Can you give me your education details and certifications you have achieved, and from which source?",
];

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

  // Tracks which hardcoded question to ask next (per session)
  const [questionIndex, setQuestionIndex] = useState<Record<string, number>>({});

  // Accumulates the user's 4 chat answers keyed by session (about_yourself, additional_projects, additional_experience, additional_education)
  const [chatAnswers, setChatAnswers] = useState<Record<string, Record<string, string>>>({});

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
          createdAt: s.createdAt,
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

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Appends a bot message to the session and optionally saves it via API */
  const appendBotMessage = async (
    sessionId: string,
    content: string,
    saveToApi = true
  ) => {
    const botMsg: ChatMessage = {
      id: `msg-${Date.now()}-bot`,
      role: "assistant",
      content,
      createdAt: new Date().toISOString(),
    };

    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [
                ...(Array.isArray(s.messages) ? s.messages : []),
                botMsg,
              ],
            }
          : s
      )
    );

    if (saveToApi) {
      try {
        await createChat(sessionId, content, "assistant", null, token);
      } catch (err) {
        console.error("Failed to save bot message", err);
      }
    }
  };

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
                started: chats && chats.length > 0 ? true : false,
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
      await startAiSession(currentSessionId, token);

      // 1. Auto-send the opening user message
      const openingMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: "Hi, I need help to build my resume.",
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
                title: "Hi, I need help to build my resume.",
              }
            : s
        )
      );

      await createChat(
        currentSessionId,
        openingMsg.content,
        "user",
        null,
        token
      );

      // 2. Fire first hardcoded question
      setQuestionIndex((prev) => ({ ...prev, [currentSessionId]: 0 }));
      await appendBotMessage(currentSessionId, HARDCODED_QUESTIONS[0]);
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
      await createChat(currentSessionId!, inputValue, "user", null, token);

      // ── Hardcoded question queue logic ────────────────────────────────────
      const sessionId = currentSessionId!;
      const currentQIndex = questionIndex[sessionId] ?? 0;
      const nextQIndex = currentQIndex + 1;

      // ── Auth from localStorage ─────────────────────────────────────────
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      const userId = userData?.user_id;
      const authToken = userData?.token;

      // ── Store the user's answer mapped to the question they just answered ──
      const answerKeyMap: Record<number, string> = {
        0: "about_yourself",
        1: "additional_projects",
        2: "additional_experience",
        3: "additional_education",
      };
      const answerKey = answerKeyMap[currentQIndex];
      if (answerKey) {
        setChatAnswers((prev) => ({
          ...prev,
          [sessionId]: {
            ...(prev[sessionId] || {}),
            [answerKey]: inputValue.trim(),
          },
        }));
      }

      await new Promise((r) => setTimeout(r, 600)); // brief natural delay

      if (nextQIndex < HARDCODED_QUESTIONS.length) {
        // ── Q index 1: projects question — fetch & enrich ──────────────────
        if (nextQIndex === 1) {
          let botContent = HARDCODED_QUESTIONS[1];
          try {
            if (userId && authToken) {
              const res = await fetch(
                `http://localhost:5000/users/${userId}/projects`,
                { headers: { Authorization: `Bearer ${authToken}` } }
              );
              if (res.ok) {
                const projects: Array<{ project_title: string }> = await res.json();
                if (Array.isArray(projects) && projects.length > 0) {
                  const titles = projects.map((p) => p.project_title).join(", ");
                  botContent = `Are these the projects you have worked on — ${titles}? If you want to add more, please mention them in a detailed format.`;
                }
              }
            }
          } catch (err) {
            console.error("Failed to fetch projects", err);
          }
          setQuestionIndex((prev) => ({ ...prev, [sessionId]: nextQIndex }));
          await appendBotMessage(sessionId, botContent);

        // ── Q index 2: work experience question — fetch & enrich ───────────
        } else if (nextQIndex === 2) {
          let botContent = HARDCODED_QUESTIONS[2];
          try {
            if (userId && authToken) {
              const res = await fetch(
                `http://localhost:5000/users/${userId}/work-experience`,
                { headers: { Authorization: `Bearer ${authToken}` } }
              );
              if (res.ok) {
                const data: { experiences?: Array<{ job_title: string; company_name: string }> } = await res.json();
                if (data.experiences && Array.isArray(data.experiences) && data.experiences.length > 0) {
                  const list = data.experiences
                    .map((e) => `${e.job_title} at ${e.company_name}`)
                    .join(", ");
                  botContent = `Here's the work experience we have on file for you — ${list}. Does this look correct, or would you like to update or add anything?`;
                }
              }
            }
          } catch (err) {
            console.error("Failed to fetch work experience", err);
          }
          setQuestionIndex((prev) => ({ ...prev, [sessionId]: nextQIndex }));
          await appendBotMessage(sessionId, botContent);

        // ── Q index 3: education question — fetch & enrich ─────────────────
        } else if (nextQIndex === 3) {
          let botContent = HARDCODED_QUESTIONS[3];
          try {
            if (userId && authToken) {
              const res = await fetch(
                `http://localhost:5000/users/${userId}/education`,
                { headers: { Authorization: `Bearer ${authToken}` } }
              );
              if (res.ok) {
                const educations: Array<{ education_type: string; institution_name: string }> = await res.json();
                if (Array.isArray(educations) && educations.length > 0) {
                  const list = educations
                    .map((e) => `${e.education_type} at ${e.institution_name}`)
                    .join(", ");
                  botContent = `Here's the education we have on file for you — ${list}. Does this look correct, or would you like to update or add certifications and other details?`;
                }
              }
            }
          } catch (err) {
            console.error("Failed to fetch education", err);
          }
          setQuestionIndex((prev) => ({ ...prev, [sessionId]: nextQIndex }));
          await appendBotMessage(sessionId, botContent);

        // ── All other questions — plain hardcoded ──────────────────────────
        } else {
          setQuestionIndex((prev) => ({ ...prev, [sessionId]: nextQIndex }));
          await appendBotMessage(sessionId, HARDCODED_QUESTIONS[nextQIndex]);
        }

      } else {
        // All 4 questions answered — call generate-resume API
        try {
          const finalAnswers = {
            ...(chatAnswers[sessionId] || {}),
            // also capture the last answer (education) which was just typed
            additional_education: inputValue.trim() || (chatAnswers[sessionId]?.additional_education ?? ""),
          };

          const generateRes = await fetch("http://localhost:5000/generate-resume", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              session_id: sessionId,
              chat_answers: finalAnswers,
            }),
          });

          if (generateRes.ok) {
            const botReplyContent =
              "Great! I've gathered all your details and generated your resume content. Your resume is ready with an enhanced technical summary, project descriptions, and work experience highlights. You can now review and download it.";

            await appendBotMessage(sessionId, botReplyContent);
          } else {
            const errData = await generateRes.json().catch(() => ({}));
            const errorMsg =
              "I encountered an issue while generating your resume. Please try again or contact support.";
            await appendBotMessage(sessionId, errorMsg);
            console.error("generate-resume API error:", errData);
          }
        } catch (err) {
          console.error("Failed to call generate-resume:", err);
          await appendBotMessage(
            sessionId,
            "Something went wrong while generating your resume. Please try again."
          );
        }
      }
      // ─────────────────────────────────────────────────────────────────────
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