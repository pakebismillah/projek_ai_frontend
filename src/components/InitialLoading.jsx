import React from 'react';

export default function InitialLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-transparent border-b-indigo-400 rounded-full" style={{ animation: 'spin 1.5s linear infinite reverse' }}></div>
      </div>
    </div>
  );
}
