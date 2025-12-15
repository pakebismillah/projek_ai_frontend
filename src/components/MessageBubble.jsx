import React, { useState } from "react";
import { Copy, RefreshCw, Check, User, Bot } from "lucide-react";

export default function MessageBubble({ message, onRegenerate, onCopy }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      navigator.clipboard.writeText(message.content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} group`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
        ${isUser 
          ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
          : "bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300"
        }
      `}>
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Bot size={20} className="text-gray-600" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? "flex justify-end" : ""}`}>
        <div className={`
          inline-block px-5 py-3.5 rounded-2xl shadow-sm transition-all
          ${isUser 
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-md" 
            : "bg-white text-gray-800 border border-gray-200 rounded-tl-md"
          }
        `}>
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isUser ? "text-purple-100" : "text-gray-400"}`}>
            {new Date(message.timestamp || Date.now()).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Actions for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}