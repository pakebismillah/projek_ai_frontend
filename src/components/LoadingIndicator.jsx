import React from 'react';
import { Bot } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200">
      <Bot className="w-5 h-5 text-purple-500 animate-pulse" />
      <span className="text-sm font-medium text-gray-600">Typing...</span>
    </div>
  );
}
