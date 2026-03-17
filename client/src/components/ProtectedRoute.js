// src/components/ProtectedRoute.js
// ─────────────────────────────────────────────────────
// Wraps any route that requires authentication.
// Pass `adminOnly` to restrict to admin role.
// ─────────────────────────────────────────────────────
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Lock } from "lucide-react";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return (
      <main
        className="mx-auto max-w-screen-xl px-6 py-20 flex flex-col
        items-center justify-center text-center animate-fade-in"
      >
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
          <Lock size={24} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-200 mb-2">
          Access Restricted
        </h2>
        <p className="text-sm text-zinc-500 max-w-xs">
          This section requires Admin access. You're signed in as a Viewer.
        </p>
      </main>
    );
  }

  return children;
};
