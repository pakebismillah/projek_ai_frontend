import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function InputBar({ inputText, onInputChange, onSend, loading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [inputText]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="
        sticky bottom-0
        bg-white
        border-t border-gray-200
        px-3 py-2
        z-20
        safe-bottom
      "
    >
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={loading}
          className="
            flex-1
            text-sm sm:text-base
            px-3 py-2
            border border-gray-300
            rounded-xl
            focus:ring-2 focus:ring-blue-500
            outline-none
            resize-none
            overflow-hidden
            bg-white
            leading-relaxed
          "
          style={{
            minHeight: "44px",
            maxHeight: "160px",
          }}
        />

        <button
          onClick={onSend}
          disabled={!inputText.trim() || loading}
          className="
            h-[44px]
            px-4
            bg-blue-600 text-white
            rounded-xl
            hover:bg-blue-700
            transition
            disabled:opacity-50
            flex items-center justify-center
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

