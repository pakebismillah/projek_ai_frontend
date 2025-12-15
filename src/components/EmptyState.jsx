import React from 'react';
import { MessageSquare, Zap, Shield, Sparkles, Code, Lightbulb } from 'lucide-react';

export default function EmptyState() {
  const suggestions = [
    { 
      icon: Code, 
      text: "Help me debug this code", 
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      icon: Lightbulb, 
      text: "Explain quantum computing", 
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    { 
      icon: Sparkles, 
      text: "Write a creative story", 
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    { 
      icon: Zap, 
      text: "Generate Python function", 
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center">
        {/* Main Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <MessageSquare size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Let's Start Chatting!
        </h3>
        <p className="text-gray-500 text-lg mb-12">
          Select a suggestion below or type your own message
        </p>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={index}
                className={`
                  group relative p-5 rounded-2xl border-2 border-gray-200 
                  hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer
                  bg-white overflow-hidden
                `}
              >
                {/* Gradient Background on Hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${suggestion.color} opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300
                `}></div>
                
                {/* Content */}
                <div className="relative flex items-center gap-4">
                  <div className={`
                    p-3 rounded-xl ${suggestion.bgColor} 
                    group-hover:bg-white/90 transition-all duration-300
                  `}>
                    <Icon size={24} className={`${suggestion.textColor} group-hover:text-gray-800`} />
                  </div>
                  <span className="text-gray-700 font-medium text-left group-hover:text-white transition-colors duration-300">
                    {suggestion.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Smart</span>
          </div>
        </div>
      </div>
    </div>
  );
}