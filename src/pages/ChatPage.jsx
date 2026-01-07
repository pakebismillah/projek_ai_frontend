// frontend/pages/ChatPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import LoadingIndicator from "../components/LoadingIndicator";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import api from "../api";

export default function ChatPage({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    data: null,
  });

  // 🔹 Fetch all sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        const fetchedSessions = res.data || [];
        setSessions(fetchedSessions);

        if (fetchedSessions.length > 0 && !activeSessionId) {
          setActiveSessionId(fetchedSessions[0].id);
        }
      } catch (err) {
        console.error("❌ Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, []);

  // 🔹 Load messages when activeSessionId changes
  useEffect(() => {
    if (!activeSessionId) return;

    async function loadMessages() {
      try {
        const res = await api.get(`/chats/${activeSessionId}`);
        const formatted = (res.data || []).map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
        }));

        setMessages((prev) => ({
          ...prev,
          [activeSessionId]: formatted,
        }));
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    }

    loadMessages();
  }, [activeSessionId]);

  // 🔹 Create new session
  const createNewSession = async () => {
    try {
      const res = await api.post("/sessions", { title: "New Conversation" });
      const newSession = res.data;
      setSessions((prev) => [newSession, ...prev]);
      setMessages((prev) => ({ ...prev, [newSession.id]: [] }));
      setActiveSessionId(newSession.id);
    } catch (err) {
      console.error("❌ Error creating session:", err);
    }
  };

  // 🔹 Rename session
  const renameSession = async (sessionId, newTitle) => {
    try {
      await api.put(`/sessions/${sessionId}`, { title: newTitle });

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
      );
    } catch (err) {
      console.error("❌ Error renaming session:", err);
    }
  };

  // 🔹 Delete session
  const deleteSession = (sessionId) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete_session",
      data: sessionId,
      title: "Delete Conversation",
      message: "Are you sure you want to delete this conversation? This action cannot be undone.",
    });
  };

  const confirmDeleteSession = async () => {
    const sessionId = confirmDialog.data;
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setMessages((prev) => {
        const copy = { ...prev };
        delete copy[sessionId];
        return copy;
      });

      if (activeSessionId === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        if (remaining.length > 0) setActiveSessionId(remaining[0].id);
        else createNewSession();
      }
    } catch (err) {
      console.error("❌ Error deleting session:", err);
    }
    setConfirmDialog({ isOpen: false, type: "", data: null });
  };

  // 🔹 Toggle pin session
  const togglePinSession = async (sessionId) => {
    try {
      const session = sessions.find((s) => s.id === sessionId);
      const newPinnedState = !session.pinned;

      await api.put(`/sessions/${sessionId}`, { pinned: newPinnedState });

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, pinned: newPinnedState } : s
        )
      );
    } catch (err) {
      console.error("❌ Error toggling pin:", err);
    }
  };

  // 🔹 Send message
  const sendMessage = async () => {
    if (!inputText.trim() || loading || !activeSessionId) return;

    const newUserMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    // Display user message immediately
    setMessages((prev) => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newUserMessage],
    }));

    const savedInput = inputText;
    setInputText("");
    setLoading(true);

    try {
      // POST to chat endpoint
      const res = await api.post(`/chats`, {
        sessionId: activeSessionId,
        message: savedInput,
      });

      console.log("🔥 CHAT RESPONSE FULL:", res.data);
      
      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      };

      // Display AI message
      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), aiMessage],
      }));

      // Update session title if it's new
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId && (s.title === "New Conversation" || s.title === "Percakapan Baru")
            ? {
                ...s,
                title:
                  savedInput.slice(0, 30) +
                  (savedInput.length > 30 ? "..." : ""),
                lastMessage: savedInput.slice(0, 50),
              }
            : s
        )
      );

      // Refresh messages from database
      const refresh = await api.get(`/chats/${activeSessionId}`);
      const formatted = (refresh.data || []).map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      }));

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: formatted,
      }));
    } catch (err) {
      console.error("❌ Error sending message:", err);
      // Remove user message on error
      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: (prev[activeSessionId] || []).slice(0, -1),
      }));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Copy message
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  // 🔹 Logout
  const handleLogoutClick = () => {
    setConfirmDialog({
      isOpen: true,
      type: "logout",
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
    });
  };

  const confirmLogout = () => {
    setConfirmDialog({ isOpen: false, type: "", data: null });
    onLogout();
  };

  // 🔹 Sort sessions (pinned first, then by date)
  const sortedSessions = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        // Pinned sessions first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // Then by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      }),
    [sessions]
  );
  const activeMessages = messages[activeSessionId] || [];
  return (
   <div className="fixed inset-0 w-screen h-screen flex bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 overflow-hidden">
  {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
          style={{ animation: 'float 20s ease-in-out infinite' }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"
          style={{ animation: 'float 25s ease-in-out infinite reverse' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/10 rounded-full blur-3xl"
          style={{ animation: 'pulse 15s ease-in-out infinite' }}
        ></div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 flex-shrink-0`}
      >
        <Sidebar
          sessions={sortedSessions}
          activeSessionId={activeSessionId}
          onSessionClick={setActiveSessionId}
          onNewChat={createNewSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          onTogglePin={togglePinSession}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Navbar */}
        <Navbar
          user={user}
          onLogout={handleLogoutClick}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeSessionId && activeMessages.length === 0 ? (
            <EmptyState />
          ) : (
            <ChatArea
              activeSessionId={activeSessionId}
              messages={activeMessages}
              onCopyMessage={copyMessage}
            />
          )}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute bottom-4 left-6">
              <LoadingIndicator />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <InputBar
          inputText={inputText}
          onInputChange={setInputText}
          onSend={sendMessage}
          loading={loading}
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={
          confirmDialog.type === "delete_session"
            ? confirmDeleteSession
            : confirmLogout
        }
        onCancel={() =>
          setConfirmDialog({ isOpen: false, type: "", data: null })
        }
      />
    </div>
  );
}