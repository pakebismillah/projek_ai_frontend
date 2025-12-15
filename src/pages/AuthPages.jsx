// frontend/pages/AuthPage.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import api from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (authPromise, extraData = {}) => {
    setError("");
    setLoading(true);
    try {
      // 1️⃣ Firebase Auth
      const userCredential = await authPromise;
      const user = userCredential.user;
      const idToken = await user.getIdToken(true);

      // 2️⃣ Simpan token di localStorage
      localStorage.setItem("token", idToken);

      // 3️⃣ Sync manual (pakai token langsung)
      await api.post(
        "/users/sync",
        {
          firebase_uid: user.uid,
          email: user.email,
          name: extraData.name || user.displayName || "User",
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // 4️⃣ Tunggu sebentar agar DB commit selesai
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 5️⃣ Retry mechanism untuk ambil profil user
      let retries = 3;
      let backendUser = null;

      while (retries > 0) {
        try {
          console.log(`🔍 Fetching /users/me (attempt ${4 - retries}/3)...`);
          const res = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          backendUser = res.data;
          console.log("✅ User profile fetched:", backendUser.email);
          if (user) {
            user.getIdToken().then((token) => {
              console.log("🔥 Firebase Token:", token);
            });
          }
          break; // Berhasil, keluar dari loop
        } catch (err) {
          console.error(
            `❌ Attempt ${4 - retries} failed:`,
            err.response?.data || err.message
          );
          retries--;
          if (retries === 0) throw err;
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      // 6️⃣ Navigasi ke ChatPage
      onAuthSuccess(backendUser);
    } catch (err) {
      console.error("Auth error:", err);
      let errorMessage = "Authentication failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!isLogin && !name.trim()) {
      setError("Name is required");
      return;
    }

    const authPromise = isLogin
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password);

    handleAuth(authPromise, { name });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    handleAuth(signInWithPopup(auth, provider));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
 {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '2s'
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-purple-500/20">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transition-transform duration-300"
            style={{
              transform: 'rotate(6deg)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(6deg)'}
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {isLogin ? "Welcome Back!" : "Join Us Today"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Sign in to continue your journey" : "Create an account to get started"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm"
            style={{
              animation: 'shake 0.5s ease-in-out'
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4 mb-4">
          {!isLogin && (
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300"
                style={{
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                disabled={loading}
              />
            </div>
          )}

          <div className="relative group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300"
              style={{
                boxShadow: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a855f7';
                e.target.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300"
              style={{
                boxShadow: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a855f7';
                e.target.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              disabled={loading}
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button 
                type="button" 
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition"
                onClick={() => alert("Forgot password feature coming soon!")}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        {/* Sign In/Up Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mb-6"
          style={{
            background: 'linear-gradient(to right, #4f46e5, #9333ea)',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(to right, #4338ca, #7e22ce)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #4f46e5, #9333ea)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" style={{
                animation: 'spin 1s linear infinite'
              }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            isLogin ? "Sign In" : "Create Account"
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm hover:shadow mb-6"
          style={{
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle Sign In/Up */}
        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}