import React, { useState } from "react";
import { Trash2, Edit3, Pin, PinOff, MessageSquare } from "lucide-react";

export default function SessionItem({
  session,
  isActive,
  onClick,
  onDelete,
  onRename,
  onTogglePin,
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-[1.02]"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
    >
      {/* Icon */}
      <div className={`
        flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all
        ${isActive ? "bg-white/20" : "bg-purple-100"}
      `}>
        <MessageSquare size={18} className={isActive ? "text-white" : "text-purple-600"} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`truncate font-medium text-sm ${isActive ? "text-white" : "text-gray-800"}`}>
          {session.title || "Untitled Chat"}
        </p>
        <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-gray-500"}`}>
          {session.lastMessage || "No messages yet"}
        </p>
      </div>

      {/* Pin Badge */}
      {session.pinned && !hover && (
        <div className={`flex-shrink-0 ${isActive ? "text-white/80" : "text-yellow-500"}`}>
          <Pin size={14} fill="currentColor" />
        </div>
      )}

      {/* Actions (on hover) */}
      {hover && (
        <div className="flex-shrink-0 flex items-center gap-1">
          {/* Pin/Unpin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              isActive 
                ? "hover:bg-white/20 text-white" 
                : "hover:bg-yellow-100 text-yellow-600"
            }`}
            title={session.pinned ? "Unpin" : "Pin"}
          >
            {session.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>

          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const name = prompt("Rename chat:", session.title);
              if (name?.trim()) onRename(name.trim());
            }}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              isActive 
                ? "hover:bg-white/20 text-white" 
                : "hover:bg-blue-100 text-blue-600"
            }`}
            title="Rename"
          >
            <Edit3 size={14} />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this chat?")) {
                onDelete();
              }
            }}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
              isActive 
                ? "hover:bg-white/20 text-white" 
                : "hover:bg-red-100 text-red-600"
            }`}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}