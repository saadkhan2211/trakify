// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/30">
            <Zap size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
              Sign in to Trakify
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Your workspace awaits.</p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 rounded-lg bg-red-500/10
                border border-red-500/20 px-3 py-2.5 text-sm text-red-400 animate-slide-up"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Email address
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500
                    hover:text-zinc-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full justify-center py-3"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="h-4 w-4 rounded-full border-2 border-white/30
                  border-t-white animate-spin"
                />
              ) : (
                <LogIn size={15} />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">demo credentials</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Demo shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Admin",
                email: "admin@trakify.io",
                pwd: "admin123",
                badge: "Full access",
              },
              {
                label: "Viewer",
                email: "viewer@trakify.io",
                pwd: "viewer123",
                badge: "Read-only",
              },
            ].map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setForm({ email: d.email, password: d.pwd })}
                className="flex flex-col items-start rounded-lg border border-zinc-800
                  bg-zinc-800/40 px-3 py-2.5 text-left hover:border-zinc-700
                  hover:bg-zinc-800/60 transition-all"
              >
                <span className="text-xs font-medium text-zinc-300">
                  {d.label}
                </span>
                <span className="text-[10px] text-zinc-600 mt-0.5">
                  {d.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          Protected by JWT · Role-based access control
        </p>
      </div>
    </div>
  );
};

export default Login;
