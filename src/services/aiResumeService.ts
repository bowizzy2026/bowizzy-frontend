
import type { ChatSession, ChatMessage } from "@/pages/(AIResumeBuilder)/types";
import api from "@/api";

export async function getAiSessions(token: string): Promise<Pick<ChatSession, "id" | "title" | "mode" | "started" | "createdAt" | "messages">[]> {
    const res = await api.get("/sessions", {
        headers: { Authorization: `Bearer ${token}` },
    });
    // Map API response to required fields
    return (res.data || []).map((item: any) => {
        const chats = (item.chats || []).map((chat: any) => ({
            id: chat.id?.toString() ?? "",
            role: chat.type || chat.role || "user",
            content: chat.text || chat.content || chat.message || "",
            createdAt: chat.created_at || new Date().toISOString(),
        }));
        return {
            id: item.id?.toString() ?? item.session_id?.toString() ?? "",
            title: item.session_name,
            mode: item.mode,
            started: item.started ?? false,
            createdAt: item.created_at,
            messages: chats,
        };
    });
}

export async function createAiSession(mode: "jd" | "non-jd", sessionName: string, token: string): Promise<ChatSession> {
    const res = await api.post(
        "/sessions",
        { session_name: sessionName, mode },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = res.data.data || res.data;
    return {
        id: data.id || data.session_id,
        title: data.session_name || sessionName,
        messages: [],
        mode: data.mode || mode,
        createdAt: data.created_at || new Date().toISOString(),
        started: false,
    };
}

export async function deleteAiSession(sessionId: string, token: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function startAiSession(sessionId: string, token: string): Promise<void> {
    await api.post(
        `/sessions/${sessionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

export async function getSessionChats(sessionId: string, token: string): Promise<ChatMessage[]> {
    const res = await api.get(`/sessions/${sessionId}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const chats = res.data.data || res.data || [];
    return chats.map((chat: any) => ({
        id: chat.id?.toString() ?? "",
        role: chat.type || chat.role || "user",
        content: chat.text || chat.content || chat.message || "",
        createdAt: chat.created_at || new Date().toISOString(),
    }));
}

export async function createChat(
    sessionId: string,
    text: string,
    type: "user" | "assistant",
    fileLink: string | null,
    token: string
): Promise<ChatMessage> {
    const res = await api.post(
        "/chats",
        {
            session_id: sessionId,
            text,
            file_link: fileLink,
            type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = res.data.data || res.data;
    return {
        id: data.id?.toString() ?? "",
        role: data.type || type,
        content: data.text || text,
        createdAt: data.created_at || new Date().toISOString(),
    };
}
