import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import EmptyState from "./EmptyState";

export default function ChatArea({ 
  activeSessionId, 
  messages = [],
  onCopyMessage
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSessionId]);

  if (!activeSessionId) return <EmptyState />;

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-4 bg-white/40 backdrop-blur-sm relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10">
        {messages.map((msg, index) => (
          <MessageBubble 
            key={msg.id || msg._id || index}
            message={msg}
            onCopyMessage={onCopyMessage}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

