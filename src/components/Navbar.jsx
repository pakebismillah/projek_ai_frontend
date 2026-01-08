import React from "react";
import { LogOut, Menu, X, Sparkles } from "lucide-react";

export default function Navbar({ user, onLogout, onToggleSidebar, sidebarOpen }) {
  const usernameFromEmail = user?.email
    ? user.email.split("@")[0]
    : "friend";

  return (
    <div className="flex-shrink-0 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm z-20">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl transition-all duration-200 hover:bg-purple-50 text-gray-700 hover:text-purple-600 active:scale-95"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Chat AI
              </h2>
              <p className="text-xs text-gray-500">
                Welcome back, {usernameFromEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                (user?.email?.[0] || "U").toUpperCase()
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.email || "user@example.com"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-sm hover:shadow-md active:scale-95 font-medium"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
