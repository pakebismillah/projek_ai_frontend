import React from "react";
import { Plus, Inbox } from "lucide-react";
import SessionItem from "./SessionItem";

export default function Sidebar({
  sessions,
  activeSessionId,
  onSessionClick,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onTogglePin
}) {
  return (
    <div className="
  h-full w-80
  bg-white/80 backdrop-blur
  flex flex-col
  border-r border-gray-200
">


      {/* Header with New Chat Button */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200/60 bg-white/30 backdrop-blur-sm">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-3.5 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
          New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-center text-gray-400 text-sm font-medium">
              No conversations yet
            </p>
            <p className="text-center text-gray-300 text-xs mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <>
            {/* Pinned Sessions */}
            {sessions.filter(s => s.pinned).length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  Pinned
                </h3>
                <div className="space-y-1">
                  {sessions.filter(s => s.pinned).map((s) => (
                    <SessionItem
                      key={s.id}
                      session={s}
                      isActive={activeSessionId === s.id}
                      onClick={() => onSessionClick(s.id)}
                      onDelete={() => onDeleteSession(s.id)}
                      onRename={(newTitle) => onRenameSession(s.id, newTitle)}
                      onTogglePin={() => onTogglePin(s.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Sessions */}
            {sessions.filter(s => !s.pinned).length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  Recent
                </h3>
                <div className="space-y-1">
                  {sessions.filter(s => !s.pinned).map((s) => (
                    <SessionItem
                      key={s.id}
                      session={s}
                      isActive={activeSessionId === s.id}
                      onClick={() => onSessionClick(s.id)}
                      onDelete={() => onDeleteSession(s.id)}
                      onRename={(newTitle) => onRenameSession(s.id, newTitle)}
                      onTogglePin={() => onTogglePin(s.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200/60 bg-white/30">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}